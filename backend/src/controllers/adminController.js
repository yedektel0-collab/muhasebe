import pool from '../db/pool.js';

export async function getAdminUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAdminTickets(req, res) {
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
    console.error('Get admin tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['open', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: open, in_progress, or closed' });
    }

    const result = await pool.query(
      'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createPlan(req, res) {
  try {
    const { name, price, speed } = req.body;

    if (!name || !price || !speed) {
      return res.status(400).json({ error: 'Name, price, and speed are required' });
    }

    const result = await pool.query(
      'INSERT INTO plans (name, price, speed) VALUES ($1, $2, $3) RETURNING *',
      [name, price, speed]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePlan(req, res) {
  try {
    const { id } = req.params;
    const { name, price, speed } = req.body;

    if (!name || !price || !speed) {
      return res.status(400).json({ error: 'Name, price, and speed are required' });
    }

    const result = await pool.query(
      'UPDATE plans SET name = $1, price = $2, speed = $3 WHERE id = $4 RETURNING *',
      [name, price, speed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deletePlan(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM plans WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}