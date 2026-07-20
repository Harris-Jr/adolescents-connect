# A-LINKS (Adolescents Connect) — Session Memory

Last updated: 10 July 2026 (session 6 — ALL Gap Analysis High +
Medium items done: demographics, M&E exports, School model with FK,
Ambassador Hub. Remaining gaps are Low/Deferred: offline sync,
accessibility pass, WhatsApp.)

---

## What This Project Is

A-LINKS (Adolescents LINKS) — a national digital platform for
Zambian adolescents (Grades 5–12) covering learning, life
skills/health, digital safety, leadership, clubs, challenges,
and confidential support services. Built for ZCSIF. Harris is
technical coordinator.

**Stack:** PERN — PostgreSQL + Express + React + Node.js
**Frontend:** React + Vite + React Router DOM v6 + Tailwind +
shadcn/ui, plain JS JSX (no TS)
**Backend:** Express + Prisma + PostgreSQL + JWT auth
**Environment:** Windows + WSL Ubuntu

**Project path:** `/mnt/c/Users/HP/Downloads/adolescents-connect-main/`
- Backend: `backend/` → `http://localhost:5000`
- Frontend: `frontend/` → Vite dev server `http://localhost:5173`
- API base: `http://localhost:5000/api`

---

## What's Fully Done

### Frontend
- ✅ All learner pages wired to real APIs (LearnIndex, ClubsIndex, CourseDetail)
- ✅ TeacherDashboard — all 9 sections, full CRUD
- ✅ SchoolDashboard — Promise.all fetching all 4 endpoints
- ✅ Onboarding — syntax bug fixed, user.name → firstName/lastName fixed
- ✅ Profile — avatar uploads to Cloudinary, profile saves to DB, all field bugs fixed

### Backend
- ✅ Full auth (register, login, refresh, logout, forgot/reset password)
- ✅ Courses, quizzes, clubs, challenges, leaderboard, notifications, chat
- ✅ Teacher APIs (lesson plans, materials, activities, quizzes)
- ✅ School APIs (stats, learners, teachers, clubs)
- ✅ Cloudinary upload (avatar + material)

### Security
- ✅ All controllers audited — all writes scoped to req.user.id or req.user.schoolName
- ✅ deleteMany silent no-op fixed — all 3 teacher delete handlers return 404 on non-owned records
- ✅ Quiz authorship — createdById field added (migration applied), createQuiz stamps it,
  listMyQuizzes filters by it
- ✅ School stats field names aligned — backend now returns totalLearners/activeTeachers/totalClubs
  matching what SchoolDashboard.jsx expects
- ✅ Club IDs — seed recreates clubs with real UUIDs, API-created clubs auto-get UUIDs
- ✅ ClubsContext "mine" restoration — verified working end-to-end

### Gap Analysis — High items (session 6, 10 July 2026)
- ✅ User demographics: `dateOfBirth`, `province`, `district`,
  `disabilityStatus` added to User (all nullable). Accepted in
  register + PATCH /users/me, returned by getCurrentUser/updateMe.
  Onboarding step 3 collects them (required for students; province/
  district shown for teachers too). Profile page edits them.
  Province→district dependent dropdowns from
  `frontend/src/lib/zambia-locations.js` (10 provinces, all districts,
  DISABILITY_OPTIONS incl. "Prefer not to say").
- ✅ M&E hub is real: `mande.controller.js` aggregates from DB
  (buildMandeData): totals, registrations by month, participation by
  province (distinct quiz-attempters / learners), quiz performance
  (avg score + pass rate vs passMark), gender/disability/district
  breakdowns, club joins by month. Date range via ?from&to.
  `GET /api/mande/export?format=csv|xlsx|pdf` (exceljs + pdfkit,
  both installed). Mande.jsx fetches real data, 3 export buttons
  download via authenticated fetch → blob.
