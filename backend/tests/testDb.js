import { Client } from "pg";
import fs from "fs";
import path from "path";

export async function ensureTestDatabase() {
  const admin = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "postgres",
  });
  await admin.connect();

  const dbName = process.env.DATABASE_NAME;
  const exists = await admin.query(
    "SELECT 1 FROM pg_database WHERE datname=$1",
    [dbName],
  );
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created test database ${dbName}`);
  }
  await admin.end();

  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: dbName,
  });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const sqlDir = path.join(process.cwd(), "sql");
  if (fs.existsSync(sqlDir)) {
    const files = fs
      .readdirSync(sqlDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const file of files) {
      const applied = await client.query(
        "SELECT 1 FROM _migrations WHERE filename=$1",
        [file],
      );
      if (applied.rowCount > 0) continue;
      const sql = fs
        .readFileSync(path.join(sqlDir, file), "utf8")
        .replace(/^\uFEFF/, "");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations(filename) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
        console.log(`Applied (test): ${file}`);
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }
  }

  await client.end();
}

export async function resetTables() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  await client.connect();
  await client.query("TRUNCATE customers RESTART IDENTITY CASCADE;");
  await client.end();
}
