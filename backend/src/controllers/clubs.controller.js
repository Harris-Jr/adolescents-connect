import { PrismaClient } from "@prisma/client";
import { createNotification } from "./notifications.controller.js";
const prisma = new PrismaClient();

export async function listClubs(req, res) {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { name: "asc" },
    });
    res.json({ clubs });
  } catch (err) {
    console.error("listClubs error:", err);
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
}

export async function getClubById(req, res) {
  try {
    const club = await prisma.club.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, grade: true } },
          },
        },
      },
    });
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json({ club });
  } catch (err) {
    console.error("getClubById error:", err);
    res.status(500).json({ error: "Failed to fetch club" });
  }
}

export async function createClub(req, res) {
  try {
    const { name, category, description, schedule } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Club name is required" });

    const teacher = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { schoolId: true, schoolName: true },
    });

    const club = await prisma.club.create({
      data: {
        name,
        category: category || "leadership",
        description: description || null,
        school: teacher?.schoolName || null,
        schoolId: teacher?.schoolId || null,
      },
    });
    res.status(201).json({ club });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A club with this name already exists" });
    }
    console.error("createClub error:", err);
    res.status(500).json({ error: "Failed to create club" });
  }
}

export async function joinClub(req, res) {
  try {
    const membership = await prisma.clubMember.create({
      data: {
        clubId: req.params.id,
        userId: req.user.id,
      },
    });
    res.status(201).json({ membership, message: "Joined club successfully" });
  } catch (err) {
    // P2002 = unique constraint violation — already a member
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Already a member of this club" });
    }
    // P2003 = foreign key violation — club doesn't exist
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Club not found" });
    }
    console.error("joinClub error:", err);
    res.status(500).json({ error: "Failed to join club" });
  }
}

export async function leaveClub(req, res) {
  try {
    await prisma.clubMember.delete({
      where: {
        clubId_userId: {
          clubId: req.params.id,
          userId: req.user.id,
        },
      },
    });
    res.json({ message: "Left club successfully" });
  } catch (err) {
    // P2025 = record not found — not a member
    if (err.code === "P2025") {
      return res.status(409).json({ error: "You are not a member of this club" });
    }
    console.error("leaveClub error:", err);
    res.status(500).json({ error: "Failed to leave club" });
  }
}

export async function getMembership(req, res) {
  try {
    const membership = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: req.params.id,
          userId: req.user.id,
        },
      },
    });
    res.json({ isMember: !!membership });
  } catch (err) {
    console.error("getMembership error:", err);
    res.status(500).json({ error: "Failed to check membership" });
  }
}

export async function getMyClubs(req, res) {
  try {
    const memberships = await prisma.clubMember.findMany({
      where: { userId: req.user.id },
      include: {
        club: {
          include: { _count: { select: { members: true } } },
        },
      },
    });
    const clubs = memberships.map((m) => m.club);
    res.json({ clubs });
  } catch (err) {
    console.error("getMyClubs error:", err);
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
}

export async function listAnnouncements(req, res) {
  try {
    const announcements = await prisma.clubAnnouncement.findMany({
      where: { clubId: req.params.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ announcements });
  } catch (err) {
    console.error("listAnnouncements error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    const announcement = await prisma.clubAnnouncement.create({
      data: {
        clubId: req.params.id,
        authorId: req.user.id,
        message,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    res.status(201).json({ announcement });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Club not found" });
    }
    console.error("createAnnouncement error:", err);
    res.status(500).json({ error: "Failed to post announcement" });
  }
}
