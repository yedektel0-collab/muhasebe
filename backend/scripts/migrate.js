import fs from "fs";
import path from "path";
import pkg from "pg";

const { Client } = pkg;

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5432,
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "muhasebe",
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
  if (!fs.existsSync(sqlDir)) {
    console.log("No sql directory. Skipping migrations.");
    await client.end();
    return;
  }

  const files = fs
    .readdirSync(sqlDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const exists = await client.query(
      "SELECT 1 FROM _migrations WHERE filename = $1",
      [file],
    );
    if (exists.rowCount > 0) {
      console.log(`Skip (already applied): ${file}`);
      continue;
    }

    const fullPath = path.join(sqlDir, file);
    // BOM varsa temizle
    const sql = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");

    console.log(`Applying: ${file}`);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations(filename) VALUES ($1)", [
        file,
      ]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      console.error(`Failed migration ${file}:`, e);
      throw e;
    }
  }

  await client.end();
  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
