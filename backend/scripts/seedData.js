import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedData() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    await client.connect();
    
    // Create a sample regular user
    const hashedPassword = await bcrypt.hash('user123', 10);
    
    const userResult = await client.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING id',
      ['John Doe', 'user@muhasebe.com', hashedPassword, 'user']
    );

    let userId = userResult.rows[0]?.id;
    if (!userId) {
      // User already exists, get their ID
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', ['user@muhasebe.com']);
      userId = existingUser.rows[0]?.id;
    }

    // Create sample plans
    await client.query(`
      INSERT INTO plans (name, price, speed) VALUES 
      ('Basic', 29.99, '10 Mbps'),
      ('Standard', 49.99, '50 Mbps'),
      ('Premium', 99.99, '100 Mbps')
      ON CONFLICT DO NOTHING
    `);

    // Create sample tickets
    if (userId) {
      await client.query(`
        INSERT INTO tickets (user_id, title, description, status) VALUES 
        ($1, 'Internet connection issue', 'My internet is very slow today', 'open'),
        ($1, 'Billing question', 'I have a question about my last bill', 'in_progress'),
        ($1, 'Service upgrade request', 'I want to upgrade to premium plan', 'closed')
        ON CONFLICT DO NOTHING
      `, [userId]);
    }

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().then(() => process.exit(0));
}

export { seedData };