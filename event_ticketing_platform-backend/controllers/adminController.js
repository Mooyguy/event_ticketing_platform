import pool from "../database/db.js";

export const getBookingsPerEvent = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.category,
        e.venue,
        e.location,
        e.seats_left,
        COALESCE(COUNT(b.id), 0) AS total_bookings,
        COALESCE(SUM(b.quantity), 0) AS tickets_sold,
        COALESCE(SUM(b.quantity * e.price), 0) AS revenue
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id, e.title, e.category, e.venue, e.location, e.seats_left
      ORDER BY tickets_sold DESC, revenue DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event analytics",
      error: error.message,
    });
  }
};