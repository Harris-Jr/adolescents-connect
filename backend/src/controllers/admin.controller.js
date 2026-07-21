import { PrismaClient } from "@prisma/client";
import { resolveSchool } from "../utils/school.js";

const prisma = new PrismaClient();

const ROLE_LABEL = {
  LEARNER: "Learner",
  TEACHER: "Teacher",
  SCHOOL_ADMIN: "School Admin",
  PROGRAMME_ADMIN: "Programme Admin",
  ADMIN: "Admin",
};
const LABEL_TO_ROLE = Object.fromEntries(
  Object.entries(ROLE_LABEL).map(([role, label]) => [label, role])
);

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

function shapeService(s) {
  return {
    id: s.id,
    name: s.name,
    categoryId: s.categoryId,
    category: s.category?.title ?? null,
    province: s.province,
    district: s.district,
    location: s.location,
    phone: s.phone,
    hours: s.hours,
    description: s.description,
    is24Hours: s.is24Hours,
    isActive: s.isActive,
  };
}

// GET /api/admin/users — real user directory for the admin panel
// Optional filters: ?role=<label>&province=&q=
export async function listUsers(req, res) {
  try {
    const { role, province, q } = req.query;

    const where = {};
    if (role && role !== "all" && LABEL_TO_ROLE[role]) where.role = LABEL_TO_ROLE[role];
    if (province && province !== "all") where.province = province;
    if (q?.trim()) {
      const term = q.trim();
      where.OR = [
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term, mode: "insensitive" } },
      ];
    }

    const rows = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        role: true, province: true, schoolName: true, isActive: true, createdAt: true,
      },
    });

    const users = rows.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email ?? u.phone,
      role: ROLE_LABEL[u.role] ?? u.role,
      province: u.province ?? "—",
      school: u.schoolName ?? "—",
      status: u.isActive ? "active" : "inactive",
      joined: ymd(u.createdAt),
    }));

    res.json({ users });
  } catch (err) {
    console.error("admin listUsers error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// PATCH /api/admin/users/:id — activate / deactivate an account
export async function updateUserStatus(req, res) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive (boolean) is required" });
    }
    if (req.params.id === req.user.id && isActive === false) {
      return res.status(400).json({ error: "You cannot deactivate your own account" });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive },
      select: { id: true, isActive: true },
    });
    res.json({ user });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "User not found" });
    console.error("admin updateUserStatus error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
}

// GET /api/admin/schools — schools with learner/teacher counts
export async function listSchools(_req, res) {
  try {
    const rows = await prisma.school.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { users: true } },
        users: { select: { role: true } },
      },
    });

    const schools = rows.map((s) => {
      const learners = s.users.filter((u) => u.role === "LEARNER").length;
      const teachers = s.users.filter((u) => u.role === "TEACHER").length;
      return {
        id: s.id,
        name: s.name,
        province: s.province ?? "—",
        district: s.district ?? "—",
        learners,
        teachers,
        // No status column on School — derive: a school with any enrolled
        // users is treated as active, otherwise still pending onboarding.
        status: s.users.length > 0 ? "active" : "pending",
      };
    });

    res.json({ schools });
  } catch (err) {
    console.error("admin listSchools error:", err);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
}

// POST /api/admin/schools — register a new school
export async function createSchool(req, res) {
  try {
    const { name, province, district } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "School name is required" });

    // resolve-or-create: case-insensitive match, writes canonical name back
    const school = await resolveSchool(prisma, name, { province, district });
    res.status(201).json({
      school: {
        id: school.id,
        name: school.name,
        province: school.province ?? "—",
        district: school.district ?? "—",
        learners: 0,
        teachers: 0,
        status: "pending",
      },
    });
  } catch (err) {
    console.error("admin createSchool error:", err);
    res.status(500).json({ error: "Failed to create school" });
  }
}

