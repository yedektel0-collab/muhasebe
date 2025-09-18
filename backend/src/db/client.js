import pkg from "pg";
const { Client } = pkg;

export async function getDbTime() {
  const client = new Client({
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "muhasebe"
  });
  await client.connect();
  const r = await client.query("SELECT NOW()");
  await client.end();
  return r.rows[0].now;
}
