import pool from '../db/pool.js';

export async function getAllPlans(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, price, speed, created_at FROM plans ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}