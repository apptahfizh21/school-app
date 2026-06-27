import bcrypt from "bcryptjs";
import pool from "./db.js";

const SALT_ROUNDS = 12;

export async function seedSuperAdmin() {
  const username = process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_FULL_NAME;

  if (!username) {
    throw new Error("SUPER_ADMIN_USERNAME belum diset.");
  }

  if (!password) {
    throw new Error("SUPER_ADMIN_PASSWORD belum diset.");
  }

  if (!name) {
    throw new Error("SUPER_ADMIN_FULL_NAME belum diset.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Cari role SUPER_ADMIN
    const roleResult = await client.query(
      `
      SELECT id
      FROM roles
      WHERE code = 'SUPER_ADMIN'
      LIMIT 1
      `,
    );

    if (roleResult.rowCount === 0) {
      throw new Error("Role SUPER_ADMIN tidak ditemukan.");
    }

    const roleId = roleResult.rows[0].id;

    // Cek apakah user sudah ada
    const userResult = await client.query(
      `
  SELECT
      id,
      password_hash
  FROM users
  WHERE username = $1
  LIMIT 1
  `,
      [username],
    );

    let userId;
    let created = false;
    let passwordUpdated = false;

    if (userResult.rowCount > 0) {
      userId = userResult.rows[0].id;

      const currentHash = userResult.rows[0].password_hash;

      const matched = await bcrypt.compare(password, currentHash);

      if (!matched) {
        const newHash = await bcrypt.hash(password, SALT_ROUNDS);

        await client.query(
          `
      UPDATE users
      SET
          password_hash = $1,
          modified_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
          [newHash, userId],
        );

        passwordUpdated = true;
      }
    } else {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const insertUser = await client.query(
        `
    INSERT INTO users
    (
      username,
      password_hash,
      name
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    RETURNING id
    `,
        [username, passwordHash, name],
      );

      userId = insertUser.rows[0].id;
      created = true;
    }

    // Pastikan relasi user_roles ada
    await client.query(
      `
      INSERT INTO user_roles
      (
        user_id,
        role_id
      )
      VALUES
      (
        $1,
        $2
      )
      ON CONFLICT (user_id, role_id)
      DO NOTHING
      `,
      [userId, roleId],
    );

    await client.query("COMMIT");

    return {
      created,
      passwordUpdated,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
