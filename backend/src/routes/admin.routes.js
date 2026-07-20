import { Router } from "express";
import {
  listUsers,
  updateUserStatus,
  listSchools,
  createSchool,
  overview,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Every admin route requires an admin-level role
router.use(requireAuth, requireRole("ADMIN", "PROGRAMME_ADMIN"));

router.get("/overview", overview);

router.get("/users", listUsers);
router.patch("/users/:id", updateUserStatus);

router.get("/schools", listSchools);
router.post("/schools", createSchool);

export default router;
