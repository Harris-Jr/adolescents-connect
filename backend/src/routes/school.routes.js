import { Router } from "express";
import {
  getSchoolLearners, getSchoolTeachers, getSchoolClubs, getSchoolStats,
  getSchoolProfile, updateSchoolProfile,
} from "../controllers/school.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
const guard = [requireAuth, requireRole("SCHOOL_ADMIN", "PROGRAMME_ADMIN", "ADMIN")];
// Editing the school's own profile is a School Admin self-service action.
const ownerGuard = [requireAuth, requireRole("SCHOOL_ADMIN")];

router.get("/stats", ...guard, getSchoolStats);
router.get("/learners", ...guard, getSchoolLearners);
router.get("/teachers", ...guard, getSchoolTeachers);
router.get("/clubs", ...guard, getSchoolClubs);
router.get("/profile", ...ownerGuard, getSchoolProfile);
router.patch("/profile", ...ownerGuard, updateSchoolProfile);

export default router;
