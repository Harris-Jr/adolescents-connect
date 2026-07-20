import { Router } from "express";
import { listSchools } from "../controllers/schools.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, listSchools);

export default router;
