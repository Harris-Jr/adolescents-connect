# A-LINKS — Adolescents LINKS Integrated Youth Support Ecosystem
### National Digital Platform for Zambian Adolescents (Grades 5–12)

A production-grade, full-stack web platform connecting adolescents to learning resources, life skills and health education, digital safety guidance, leadership opportunities, and confidential support services — built for ZCSIF.

**Live Demo:** _add your deployed URL here_
**Staff/Teacher Portal:** _add URL_
**GitHub:** https://github.com/Harris-Jr/adolescents-connect

---

## Overview

A-LINKS operationalizes the **LINKS framework** — Locate, Inform, Nurture, Knowledge in Action, Sustain — as a single platform serving adolescent learners, teachers, school administrators, and programme administrators. It provides grade-based learning pathways, gamified clubs and challenges, a teacher resource hub, an adolescent ambassador leadership programme, and national-level monitoring & evaluation reporting.

Built as a real programme platform for **ZCSIF**, with Harris Shikapande as technical coordinator.

> **Note for new maintainers:** This system currently runs on the original developer's personal service accounts (Cloudinary, SMTP/Gmail). Before scaling beyond initial launch, transfer ownership of each service or reprovision against organizational accounts.

---

## Role Structure

| Role | Access |
|------|--------|
| `LEARNER` | Personal dashboard, courses, quizzes, clubs, challenges, ambassador programme, support chat |
| `TEACHER` | Teacher Hub — lesson plans, materials, classroom activities, quizzes (scoped to own content) |
| `SCHOOL_ADMIN` | School dashboard — learners, teachers, and clubs scoped to their school |
| `PROGRAMME_ADMIN` / `ADMIN` | Full platform access — M&E dashboard, ambassador review, support chat oversight, user management |

---

## Features

### For Learners
- Grade-based learning pathways (Foundation 5–7, Intermediate 8–9, Advanced 10–12)
- Courses, lessons, and quizzes with attempt tracking and scoring
- Clubs — browse, join, leave; club announcements
- Challenges & missions with point rewards
- Leaderboard — points from quizzes, challenges, and ambassador activity
- Adolescent Ambassador programme — apply, complete leadership missions, submit community activity reports with photo evidence
- Confidential support chat
- In-app notifications
- Profile management with avatar upload (Cloudinary)
- Onboarding captures grade, gender, school (with province/district), date of birth, and disability status (optional, "prefer not to say" supported)

### For Teachers
- Lesson plans, teaching materials, and classroom activities (full CRUD, scoped to the authenticated teacher)
- Create and manage quizzes — visible only to their own account
- View learners and clubs at their school

### For School Administrators
- School-scoped dashboard: registered learners, active teachers, club count, completion rate
- Learner and teacher rosters filtered by school (via a proper `School` foreign key, not string matching)
- Club oversight for their school

### For Programme Administrators
- Monitoring & Evaluation dashboard — registrations by month, participation rate by province, quiz pass rates, gender/disability/district breakdowns, club and ambassador activity
- Export reports as CSV, Excel, or PDF
- Ambassador programme administration — review applications, author leadership missions, verify activity reports
- Live support chat — respond to learner support requests
- Role-based access control across all privileged routes

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React (Vite) | UI framework, plain JSX (no TypeScript) |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS + shadcn/ui | Styling and component primitives |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Express | REST API server |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Primary datastore |
| JWT (access + refresh tokens) | Authentication |
| Cloudinary | Avatar and teaching-material uploads |
| Nodemailer (SMTP) | Password reset / transactional email |
| ExcelJS, PDFKit | M&E report export (CSV built in-house) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| PostgreSQL | Hosted database — _specify provider once deployed_ |
| _Hosting TBD_ | Backend + frontend hosting — _fill in once deployed_ |
| GitHub | Version control — `main` is production |

---

## Database Schema (summary)

Key models (see `backend/prisma/schema.prisma` for full definitions):

- **User** — role (`LEARNER`/`TEACHER`/`SCHOOL_ADMIN`/`PROGRAMME_ADMIN`/`ADMIN`), grade, gender, dateOfBirth, province, district, disabilityStatus, `schoolId` (FK → School)
- **School** — first-class entity with province/district, referenced by User and Club via FK
- **Course / Lesson / Quiz / Question** — learning content and assessment
- **QuizAttempt** — learner scores per quiz
- **Club / ClubMember / ClubAnnouncement** — club registration and membership
- **Challenge / ChallengeAttempt** — missions and completion tracking
- **Ambassador / LeadershipMission / AmbassadorReport** — the Adolescent Ambassador programme
- **ChatSession / ChatMessage** — confidential support chat
- **Notification** — in-app notifications
- **LessonPlan / TeacherMaterial / ClassroomActivity** — Teacher Hub content, scoped by `createdById`

---

## API Reference

### Auth — `/api/auth/...`
register, login, refresh, logout, forgot-password, reset-password

