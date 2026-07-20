import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  listChallenges,
  getChallengeById,
  completeChallenge,
} from "../controllers/challenges.controller.js";

const router = Router();

router.get("/", listChallenges);
router.get("/:id", getChallengeById);

export default router;
