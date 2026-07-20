// Learning catalog: courses, lessons, quizzes, and subjects
// This is the content library representing what the platform offers.
// No personal/user data here.

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

const reading = (extra) =>
  `<p>Welcome to this lesson. ${extra}</p>` +
  `<p>Take your time to read through the material. The ideas here build on what you already know and prepare you for the activities and quiz that follow.</p>` +
  `<h3>Why this matters</h3>` +
  `<p>Understanding these concepts helps you make confident, informed choices in everyday life. Try to connect each point to a situation you have experienced.</p>` +
  `<ul><li>Read carefully and reflect.</li><li>Note any questions you have.</li><li>Discuss with a friend or your club.</li></ul>` +
  `<p>When you are ready, mark this lesson as complete and continue.</p>`;

export const QUIZZES = [
  {
    id: "quiz-digital-safety-1",
    title: "Digital Safety Basics Quiz",
    subject: "digital_safety",
    grade: 7,
    pointsPerQuestion: 10,
    passMark: 60,
    questions: [
      { id: "q1", text: "What makes a strong password?", options: ["Your name", "A mix of letters, numbers and symbols", "123456", "Your birthday"], correct: 1, explanation: "Strong passwords mix letters, numbers and symbols and avoid personal info." },
      { id: "q2", text: "Someone you don't know asks for your home address online. You should:", options: ["Share it", "Ignore and tell a trusted adult", "Send a photo of your house", "Give a fake one and keep chatting"], correct: 1, explanation: "Never share personal details with strangers; tell a trusted adult." },
      { id: "q3", text: "What is phishing?", options: ["A type of game", "A trick to steal your information", "A social network", "A safety app"], correct: 1, explanation: "Phishing tricks people into revealing personal or financial information." },
      { id: "q4", text: "Before clicking a link from an unknown sender you should:", options: ["Click quickly", "Check if it looks suspicious", "Forward to friends", "Reply with your password"], correct: 1, explanation: "Always check links carefully and avoid suspicious ones." },
      { id: "q5", text: "Cyberbullying should be:", options: ["Ignored forever", "Reported to a trusted adult", "Answered with insults", "Kept secret"], correct: 1, explanation: "Report cyberbullying and keep evidence; you don't have to face it alone." },
    ],
  },
  {
    id: "quiz-life-skills-1",
    title: "Decision Making Quiz",
    subject: "life_skills",
    grade: 8,
    pointsPerQuestion: 10,
    passMark: 60,
    questions: [
      { id: "q1", text: "A good first step in making a decision is to:", options: ["Guess", "Identify the problem clearly", "Ask no one", "Do nothing"], correct: 1, explanation: "Clearly defining the problem helps you find good options." },
      { id: "q2", text: "Peer pressure is:", options: ["Always good", "Influence from people your age", "A school subject", "A type of food"], correct: 1, explanation: "Peer pressure is influence from peers; it can be positive or negative." },
      { id: "q3", text: "Setting a SMART goal means it is:", options: ["Slow", "Specific and Measurable", "Secret", "Simple only"], correct: 1, explanation: "SMART = Specific, Measurable, Achievable, Relevant, Time-bound." },
      { id: "q4", text: "When you feel angry, a healthy response is to:", options: ["Shout", "Take deep breaths and pause", "Break something", "Blame others"], correct: 1, explanation: "Pausing and breathing helps you respond calmly." },
    ],
  },
  {
    id: "quiz-health-1",
    title: "Healthy Living Quiz",
    subject: "health_wellbeing",
    grade: 6,
    pointsPerQuestion: 10,
    passMark: 60,
    questions: [
      { id: "q1", text: "How many hours of sleep do teens generally need?", options: ["3-4", "8-10", "1-2", "12-14"], correct: 1, explanation: "Teenagers need roughly 8-10 hours of sleep." },
      { id: "q2", text: "A balanced diet should include:", options: ["Only sweets", "A variety of food groups", "Only one food", "No water"], correct: 1, explanation: "Eat a variety of foods for the nutrients your body needs." },
      { id: "q3", text: "Regular exercise helps:", options: ["Only muscles", "Body and mind", "Nothing", "Only sleep"], correct: 1, explanation: "Exercise benefits both physical and mental health." },
    ],
  },
  {
    id: "quiz-leadership-1",
    title: "Leadership Foundations Quiz",
    subject: "leadership",
    grade: 9,
    pointsPerQuestion: 10,
    passMark: 60,
    questions: [
      { id: "q1", text: "A good leader listens to:", options: ["No one", "Team members", "Only themselves", "Only adults"], correct: 1, explanation: "Great leaders listen and value others' input." },
      { id: "q2", text: "Integrity means:", options: ["Doing what's right even when no one watches", "Being popular", "Winning always", "Avoiding work"], correct: 0, explanation: "Integrity is acting honestly and ethically at all times." },
      { id: "q3", text: "Delegation is:", options: ["Doing everything yourself", "Sharing tasks with the team", "Ignoring tasks", "Blaming others"], correct: 1, explanation: "Delegation shares responsibility and builds trust." },
    ],
  },
];

export function getQuiz(id) {
  const resolvedId = id === "quiz-1" ? "quiz-digital-safety-1" : id;
  return QUIZZES.find((q) => q.id === resolvedId);
}

