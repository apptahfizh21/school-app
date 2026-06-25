import { runMigrations } from "../lib/migration.js";

export default async function handler(req, res) {
  try {
    const result = await runMigrations();

    res.status(200).json({
      success: true,
      message: "Database migration completed.",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
