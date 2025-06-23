import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

const app = express();
app.use(cors({
  origin: 'https://sheethole.net'
}));

app.use(express.json());

const db = new sqlite3.Database('./claims.db');

const CLIENT_ID = '475019880749-qdbpinnod6egm4oqltv3qahgtuotlv69.apps.googleusercontent.com';
const oauthClient = new OAuth2Client(CLIENT_ID);

// Initialize claims table
db.run(`CREATE TABLE claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_user_id TEXT,
  google_user_name TEXT,
  google_user_email TEXT,
  ship_number INTEGER,
  rarity TEXT,
  color TEXT,
  image_url TEXT,
  claimed_at TEXT
)`);

// ✅ Existing route to save ship claims
app.post('/api/claim-ship', (req, res) => {
  const { googleUserId, googleUserName, googleUserEmail, shipNumber, rarity, color, image, claimedAt } = req.body;

  db.run(
    `INSERT INTO claims 
     (google_user_id, google_user_name, google_user_email, ship_number, rarity, color, image_url, claimed_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [googleUserId || null, googleUserName || null, googleUserEmail || null, shipNumber, rarity, color, image, claimedAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get('/api/user-claims/:googleUserId', (req, res) => {
  const googleUserId = req.params.googleUserId;

  db.all(
    `SELECT * FROM claims WHERE google_user_id = ? ORDER BY claimed_at DESC LIMIT 3`,
    [googleUserId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, claims: rows });
    }
  );
});

// ✅ NEW route: Google login verification
app.post('/api/google-login', async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('✅ Google User:', payload);  // Helpful for debugging

    res.json({
      success: true,
      user: {
        id: payload.sub,           // Google's user ID (useful for linking with claims later)
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });
  } catch (error) {
    console.error('Google login verification error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.listen(3000, () => console.log('API running at http://localhost:3000'));


