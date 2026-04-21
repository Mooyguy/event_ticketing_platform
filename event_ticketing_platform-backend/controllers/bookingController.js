import pool from "../database/db.js";
import QRCode from "qrcode";
import { generateTicketCode } from "../utils/generateTicketCode.js";

export const createBooking = async (req, res) => {
  try {
    const { user_id, user_name, user_email, event_id, quantity } = req.body;

    if (!user_id || !user_name || !user_email || !event_id || !quantity) {
      return res.status(400).json({
        message: "Missing required booking fields",
      });
    }

    if (Number(req.user.id) !== Number(user_id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You cannot create a booking for another user",
      });
    }

    const [existingBookings] = await pool.query(
      "SELECT * FROM bookings WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    if (existingBookings.length > 0) {
      const existingBooking = existingBookings[0];

      return res.status(409).json({
        message: "You already booked this event",
        bookingExists: true,
        existingBookingId: existingBooking.id,
        existingQuantity: existingBooking.quantity,
      });
    }

    const [eventRows] = await pool.query(
      "SELECT * FROM events WHERE id = ?",
      [event_id]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventRows[0];

    if (event.seats_left < Number(quantity)) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    const ticketCode = generateTicketCode();
    const qrData = `Ticket:${ticketCode}|Event:${event.title}|User:${user_email}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, user_name, user_email, event_id, quantity, ticket_code, qr_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, user_name, user_email, event_id, quantity, ticketCode, qrCode]
    );

    await pool.query(
      "UPDATE events SET seats_left = seats_left - ? WHERE id = ?",
      [quantity, event_id]
    );

    res.status(201).json({
      message: "Booking successful",
      bookingId: result.insertId,
      ticketCode,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
};

export const addTicketsToExistingBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const [bookingRows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ?",
      [id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingRows[0];

    if (Number(req.user.id) !== Number(booking.user_id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to update this booking",
      });
    }

    const [eventRows] = await pool.query(
      "SELECT * FROM events WHERE id = ?",
      [booking.event_id]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventRows[0];

    if (event.seats_left < Number(quantity)) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    const newQuantity = Number(booking.quantity) + Number(quantity);

    await pool.query(
      "UPDATE bookings SET quantity = ? WHERE id = ?",
      [newQuantity, id]
    );

    await pool.query(
      "UPDATE events SET seats_left = seats_left - ? WHERE id = ?",
      [quantity, booking.event_id]
    );

    res.status(200).json({
      message: "Booking updated successfully",
      merged: true,
      bookingId: booking.id,
      newQuantity,
      ticketCode: booking.ticket_code,
      qrCode: booking.qr_code,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.id,
        b.user_id,
        b.user_name,
        b.user_email,
        b.event_id,
        b.quantity,
        b.ticket_code,
        b.qr_code,
        b.created_at,
        e.title AS event_title,
        e.price,
        e.venue
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      ORDER BY b.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(req.user.id) !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to view these bookings",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        b.id,
        b.user_id,
        b.user_name,
        b.user_email,
        b.event_id,
        b.quantity,
        b.ticket_code,
        b.qr_code,
        b.created_at,
        e.title AS event_title,
        e.price,
        e.venue
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user bookings",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    await pool.query(
      "UPDATE events SET seats_left = seats_left + ? WHERE id = ?",
      [booking.quantity, booking.event_id]
    );

    await pool.query(
      "DELETE FROM bookings WHERE id = ?",
      [id]
    );

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};