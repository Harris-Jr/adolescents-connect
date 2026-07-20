import { Router } from "express";
import {
  listCourses,
  getCourseById,
  getQuizById,
  submitQuizAttempt,
  createCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Public — anyone can browse the course catalog
router.get("/", listCourses);
router.get("/:id", getCourseById);

// Quiz lookup (separate resource, same controller for now)
router.get("/quizzes/:id", getQuizById);
router.post("/quizzes/:id/attempt", requireAuth, submitQuizAttempt);

// Protected — only teachers/admins can create or delete courses
router.post("/", requireAuth, requireRole("TEACHER", "PROGRAMME_ADMIN", "ADMIN"), createCourse);
router.delete("/:id", requireAuth, requireRole("TEACHER", "PROGRAMME_ADMIN", "ADMIN"), deleteCourse);

export default router;
