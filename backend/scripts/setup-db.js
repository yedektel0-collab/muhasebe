import pool from "../src/db/pool.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log("Setting up database...");
    
    // Run initial migration
    const sql1 = fs.readFileSync(path.join(__dirname, "../sql/001_init.sql"), "utf8");
    await pool.query(sql1);
    console.log("✓ Created customers table");
    
    // Run auth tables migration
    const sql2 = fs.readFileSync(path.join(__dirname, "../sql/002_auth_tables.sql"), "utf8");
    await pool.query(sql2);
    console.log("✓ Created users, tickets, and plans tables");
    
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPass = process.env.ADMIN_PASS || "adminpassword";
    
    const existingAdmin = await pool.query("SELECT id FROM users WHERE email = $1", [adminEmail]);
    
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
        ["Admin User", adminEmail, hashedPassword, "admin"]
      );
      console.log("✓ Created admin user:", adminEmail);
    } else {
      console.log("✓ Admin user already exists");
    }
    
    // Create a test regular user
    const testUserEmail = "user@example.com";
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [testUserEmail]);
    
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("userpassword", 10);
      const userResult = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
        ["Test User", testUserEmail, hashedPassword, "user"]
      );
      const userId = userResult.rows[0].id;
      
      // Create some test tickets for this user
      await pool.query(
        "INSERT INTO tickets (user_id, title, description, status) VALUES ($1, $2, $3, $4)",
        [userId, "Login Issue", "Cannot login to the system", "open"]
      );
      await pool.query(
        "INSERT INTO tickets (user_id, title, description, status) VALUES ($1, $2, $3, $4)",
        [userId, "Billing Question", "Need help with my bill", "closed"]
      );
      
      console.log("✓ Created test user and tickets");
    }
    
    // Create some sample plans
    const planCheck = await pool.query("SELECT id FROM plans LIMIT 1");
    if (planCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO plans (name, price, speed) VALUES ($1, $2, $3)",
        ["Basic", 9.99, "10 Mbps"]
      );
      await pool.query(
        "INSERT INTO plans (name, price, speed) VALUES ($1, $2, $3)",
        ["Pro", 19.99, "50 Mbps"]
      );
      await pool.query(
        "INSERT INTO plans (name, price, speed) VALUES ($1, $2, $3)",
        ["Enterprise", 49.99, "100 Mbps"]
      );
      console.log("✓ Created sample plans");
    }
    
    console.log("\n🎉 Database setup complete!");
    console.log("Admin credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPass);
    
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    await pool.end();
  }
}

setupDatabase();