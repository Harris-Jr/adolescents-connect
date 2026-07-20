import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Powers the school autocomplete in onboarding/profile. Optional
// ?province= filter narrows the list to the learner's selection.
export async function listSchools(req, res) {
  try {
    const { province } = req.query;
    const schools = await prisma.school.findMany({
      where: province ? { province } : undefined,
      select: { id: true, name: true, province: true, district: true },
      orderBy: { name: "asc" },
    });
    res.json({ schools });
  } catch (err) {
    console.error("listSchools error:", err);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
}
