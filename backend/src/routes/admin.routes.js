import { Router } from "express";
import {
  listUsers,
  createUser,
  updateUserStatus,
  changeUserRole,
  listSchools,
  createSchool,
  overview,
  listReferralServices,
  createReferralService,
  updateReferralService,
  deleteReferralService,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Every admin route requires an admin-level role
router.use(requireAuth, requireRole("ADMIN", "PROGRAMME_ADMIN"));

router.get("/overview", overview);

router.get("/users", listUsers);
// Super-admin only: create users of any role + change an existing role.
router.post("/users", requireRole("ADMIN"), createUser);
router.patch("/users/:id/role", requireRole("ADMIN"), changeUserRole);
router.patch("/users/:id", updateUserStatus);

router.get("/schools", listSchools);
router.post("/schools", createSchool);

router.get("/referral-services", listReferralServices);
router.post("/referral-services", createReferralService);
router.patch("/referral-services/:id", updateReferralService);
router.delete("/referral-services/:id", deleteReferralService);

export default router;
