import bcrypt from "bcryptjs";
import pool from "../src/db/pool.js";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;
    
    if (!adminEmail || !adminPass) {
      console.log("ADMIN_EMAIL and ADMIN_PASS environment variables are required");
      return;
    }
    
    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log("Admin user already exists");
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      ["Admin User", adminEmail, hashedPassword, "admin"]
    );
    
    console.log("Admin user created:", result.rows[0]);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  } finally {
    await pool.end();
  }
}

seedAdmin();