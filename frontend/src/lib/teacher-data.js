// Teacher Hub data
// Personal/user data has been removed (see STEP 5 of restructuring)

// TODO: Fetch real learner records from /api/teacher/learners once the teacher has students
// This should be empty until a teacher actually has real students
export const LEARNERS = [];

// TODO: Fetch real teaching materials from /api/teacher/materials once teachers upload content
export const MATERIALS = [];

// TODO: Fetch real lesson plans from /api/teacher/lesson-plans once teachers create them
export const LESSON_PLANS = [];

// TODO: Fetch real club data from /api/teacher/clubs once the teacher creates/joins clubs
export const CLUBS = [];

export const ACTIVITIES = [];

export const TRAINING_RESOURCES = [
  { id: "t1", title: "Facilitator's Guide to LSHE", topic: "LSHE", format: "PDF" },
  { id: "t2", title: "Classroom Management Toolkit", topic: "Pedagogy", format: "PDF" },
  { id: "t3", title: "Safeguarding Essentials", topic: "Safeguarding", format: "Video" },
  { id: "t4", title: "Using the A-LINKS Platform", topic: "Platform", format: "PDF" },
  { id: "t5", title: "Inclusive Education Practices", topic: "Pedagogy", format: "PDF" },
];

export const SUBJECT_OPTIONS = [
  "Life Skills",
  "Health & Wellbeing",
  "Digital Safety",
  "Leadership",
  "Civic Education",
  "Career Guidance",
  "SRHR",
  "LSHE",
];

export const GRADE_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12];
