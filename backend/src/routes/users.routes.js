import { Router } from "express";
import { listUsers, getMyPoints, updateMe, changePassword } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "PROGRAMME_ADMIN"), listUsers);

router.get("/me/points", requireAuth, getMyPoints);
router.patch("/me/password", requireAuth, changePassword);
router.patch("/me", requireAuth, updateMe);
export default router;
