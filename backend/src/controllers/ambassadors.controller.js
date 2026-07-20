import { PrismaClient } from "@prisma/client";
import { createNotification } from "./notifications.controller.js";

const prisma = new PrismaClient();

// Points awarded for a verified general community activity (no mission)
const GENERAL_ACTIVITY_POINTS = 25;

// ---------- Learner side ----------

// POST /api/ambassadors/apply
export async function applyAmbassador(req, res) {
  try {
    const motivation = req.body.motivation?.trim();
    if (!motivation) {
      return res.status(400).json({ error: "Please tell us why you want to be an ambassador" });
    }

    const existing = await prisma.ambassador.findUnique({ where: { userId: req.user.id } });
    if (existing && ["PENDING", "APPROVED"].includes(existing.status)) {
      return res.status(409).json({
        error: existing.status === "PENDING"
          ? "Your application is already under review"
          : "You are already an ambassador",
      });
    }

    // Re-application after rejection/deactivation resets the record
    const ambassador = existing
      ? await prisma.ambassador.update({
          where: { id: existing.id },
          data: { status: "PENDING", motivation, appliedAt: new Date(), reviewedAt: null, reviewedById: null },
        })
      : await prisma.ambassador.create({ data: { userId: req.user.id, motivation } });

    res.status(201).json({ ambassador });
  } catch (err) {
    console.error("applyAmbassador error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
}

// GET /api/ambassadors/me
export async function getMyAmbassador(req, res) {
  try {
    const ambassador = await prisma.ambassador.findUnique({
      where: { userId: req.user.id },
      include: {
        reports: {
          orderBy: { createdAt: "desc" },
          include: { mission: { select: { id: true, title: true } } },
        },
      },
    });
    res.json({ ambassador });
  } catch (err) {
    console.error("getMyAmbassador error:", err);
    res.status(500).json({ error: "Failed to fetch ambassador profile" });
  }
}

// PATCH /api/ambassadors/me — approved ambassadors update their bio
export async function updateMyAmbassador(req, res) {
  try {
    const ambassador = await prisma.ambassador.findUnique({ where: { userId: req.user.id } });
    if (!ambassador || ambassador.status !== "APPROVED") {
      return res.status(403).json({ error: "Only approved ambassadors can edit their profile" });
    }
    const { bio } = req.body;
    const updated = await prisma.ambassador.update({
      where: { id: ambassador.id },
      data: { bio: bio?.trim() || null },
    });
    res.json({ ambassador: updated });
  } catch (err) {
    console.error("updateMyAmbassador error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// GET /api/ambassadors/missions
export async function listMissions(_req, res) {
  try {
    const missions = await prisma.leadershipMission.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ missions });
  } catch (err) {
    console.error("listMissions error:", err);
    res.status(500).json({ error: "Failed to fetch missions" });
  }
}

// POST /api/ambassadors/reports — approved ambassadors submit activity reports
export async function submitReport(req, res) {
  try {
    const ambassador = await prisma.ambassador.findUnique({ where: { userId: req.user.id } });
    if (!ambassador || ambassador.status !== "APPROVED") {
      return res.status(403).json({ error: "Only approved ambassadors can submit reports" });
    }

    const { missionId, title, description, activityDate, location, participants, evidenceUrl } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    const date = new Date(activityDate);
    if (!activityDate || isNaN(date.getTime())) {
      return res.status(400).json({ error: "A valid activity date is required" });
    }

    if (missionId) {
      const mission = await prisma.leadershipMission.findUnique({ where: { id: missionId } });
      if (!mission || !mission.isActive) {
        return res.status(400).json({ error: "Mission not found or no longer active" });
      }
    }

    const report = await prisma.ambassadorReport.create({
      data: {
        ambassadorId: ambassador.id,
        missionId: missionId || null,
        title: title.trim(),
        description: description.trim(),
        activityDate: date,
        location: location?.trim() || null,
        participants: participants ? parseInt(participants) : null,
        evidenceUrl: evidenceUrl || null,
      },
      include: { mission: { select: { id: true, title: true } } },
    });
    res.status(201).json({ report });
  } catch (err) {
    console.error("submitReport error:", err);
    res.status(500).json({ error: "Failed to submit report" });
  }
}

// ---------- Admin side (ADMIN, PROGRAMME_ADMIN) ----------

// GET /api/ambassadors/applications?status=
export async function listApplications(req, res) {
  try {
    const { status } = req.query;
    const applications = await prisma.ambassador.findMany({
      where: status ? { status: String(status).toUpperCase() } : undefined,
      orderBy: { appliedAt: "desc" },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, grade: true,
            schoolName: true, province: true, district: true,
          },
        },
        _count: { select: { reports: true } },
      },
    });
    res.json({ applications });
  } catch (err) {
    console.error("listApplications error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

// PATCH /api/ambassadors/applications/:id — { action: "approve" | "reject" | "deactivate" }
export async function reviewApplication(req, res) {
  try {
    const { action } = req.body;
    const statusByAction = { approve: "APPROVED", reject: "REJECTED", deactivate: "INACTIVE" };
    const status = statusByAction[action];
    if (!status) return res.status(400).json({ error: "action must be approve, reject or deactivate" });

    const ambassador = await prisma.ambassador.findUnique({ where: { id: req.params.id } });
    if (!ambassador) return res.status(404).json({ error: "Application not found" });

    const updated = await prisma.ambassador.update({
      where: { id: ambassador.id },
      data: { status, reviewedAt: new Date(), reviewedById: req.user.id },
    });

    if (action === "approve") {
      await createNotification(
        ambassador.userId,
        "ambassador",
        "Congratulations! Your ambassador application has been approved. 🎉",
      );
    } else if (action === "reject") {
      await createNotification(
        ambassador.userId,
        "ambassador",
        "Your ambassador application was not approved this time. You can apply again.",
      );
    }
    res.json({ ambassador: updated });
  } catch (err) {
    console.error("reviewApplication error:", err);
    res.status(500).json({ error: "Failed to review application" });
  }
}

// POST /api/ambassadors/missions
export async function createMission(req, res) {
  try {
    const { title, description, points } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    const mission = await prisma.leadershipMission.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        points: points ? parseInt(points) : 50,
        createdById: req.user.id,
      },
    });
    res.status(201).json({ mission });
  } catch (err) {
    console.error("createMission error:", err);
    res.status(500).json({ error: "Failed to create mission" });
  }
}