- ✅ School model (Medium item 1): `School` (id, name unique, province,
  district) with FKs `User.schoolId` and `Club.schoolId` (both
  SetNull). `schoolName`/`Club.school` strings kept as denormalized
  display fields, always synced. Resolve-or-create on save:
  `src/utils/school.js` → `resolveSchool(prisma, name, {province,
  district})` — case-insensitive + trimmed match, canonical name
  written back; used by register + updateMe. school.controller scopes
  by schoolId (falls back to name match if schoolId null).
  createClub stamps both school + schoolId. New endpoint:
  GET /api/schools [auth] (?province= filter) → { schools } — powers
  datalist autocomplete in Onboarding school input. Backfill script:
  `backend/scripts/backfill-schools.js` (re-runnable, run 10 Jul).
- ✅ Ambassador Hub (Medium item 2): models `Ambassador` (1:1 User,
  status PENDING/APPROVED/REJECTED/INACTIVE, motivation, bio),
  `LeadershipMission` (title, description, points, isActive),
  `AmbassadorReport` (mission optional — null = general community
  activity, activityDate, participants=reach, evidenceUrl, status
  SUBMITTED/VERIFIED/REJECTED, pointsAwarded).
  `ambassadors.controller.js` + routes at /api/ambassadors.
  Verify awards mission points (25 default for general activities),
  sends notifications on approve/reject/verify via
  createNotification. Leaderboard + GET /users/me/points now sum a
  3rd source: VERIFIED report pointsAwarded. M&E overview/exports
  gained `ambassadorActivity` (active, pending, submitted, verified,
  adolescentsReached) + "Ambassador Activities" report section.
  Frontend: `/ambassador` learner page (state machine: apply →
  pending → approved dashboard w/ missions, report form, evidence
  upload via /upload/material, report history);
  `/admin/ambassadors` admin page (tabs: Applications/Missions/
  Reports); ClubsIndex AmbassadorSection form now POSTs for real
  (was fake local state); AdminDashboard NAV has Ambassadors link;
  Mande.jsx has Ambassador Activities panel.
  Reviewers: ADMIN + PROGRAMME_ADMIN only. Any learner can apply.
- Test accounts: create one per role via the seed script. Do NOT
  hardcode credentials in docs or commit them to the repo. The seed
  can also provision sample ambassador data (an APPROVED ambassador
  with a verified report and an active mission) for exercising the
  Ambassador Hub end-to-end.

### Schema / Migrations (11 total, in order)
- `20260619090531_init`
- `20260625075359_add_content_models`
- `20260625134308_add_attempt_models`
- `20260626081521_add_chat_models`
- `20260626090506_add_notifications`
- `20260626093329_add_teacher_models`
- `20260629091003_add_club_announcements`
- `20260702084745_add_quiz_created_by`
- `20260710150628_add_learner_demographics`
- `20260710153703_add_school_model` (School table + User/Club schoolId FKs)
- `20260710155608_add_ambassador_module` (Ambassador, LeadershipMission,
  AmbassadorReport)

---

## Stack / Patterns Reference

### Backend
- No shared `lib/prisma.js` — each controller instantiates PrismaClient directly
- Auth middleware: `src/middleware/auth.middleware.js` → `requireAuth`
- Role middleware: `src/middleware/role.middleware.js` → `requireRole(...roles)`
- `req.user.id` set by `requireAuth`
- Prisma error codes: P2002 = unique, P2003 = FK, P2025 = not found
- Cloudinary: `src/utils/cloudinary.js` → `uploadToCloudinary(buffer, folder)`
  - env var: `CLOUDINARY_CLOUD_NAME` (not CLOUDINARY_NAME)

### Frontend
- `API_URL` from `src/lib/api.js` = `import.meta.env.VITE_API_URL || "http://localhost:5000/api"`
- Auth token: `import { getAccessToken } from "@/contexts/AuthContext"`
- Auth hook: `import { useAuth } from "@/contexts/AuthContext"` → `const { user } = useAuth()`
- **Real user fields:** firstName, lastName, schoolName, role, grade, gender,
  subjects[], staffId, avatar, onboardingDone, dateOfBirth, province,
  district, disabilityStatus
  - NO name field, NO school field, NO avatarImage field — all fixed