export const COURSES = [
  {
    id: "digital-safety-basics",
    title: "Digital Safety Basics",
    description: "Learn how to stay safe online: passwords, privacy, scams and dealing with cyberbullying.",
    subject: "digital_safety",
    grade: 7,
    lessons: [
      { id: "l1", title: "Welcome to Digital Safety", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Creating Strong Passwords", type: "reading", duration: "6 min", body: reading("Today we explore what makes a password strong and how to keep your accounts safe.") },
      { id: "l3", title: "Spotting Scams & Phishing", type: "reading", duration: "7 min", body: reading("Scammers use clever tricks. Learn how to recognise and avoid them.") },
      { id: "l4", title: "Privacy Settings Activity", type: "activity", duration: "10 min", body: reading("Practice setting your privacy controls on your favourite apps.") },
      { id: "l5", title: "Digital Safety Basics Quiz", type: "quiz", duration: "5 min", quizId: "quiz-digital-safety-1" },
    ],
  },
  {
    id: "decision-making",
    title: "Smart Decision Making",
    description: "Build life skills to make confident choices, set goals and handle peer pressure.",
    subject: "life_skills",
    grade: 8,
    lessons: [
      { id: "l1", title: "Understanding Choices", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "The Decision Process", type: "reading", duration: "6 min", body: reading("A simple framework helps you make better decisions step by step.") },
      { id: "l3", title: "Handling Peer Pressure", type: "reading", duration: "7 min", body: reading("Learn assertive ways to say no and stay true to your values.") },
      { id: "l4", title: "Decision Making Quiz", type: "quiz", duration: "5 min", quizId: "quiz-life-skills-1" },
    ],
  },
  {
    id: "healthy-living",
    title: "Healthy Living",
    description: "Nutrition, sleep, exercise and emotional wellbeing for a healthy, balanced life.",
    subject: "health_wellbeing",
    grade: 6,
    lessons: [
      { id: "l1", title: "Your Amazing Body", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Eating Well", type: "reading", duration: "6 min", body: reading("Discover how a balanced diet fuels your body and mind.") },
      { id: "l3", title: "Move & Rest", type: "reading", duration: "5 min", body: reading("Exercise and sleep work together to keep you healthy.") },
      { id: "l4", title: "Healthy Living Quiz", type: "quiz", duration: "5 min", quizId: "quiz-health-1" },
    ],
  },
  {
    id: "leadership-101",
    title: "Leadership 101",
    description: "Discover what makes a great leader and start building your own leadership skills.",
    subject: "leadership",
    grade: 9,
    lessons: [
      { id: "l1", title: "What is Leadership?", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Leading with Integrity", type: "reading", duration: "6 min", body: reading("Integrity is the foundation of trusted leadership.") },
      { id: "l3", title: "Teamwork Activity", type: "activity", duration: "12 min", body: reading("Work through a teamwork scenario and reflect on your role.") },
      { id: "l4", title: "Leadership Foundations Quiz", type: "quiz", duration: "5 min", quizId: "quiz-leadership-1" },
    ],
  },
  {
    id: "my-rights",
    title: "Know Your Rights",
    description: "An introduction to civic education: rights, responsibilities and active citizenship.",
    subject: "civic_education",
    grade: 10,
    lessons: [
      { id: "l1", title: "Citizens & Communities", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Rights & Responsibilities", type: "reading", duration: "7 min", body: reading("Every right comes with a responsibility. Explore the balance.") },
      { id: "l3", title: "Getting Involved", type: "activity", duration: "10 min", body: reading("Plan a small community action with your club.") },
    ],
  },
  {
    id: "career-paths",
    title: "Exploring Career Paths",
    description: "Discover your strengths and explore careers that match your interests and goals.",
    subject: "career_guidance",
    grade: 11,
    lessons: [
      { id: "l1", title: "Know Your Strengths", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Careers Around You", type: "reading", duration: "6 min", body: reading("Explore different career families and what they involve.") },
      { id: "l3", title: "Planning Your Path", type: "activity", duration: "10 min", body: reading("Map out steps from school to your dream career.") },
    ],
  },
  {
    id: "growing-up",
    title: "Growing Up Healthy (SRHR)",
    description: "Age-appropriate sexual and reproductive health and rights education.",
    subject: "srhr",
    grade: 8,
    lessons: [
      { id: "l1", title: "Understanding Changes", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Respect & Boundaries", type: "reading", duration: "7 min", body: reading("Learn about consent, respect and healthy boundaries.") },
      { id: "l3", title: "Staying Healthy", type: "reading", duration: "6 min", body: reading("Practical information to look after your wellbeing.") },
    ],
  },
  {
    id: "lshe-foundations",
    title: "Life Skills & Health Education",
    description: "Core LSHE content combining life skills with health knowledge for everyday living.",
    subject: "lshe",
    grade: 5,
    lessons: [
      { id: "l1", title: "Introduction to LSHE", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { id: "l2", title: "Caring for Yourself", type: "reading", duration: "5 min", body: reading("Daily habits that keep you healthy and happy.") },
      { id: "l3", title: "Caring for Others", type: "activity", duration: "8 min", body: reading("Kindness in action: small things that make a big difference.") },
    ],
  },
];

export function getCourse(id) {
  return COURSES.find((c) => c.id === id);
}

export function courseLessonCount(course) {
  return course.lessons.length;
}
