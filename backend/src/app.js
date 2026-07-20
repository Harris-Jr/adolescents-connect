import "./config/env.js";
import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { verifyEmailConfig } from "./utils/email.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import clubsRoutes from "./routes/clubs.routes.js";
import challengesRoutes from "./routes/challenges.routes.js";
import supportRoutes from "./routes/support.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import mandeRoutes from "./routes/mande.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import schoolsRoutes from "./routes/schools.routes.js";
import ambassadorsRoutes from "./routes/ambassadors.routes.js";


const app = express();

// Security middleware
app.use(helmet());
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
  })
);

// Global rate limiting (280 requests per 15 minutes)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 280,
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/clubs", clubsRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/mande", mandeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/schools", schoolsRoutes);
app.use("/api/ambassadors", ambassadorsRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

// Initialize and start server
async function startServer() {
  try {
    // Verify email configuration on startup
    const emailConfigured = await verifyEmailConfig();
    if (!emailConfigured) {
      console.warn(
        "⚠ Email is not configured. Password reset emails will not be sent."
      );
      console.warn("Set EMAIL_USER and EMAIL_PASSWORD in .env to enable emails.");
    }

    app.listen(PORT, () => {
      console.log(`✓ A-LINKS backend running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;

