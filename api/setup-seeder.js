import { runSeeders } from "../lib/seeder.js";

export default async function handler(req, res) {
  try {
    const result = await runSeeders();

    res.status(200).json({
      success: true,
      message: "Database seeder completed.",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
