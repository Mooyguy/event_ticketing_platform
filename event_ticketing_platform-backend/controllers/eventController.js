import pool from "../database/db.js";

export const getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        category,
        DATE_FORMAT(event_date, '%a, %b %d, %Y') AS date,
        TIME_FORMAT(event_time, '%h:%i %p') AS time,
        venue,
        location,
        price,
        status,
        image,
        description,
        seats_left AS seatsLeft
      FROM events
      ORDER BY event_date ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        category,
        DATE_FORMAT(event_date, '%a, %b %d, %Y') AS date,
        TIME_FORMAT(event_time, '%h:%i %p') AS time,
        venue,
        location,
        price,
        status,
        image,
        description,
        seats_left AS seatsLeft
      FROM events
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      event_date,
      event_time,
      venue,
      location,
      price,
      status,
      image,
      description,
      seats_left,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO events
      (title, category, event_date, event_time, venue, location, price, status, image, description, seats_left)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        category,
        event_date,
        event_time,
        venue,
        location,
        price,
        status || "Available",
        image || null,
        description || null,
        seats_left,
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      event_date,
      event_time,
      venue,
      location,
      price,
      status,
      image,
      description,
      seats_left,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE events
      SET
        title = ?,
        category = ?,
        event_date = ?,
        event_time = ?,
        venue = ?,
        location = ?,
        price = ?,
        status = ?,
        image = ?,
        description = ?,
        seats_left = ?
      WHERE id = ?
      `,
      [
        title,
        category,
        event_date,
        event_time,
        venue,
        location,
        price,
        status,
        image || null,
        description || null,
        seats_left,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query(
      "SELECT id FROM bookings WHERE event_id = ? LIMIT 1",
      [id]
    );

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete event with existing bookings",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM events WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};