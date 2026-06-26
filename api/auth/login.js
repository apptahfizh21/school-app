import { login } from "../../lib/auth-service.js";

export default async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const { username, password } = req.body ?? {};

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username dan password wajib diisi.",
      });
    }

    // Proses login
    const result = await login(username, password);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}
