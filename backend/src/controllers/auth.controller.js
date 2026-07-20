import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../utils/jwt.js";
import {
  validatePasswordBasic,
  validatePasswordMatch,
} from "../utils/passwordValidator.js";
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../utils/email.js";
import { resolveSchool } from "../utils/school.js";

const prisma = new PrismaClient();
const REFRESH_EXPIRES_DAYS = 7;
const BCRYPT_SALT_ROUNDS = 12;

function safeUser(user) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  };
}

/**
 * POST /auth/register
 * Register new user with email and password
 */
export async function register(req, res) {
  try {
    const input = req.body;

    // Validate required fields
    if (!input.firstName?.trim() || !input.lastName?.trim()) {
      return res.status(400).json({ error: "First and last names are required" });
    }

    if (!input.email?.trim() && !input.phone?.trim()) {
      return res.status(400).json({ error: "Email or phone is required" });
    }

    if (!input.password || !input.confirmPassword) {
      return res.status(400).json({ error: "Password and confirmation are required" });
    }

    // Validate password strength
    const passwordCheck = validatePasswordBasic(input.password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        error: passwordCheck.errors[0],
        details: passwordCheck.errors,
      });
    }

    // Validate passwords match
    const matchCheck = validatePasswordMatch(input.password, input.confirmPassword);
    if (!matchCheck.isValid) {
      return res.status(400).json({ error: matchCheck.error });
    }

    // Validate date of birth if provided
    if (input.dateOfBirth && isNaN(new Date(input.dateOfBirth).getTime())) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          ...(input.email ? [{ email: input.email }] : []),
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email or phone already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    // Link (or create) the School record for free-text school names
    const school = await resolveSchool(prisma, input.school, {
      province: input.province,
      district: input.district,
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        passwordHash,
        gender: input.gender || null,
        grade: input.grade ? Number(input.grade) : null,
        schoolId: school?.id || null,
        schoolName: school?.name || null,
        role: input.role === "teacher" ? "TEACHER" : "LEARNER",
        subjects: input.subjects || [],
        staffId: input.staffId || null,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        province: input.province || null,
        district: input.district || null,
        disabilityStatus: input.disabilityStatus || null,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken();
    const expiresAt = new Date(
      Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt,
      },
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshTokenValue, cookieOptions());

    // Send welcome email (non-blocking)
    if (user.email) {
      sendWelcomeEmail(user.email, user.firstName).catch((err) =>
        console.error("Welcome email failed:", err)
      );
    }

    return res.status(201).json({
      user: safeUser(user),
      accessToken,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}

/**
 * POST /auth/login
 * Login user with email/phone and password
 */
export async function login(req, res) {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!email && !phone) {
      return res
        .status(400).json({ error: "Email or phone is required" });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is inactive. Contact your administrator.",
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken();
    const expiresAt = new Date(
      Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt,
      },
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshTokenValue, cookieOptions());

    return res.json({
      user: safeUser(user),
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}

/**
 * POST /auth/refresh-token
 * Generate new access token using refresh token
 * Implements token rotation: old token deleted, new token created
 */
export async function refreshToken(req, res) {
  try {
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // Find and verify refresh token
    const stored = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: true },
    });

    if (!stored) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    if (stored.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      return res.status(401).json({ error: "Refresh token expired" });
    }

    if (!stored.user.isActive) {
      return res.status(401).json({ error: "User account is inactive" });
    }

    // Generate new access token
    const accessToken = generateAccessToken(stored.user);

    // Rotate refresh token
    const newRefreshTokenValue = generateRefreshToken();
    const expiresAt = new Date(
      Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
    );

    // Delete old token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: stored.id } }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshTokenValue,
          userId: stored.userId,
          expiresAt,
        },
      }),
    ]);

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshTokenValue, cookieOptions());

    return res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ error: "Token refresh failed" });
  }
}

/**
 * POST /auth/logout
 * Logout user and invalidate refresh token
 */
export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
}

/**
 * POST /auth/forgot-password
 * Send password reset email
 * Does NOT reveal whether email exists (security best practice)
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res
        .status(400)
        .json({ error: "Email is required" });
    }

    // Find user (silently fail if not found)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Generate reset token
      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordReset.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send email
      try {
        await sendPasswordResetEmail(
          user.email,
          resetToken,
          user.firstName
        );
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        // Log error but don't expose to client
      }
    }

    // Always return success to prevent email enumeration
    return res.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Request failed" });
  }
}

/**
 * POST /auth/reset-password
 * Reset password using reset token
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token?.trim()) {
      return res.status(400).json({ error: "Reset token is required" });
    }

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirmation are required" });
    }

    // Validate password strength
    const passwordCheck = validatePasswordBasic(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        error: passwordCheck.errors[0],
        details: passwordCheck.errors,
      });
    }

    // Validate passwords match
    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.isValid) {
      return res.status(400).json({ error: matchCheck.error });
    }

    // Find and verify reset token
    const reset = await prisma.passwordReset.findUnique({
      where: { token: token.trim() },
      include: { user: true },
    });

    if (!reset) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    if (reset.used) {
      return res
        .status(400)
        .json({ error: "This reset link has already been used" });
    }

    if (reset.expiresAt < new Date()) {
      return res.status(400).json({ error: "Reset link has expired" });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // Update user password and mark token as used
    await prisma.$transaction([
      // Update password
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      // Mark token as used
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      }),
      // IMPORTANT: Delete all refresh tokens for security
      prisma.refreshToken.deleteMany({
        where: { userId: reset.userId },
      }),
    ]);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Password reset failed" });
  }
}

/**
 * GET /auth/me
 * Get current user info (requires auth)
 */
export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        grade: true,
        schoolId: true,
        schoolName: true,
        subjects: true,
        staffId: true,
        dateOfBirth: true,
        province: true,
        district: true,
        disabilityStatus: true,
        role: true,
        isActive: true,
        onboardingDone: true,
        createdAt: true,
      },
    });

    return res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}

