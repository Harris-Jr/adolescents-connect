import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

/**
 * Generate JWT access token (short-lived: 15 minutes)
 * Payload includes: userId, email, phone, role
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

/**
 * Generate secure random refresh token
 * Stored in database and sent as HttpOnly cookie
 */
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

/**
 * Generate secure random password reset token
 * Sent via email to user for password reset
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify JWT access token
 * Throws error if invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

/**
 * Decode token without verifying (for debugging only)
 */
export function decodeToken(token) {
  return jwt.decode(token);
}
