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

  // Hapus data sensitif setelah selesai digunakan
  delete user.password_hash;

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
  const matched = await bcrypt.compare(password, passwordHash);

  if (!matched) {
    throw new Error("Username atau password salah.");
  }
}

/**
 * Ambil seluruh role user
 */
async function getUserRoles(userId) {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.code,
      r.name
    FROM user_roles ur
    JOIN roles r
      ON r.id = ur.role_id
    WHERE ur.user_id = $1
      AND r.is_active = TRUE
    ORDER BY r.code;
    `,
    [userId],
  );

  return result.rows;
}

/**
 * Ambil seluruh permission user
 */
async function getUserPermissions(userId) {
  const result = await pool.query(
    `
    SELECT DISTINCT
      p.id,
      p.code,
      p.name,
      p.module
    FROM user_roles ur
    JOIN role_permissions rp
      ON rp.role_id = ur.role_id
    JOIN permissions p
      ON p.id = rp.permission_id
    WHERE ur.user_id = $1
      AND p.is_active = TRUE
    ORDER BY p.module, p.code;
    `,
    [userId],
  );

  return result.rows;
}
