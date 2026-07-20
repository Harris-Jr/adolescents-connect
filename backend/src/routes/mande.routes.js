import { Router } from "express";
import { getMandeOverview, exportMandeReport } from "../controllers/mande.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "PROGRAMME_ADMIN"), getMandeOverview);
router.get("/export", requireAuth, requireRole("ADMIN", "PROGRAMME_ADMIN"), exportMandeReport);

export default router;
