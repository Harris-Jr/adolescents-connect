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

// Chat — authenticated only (safeguarding: sessions carry sensitive
// disclosures from minors, so every session must have a known owner and
// access is restricted to that owner or a reviewer).
router.post("/chat/start", requireAuth, startChat);
router.post("/chat/:sessionId/message", requireAuth, sendMessage);
router.get("/chat/:sessionId/messages", requireAuth, getMessages);

// Admin only — list all sessions
router.get(
  "/chat/sessions",
  requireAuth,
  requireRole("ADMIN", "PROGRAMME_ADMIN"),
  listSessions
);

export default router;
