import { PrismaClient } from "@prisma/client";
import { resolveSchool } from "../utils/school.js";
const prisma = new PrismaClient();

export async function listUsers(_req, res) {
  res.json({ users: [] });
}

export async function getMyPoints(req, res) {
  try {
    const [quizAgg, challengeAgg, ambassadorAgg] = await Promise.all([
      prisma.quizAttempt.aggregate({
        where: { userId: req.user.id },
        _sum: { pointsEarned: true },
      }),
      prisma.challengeAttempt.aggregate({
        where: { userId: req.user.id },
        _sum: { pointsEarned: true },
      }),
      prisma.ambassadorReport.aggregate({
        where: { status: "VERIFIED", ambassador: { userId: req.user.id } },
        _sum: { pointsAwarded: true },
      }),
    ]);
    const points =
      (quizAgg._sum.pointsEarned ?? 0) +
      (challengeAgg._sum.pointsEarned ?? 0) +
      (ambassadorAgg._sum.pointsAwarded ?? 0);
    res.json({ points });
  } catch (err) {
    console.error("getMyPoints error:", err);
    res.status(500).json({ error: "Failed to fetch points" });
  }
}

export async function updateMe(req, res) {
  try {
    const {
      gender, grade, schoolName, subjects, staffId, onboardingDone,
      dateOfBirth, province, district, disabilityStatus,
      avatar, interests,
    } = req.body;

    const data = {};
    if (gender !== undefined) data.gender = gender;
    if (grade !== undefined) data.grade = grade ? parseInt(grade) : null;
    if (schoolName !== undefined) {
      // Onboarding and Profile both send province/district alongside the
      // school name; new schools are stamped with that geo
      const school = await resolveSchool(prisma, schoolName, { province, district });
      data.schoolId = school?.id ?? null;
      data.schoolName = school?.name ?? null;
    }
    if (subjects !== undefined) data.subjects = subjects;
    if (staffId !== undefined) data.staffId = staffId;
    if (onboardingDone !== undefined) data.onboardingDone = onboardingDone;
    if (dateOfBirth !== undefined) {
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime())) {
          return res.status(400).json({ error: "Invalid date of birth" });
        }
        data.dateOfBirth = dob;
      } else {
        data.dateOfBirth = null;
      }
    }
    if (province !== undefined) data.province = province || null;
    if (district !== undefined) data.district = district || null;
    if (disabilityStatus !== undefined) data.disabilityStatus = disabilityStatus || null;
    // avatar and interests are frontend-only (localStorage) — not in schema, skip silently

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, gender: true, grade: true, schoolId: true, schoolName: true,
        role: true, subjects: true, staffId: true,
        dateOfBirth: true, province: true, district: true, disabilityStatus: true,
        isActive: true, onboardingDone: true,
      },
    });
    res.json({ user });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}