// GET /api/admin/overview — national KPIs, charts and recent registrations
export async function overview(_req, res) {
  try {
    const [
      totalUsers, schoolCount, clubCount, teacherCount, provinceGroups, roleGroups, recent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.club.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.groupBy({ by: ["province"], _count: { _all: true } }),
      prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, firstName: true, lastName: true, role: true, province: true, createdAt: true },
      }),
    ]);

    const kpis = {
      totalUsers,
      schools: schoolCount,
      provinces: provinceGroups.filter((g) => g.province).length,
      activeClubs: clubCount,
      teachersTrained: teacherCount,
    };

    // Registrations for the last 6 months, oldest → newest
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString("en-US", { month: "short" }),
        registrations: 0,
      });
    }
    const monthIndex = new Map(months.map((m, i) => [m.key, i]));
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });
    for (const u of recentUsers) {
      const key = `${u.createdAt.getFullYear()}-${u.createdAt.getMonth()}`;
      const idx = monthIndex.get(key);
      if (idx !== undefined) months[idx].registrations += 1;
    }
    const monthlyRegistrations = months.map(({ month, registrations }) => ({ month, registrations }));

    const activityByProvince = provinceGroups
      .filter((g) => g.province)
      .map((g) => ({ province: g.province, activity: g._count._all }))
      .sort((a, b) => b.activity - a.activity);

    const usersByRole = roleGroups.map((g) => ({
      name: ROLE_LABEL[g.role] ?? g.role,
      value: g._count._all,
    }));

    const recentRegistrations = recent.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      role: ROLE_LABEL[u.role] ?? u.role,
      province: u.province ?? "—",
      joined: ymd(u.createdAt),
    }));

    res.json({ kpis, monthlyRegistrations, activityByProvince, usersByRole, recentRegistrations });
  } catch (err) {
    console.error("admin overview error:", err);
    res.status(500).json({ error: "Failed to fetch overview" });
  }
}

// ---------- Referral service directory management (SRS §11) ----------
// Lets ZCSIF correct phone numbers / addresses without editing the seed.

// GET /api/admin/referral-services — full directory, incl. inactive
export async function listReferralServices(_req, res) {
  try {
    const rows = await prisma.referralService.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      include: { category: { select: { title: true } } },
    });
    res.json({ services: rows.map(shapeService) });
  } catch (err) {
    console.error("admin listReferralServices error:", err);
    res.status(500).json({ error: "Failed to fetch referral services" });
  }
}

const REQUIRED = { name: "name", categoryId: "category", province: "province", district: "district", location: "location", phone: "phone", hours: "hours" };

// POST /api/admin/referral-services
export async function createReferralService(req, res) {
  try {
    const b = req.body ?? {};
    for (const [field, label] of Object.entries(REQUIRED)) {
      const val = b[field];
      if (val === undefined || val === null || String(val).trim() === "") {
        return res.status(400).json({ error: `${label} is required` });
      }
    }
    const created = await prisma.referralService.create({
      data: {
        name: String(b.name).trim(),
        categoryId: b.categoryId,
        province: String(b.province).trim(),
        district: String(b.district).trim(),
        location: String(b.location).trim(),
        phone: String(b.phone).trim(),
        hours: String(b.hours).trim(),
        description: b.description ? String(b.description).trim() : null,
        is24Hours: Boolean(b.is24Hours),
        isActive: b.isActive === undefined ? true : Boolean(b.isActive),
      },
      include: { category: { select: { title: true } } },
    });
    res.status(201).json({ service: shapeService(created) });
  } catch (err) {
    if (err.code === "P2003") return res.status(400).json({ error: "Invalid category" });
    console.error("admin createReferralService error:", err);
    res.status(500).json({ error: "Failed to create referral service" });
  }
}

// PATCH /api/admin/referral-services/:id — partial update (e.g. phone/address)
export async function updateReferralService(req, res) {
  try {
    const b = req.body ?? {};
    const data = {};
    const trimField = (key) => {
      if (b[key] === undefined) return;
      if (String(b[key]).trim() === "") throw { status: 400, message: `${key} cannot be blank` };
      data[key] = String(b[key]).trim();
    };
    ["name", "categoryId", "province", "district", "location", "phone", "hours"].forEach(trimField);
    if (b.description !== undefined) data.description = b.description ? String(b.description).trim() : null;
    if (b.is24Hours !== undefined) data.is24Hours = Boolean(b.is24Hours);
    if (b.isActive !== undefined) data.isActive = Boolean(b.isActive);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updated = await prisma.referralService.update({
      where: { id: req.params.id },
      data,
      include: { category: { select: { title: true } } },
    });
    res.json({ service: shapeService(updated) });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    if (err.code === "P2025") return res.status(404).json({ error: "Referral service not found" });
    if (err.code === "P2003") return res.status(400).json({ error: "Invalid category" });
    console.error("admin updateReferralService error:", err);
    res.status(500).json({ error: "Failed to update referral service" });
  }
}

// DELETE /api/admin/referral-services/:id
export async function deleteReferralService(req, res) {
  try {
    await prisma.referralService.delete({ where: { id: req.params.id } });
    res.json({ message: "Referral service deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Referral service not found" });
    console.error("admin deleteReferralService error:", err);
    res.status(500).json({ error: "Failed to delete referral service" });
  }
}