// PATCH /api/ambassadors/missions/:id
export async function updateMission(req, res) {
  try {
    const { title, description, points, isActive } = req.body;
    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description.trim();
    if (points !== undefined) data.points = parseInt(points);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const mission = await prisma.leadershipMission.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ mission });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Mission not found" });
    console.error("updateMission error:", err);
    res.status(500).json({ error: "Failed to update mission" });
  }
}

// GET /api/ambassadors/reports?status=
export async function listReports(req, res) {
  try {
    const { status } = req.query;
    const reports = await prisma.ambassadorReport.findMany({
      where: status ? { status: String(status).toUpperCase() } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        mission: { select: { id: true, title: true, points: true } },
        ambassador: {
          select: {
            id: true,
            user: { select: { id: true, firstName: true, lastName: true, schoolName: true, province: true } },
          },
        },
      },
    });
    res.json({ reports });
  } catch (err) {
    console.error("listReports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
}

// PATCH /api/ambassadors/reports/:id — { action: "verify" | "reject" }
export async function reviewReport(req, res) {
  try {
    const { action } = req.body;
    if (!["verify", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be verify or reject" });
    }

    const report = await prisma.ambassadorReport.findUnique({
      where: { id: req.params.id },
      include: {
        mission: { select: { points: true, title: true } },
        ambassador: { select: { userId: true } },
      },
    });
    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.status !== "SUBMITTED") {
      return res.status(409).json({ error: "Report has already been reviewed" });
    }

    const pointsAwarded =
      action === "verify" ? (report.mission?.points ?? GENERAL_ACTIVITY_POINTS) : 0;

    const updated = await prisma.ambassadorReport.update({
      where: { id: report.id },
      data: {
        status: action === "verify" ? "VERIFIED" : "REJECTED",
        pointsAwarded,
        reviewedAt: new Date(),
        reviewedById: req.user.id,
      },
    });

    await createNotification(
      report.ambassador.userId,
      "ambassador",
      action === "verify"
        ? `Your activity report "${report.title}" was verified — you earned ${pointsAwarded} points!`
        : `Your activity report "${report.title}" was not verified. Contact your programme admin for details.`,
    );
    res.json({ report: updated });
  } catch (err) {
    console.error("reviewReport error:", err);
    res.status(500).json({ error: "Failed to review report" });
  }
}
