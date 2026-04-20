import bcrypt from "bcrypt";
import pool from "../database/db.js";

export const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@alleventshub.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345$";
    const adminName = process.env.ADMIN_NAME || "System Admin";

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existing.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [adminName, adminEmail, hashedPassword, "admin"]
    );

    console.log("Default admin user created");
    console.log(`Admin email: ${adminEmail}`);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
  }
};