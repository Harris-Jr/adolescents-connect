import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { resolveSchool } from "../utils/school.js";
import {
  validatePasswordBasic,
  validatePasswordMatch,
} from "../utils/passwordValidator.js";
const prisma = new PrismaClient();
const BCRYPT_SALT_ROUNDS = 12;

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
      firstName, lastName,
      gender, grade, schoolName, subjects, staffId, onboardingDone,
      dateOfBirth, province, district, disabilityStatus,
      avatar, interests,
    } = req.body;

    const data = {};
    if (firstName !== undefined) {
      if (!String(firstName).trim()) {
        return res.status(400).json({ error: "First name cannot be blank" });
      }
      data.firstName = String(firstName).trim();
    }
    if (lastName !== undefined) {
      if (!String(lastName).trim()) {
        return res.status(400).json({ error: "Last name cannot be blank" });
      }
      data.lastName = String(lastName).trim();
    }
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

// PATCH /api/users/me/password — authenticated password change. Verifies the
// current password before setting a new one. (Token-based reset for
// forgotten passwords lives separately in auth.)
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body ?? {};
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Current, new and confirmation passwords are required" });
    }

    const strength = validatePasswordBasic(newPassword);
    if (!strength.isValid) {
      return res.status(400).json({ error: strength.errors[0], details: strength.errors });
    }
    const match = validatePasswordMatch(newPassword, confirmPassword);
    if (!match.isValid) {
      return res.status(400).json({ error: match.error });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { passwordHash: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
}
