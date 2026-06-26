import fs from "fs";
import path from "path";
import pool from "./db.js";

const FILE_PATTERN = /^\d{3}_[a-z0-9_]+\.sql$/;

function getSqlFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Folder tidak ditemukan: ${directory}`);
  }

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (!FILE_PATTERN.test(file)) {
      throw new Error(
        `Nama file tidak valid: ${file}
Gunakan format: 001_nama_file.sql`,
      );
    }
  }

  return files;
}

export async function runSqlFiles({ directory, historyTable }) {
  const client = await pool.connect();

  const executed = [];
  const skipped = [];
  const failed = [];

  try {
    await client.query("BEGIN");

    // Membuat tabel history jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${historyTable} (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const files = getSqlFiles(directory);

    for (const file of files) {
      const exists = await client.query(
        `
        SELECT 1
        FROM ${historyTable}
        WHERE filename = $1
        `,
        [file],
      );

      if (exists.rowCount > 0) {
        skipped.push(file);
        continue;
      }

      const sql = fs.readFileSync(path.join(directory, file), "utf8");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO ${historyTable}(filename)
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
