import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminEmail || !adminPass) {
    console.log('Skipping admin seeding - ADMIN_EMAIL or ADMIN_PASS not set');
    return;
  }

  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    await client.connect();
    
    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    
    const result = await client.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email',
      ['Admin User', adminEmail, hashedPassword, 'admin']
    );

    console.log(`Admin user created with email: ${result.rows[0].email}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await client.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin().then(() => process.exit(0));
}