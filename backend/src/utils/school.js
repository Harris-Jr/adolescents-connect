/**
 * Resolve a free-text school name to a School record, creating one if
 * no case-insensitive match exists. Returns null for blank names.
 * Geo (province/district) is only stamped on newly created schools —
 * existing records are never overwritten by a learner's selection.
 */
export async function resolveSchool(prisma, name, { province, district } = {}) {
  const trimmed = name?.trim();
  if (!trimmed) return null;

  const existing = await prisma.school.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (existing) return existing;

  try {
    return await prisma.school.create({
      data: {
        name: trimmed,
        province: province || null,
        district: district || null,
      },
    });
  } catch (err) {
    // P2002: another request created the same school concurrently
    if (err.code === "P2002") {
      return prisma.school.findFirst({
        where: { name: { equals: trimmed, mode: "insensitive" } },
      });
    }
    throw err;
  }
}
