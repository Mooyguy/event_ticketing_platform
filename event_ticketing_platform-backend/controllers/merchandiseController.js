import pool from "../database/db.js";

export const getAllMerchandise = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        m.id,
        m.event_id,
        m.name,
        m.description,
        m.price,
        m.stock,
        m.image,
        m.category,
        m.status,
        m.created_at,
        e.title AS event_title
      FROM merchandise m
      LEFT JOIN events e ON m.event_id = e.id
      ORDER BY m.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch merchandise",
      error: error.message,
    });
  }
};

export const getMerchandiseByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        event_id,
        name,
        description,
        price,
        stock,
        image,
        category,
        status,
        created_at
      FROM merchandise
      WHERE (event_id = ? OR event_id IS NULL)
        AND status = 'Available'
      ORDER BY created_at DESC
      `,
      [eventId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event merchandise",
      error: error.message,
    });
  }
};

export const getRecommendedMerchandise = async (req, res) => {
  try {
    const { category } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        event_id,
        name,
        description,
        price,
        stock,
        image,
        category,
        status,
        created_at
      FROM merchandise
      WHERE status = 'Available'
        AND (
          category = ?
          OR name LIKE ?
          OR description LIKE ?
        )
      ORDER BY stock DESC, created_at DESC
      LIMIT 6
      `,
      [category, `%${category}%`, `%${category}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recommended merchandise",
      error: error.message,
    });
  }
};

export const getMerchandiseById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        m.id,
        m.event_id,
        m.name,
        m.description,
        m.price,
        m.stock,
        m.image,
        m.category,
        m.status,
        m.created_at,
        e.title AS event_title
      FROM merchandise m
      LEFT JOIN events e ON m.event_id = e.id
      WHERE m.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Merchandise not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch merchandise item",
      error: error.message,
    });
  }
};

export const createMerchandise = async (req, res) => {
  try {
    const {
      event_id,
      name,
      description,
      price,
      stock,
      image,
      category,
      status,
    } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, and stock are required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO merchandise
      (event_id, name, description, price, stock, image, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        event_id || null,
        name,
        description || null,
        price,
        stock,
        image || null,
        category || null,
        status || "Available",
      ]
    );

    res.status(201).json({
      message: "Merchandise created successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create merchandise",
      error: error.message,
    });
  }
};

export const updateMerchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      event_id,
      name,
      description,
      price,
      stock,
      image,
      category,
      status,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE merchandise
      SET
        event_id = ?,
        name = ?,
        description = ?,
        price = ?,
        stock = ?,
        image = ?,
        category = ?,
        status = ?
      WHERE id = ?
      `,
      [
        event_id || null,
        name,
        description || null,
        price,
        stock,
        image || null,
        category || null,
        status || "Available",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Merchandise not found",
      });
    }

    res.json({
      message: "Merchandise updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update merchandise",
      error: error.message,
    });
  }
};

export const deleteMerchandise = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM merchandise WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Merchandise not found",
      });
    }

    res.json({
      message: "Merchandise deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete merchandise",
      error: error.message,
    });
  }
};