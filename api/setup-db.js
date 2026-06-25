import { runMigrations } from "../lib/migration.js";

export default async function handler(req, res) {
  try {
    await runMigrations();

    res.status(200).json({
      success: true,
      message: "Database migration completed.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
