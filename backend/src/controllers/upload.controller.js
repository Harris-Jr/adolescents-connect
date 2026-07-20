import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const prisma = new PrismaClient();

export async function uploadAvatar(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "File must be an image" });
    }

    // Max 5MB
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image must be under 5MB" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "avatars");

    // Persist avatar URL to user record
    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: result.secure_url },
    });

    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
}

export async function uploadMaterial(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // Max 20MB for materials
    if (req.file.size > 20 * 1024 * 1024) {
      return res.status(400).json({ error: "File must be under 20MB" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "materials");
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error("uploadMaterial error:", err);
    return res.status(500).json({ error: "Failed to upload material" });
  }
}
