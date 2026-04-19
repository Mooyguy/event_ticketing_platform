import pool from "../database/db.js";

export const getRecommendedEvents = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [eventRows] = await pool.query(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookedEvent = eventRows[0];

    const bookedCity = (bookedEvent.location || "").split(",")[0].trim();

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
      WHERE id <> ?
        AND category = ?
        AND status = 'Available'
        AND seats_left > 0
      ORDER BY
        CASE
          WHEN location LIKE ? THEN 0
          ELSE 1
        END,
        ABS(price - ?),
        event_date ASC
      LIMIT 6
      `,
      [eventId, bookedEvent.category, `${bookedCity}%`, bookedEvent.price]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recommendations",
      error: error.message,
    });
  }
};