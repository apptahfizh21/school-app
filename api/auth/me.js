import { authenticate } from "../../lib/middleware/auth.js";

export default async function handler(req, res) {
  // Hanya menerima GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // Verifikasi JWT
    await authenticate(req);

    return res.status(200).json({
      success: true,
      message: "Autentikasi berhasil.",
      data: req.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}
