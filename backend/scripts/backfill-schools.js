/**
 * One-off backfill: create School records from the distinct free-text
 * school names on User.schoolName and Club.school, then link users and
 * clubs to them via schoolId. Safe to re-run (resolveSchool matches
 * case-insensitively; already-linked rows are skipped).
 *
 * Run from backend/: node scripts/backfill-schools.js
 */
import { PrismaClient } from "@prisma/client";
import { resolveSchool } from "../src/utils/school.js";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { schoolName: { not: null }, schoolId: null },
    select: { id: true, schoolName: true, province: true, district: true },
  });

  let linkedUsers = 0;
  for (const user of users) {
    const school = await resolveSchool(prisma, user.schoolName, {
      province: user.province,
      district: user.district,
    });
    if (!school) continue;
    await prisma.user.update({
      where: { id: user.id },
      data: { schoolId: school.id, schoolName: school.name },
    });
    linkedUsers++;
  }

  const clubs = await prisma.club.findMany({
    where: { school: { not: null }, schoolId: null },
    select: { id: true, school: true, province: true, district: true },
  });

  let linkedClubs = 0;
  for (const club of clubs) {
    const school = await resolveSchool(prisma, club.school, {
      province: club.province,
      district: club.district,
    });
    if (!school) continue;
    await prisma.club.update({
      where: { id: club.id },
      data: { schoolId: school.id, school: school.name },
    });
    linkedClubs++;
  }

  const totalSchools = await prisma.school.count();
  console.log(`Linked ${linkedUsers} users and ${linkedClubs} clubs. Schools in DB: ${totalSchools}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
