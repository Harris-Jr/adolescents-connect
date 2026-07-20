import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import {
  loginLimiter,
  forgotPasswordLimiter,
  registerLimiter,
  resetPasswordLimiter,
  refreshTokenLimiter,
} from "../utils/rateLimiters.js";

const router = Router();

/**
 * Auth endpoints
 */

// Register new user
router.post("/register", registerLimiter, register);

// Login
router.post("/login", loginLimiter, login);

// Refresh token with rotation
router.post("/refresh-token", refreshTokenLimiter, refreshToken);

// Logout
router.post("/logout", logout);

// Forgot password (request reset email)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// Reset password
router.post("/reset-password", resetPasswordLimiter, resetPassword);

// Get current user (requires auth)
router.get("/me", verifyAuth, getCurrentUser);

export default router;

