// Admin dashboard reference data
// Personal/user data has been removed (see STEP 4 of restructuring)
// Analytics data is empty pending real data from backend

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

export const SCHOOL_NAME = "Lusaka Central Secondary School";

// TODO: Fetch real learner records from /api/admin/learners once users exist
export const ADMIN_LEARNERS = [];

// TODO: Fetch real teacher records from /api/admin/teachers once users exist
export const ADMIN_TEACHERS = [];

// TODO: Fetch real school records from /api/admin/schools once users exist
export const ADMIN_SCHOOLS = [];

// TODO: Fetch real user records from /api/admin/users once users exist
export const ADMIN_USERS = [];

// TODO: Fetch pending content from /api/admin/content/pending once teachers upload content
export const PENDING_CONTENT = [];

// TODO: Fetch notification history from /api/admin/notifications once notifications are sent
export const SENT_NOTIFICATIONS = [];

// ----- Chart data -----

// TODO: Replace with real data from /api/admin/analytics/registrations
export const MONTHLY_REGISTRATIONS = [];

// TODO: Replace with real data from /api/admin/analytics/activity-by-province
export const ACTIVITY_BY_PROVINCE = [];

// TODO: Replace with real data from /api/admin/analytics/users-by-role
export const USERS_BY_ROLE = [];

// TODO: Replace with real data from /api/admin/analytics/registration-targets
export const REGISTRATION_TARGETS = [];

// TODO: Replace with real data from /api/admin/analytics/participation-by-province
export const PARTICIPATION_BY_PROVINCE = [];

// TODO: Replace with real data from /api/admin/analytics/completion-rates
export const COMPLETION_RATES = [];

// TODO: Replace with real data from /api/admin/analytics/gender-breakdown
export const GENDER_BREAKDOWN = [];

// TODO: Replace with real data from /api/admin/analytics/club-activity-rates
export const CLUB_ACTIVITY_RATES = [];

// TODO: Replace with real data from /api/admin/analytics/kpis
export const NATIONAL_KPIS = {
  totalUsers: 0,
  schools: 0,
  provinces: 0,
  activeClubs: 0,
  teachersTrained: 0,
};
