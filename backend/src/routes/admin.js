import express from "express";
import pool from "../db/pool.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware and admin check to all admin routes
router.use(authMiddleware);
router.use(isAdmin);

// GET /api/admin/users - list all users
router.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/tickets - list all tickets with user email
router.get("/tickets", async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.title, t.description, t.status, t.created_at, t.updated_at,
             u.email as user_email, u.name as user_name
      FROM tickets t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/tickets/:id - update ticket status
router.patch("/tickets/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    
    if (!['open', 'closed', 'in_progress'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'open', 'closed', or 'in_progress'" });
    }
    
    const result = await pool.query(
      "UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/plans - create new plan
router.post("/plans", async (req, res, next) => {
  try {
    const { name, price, speed } = req.body;
    
    if (!name || !price || !speed) {
      return res.status(400).json({ error: "Name, price, and speed are required" });
    }
    
    const result = await pool.query(
      "INSERT INTO plans (name, price, speed) VALUES ($1, $2, $3) RETURNING *",
      [name, price, speed]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/plans/:id - update plan
router.put("/plans/:id", async (req, res, next) => {
  try {
    const { name, price, speed } = req.body;
    
    if (!name || !price || !speed) {
      return res.status(400).json({ error: "Name, price, and speed are required" });
    }
    
    const result = await pool.query(
      "UPDATE plans SET name = $1, price = $2, speed = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [name, price, speed, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/plans/:id - delete plan
router.delete("/plans/:id", async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM plans WHERE id = $1",
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;