### Users — `/api/users/...`
`GET/PATCH /me` · `GET /` [ADMIN, PROGRAMME_ADMIN]

### Courses — `/api/courses/...`
`GET /`, `GET /:id`, `GET /:id/lessons/:lessonId`, `POST /:id/lessons/:lessonId/complete` [auth]

### Quizzes — `/api/quizzes/...`
`GET /`, `GET /:id`, `POST /:id/attempt` [auth]

### Clubs — `/api/clubs/...`
`GET /`, `GET /:id`, `GET /mine` [auth], `POST /` [TEACHER, SCHOOL_ADMIN, PROGRAMME_ADMIN, ADMIN], `POST /:id/join`, `DELETE /:id/leave` [auth]

### Challenges — `/api/challenges/...`
`GET /`, `GET /:id`, `POST /:id/complete` [auth]

### Ambassadors — `/api/ambassadors/...`
Applications, leadership missions, activity reports and verification [role-gated]

### Leaderboard — `GET /api/leaderboard`

### Notifications — `/api/notifications/...`
`GET /` [auth], `PATCH /:id/read` [auth]

### Upload — `/api/upload/...`
`POST /avatar`, `POST /material` [auth] → Cloudinary → `{ url }`

### Chat — `/api/chat/...`
`POST /start`, `GET /:sessionId`, `POST /:sessionId/message`, `GET /` [ADMIN], `PATCH /:sessionId/status` [ADMIN]

### Teacher — `/api/teacher/...` [TEACHER only]
`GET /overview`, lesson-plans / materials / activities / quizzes CRUD, all scoped to the authenticated teacher

### School — `/api/school/...` [SCHOOL_ADMIN only]
`GET /stats`, `GET /learners`, `GET /teachers`, `GET /clubs`

### Schools — `/api/schools/...`
School lookup/autocomplete backing onboarding and registration

### M&E — `/api/mande/...` [ADMIN, PROGRAMME_ADMIN]
`GET /overview` — aggregated programme data
`GET /export?format=csv|xlsx|pdf` — donor/programme reporting exports

---

## Environment Variables Checklist

### Backend (`backend/.env`)
- [ ] `DATABASE_URL`
- [ ] `ACCESS_TOKEN_SECRET`
- [ ] `REFRESH_TOKEN_EXPIRY`
- [ ] `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`
- [ ] `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- [ ] `NODE_ENV`
- [ ] `PORT`
- [ ] `FRONTEND_URL` — must match your deployed frontend origin (CORS)

### Frontend (`frontend/.env`)
- [ ] `VITE_API_URL`
- [ ] `VITE_APP_NAME`

See `backend/.env.example` and `frontend/.env.example` for full templates. Never commit real `.env` files — only the `.example` versions are tracked.

---

## Local Development

```bash
# Database
sudo service postgresql start

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev          # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev           # http://localhost:5173

# Prisma Studio (inspect/edit data directly)
cd backend && npx prisma studio   # http://localhost:5555
```

---

## Production Deployment

```bash
# On the server, after pulling the latest main:
cd backend && npx prisma migrate deploy   # NOT `migrate dev` — applies pending migrations only, no prompts, safe for live data
npm ci --omit=dev
pm2 restart alinks-api                     # or your process manager's equivalent

cd ../frontend
npm ci
npm run build
# serve the dist/ output via your hosting platform / reverse proxy
```

**Never run `prisma migrate dev` against the production database.** It's an interactive, schema-drift-resolving command meant for local development and can prompt for destructive resets. Use `migrate deploy` in production.

---

## Known Gaps / Deferred Scope

Tracked against the full SRS/FRD/PRD. As of the current build:

- **Offline learning support** (SRS §13) — not yet implemented; deferred by product decision, not by spec.
- **Accessibility requirements** (SRS §14) — screen reader support, adjustable font sizes, keyboard navigation — not yet implemented; deferred by product decision.
- **WhatsApp notifications** (SRS §18) — explicitly marked optional in the SRS; not implemented.
- **School scoping** — resolved via a proper `School` model with FK (previously string-matched); recent change, worth extra QA.
- **Completion percentage** in school stats is currently a quiz-attempt proxy, not true lesson-completion tracking.
- **i18n / Bemba** — `LanguageContext.jsx` and a translation scaffold exist; not yet migrated to `react-i18next` or populated.
- **Prisma v7 upgrade** — currently on v6.19.3; config migration to `prisma.config.ts` not yet started.

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
└── src/
    ├── app.js
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── utils/

frontend/
└── src/
    ├── components/          # shared UI, including shadcn/ui primitives
    ├── contexts/             # Auth, Clubs, Notifications, Progress, Language
    ├── hooks/
    ├── lib/                  # API client, catalogs, style maps
    └── pages/
        ├── auth/
        ├── clubs/
        ├── dashboard/        # Learner / Teacher / School / Admin
        ├── learn/
        ├── quiz/
        └── support/
```

---

## Author

Technical Coordinator: **Harris Shikapande**
Programme: **ZCSIF**
