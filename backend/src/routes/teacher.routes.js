import { Router } from "express";
import {
  listLessonPlans, createLessonPlan, deleteLessonPlan,
  listMaterials, createMaterial, deleteMaterial,
  listActivities, createActivity, deleteActivity,
  createQuiz, listMyQuizzes,
} from "../controllers/teacher.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
const guard = [requireAuth, requireRole("TEACHER", "PROGRAMME_ADMIN", "ADMIN")];

router.get("/lesson-plans", ...guard, listLessonPlans);
router.post("/lesson-plans", ...guard, createLessonPlan);
router.delete("/lesson-plans/:id", ...guard, deleteLessonPlan);

router.get("/materials", ...guard, listMaterials);
router.post("/materials", ...guard, createMaterial);
router.delete("/materials/:id", ...guard, deleteMaterial);

router.get("/activities", ...guard, listActivities);
router.post("/activities", ...guard, createActivity);
router.delete("/activities/:id", ...guard, deleteActivity);

router.get("/quizzes", ...guard, listMyQuizzes);
router.post("/quizzes", ...guard, createQuiz);

export default router;
