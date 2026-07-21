/**
 * Demo account provisioning.
 *
 * Creates the elevated-role accounts that CANNOT be self-registered from the
 * UI (SCHOOL_ADMIN, PROGRAMME_ADMIN, ADMIN) plus the demo School the school
 * admin is linked to. Registration only ever produces LEARNER/TEACHER
 * (auth.controller.js), and there is no role-change endpoint, so these three
 * must be provisioned directly.
 *
 * This seeds LOGIN ACCOUNTS ONLY — no fake learners, quiz attempts or
 * analytics. Register the learners/teacher from the UI during the demo (under
 * the exact school name below) and every dashboard fills from real activity.
 *
 * Idempotent: users are upserted by phone, the school by name — safe to
 * re-run to reset the demo (re-running also resets the password).
 *
 * Run from backend/:
 *   DEMO_PASSWORD='YourStr0ngPass!' node scripts/seed-demo.js
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { resolveSchool } from "../src/utils/school.js";

const prisma = new PrismaClient();
const BCRYPT_SALT_ROUNDS = 12;

const DEMO_SCHOOL = {
  name: "A-LINKS Demo Secondary School",
  province: "Lusaka",
  district: "Lusaka",
};

// Distinct 096600000x phones so they never collide with real demo signups.
const ACCOUNTS = [
  { firstName: "Joseph", lastName: "Test", phone: "0966000001", role: "SCHOOL_ADMIN", staffId: "DEMO-SA-01", linkSchool: true },
  { firstName: "Micheal", lastName: "Test", phone: "0966000002", role: "PROGRAMME_ADMIN", staffId: "DEMO-PA-01" },
  { firstName: "John", lastName: "Test", phone: "0966000003", role: "ADMIN", staffId: "DEMO-AD-01" },
];

async function main() {
  const password = process.env.DEMO_PASSWORD;
  if (!password || password.trim().length < 8) {
    console.error(
      "\n✗ Set DEMO_PASSWORD (min 8 chars) before running, e.g.:\n" +
        "    DEMO_PASSWORD='ChangeMe123!' node scripts/seed-demo.js\n" +
        "  (Credentials are never hardcoded in the repo.)\n",
    );
    process.exitCode = 1;
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Resolve-or-create the demo school (case-insensitive match on re-run).
  const school = await resolveSchool(prisma, DEMO_SCHOOL.name, {
    province: DEMO_SCHOOL.province,
    district: DEMO_SCHOOL.district,
  });

  const created = [];
  for (const acc of ACCOUNTS) {
    const data = {
      firstName: acc.firstName,
      lastName: acc.lastName,
      role: acc.role,
      staffId: acc.staffId,
      passwordHash,
      isActive: true,
      onboardingDone: true, // land straight on the dashboard, skip onboarding
      province: DEMO_SCHOOL.province,
      district: DEMO_SCHOOL.district,
      schoolId: acc.linkSchool ? school.id : null,
      schoolName: acc.linkSchool ? school.name : null,
    };
    const user = await prisma.user.upsert({
      where: { phone: acc.phone },
      update: data,
      create: { ...data, phone: acc.phone },
    });
    created.push({ role: user.role, name: `${user.firstName} ${user.lastName}`, phone: user.phone });
  }

  console.log(`\n✓ Demo school: ${school.name} (${school.province}/${school.district})`);
  console.log("✓ Demo accounts (password = your DEMO_PASSWORD):\n");
  for (const c of created) {
    console.log(`   ${c.role.padEnd(16)} ${c.phone}   ${c.name}`);
  }
  console.log(
    `\nNext: register 1 teacher + 3–4 learners from the UI under the exact school\n` +
      `  name "${school.name}", then generate real activity (quizzes, clubs,\n` +
      `  ambassador flow, I-Need-Help chat) to populate the dashboards.\n` +
      `  See scripts/DEMO.md for the full runbook.\n`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