- Toast: `import { toast } from "sonner"`
- Loading/error/empty pattern: animate-pulse skeleton → text-brand-pink error → empty state → data
- **WSL bash:** never use `!` in double-quoted strings — use python3 for all in-place edits

---

## API Reference (all confirmed routes)

### Auth — `/api/auth/...`
register, login, refresh, logout, forgot-password, reset-password

### Users — `/api/users/...`
- GET/PATCH `/me`
- GET `/` [ADMIN, PROGRAMME_ADMIN]

### Courses — `/api/courses/...`
- GET `/` and `/:id`
- GET `/:id/lessons/:lessonId`
- POST `/:id/lessons/:lessonId/complete` [auth]

### Quizzes — `/api/quizzes/...`
- GET `/` and `/:id`
- POST `/:id/attempt` [auth]

### Clubs — `/api/clubs/...`
- GET `/` and `/:id`
- GET `/mine` [auth] — must be before `/:id` in routes (it is)
- POST `/` [TEACHER, SCHOOL_ADMIN, PROGRAMME_ADMIN, ADMIN]
- POST `/:id/join` / DELETE `/:id/leave` [auth]

### Challenges — `/api/challenges/...`
- GET `/` and `/:id`
- POST `/:id/complete` [auth]

### Leaderboard — GET `/api/leaderboard`

### M&E — `/api/mande/...` [ADMIN, PROGRAMME_ADMIN]
- GET `/?from=YYYY-MM-DD&to=YYYY-MM-DD` → full aggregate object
- GET `/export?format=csv|xlsx|pdf&from&to` → file download

### Schools — GET `/api/schools` [auth]
- Optional `?province=` filter → { schools: [{id,name,province,district}] }

### Ambassadors — `/api/ambassadors/...`
- POST `/apply` [auth] — { motivation }; 409 if PENDING/APPROVED
- GET `/me` [auth] — { ambassador: null | {…, reports[]} }
- PATCH `/me` [auth, APPROVED only] — { bio }
- GET `/missions` [auth] — active missions
- POST `/reports` [auth, APPROVED only] — { missionId?, title,
  description, activityDate, location?, participants?, evidenceUrl? }
- Admin [ADMIN, PROGRAMME_ADMIN]:
  - GET `/applications?status=`, PATCH `/applications/:id`
    { action: approve|reject|deactivate }
  - POST `/missions`, PATCH `/missions/:id` (incl. { isActive })
  - GET `/reports?status=`, PATCH `/reports/:id`
    { action: verify|reject } — verify awards points, 409 if reviewed

### Notifications — `/api/notifications/...`
- GET `/` [auth]
- PATCH `/:id/read` [auth]

### Upload — `/api/upload/...`
- POST `/avatar` [auth] → Cloudinary → { url }
- POST `/material` [auth] → Cloudinary → { url }

### Chat — `/api/chat/...`
- POST `/start`, GET `/:sessionId`, POST `/:sessionId/message`
- GET `/` [ADMIN], PATCH `/:sessionId/status` [ADMIN]

### Teacher — `/api/teacher/...` [TEACHER only]
- GET `/overview`
- GET/POST `/lesson-plans`, DELETE `/lesson-plans/:id` → 404 if not owned
- GET/POST `/materials`, DELETE `/materials/:id` → 404 if not owned
- GET/POST `/activities`, DELETE `/activities/:id` → 404 if not owned
- GET/POST `/quizzes` — GET returns only teacher's own quizzes (createdById filter)

### School — `/api/school/...` [SCHOOL_ADMIN only]
- GET `/stats` → { totalLearners, activeTeachers, totalClubs, avgCompletion, school }
- GET `/learners` → { learners: [...] }
- GET `/teachers` → { teachers: [...] }
- GET `/clubs` → { clubs: [...] }

---

## Known Issues / Deferred

### Item 8 — School scoping fragility — RESOLVED (session 6)
School model with FK added; school.controller now scopes by
schoolId (name-match fallback for unlinked accounts). See Gap
Analysis section above.

### Dead code in createClub
`schedule` is destructured from req.body but Club model has no
schedule field — harmless, just unused.

