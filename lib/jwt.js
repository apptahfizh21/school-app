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
  const token = jwt.sign(
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

  // ===== DEBUG =====
  console.log("========== JWT GENERATED ==========");
  console.log("SECRET LENGTH :", JWT_SECRET.length);
  console.log("ALGORITHM     :", JWT_ALGORITHM);
  console.log("EXPIRES IN    :", JWT_EXPIRES_IN);
  console.log("PAYLOAD        :", {
    id: user.id,
    username: user.username,
  });
  console.log("TOKEN          :", token);
  console.log("===================================");
  // =================

  return token;
}

/**
 * Verify JWT Token
 * @param {string} token
 * @returns {Object}
 */
export function verifyToken(token) {
  // ===== DEBUG =====
  console.log("========== JWT VERIFY ==========");
  console.log("SECRET LENGTH :", JWT_SECRET.length);
  console.log("ALGORITHM     :", JWT_ALGORITHM);
  console.log("TOKEN          :", token);
  console.log("================================");
  // =================

  const payload = jwt.verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  });

  // ===== DEBUG =====
  console.log("======= JWT VERIFIED =======");
  console.log("PAYLOAD :", payload);
  console.log("============================");
  // =================

  return payload;
}
