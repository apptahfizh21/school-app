import fs from "fs";
import path from "path";
import pool from "./db.js";
import migrations from "../database/migration-index.js";

export async function runMigrations() {
  const executed = [];
  const skipped = [];
  const failed = [];

  // Pastikan tabel schema_migrations sudah ada
  await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            migration_name VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);

  for (const migration of migrations) {
    const check = await pool.query(
      `
            SELECT 1
            FROM schema_migrations
            WHERE migration_name = $1
            `,
      [migration],
    );

    if (check.rowCount > 0) {
      skipped.push(migration);
      continue;
    }

    const sqlFile = path.join(
      process.cwd(),
      "database",
      "migrations",
      migration,
    );

    const sql = fs.readFileSync(sqlFile, "utf8");

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(sql);

      await client.query(
        `
                INSERT INTO schema_migrations
                (migration_name)
                VALUES ($1)
                `,
        [migration],
      );

      await client.query("COMMIT");

      executed.push(migration);
    } catch (err) {
      await client.query("ROLLBACK");

      failed.push({
        migration,
        error: err.message,
      });

      throw err;
    } finally {
      client.release();
    }
  }

  return {
    executed,
    skipped,
    failed,
  };
}
