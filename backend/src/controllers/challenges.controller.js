import { PrismaClient } from "@prisma/client";
import { createNotification } from "./notifications.controller.js";
const prisma = new PrismaClient();

export async function listChallenges(_req, res) {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { deadline: "asc" },
    });
    res.json({ challenges });
  } catch (err) {
    console.error("listChallenges error:", err);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
}

export async function getChallengeById(req, res) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
    });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json({ challenge });
  } catch (err) {
    console.error("getChallengeById error:", err);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
}

export async function completeChallenge(req, res) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
    });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    const attempt = await prisma.challengeAttempt.create({
      data: {
        userId: req.user.id,
        challengeId: req.params.id,
        pointsEarned: challenge.points,
      },
    });
    res.status(201).json({ attempt, pointsEarned: challenge.points });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Challenge already completed" });
    }
    console.error("completeChallenge error:", err);
    res.status(500).json({ error: "Failed to complete challenge" });
  }
}
