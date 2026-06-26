import fs from "fs";
import path from "path";
import pool from "./db.js";

const MIGRATION_DIR = path.join(process.cwd(), "database", "migrations");
const MIGRATION_PATTERN = /^\d{3}_[a-z0-9_]+\.sql$/;

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATION_DIR)) {
    throw new Error("Folder database/migrations tidak ditemukan.");
  }

  const files = fs
    .readdirSync(MIGRATION_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (!MIGRATION_PATTERN.test(file)) {
      throw new Error(
        `Nama migration tidak valid: ${file}
Gunakan format: 001_nama_migration.sql`,
      );
    }
  }

  return files;
}

export async function runMigrations() {
  const client = await pool.connect();

  const executed = [];
  const skipped = [];
  const failed = [];

  try {
    await client.query("BEGIN");

    // Membuat tabel schema_migrations jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationFiles = getMigrationFiles();

    for (const file of migrationFiles) {
      const exists = await client.query(
        `
        SELECT 1
        FROM schema_migrations
        WHERE filename = $1
        `,
        [file],
      );

      if (exists.rowCount > 0) {
        skipped.push(file);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATION_DIR, file), "utf8");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_migrations(filename)
          VALUES($1)
          `,
          [file],
        );

        executed.push(file);
      } catch (err) {
        failed.push({
          file,
          error: err.message,
        });

        throw err;
      }
    }

    await client.query("COMMIT");

    return {
      executed,
      skipped,
      failed,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}
