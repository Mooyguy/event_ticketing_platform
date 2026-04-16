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
        e.price,
        e.seats_left,

        COUNT(b.id) AS total_bookings,
        COALESCE(SUM(b.quantity), 0) AS tickets_sold,
        COALESCE(SUM(b.quantity * e.price), 0) AS revenue

      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id
      ORDER BY revenue DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Failed to fetch analytics data",
      error: error.message,
    });
  }
};


export const getTopEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.category,
        COALESCE(SUM(b.quantity), 0) AS tickets_sold
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id
      ORDER BY tickets_sold DESC
      LIMIT 5
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Top events error:", error);
    res.status(500).json({
      message: "Failed to fetch top events",
      error: error.message,
    });
  }
};


export const getOverallStats = async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM events) AS total_events,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COALESCE(SUM(quantity), 0) FROM bookings) AS total_tickets,
        (
          SELECT COALESCE(SUM(b.quantity * e.price), 0)
          FROM bookings b
          JOIN events e ON b.event_id = e.id
        ) AS total_revenue
    `);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Overall stats error:", error);
    res.status(500).json({
      message: "Failed to fetch overall stats",
      error: error.message,
    });
  }
};