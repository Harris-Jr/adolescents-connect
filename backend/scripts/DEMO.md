# A-LINKS Demo Runbook

Everything shown in the demo is a **real DB read** — no fabricated analytics.
The seed provisions only the login accounts that can't be created from the UI;
all charts, leaderboards and tables fill from activity you perform live.

## Accounts at a glance

| Where it comes from | Role | Count | How |
|---|---|---|---|
| **Seeded** (this script) | SCHOOL_ADMIN | 1 | `seed-demo.js` |
| **Seeded** | PROGRAMME_ADMIN | 1 | `seed-demo.js` |
| **Seeded** | ADMIN | 1 | `seed-demo.js` |
| **UI signup** | TEACHER | 1 | Register, choose "teacher" |
| **UI signup** | LEARNER | 3–4 | Register |

The 3 elevated roles are seeded because registration only ever produces
LEARNER/TEACHER. **ADMIN is the platform super-admin**: only ADMIN can invite/
create users of any role and change an existing user's role (Users panel →
*Invite User* / per-row *Role*). **PROGRAMME_ADMIN** keeps everything else —
M&E, referral CRUD, content approval, ambassador review, live chat — but does
**not** see user-invite or role-change. Keep both accounts to demo that split.

## 1. Provision (run from `backend/`)

```bash
npx prisma db seed                                   # content: courses, quizzes, clubs, challenges, support services
DEMO_PASSWORD='ChangeMe123!' npm run seed:demo       # the 3 elevated accounts + demo school
```

Seeded logins (password = your `DEMO_PASSWORD`):

| Role | Phone |
|---|---|
| SCHOOL_ADMIN | `0966000001` |
| PROGRAMME_ADMIN | `0966000002` |
| ADMIN | `0966000003` |

Demo school: **A-LINKS Demo Secondary School** (Lusaka / Lusaka). Re-run the
script anytime to reset these accounts (also resets the password).

## 2. Register from the UI (under the exact demo-school name)

Register all of these with school = **A-LINKS Demo Secondary School** so School
Admin scoping links them together:

- **1 teacher** — pick the teacher option at signup.
- **3–4 learners** — vary province / gender / grade across 2–3 provinces so the
  M&E province, gender and district breakdowns aren't a single bar.

## 3. Generate the real activity that lights up each screen

- **Each learner:** open a course → complete a lesson → take its quiz; join a
  club; optionally complete a challenge.
  → drives Leaderboard, M&E (quiz performance, participation-by-province,
  registrations, club joins) and the School Admin completion %.
- **Teacher:** create a lesson plan, upload a material, create a quiz, and
  **create a club** (seeded clubs have no school, so the School Admin *Clubs*
  panel stays empty until a club is created with a school).
- **Ambassador (one learner):** apply → sign in as an admin and **approve** →
  learner **submits a report** → admin **verifies** it.
  → shows the learner on the Leaderboard and fills the M&E ambassador tiles.
  Also, as admin, **create an active Leadership Mission** so the missions list
  isn't empty.
- **"I Need Help" (one learner):** submit the form → admin gets the bell
  notification + the *Live Chat* pending badge → admin replies as counsellor →
  learner sees the reply in the same session.
- **User management (optional, ADMIN only):** sign in as ADMIN → Users →
  *Invite User* to create an account of any role (set an initial password and
  share it directly), or per-row *Role* to change someone's role. Sign in as
  PROGRAMME_ADMIN to confirm those controls are absent — demonstrates the
  super-admin split.

## 4. Verify before the demo

- Log in as each seeded account → each lands on its dashboard.
- School Admin lists the demo teacher + learners (and clubs once one is created).
- Leaderboard shows learners with points; M&E charts are non-empty.
- Ambassador Hub completes apply → approve → report → verify.
- Live chat shows the help-request notification and the counsellor reply.
