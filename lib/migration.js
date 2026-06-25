import fs from "fs";
import path from "path";
import pool from "./db.js";
import migrations from "../database/migration-index.js";

export async function runMigrations() {
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
      console.log(`Skip ${migration}`);
      continue;
    }

    const sqlPath = path.join(
      process.cwd(),
      "database",
      "migrations",
      migration,
    );

    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log(`Run ${migration}`);

    await pool.query(sql);

    if (migration !== "002_schema_migrations.sql") {
      await pool.query(
        `
                INSERT INTO schema_migrations
                (
                    migration_name
                )
                VALUES
                (
                    $1
                )
                `,
        [migration],
      );
    }
  }
}
