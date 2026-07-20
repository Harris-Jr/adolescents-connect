import { Router } from "express";
import {
  getSchoolLearners, getSchoolTeachers, getSchoolClubs, getSchoolStats,
} from "../controllers/school.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
const guard = [requireAuth, requireRole("SCHOOL_ADMIN", "PROGRAMME_ADMIN", "ADMIN")];

router.get("/stats", ...guard, getSchoolStats);
router.get("/learners", ...guard, getSchoolLearners);
router.get("/teachers", ...guard, getSchoolTeachers);
router.get("/clubs", ...guard, getSchoolClubs);

export default router;
