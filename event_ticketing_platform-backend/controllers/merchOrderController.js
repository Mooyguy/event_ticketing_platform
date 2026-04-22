import pool from "../database/db.js";

export const createMerchOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "User and merchandise items are required",
      });
    }

    if (Number(req.user.id) !== Number(user_id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You cannot create an order for another user",
      });
    }

    let totalAmount = 0;

    for (const item of items) {
      const [rows] = await pool.query(
        "SELECT * FROM merchandise WHERE id = ?",
        [item.merchandise_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: `Merchandise item ${item.merchandise_id} not found`,
        });
      }

      const merch = rows[0];

      if (Number(merch.stock) < Number(item.quantity)) {
        return res.status(400).json({
          message: `Not enough stock for ${merch.name}`,
        });
      }

      totalAmount += Number(merch.price) * Number(item.quantity);
    }

    const [orderResult] = await pool.query(
      `
      INSERT INTO merch_orders (user_id, total_amount, status)
      VALUES (?, ?, ?)
      `,
      [user_id, totalAmount, "Paid"]
    );

    const merchOrderId = orderResult.insertId;

    for (const item of items) {
      const [rows] = await pool.query(
        "SELECT * FROM merchandise WHERE id = ?",
        [item.merchandise_id]
      );

      const merch = rows[0];
      const quantity = Number(item.quantity);
      const unitPrice = Number(merch.price);
      const subtotal = quantity * unitPrice;

      await pool.query(
        `
        INSERT INTO merch_order_items
        (merch_order_id, merchandise_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [merchOrderId, merch.id, quantity, unitPrice, subtotal]
      );

      await pool.query(
        `
        UPDATE merchandise
        SET stock = stock - ?
        WHERE id = ?
        `,
        [quantity, merch.id]
      );
    }

    res.status(201).json({
      message: "Merchandise order created successfully",
      merchOrderId,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create merchandise order",
      error: error.message,
    });
  }
};

export const getMerchOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(req.user.id) !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to view these orders",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        mo.id,
        mo.user_id,
        mo.total_amount,
        mo.status,
        mo.created_at
      FROM merch_orders mo
      WHERE mo.user_id = ?
      ORDER BY mo.created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch merchandise orders",
      error: error.message,
    });
  }
};

export const getAllMerchOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        mo.id,
        mo.user_id,
        u.name AS user_name,
        u.email AS user_email,
        mo.total_amount,
        mo.status,
        mo.created_at
      FROM merch_orders mo
      JOIN users u ON mo.user_id = u.id
      ORDER BY mo.created_at DESC
      `
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch merchandise orders",
      error: error.message,
    });
  }
};