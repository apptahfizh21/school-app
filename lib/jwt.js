import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
const JWT_ALGORITHM = "HS256";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured.");
}

/**
 * Generate JWT Token
 * @param {Object} user
 * @param {string} user.id
 * @param {string} user.username
 * @returns {string}
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

/**
 * Verify JWT Token
 * @param {string} token
 * @returns {Object}
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  });
}
