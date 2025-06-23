// server.js
import express from "express";
import pkg from "pg";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

const { Pool } = pkg;
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const pool = new Pool({
  user: "your_pg_user",
  host: "localhost",
  database: "your_pg_database",
  password: "your_pg_password",
  port: 5432,
});

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const oauthClient = new OAuth2Client(CLIENT_ID);

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_user_id TEXT UNIQUE NOT NULL,
    google_user_name TEXT,
    google_user_email TEXT,
    wallet_address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    google_user_id TEXT REFERENCES users(google_user_id),
    ship_number INTEGER,
    rarity TEXT,
    color TEXT,
    image_url TEXT,
    claimed_at TIMESTAMP DEFAULT NOW()
  );
`);

app.post("/api/google-login", async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleUserId = payload.sub;

    // Check if user already has wallet address in DB
    const userResult = await pool.query(
      'SELECT wallet_address FROM claims WHERE google_user_id = $1 LIMIT 1',
      [googleUserId]
    );

    let walletAddress;

    if (userResult.rows.length === 0 || !userResult.rows[0].wallet_address) {
      // Create wallet if none exists
      const wallet = ethers.Wallet.createRandom();
      walletAddress = wallet.address;

      // Store wallet address for this user
      await pool.query(
        `INSERT INTO claims (google_user_id, google_user_name, google_user_email, wallet_address)
         VALUES ($1, $2, $3, $4)`,
        [googleUserId, payload.name, payload.email, walletAddress]
      );
    } else {
      walletAddress = userResult.rows[0].wallet_address;
    }


    res.json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        walletAddress,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

app.post("/api/save-user-wallet", async (req, res) => {
  const { googleUserId, googleUserName, googleUserEmail, walletAddress } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (google_user_id, google_user_name, google_user_email, wallet_address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_user_id)
       DO UPDATE SET google_user_name = EXCLUDED.google_user_name,
                     google_user_email = EXCLUDED.google_user_email,
                     wallet_address = EXCLUDED.wallet_address;`,
      [googleUserId, googleUserName, googleUserEmail, walletAddress]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/claim-ship", async (req, res) => {
  const { googleUserId, shipNumber, rarity, color, image } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO claims (google_user_id, ship_number, rarity, color, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id;`,
      [googleUserId, shipNumber, rarity, color, image]
    );

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/user-claims/:googleUserId", async (req, res) => {
  const { googleUserId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM claims WHERE google_user_id = $1 ORDER BY claimed_at DESC LIMIT 3;`,
      [googleUserId]
    );

    res.json({ success: true, claims: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("API running at http://localhost:3000"));
