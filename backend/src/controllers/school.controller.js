import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get the school scope for the requesting admin. Prefers the schoolId FK;
// falls back to schoolName string matching for accounts not yet linked.
async function getSchoolScope(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { schoolId: true, schoolName: true },
  });
  if (!user?.schoolId && !user?.schoolName) return null;
  return {
    schoolId: user.schoolId,
    schoolName: user.schoolName,
    userWhere: user.schoolId ? { schoolId: user.schoolId } : { schoolName: user.schoolName },
    clubWhere: user.schoolId ? { schoolId: user.schoolId } : { school: user.schoolName },
  };
}

export async function getSchoolLearners(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope) return res.status(400).json({ error: "No school associated with your account" });
    const learners = await prisma.user.findMany({
      where: { ...scope.userWhere, role: "LEARNER", isActive: true },
      select: {
        id: true, firstName: true, lastName: true,
        grade: true, gender: true, isActive: true,
        quizAttempts: { select: { pointsEarned: true } },
      },
      orderBy: { lastName: "asc" },
    });
    const result = learners.map((l) => ({
      id: l.id,
      name: `${l.firstName} ${l.lastName}`,
      grade: l.grade,
      gender: l.gender,
      status: l.isActive ? "active" : "inactive",
      completion: l.quizAttempts.length > 0
        ? Math.min(100, Math.round((l.quizAttempts.length / 5) * 100))
        : 0,
    }));
    res.json({ learners: result, school: scope.schoolName });
  } catch (err) {
    console.error("getSchoolLearners error:", err);
    res.status(500).json({ error: "Failed to fetch learners" });
  }
}

export async function getSchoolTeachers(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope) return res.status(400).json({ error: "No school associated with your account" });
    const teachers = await prisma.user.findMany({
      where: { ...scope.userWhere, role: "TEACHER", isActive: true },
      select: { id: true, firstName: true, lastName: true, subjects: true, isActive: true },
      orderBy: { lastName: "asc" },
    });
    const result = teachers.map((t) => ({
      id: t.id,
      name: `${t.firstName} ${t.lastName}`,
      subject: t.subjects.join(", ") || "—",
      status: t.isActive ? "active" : "inactive",
    }));
    res.json({ teachers: result });
  } catch (err) {
    console.error("getSchoolTeachers error:", err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
}

export async function getSchoolClubs(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope) return res.status(400).json({ error: "No school associated with your account" });
    const clubs = await prisma.club.findMany({
      where: scope.clubWhere,
      include: { _count: { select: { members: true } } },
      orderBy: { name: "asc" },
    });
    res.json({ clubs });
  } catch (err) {
    console.error("getSchoolClubs error:", err);
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
}

// GET /api/school/profile — the requesting School Admin's own school record.
// Requires a linked schoolId (name-only accounts can't be edited safely).
export async function getSchoolProfile(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope?.schoolId) {
      return res.status(400).json({ error: "No linked school on your account" });
    }
    const school = await prisma.school.findUnique({
      where: { id: scope.schoolId },
      select: { id: true, name: true, province: true, district: true },
    });
    if (!school) return res.status(404).json({ error: "School not found" });
    res.json({ school });
  } catch (err) {
    console.error("getSchoolProfile error:", err);
    res.status(500).json({ error: "Failed to fetch school profile" });
  }
}

// PATCH /api/school/profile — edit the School Admin's own school. A rename
// cascades to the denormalized User.schoolName / Club.school copies so display
// names stay in sync. School.name is unique → a collision returns 409.
export async function updateSchoolProfile(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope?.schoolId) {
      return res.status(400).json({ error: "No linked school on your account" });
    }

    const b = req.body ?? {};
    const data = {};
    if (b.name !== undefined) {
      if (!String(b.name).trim()) return res.status(400).json({ error: "School name cannot be blank" });
      data.name = String(b.name).trim();
    }
    if (b.province !== undefined) data.province = b.province ? String(b.province).trim() : null;
    if (b.district !== undefined) data.district = b.district ? String(b.district).trim() : null;
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Update the School row and, on rename, the denormalized copies together.
    const [school] = await prisma.$transaction([
      prisma.school.update({
        where: { id: scope.schoolId },
        data,
        select: { id: true, name: true, province: true, district: true },
      }),
      ...(data.name
        ? [
            prisma.user.updateMany({ where: { schoolId: scope.schoolId }, data: { schoolName: data.name } }),
            prisma.club.updateMany({ where: { schoolId: scope.schoolId }, data: { school: data.name } }),
          ]
        : []),
    ]);

    res.json({ school });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A school with that name already exists" });
    }
    console.error("updateSchoolProfile error:", err);
    res.status(500).json({ error: "Failed to update school" });
  }
}

export async function getSchoolStats(req, res) {
  try {
    const scope = await getSchoolScope(req.user.id);
    if (!scope) return res.status(400).json({ error: "No school associated with your account" });
    const [learnerCount, teacherCount, clubCount, attempts] = await Promise.all([
      prisma.user.count({ where: { ...scope.userWhere, role: "LEARNER", isActive: true } }),
      prisma.user.count({ where: { ...scope.userWhere, role: "TEACHER", isActive: true } }),
      prisma.club.count({ where: scope.clubWhere }),
      prisma.quizAttempt.findMany({
        where: { user: scope.userWhere },
        select: { pointsEarned: true },
      }),
    ]);
    const avgCompletion = attempts.length > 0
      ? Math.min(100, Math.round((attempts.length / (learnerCount * 5)) * 100))
      : 0;
    res.json({ totalLearners: learnerCount, activeTeachers: teacherCount, totalClubs: clubCount, avgCompletion, school: scope.schoolName });
  } catch (err) {
    console.error("getSchoolStats error:", err);
    res.status(500).json({ error: "Failed to fetch school stats" });
  }
}
