// Subject presentation metadata (colours/labels) for the Learning Hub.
//
// Course, lesson and quiz CONTENT is NOT defined here — it lives in the
// database and is served by /api/courses and /api/quizzes. The old static
// COURSES/QUIZZES catalogs were removed to keep a single source of truth
// (they had to be hand-synced with prisma/seed.js and would silently drift).

export const SUBJECTS = [
  { id: "life_skills", label: "Life Skills", surface: "bg-surface-lavender", banner: "bg-brand-purple", text: "text-brand-purple", dot: "bg-brand-purple" },
  { id: "health_wellbeing", label: "Health & Wellbeing", surface: "bg-surface-peach", banner: "bg-brand-pink", text: "text-brand-pink", dot: "bg-brand-pink" },
  { id: "digital_safety", label: "Digital Safety", surface: "bg-surface-blue", banner: "bg-brand-blue", text: "text-brand-blue", dot: "bg-brand-blue" },
  { id: "leadership", label: "Leadership", surface: "bg-surface-mint", banner: "bg-brand-teal", text: "text-brand-teal", dot: "bg-brand-teal" },
  { id: "civic_education", label: "Civic Education", surface: "bg-surface-yellow", banner: "bg-brand-yellow", text: "text-brand-yellow", dot: "bg-brand-yellow" },
  { id: "career_guidance", label: "Career Guidance", surface: "bg-surface-lilac", banner: "bg-brand-navy", text: "text-brand-navy", dot: "bg-brand-navy" },
  { id: "srhr", label: "SRHR", surface: "bg-surface-peach", banner: "bg-brand-red", text: "text-brand-red", dot: "bg-brand-red" },
  { id: "lshe", label: "LSHE", surface: "bg-surface-mint", banner: "bg-brand-teal", text: "text-brand-teal", dot: "bg-brand-teal" },
];

export function getSubject(id) {
  return SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0];
}
