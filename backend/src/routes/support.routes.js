import { Router } from "express";
import {
  listReferralServices,
  listSupportMeta,
  startChat,
  sendMessage,
  getMessages,
  listSessions,
} from "../controllers/support.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Referral directory (SRS §11) — public read, like courses
router.get("/services", listReferralServices);
router.get("/meta", listSupportMeta);

// Chat — start is optionally authed (guests can chat too)
router.post("/chat/start", startChat);
router.post("/chat/:sessionId/message", sendMessage);
router.get("/chat/:sessionId/messages", getMessages);

// Admin only — list all sessions
router.get(
  "/chat/sessions",
  requireAuth,
  requireRole("ADMIN", "PROGRAMME_ADMIN"),
  listSessions
);

export default router;
