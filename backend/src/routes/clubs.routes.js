import { Router } from "express";
import {
  listClubs,
  getMyClubs,
  getClubById,
  createClub,
  joinClub,
  leaveClub,
  getMembership,
  listAnnouncements,
  createAnnouncement,
} from "../controllers/clubs.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Auth required — must come before /:id
router.get("/mine", requireAuth, getMyClubs);

// Public — browsing doesn't require login
router.get("/", listClubs);
router.get("/:id", getClubById);

// Create — teachers/school admins/admins only
router.post("/", requireAuth, requireRole("TEACHER", "SCHOOL_ADMIN", "PROGRAMME_ADMIN", "ADMIN"), createClub);

// Auth required — joining/leaving/checking membership
router.get("/:id/membership", requireAuth, getMembership);
router.post("/:id/join", requireAuth, joinClub);
router.delete("/:id/leave", requireAuth, leaveClub);

// Announcements — anyone can read, only staff can post
router.get("/:id/announcements", listAnnouncements);
router.post("/:id/announcements", requireAuth, requireRole("TEACHER", "SCHOOL_ADMIN", "PROGRAMME_ADMIN", "ADMIN"), createAnnouncement);

export default router;
