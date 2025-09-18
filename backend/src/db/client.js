import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "muhasebe",
});

export async function getDbTime() {
  const r = await pool.query("SELECT NOW()");
  return r.rows[0].now;
}

export async function getAllCustomers() {
  const r = await pool.query(
    "SELECT id, name, email, created_at FROM customers ORDER BY id ASC",
  );
  return r.rows;
}

export async function getCustomerById(id) {
  const r = await pool.query(
    "SELECT id, name, email, created_at FROM customers WHERE id = $1",
    [id],
  );
  return r.rows[0] || null;
}

export async function createCustomer({ name, email }) {
  const r = await pool.query(
    "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
    [name, email],
  );
  return r.rows[0];
}

export async function updateCustomer(id, { name, email }) {
  const r = await pool.query(
    `UPDATE customers
     SET name = COALESCE($2, name),
         email = COALESCE($3, email)
     WHERE id = $1
     RETURNING id, name, email, created_at`,
    [id, name ?? null, email ?? null],
  );
  return r.rows[0] || null;
}

export async function deleteCustomer(id) {
  const r = await pool.query("DELETE FROM customers WHERE id = $1", [id]);
  return r.rowCount > 0;
}
