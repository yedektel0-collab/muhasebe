import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

// GET /api/plans - public endpoint to list all plans
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM plans ORDER BY price ASC"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;