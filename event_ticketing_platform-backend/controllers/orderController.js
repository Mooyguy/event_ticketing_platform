import pool from "../database/db.js";
import QRCode from "qrcode";
import { generateTicketCode } from "../utils/generateTicketCode.js";
import { sendReceiptEmail } from "../utils/sendReceiptEmail.js";

export const checkoutOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      user_name,
      user_email,
      ticketItems = [],
      merchItems = [],
    } = req.body;

    if (!user_id) {
      await connection.rollback();
      return res.status(400).json({ message: "User is required" });
    }

    if (Number(req.user.id) !== Number(user_id) && req.user.role !== "admin") {
      await connection.rollback();
      return res.status(403).json({
        message: "You cannot create an order for another user",
      });
    }

    if (ticketItems.length === 0 && merchItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    let orderType = "mixed";

    if (ticketItems.length > 0 && merchItems.length === 0) {
      orderType = "ticket";
    } else if (ticketItems.length === 0 && merchItems.length > 0) {
      orderType = "merchandise";
    }

    for (const item of ticketItems) {
      const [eventRows] = await connection.query(
        "SELECT * FROM events WHERE id = ?",
        [item.event_id]
      );

      if (eventRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `Event ${item.event_id} not found`,
        });
      }

      const event = eventRows[0];

      if (Number(event.seats_left) < Number(item.quantity)) {
        await connection.rollback();
        return res.status(400).json({
          message: `Not enough seats for ${event.title}`,
        });
      }

      totalAmount += Number(event.price) * Number(item.quantity);
    }

    for (const item of merchItems) {
      const [merchRows] = await connection.query(
        "SELECT * FROM merchandise WHERE id = ?",
        [item.merchandise_id]
      );

      if (merchRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `Merchandise ${item.merchandise_id} not found`,
        });
      }

      const merch = merchRows[0];

      if (Number(merch.stock) < Number(item.quantity)) {
        await connection.rollback();
        return res.status(400).json({
          message: `Not enough stock for ${merch.name}`,
        });
      }

      totalAmount += Number(merch.price) * Number(item.quantity);
    }

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders (user_id, order_type, total_amount, payment_status)
      VALUES (?, ?, ?, ?)
      `,
      [user_id, orderType, totalAmount, "Paid"]
    );

    const orderId = orderResult.insertId;

    let latestTicketCode = "";
    let latestQrCode = "";

    for (const item of ticketItems) {
      const [existingBookings] = await connection.query(
        "SELECT * FROM bookings WHERE user_id = ? AND event_id = ?",
        [user_id, item.event_id]
      );

      if (existingBookings.length > 0) {
        const existingBooking = existingBookings[0];
        const newQuantity =
          Number(existingBooking.quantity) + Number(item.quantity);

        const [eventRows] = await connection.query(
          "SELECT * FROM events WHERE id = ?",
          [item.event_id]
        );
        const event = eventRows[0];

        if (Number(event.seats_left) < Number(item.quantity)) {
          await connection.rollback();
          return res.status(400).json({
            message: `Not enough seats for ${event.title}`,
          });
        }

        await connection.query(
          "UPDATE bookings SET quantity = ?, order_id = ? WHERE id = ?",
          [newQuantity, orderId, existingBooking.id]
        );

        await connection.query(
          "UPDATE events SET seats_left = seats_left - ? WHERE id = ?",
          [item.quantity, item.event_id]
        );

        latestTicketCode = existingBooking.ticket_code;
        latestQrCode = existingBooking.qr_code;
      } else {
        const [eventRows] = await connection.query(
          "SELECT * FROM events WHERE id = ?",
          [item.event_id]
        );

        const event = eventRows[0];
        const ticketCode = generateTicketCode();
        const qrData = `Ticket:${ticketCode}|Event:${event.title}|User:${user_email}`;
        const qrCode = await QRCode.toDataURL(qrData);

        await connection.query(
          `
          INSERT INTO bookings
          (order_id, user_id, user_name, user_email, event_id, quantity, ticket_code, qr_code)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            orderId,
            user_id,
            user_name,
            user_email,
            item.event_id,
            item.quantity,
            ticketCode,
            qrCode,
          ]
        );

        await connection.query(
          "UPDATE events SET seats_left = seats_left - ? WHERE id = ?",
          [item.quantity, item.event_id]
        );

        latestTicketCode = ticketCode;
        latestQrCode = qrCode;
      }
    }

    if (merchItems.length > 0) {
      const [merchOrderResult] = await connection.query(
        `
        INSERT INTO merch_orders (order_id, user_id, total_amount, status)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, user_id, 0, "Paid"]
      );

      const merchOrderId = merchOrderResult.insertId;
      let merchTotal = 0;

      for (const item of merchItems) {
        const [merchRows] = await connection.query(
          "SELECT * FROM merchandise WHERE id = ?",
          [item.merchandise_id]
        );

        const merch = merchRows[0];
        const quantity = Number(item.quantity);
        const unitPrice = Number(merch.price);
        const subtotal = quantity * unitPrice;

        await connection.query(
          `
          INSERT INTO merch_order_items
          (merch_order_id, merchandise_id, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?)
          `,
          [merchOrderId, merch.id, quantity, unitPrice, subtotal]
        );

        await connection.query(
          "UPDATE merchandise SET stock = stock - ? WHERE id = ?",
          [quantity, merch.id]
        );

        merchTotal += subtotal;
      }

      await connection.query(
        "UPDATE merch_orders SET total_amount = ? WHERE id = ?",
        [merchTotal, merchOrderId]
      );
    }

    await connection.commit();

    const [ticketRows] = await pool.query(
      `
      SELECT
        b.id,
        b.quantity,
        b.ticket_code,
        e.title AS event_title
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.order_id = ?
      `,
      [orderId]
    );

    let merchandise = [];

    const [merchOrderRows] = await pool.query(
      `SELECT id FROM merch_orders WHERE order_id = ?`,
      [orderId]
    );

    if (merchOrderRows.length > 0) {
      const merchOrderId = merchOrderRows[0].id;

      const [merchOrderItems] = await pool.query(
        `
        SELECT
          moi.id,
          moi.quantity,
          moi.unit_price,
          moi.subtotal,
          m.name
        FROM merch_order_items moi
        JOIN merchandise m ON moi.merchandise_id = m.id
        WHERE moi.merch_order_id = ?
        `,
        [merchOrderId]
      );

      merchandise = merchOrderItems;
    }

    try {
      await sendReceiptEmail({
        to: user_email,
        userName: user_name,
        orderId,
        createdAt: new Date(),
        paymentStatus: "Paid",
        totalAmount,
        tickets: ticketRows,
        merchandise,
      });
    } catch (emailError) {
      console.error("Receipt email failed:", emailError.message);
    }

    return res.status(201).json({
      message: "Order checkout successful",
      orderId,
      totalAmount,
      ticketCode: latestTicketCode,
      qrCode: latestQrCode,
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({
      message: "Checkout failed",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(req.user.id) !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to view these orders",
      });
    }

    const [orders] = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const results = [];

    for (const order of orders) {
      const [tickets] = await pool.query(
        `
        SELECT
          b.id,
          b.event_id,
          b.quantity,
          b.ticket_code,
          e.title AS event_title
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.order_id = ?
        `,
        [order.id]
      );

      const [merchOrderRows] = await pool.query(
        `
        SELECT id
        FROM merch_orders
        WHERE order_id = ?
        `,
        [order.id]
      );

      let merchandise = [];

      if (merchOrderRows.length > 0) {
        const merchOrderId = merchOrderRows[0].id;

        const [merchOrderItems] = await pool.query(
          `
          SELECT
            moi.id,
            moi.quantity,
            moi.unit_price,
            moi.subtotal,
            m.name
          FROM merch_order_items moi
          JOIN merchandise m ON moi.merchandise_id = m.id
          WHERE moi.merch_order_id = ?
          `,
          [merchOrderId]
        );

        merchandise = merchOrderItems;
      }

      results.push({
        ...order,
        tickets,
        merchandise,
      });
    }

    return res.json(results);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};