const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'local-development-secret';
const hasDatabase = Boolean(process.env.DATABASE_URL);
const pool = hasDatabase
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const demoUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  passwordHash: bcrypt.hashSync('demo1234', 10)
};

async function prepareDatabase() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [demoUser.email]);
  if (existing.rowCount === 0) {
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [demoUser.name, demoUser.email, demoUser.passwordHash]
    );
  }
}

async function findUser(email) {
  if (!pool) return email === demoUser.email ? demoUser : null;

  const result = await pool.query(
    'SELECT id, name, email, password_hash AS "passwordHash" FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

app.get('/api/health', async (_req, res) => {
  if (!pool) return res.json({ ok: true, database: 'demo-fallback' });

  try {
    await pool.query('SELECT 1');
    return res.json({ ok: true, database: 'connected' });
  } catch (_error) {
    return res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.post('/api/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Enter your email and password.' });
  }

  try {
    const user = await findUser(email);
    const validPassword = user && await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: 'That email or password is not right.' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'The login service is temporarily unavailable.' });
  }
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie('session');
  res.status(204).end();
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

prepareDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Login app running at http://localhost:${port}`));
  })
  .catch((error) => {
    console.error('Could not prepare the database:', error);
    process.exit(1);
  });
