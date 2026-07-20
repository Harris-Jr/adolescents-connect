import rateLimit from "express-rate-limit";

/**
 * Rate limiter for login attempts
 * 5 requests per 15 minutes
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip for specific IPs if needed (e.g., testing)
    return false;
  },
});

/**
 * Rate limiter for forgot password
 * 5 requests per hour
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Too many password reset requests from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for registration
 * 10 requests per hour
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many accounts created from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for reset password
 * 3 requests per 15 minutes
 */
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message:
    "Too many password reset attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for refresh token
 * 30 requests per 15 minutes (very permissive, for normal operation)
 */
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many token refresh requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
