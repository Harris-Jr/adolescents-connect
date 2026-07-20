// Admin dashboard static reference data.
// User, school and analytics data are now fetched live from /api/admin/*
// (see AdminDashboard OverviewSection / UsersSection / SchoolsSection).
// What remains here is genuinely static UI config, plus two placeholder
// queues for features that do not yet have a backend (see below).

export const PROVINCES = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];

// NOT YET REAL — Content Approval has no backend model/endpoint. The
// approve/reject actions in ContentApprovalSection are local-only.
// TODO: build a content-moderation workflow (TeacherMaterial.status already
// exists) and fetch the pending queue from the API.
export const PENDING_CONTENT = [];

// NOT YET REAL — the notification composer does not send anything. Recipient
// counts shown after "send" are fabricated in the component.
// TODO: build a broadcast endpoint (targeting by role/province/school across
// in-app + SMS + email) and fetch real send history.
export const SENT_NOTIFICATIONS = [];
