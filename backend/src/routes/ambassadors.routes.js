import { Router } from "express";
import {
  applyAmbassador,
  getMyAmbassador,
  updateMyAmbassador,
  listMissions,
  submitReport,
  listApplications,
  reviewApplication,
  createMission,
  updateMission,
  listReports,
  reviewReport,
} from "../controllers/ambassadors.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
const requireAdmin = requireRole("ADMIN", "PROGRAMME_ADMIN");

// Learner side
router.post("/apply", requireAuth, applyAmbassador);
router.get("/me", requireAuth, getMyAmbassador);
router.patch("/me", requireAuth, updateMyAmbassador);
router.get("/missions", requireAuth, listMissions);
router.post("/reports", requireAuth, submitReport);

// Admin side
router.get("/applications", requireAuth, requireAdmin, listApplications);
router.patch("/applications/:id", requireAuth, requireAdmin, reviewApplication);
router.post("/missions", requireAuth, requireAdmin, createMission);
router.patch("/missions/:id", requireAuth, requireAdmin, updateMission);
router.get("/reports", requireAuth, requireAdmin, listReports);
router.patch("/reports/:id", requireAuth, requireAdmin, reviewReport);

export default router;
