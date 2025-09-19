const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);
const dbPath = path.join(DB_DIR, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user')`);
  db.run(`CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, speed TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, user_id INTEGER, subject TEXT, message TEXT, status TEXT DEFAULT 'open')`);
  db.run(`INSERT OR IGNORE INTO plans (id,name,price,speed) VALUES (1,'Basic',100,'10Mbps')`);
});

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name||'', email, hashed], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    const user = { id: this.lastID, email, name: name||'', role: 'user' };
    const token = generateToken(user);
    res.json({ user, token });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
    const user = { id: row.id, email: row.email, name: row.name, role: row.role };
    const token = generateToken(user);
    res.json({ user, token });
  });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'malformed token' });
  const token = parts[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data; next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

app.get('/api/me', authMiddleware, (req, res) => {
  db.get('SELECT id,name,email,role FROM users WHERE id = ?', [req.user.id], (err,row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ user: row });
  });
});

app.get('/api/plans', (req, res) => {
  db.all('SELECT * FROM plans', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/tickets', authMiddleware, (req,res)=>{
  const { subject, message } = req.body;
  db.run('INSERT INTO tickets (user_id,subject,message) VALUES (?,?,?)', [req.user.id, subject||'', message||''], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, status: 'open' });
  });
});

// Admin seeder
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;
if (ADMIN_EMAIL && ADMIN_PASS) {
  db.get('SELECT * FROM users WHERE email = ?', [ADMIN_EMAIL], async (err,row) => {
    if (!row) {
      const hashed = await bcrypt.hash(ADMIN_PASS, 10);
      db.run('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', ['Admin', ADMIN_EMAIL, hashed, 'admin']);
      console.log('Admin user created:', ADMIN_EMAIL);
    }
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend running on', PORT));

---
