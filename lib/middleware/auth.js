import { verifyToken } from "../jwt.js";

/**
 * Middleware autentikasi JWT
 * Memverifikasi Bearer Token dan mengembalikan payload JWT.
 *
 * @param {import("http").IncomingMessage} req
 * @returns {Object} Payload JWT
 */
export async function authenticate(req) {
  // Ambil Authorization Header
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new Error("Authorization header tidak ditemukan.");
  }

  // Format harus: Bearer <token>
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Format Authorization tidak valid.");
  }

  // Verifikasi JWT
  const payload = verifyToken(token);

  // Simpan payload ke request
  req.user = payload;

  return payload;
}