### Completion % is a proxy
`getSchoolLearners` and `getSchoolStats` calculate completion as
`(quizAttempts.length / 5) * 100` — a rough proxy, not actual
lesson completion tracking. Fine for now.

---

## Seeded Data

**Clubs (5, now with real UUIDs):**
Digital Safety Club, Debate & Leadership Society, Health Champions,
Civic Action Club, Career Explorers

**Quizzes (4):** quiz-digital-safety-1, quiz-life-skills-1,
quiz-health-1, quiz-leadership-1

**Courses (8):** digital-safety-basics, decision-making,
healthy-living, leadership-101, my-rights, career-paths,
growing-up, lshe-foundations

**Challenges (3):** 30-Day Digital Safety, Community Clean-Up,
Leadership Sprint

---

## End-to-End Test Plan (next session)

Run both servers first:
```bash
# Terminal 1
cd .../backend && npm run dev

# Terminal 2
cd .../frontend && npm run dev
```

### Flow 1 — Learner
1. Register new account (phone + password)
2. Complete onboarding (gender, grade, school, interests)
3. Go to Learn → open a course → complete a lesson → complete the quiz
4. Check leaderboard — points should appear
5. Go to Clubs → join a club → hard refresh → still joined
6. Go to Challenges → join a challenge → advance through steps → complete
7. Go to Profile → upload avatar → save profile changes → refresh → changes persist
8. Open Support Chat → send a message

### Flow 2 — Teacher (register separate account, set role to TEACHER in DB)
1. Log in → lands on TeacherDashboard
2. Create a lesson plan → appears in list → delete it → gone
3. Upload a material → appears → delete → gone
4. Create an activity → appears → delete → gone
5. Create a quiz → appears in quiz list
6. Verify quiz is ONLY visible to this teacher (not other teachers)

### Flow 3 — School Admin (register, set role to SCHOOL_ADMIN + schoolName in DB)
1. Log in → lands on SchoolDashboard
2. Stats load (may show 0 if no learners at that school yet)
3. Learners tab → shows only learners with matching schoolName
4. Teachers tab → shows only teachers with matching schoolName
5. Clubs tab → shows only clubs scoped to that school

### Flow 4 — Admin (set role to ADMIN in DB)
1. Log in → Admin dashboard
2. Go to Live Chat → see pending support sessions
3. Reply to learner's message from Flow 1 Step 8
4. Verify learner sees reply (poll or refresh)

### DB verification after full run
```bash
# In backend dir
npx prisma studio   # → http://localhost:5555
```
Check: QuizAttempt, ChallengeAttempt, ClubMember, Notification,
ChatSession/ChatMessage, LessonPlan, TeacherMaterial, ClassroomActivity

---

## After E2E Testing

### i18n / Bemba
- `LanguageContext.jsx` + `translations.js` already exist
- Plan: migrate to `react-i18next`, populate Bemba string keys
- Scope: UI labels, nav, button text, course UI chrome
  (course content itself stays in English)

### Prisma v7 Upgrade
- Currently on 6.19.3
- Key breaking change: config migrates to `prisma.config.ts`
  (warned in migrations already: "property `package.json#prisma`
  is deprecated")
- Steps: update package.json, run npx prisma generate, test all
  DB ops, create prisma.config.ts

---

## Useful Commands

```bash
# Backend
cd /mnt/c/Users/HP/Downloads/adolescents-connect-main/backend && npm run dev

# Frontend
cd /mnt/c/Users/HP/Downloads/adolescents-connect-main/frontend && npm run dev

# Prisma Studio
cd .../backend && npx prisma studio

# After schema change
npx prisma migrate dev --name <description>

# Re-seed (safe — clubs are deleted+recreated, challenges checked before insert)
npx prisma db seed

# Postgres (WSL)
sudo service postgresql start
```

---

## Working Style Notes

- Multiple parallel chat threads — always ask for latest memory
  file before assuming context is current.
- python3 for all in-place text edits. Never sed for multi-line.
  Never bash ! in double-quoted strings (WSL history expansion).
- Build things completely. No stubs/TODOs without being asked.
- Production correctness matters: live ZCSIF platform
