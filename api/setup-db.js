import pool from "../lib/db.js";

export default async function handler(req, res) {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

          username VARCHAR(50) UNIQUE NOT NULL,

          password_hash TEXT NOT NULL,

          full_name VARCHAR(100) NOT NULL,

          role VARCHAR(20) NOT NULL,

          is_active BOOLEAN DEFAULT TRUE,

          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    res.status(200).json({
      success: true,
      message: "Database setup berhasil",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
