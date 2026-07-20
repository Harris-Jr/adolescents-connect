import { Router } from "express";
import multer from "multer";
import { uploadAvatar, uploadMaterial } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/avatar", requireAuth, upload.single("avatar"), uploadAvatar);
router.post("/material", requireAuth, upload.single("file"), uploadMaterial);

export default router;
