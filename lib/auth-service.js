import bcrypt from "bcryptjs";
import pool from "./db.js";
import { generateToken } from "./jwt.js";

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Object}
 */
export async function login(username, password) {
  // 1. Cari user
  const user = await findUserByUsername(username);

  // 2. Validasi user
  validateUser(user);

  // 3. Verifikasi password
  await verifyPassword(password, user.password_hash);

  // 4. Ambil role
  const roles = await getUserRoles(user.id);

  // 5. Ambil permission
  const permissions = await getUserPermissions(user.id);

  // 6. Generate JWT
  const token = generateToken(user);

  // 7. Return hasil login
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      roles,
      permissions,
    },
  };
}

/**
 * Cari user berdasarkan username
 */
async function findUserByUsername(username) {
  const result = await pool.query(
    `
    SELECT
      id,
      username,
      password_hash,
      name,
      is_active
    FROM users
    WHERE username = $1
    LIMIT 1;
    `,
    [username],
  );

  return result.rows[0] ?? null;
}

/**
 * Validasi user
 */
function validateUser(user) {
  if (!user) {
    throw new Error("Username atau password salah.");
  }

  if (!user.is_active) {
    throw new Error("Akun tidak aktif.");
  }
}

/**
 * Verifikasi password
 */
async function verifyPassword(password, passwordHash) {
  throw new Error("Not implemented.");
}

/**
 * Ambil seluruh role user
 */
async function getUserRoles(userId) {
  throw new Error("Not implemented.");
}

/**
 * Ambil seluruh permission user
 */
async function getUserPermissions(userId) {
  throw new Error("Not implemented.");
}
