import bcrypt from 'bcryptjs';
import pool from '../src/db/pool.js';

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminEmail || !adminPass) {
    console.log('Skipping admin seeding - ADMIN_EMAIL or ADMIN_PASS not set');
    return;
  }

  try {
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email',
      ['Admin User', adminEmail, hashedPassword, 'admin']
    );

    console.log(`Admin user created with email: ${result.rows[0].email}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin().then(() => process.exit(0));
}