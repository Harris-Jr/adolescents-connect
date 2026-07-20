import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reading = (extra) =>
  `<p>Welcome to this lesson. ${extra}</p>` +
  `<p>Take your time to read through the material. The ideas here build on what you already know and prepare you for the activities and quiz that follow.</p>` +
  `<h3>Why this matters</h3>` +
  `<p>Understanding these concepts helps you make confident, informed choices in everyday life. Try to connect each point to a situation you have experienced.</p>` +
  `<ul><li>Read carefully and reflect.</li><li>Note any questions you have.</li><li>Discuss with a friend or your club.</li></ul>` +
  `<p>When you are ready, mark this lesson as complete and continue.</p>`;

const QUIZZES = [
  {
    id: "quiz-digital-safety-1",
    title: "Digital Safety Basics Quiz",
    subject: "digital_safety",
    grade: 7,
    pointsPerQuestion: 10,
    passMark: 60,
    questions: [
      { text: "What makes a strong password?", options: ["Your name", "A mix of letters, numbers and symbols", "123456", "Your birthday"], correct: 1, explanation: "Strong passwords mix letters, numbers and symbols and avoid personal info." },
      { text: "Someone you don't know asks for your home address online. You should:", options: ["Share it", "Ignore and tell a trusted adult", "Send a photo of your house", "Give a fake one and keep chatting"], correct: 1, explanation: "Never share personal details with strangers; tell a trusted adult." },
      { text: "What is phishing?", options: ["A type of game", "A trick to steal your information", "A social network", "A safety app"], correct: 1, explanation: "Phishing tricks people into revealing personal or financial information." },
      { text: "Before clicking a link from an unknown sender you should:", options: ["Click quickly", "Check if it looks suspicious", "Forward to friends", "Reply with your password"], correct: 1, explanation: "Always check links carefully and avoid suspicious ones." },
      { text: "Cyberbullying should be:", options: ["Ignored forever", "Reported to a trusted adult", "Answered with insults", "Kept secret"], correct: 1, explanation: "Report cyberbullying and keep evidence; you don't have to face it alone." },
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
      { text: "A good first step in making a decision is to:", options: ["Guess", "Identify the problem clearly", "Ask no one", "Do nothing"], correct: 1, explanation: "Clearly defining the problem helps you find good options." },
      { text: "Peer pressure is:", options: ["Always good", "Influence from people your age", "A school subject", "A type of food"], correct: 1, explanation: "Peer pressure is influence from peers; it can be positive or negative." },
      { text: "Setting a SMART goal means it is:", options: ["Slow", "Specific and Measurable", "Secret", "Simple only"], correct: 1, explanation: "SMART = Specific, Measurable, Achievable, Relevant, Time-bound." },
      { text: "When you feel angry, a healthy response is to:", options: ["Shout", "Take deep breaths and pause", "Break something", "Blame others"], correct: 1, explanation: "Pausing and breathing helps you respond calmly." },
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
      { text: "How many hours of sleep do teens generally need?", options: ["3-4", "8-10", "1-2", "12-14"], correct: 1, explanation: "Teenagers need roughly 8-10 hours of sleep." },
      { text: "A balanced diet should include:", options: ["Only sweets", "A variety of food groups", "Only one food", "No water"], correct: 1, explanation: "Eat a variety of foods for the nutrients your body needs." },
      { text: "Regular exercise helps:", options: ["Only muscles", "Body and mind", "Nothing", "Only sleep"], correct: 1, explanation: "Exercise benefits both physical and mental health." },
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
      { text: "A good leader listens to:", options: ["No one", "Team members", "Only themselves", "Only adults"], correct: 1, explanation: "Great leaders listen and value others' input." },
      { text: "Integrity means:", options: ["Doing what's right even when no one watches", "Being popular", "Winning always", "Avoiding work"], correct: 0, explanation: "Integrity is acting honestly and ethically at all times." },
      { text: "Delegation is:", options: ["Doing everything yourself", "Sharing tasks with the team", "Ignoring tasks", "Blaming others"], correct: 1, explanation: "Delegation shares responsibility and builds trust." },
    ],
  },
];

const COURSES = [
  {
    id: "digital-safety-basics",
    title: "Digital Safety Basics",
    description: "Learn how to stay safe online: passwords, privacy, scams and dealing with cyberbullying.",
    subject: "digital_safety",
    grade: 7,
    lessons: [
      { title: "Welcome to Digital Safety", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Creating Strong Passwords", type: "reading", duration: "6 min", body: reading("Today we explore what makes a password strong and how to keep your accounts safe.") },
      { title: "Spotting Scams & Phishing", type: "reading", duration: "7 min", body: reading("Scammers use clever tricks. Learn how to recognise and avoid them.") },
      { title: "Privacy Settings Activity", type: "activity", duration: "10 min", body: reading("Practice setting your privacy controls on your favourite apps.") },
      { title: "Digital Safety Basics Quiz", type: "quiz", duration: "5 min", quizId: "quiz-digital-safety-1" },
    ],
  },
  {
    id: "decision-making",
    title: "Smart Decision Making",
    description: "Build life skills to make confident choices, set goals and handle peer pressure.",
    subject: "life_skills",
    grade: 8,
    lessons: [
      { title: "Understanding Choices", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "The Decision Process", type: "reading", duration: "6 min", body: reading("A simple framework helps you make better decisions step by step.") },
      { title: "Handling Peer Pressure", type: "reading", duration: "7 min", body: reading("Learn assertive ways to say no and stay true to your values.") },
      { title: "Decision Making Quiz", type: "quiz", duration: "5 min", quizId: "quiz-life-skills-1" },
    ],
  },
  {
    id: "healthy-living",
    title: "Healthy Living",
    description: "Nutrition, sleep, exercise and emotional wellbeing for a healthy, balanced life.",
    subject: "health_wellbeing",
    grade: 6,
    lessons: [
      { title: "Your Amazing Body", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Eating Well", type: "reading", duration: "6 min", body: reading("Discover how a balanced diet fuels your body and mind.") },
      { title: "Move & Rest", type: "reading", duration: "5 min", body: reading("Exercise and sleep work together to keep you healthy.") },
      { title: "Healthy Living Quiz", type: "quiz", duration: "5 min", quizId: "quiz-health-1" },
    ],
  },
  {
    id: "leadership-101",
    title: "Leadership 101",
    description: "Discover what makes a great leader and start building your own leadership skills.",
    subject: "leadership",
    grade: 9,
    lessons: [
      { title: "What is Leadership?", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Leading with Integrity", type: "reading", duration: "6 min", body: reading("Integrity is the foundation of trusted leadership.") },
      { title: "Teamwork Activity", type: "activity", duration: "12 min", body: reading("Work through a teamwork scenario and reflect on your role.") },
      { title: "Leadership Foundations Quiz", type: "quiz", duration: "5 min", quizId: "quiz-leadership-1" },
    ],
  },
  {
    id: "my-rights",
    title: "Know Your Rights",
    description: "An introduction to civic education: rights, responsibilities and active citizenship.",
    subject: "civic_education",
    grade: 10,
    lessons: [
      { title: "Citizens & Communities", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Rights & Responsibilities", type: "reading", duration: "7 min", body: reading("Every right comes with a responsibility. Explore the balance.") },
      { title: "Getting Involved", type: "activity", duration: "10 min", body: reading("Plan a small community action with your club.") },
    ],
  },
  {
    id: "career-paths",
    title: "Exploring Career Paths",
    description: "Discover your strengths and explore careers that match your interests and goals.",
    subject: "career_guidance",
    grade: 11,
    lessons: [
      { title: "Know Your Strengths", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Careers Around You", type: "reading", duration: "6 min", body: reading("Explore different career families and what they involve.") },
      { title: "Planning Your Path", type: "activity", duration: "10 min", body: reading("Map out steps from school to your dream career.") },
    ],
  },
  {
    id: "growing-up",
    title: "Growing Up Healthy (SRHR)",
    description: "Age-appropriate sexual and reproductive health and rights education.",
    subject: "srhr",
    grade: 8,
    lessons: [
      { title: "Understanding Changes", type: "video", duration: "5 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Respect & Boundaries", type: "reading", duration: "7 min", body: reading("Learn about consent, respect and healthy boundaries.") },
      { title: "Staying Healthy", type: "reading", duration: "6 min", body: reading("Practical information to look after your wellbeing.") },
    ],
  },
  {
    id: "lshe-foundations",
    title: "Life Skills & Health Education",
    description: "Core LSHE content combining life skills with health knowledge for everyday living.",
    subject: "lshe",
    grade: 5,
    lessons: [
      { title: "Introduction to LSHE", type: "video", duration: "4 min", videoUrl: "https://www.youtube.com/embed/aO858HyFbKI" },
      { title: "Caring for Yourself", type: "reading", duration: "5 min", body: reading("Daily habits that keep you healthy and happy.") },
      { title: "Caring for Others", type: "activity", duration: "8 min", body: reading("Kindness in action: small things that make a big difference.") },
    ],
  },
];

const CLUBS = [
  { name: "Digital Safety Club", category: "digital_safety", description: "Learn and teach safe online habits with peers." },
  { name: "Debate & Leadership Society", category: "leadership", description: "Practice public speaking and leadership skills." },
  { name: "Health Champions", category: "health_wellbeing", description: "Promote healthy habits in your school community." },
  { name: "Civic Action Club", category: "civic_education", description: "Get involved in community and civic projects." },
  { name: "Career Explorers", category: "career_guidance", description: "Explore career paths and meet mentors." },
];

const CHALLENGES = [
  { title: "30-Day Digital Safety Challenge", description: "Complete daily digital safety tasks for 30 days.", points: 200, subject: "digital_safety", deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { title: "Community Clean-Up", description: "Organise or join a community clean-up activity.", points: 150, subject: "civic_education", deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { title: "Leadership Sprint", description: "Complete the Leadership 101 course and lead one activity.", points: 180, subject: "leadership", deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
];

// ---------- Support / Referral Services (SRS §11) ----------
// Categories mirror the UI. Colours/icons stay in the frontend, keyed by id.
const SUPPORT_CATEGORIES = [
  { id: "mental-health", title: "Mental Health", sortOrder: 1, description: "Talk to someone about stress, anxiety, depression or anything weighing on your mind." },
  { id: "srh", title: "Sexual & Reproductive Health", sortOrder: 2, description: "Confidential information and services about your body, relationships and health." },
  { id: "gbv", title: "Gender-Based Violence", sortOrder: 3, description: "Safe, confidential support if you or someone you know is experiencing violence." },
  { id: "substance-abuse", title: "Substance Abuse", sortOrder: 4, description: "Help and guidance with alcohol, drugs and other substance-related challenges." },
  { id: "legal-aid", title: "Legal Aid", sortOrder: 5, description: "Know your rights and get connected to free legal advice and support." },
  { id: "child-protection", title: "Child Protection", sortOrder: 6, description: "Report abuse or get help to keep yourself and other children safe." },
];

// IMPORTANT: These are real Zambian organisations. The national toll-free
// short codes (116 Childline, 933 GBV, 991 emergency) are widely published
// and stable. Organisation landline numbers and physical addresses are
// provisional and MUST be verified and signed off by ZCSIF before go-live —
// an incorrect crisis-line number can send an adolescent to the wrong place.
const REFERRAL_SERVICES = [
  { categoryId: "child-protection", name: "Childline Zambia", province: "Lusaka", district: "Lusaka", location: "Nationwide (toll-free)", phone: "116", hours: "24 hours, every day", is24Hours: true, description: "Free, confidential helpline for any child in need of help, advice or protection." },
  { categoryId: "gbv", name: "GBV National Helpline", province: "Lusaka", district: "Lusaka", location: "Nationwide (toll-free)", phone: "933", hours: "24 hours, every day", is24Hours: true, description: "Toll-free national line for survivors of gender-based violence." },
  { categoryId: "gbv", name: "Zambia Police Victim Support Unit", province: "Lusaka", district: "Lusaka", location: "Police stations nationwide", phone: "991", hours: "24 hours, every day", is24Hours: true, description: "Report abuse and get protection through the Victim Support Unit at any police station." },
  { categoryId: "gbv", name: "YWCA Zambia Crisis Centre", province: "Lusaka", district: "Lusaka", location: "Nationalist Road, Lusaka", phone: "+260 211 254 991", hours: "Mon–Fri, 08:00 – 17:00", is24Hours: false, description: "Counselling, shelter and support for survivors of violence." },
  { categoryId: "srh", name: "Planned Parenthood Association of Zambia (PPAZ)", province: "Lusaka", district: "Lusaka", location: "Chilimbulu Road, Lusaka", phone: "+260 211 228 178", hours: "Mon–Fri, 08:00 – 17:00", is24Hours: false, description: "Confidential sexual and reproductive health information and services for young people." },
  { categoryId: "srh", name: "Society for Family Health", province: "Copperbelt", district: "Ndola", location: "Broadway, Ndola", phone: "+260 212 620 088", hours: "Mon–Sat, 08:00 – 16:00", is24Hours: false, description: "Youth-friendly reproductive health services and referrals." },
  { categoryId: "mental-health", name: "Chainama Hills Hospital", province: "Lusaka", district: "Lusaka", location: "Great East Road, Lusaka", phone: "+260 211 291 439", hours: "Mon–Fri, 08:00 – 16:00", is24Hours: false, description: "National referral hospital for mental health assessment and care." },
  { categoryId: "mental-health", name: "Mental Health Users Network of Zambia (MHUNZA)", province: "Lusaka", district: "Lusaka", location: "Lusaka", phone: "+260 211 234 567", hours: "Mon–Fri, 09:00 – 16:00", is24Hours: false, description: "Peer support and advocacy for people living with mental health conditions." },
  { categoryId: "mental-health", name: "Chipata Central Hospital Mental Health Unit", province: "Eastern", district: "Chipata", location: "Chipata Central Hospital", phone: "+260 216 221 122", hours: "Mon–Fri, 08:00 – 16:00", is24Hours: false, description: "Mental health assessment and counselling in Eastern Province." },
  { categoryId: "substance-abuse", name: "Serenity Harm Reduction Programme Zambia", province: "Lusaka", district: "Lusaka", location: "Lusaka", phone: "+260 977 000 000", hours: "Mon–Fri, 09:00 – 18:00", is24Hours: false, description: "Support and rehabilitation for alcohol and drug-related challenges." },
  { categoryId: "legal-aid", name: "Legal Aid Board", province: "Lusaka", district: "Lusaka", location: "Fairley Road, Lusaka", phone: "+260 211 253 789", hours: "Mon–Fri, 08:00 – 17:00", is24Hours: false, description: "Free legal advice and representation for those who cannot afford it." },
  { categoryId: "legal-aid", name: "National Legal Aid Clinic for Women", province: "Lusaka", district: "Lusaka", location: "Church Road, Lusaka", phone: "+260 211 221 332", hours: "Mon–Fri, 08:00 – 16:30", is24Hours: false, description: "Free legal help for women and children, including GBV and family matters." },
  { categoryId: "legal-aid", name: "Legal Resources Foundation", province: "Southern", district: "Livingstone", location: "Mosi-oa-Tunya Road, Livingstone", phone: "+260 213 320 456", hours: "Mon–Fri, 08:30 – 16:30", is24Hours: false, description: "Free legal advice and rights education in Southern Province." },
];

async function main() {
  console.log("Seeding quizzes...");
  for (const q of QUIZZES) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        title: q.title,
        subject: q.subject,
        grade: q.grade,
        pointsPerQuestion: q.pointsPerQuestion,
        passMark: q.passMark,
        questions: {
          create: q.questions.map((question, index) => ({
            order: index,
            text: question.text,
            options: question.options,
            correct: question.correct,
            explanation: question.explanation,
          })),
        },
      },
    });
  }

  console.log("Seeding courses...");
  for (const c of COURSES) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        title: c.title,
        description: c.description,
        subject: c.subject,
        grade: c.grade,
        lessons: {
          create: c.lessons.map((lesson, index) => ({
            order: index,
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration ?? null,
            videoUrl: lesson.videoUrl ?? null,
            body: lesson.body ?? null,
            quizId: lesson.quizId ?? null,
          })),
        },
      },
    });
  }

  console.log("Seeding clubs...");
  // Clear memberships first (FK), then clubs, then recreate with real UUIDs
  await prisma.clubMember.deleteMany({});
  await prisma.club.deleteMany({});
  for (const club of CLUBS) {
    await prisma.club.create({
      data: {
        name: club.name,
        category: club.category,
        description: club.description ?? null,
      },
    });
  }

  console.log("Seeding challenges...");
  for (const challenge of CHALLENGES) {
    const existing = await prisma.challenge.findFirst({ where: { title: challenge.title } });
    if (!existing) {
      await prisma.challenge.create({ data: challenge });
    }
  }

  console.log("Seeding support categories...");
  for (const cat of SUPPORT_CATEGORIES) {
    await prisma.supportCategory.upsert({
      where: { id: cat.id },
      update: { title: cat.title, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  console.log("Seeding referral services...");
  // Clear + recreate so edits to the list are reflected on re-seed.
  await prisma.referralService.deleteMany({});
  for (const svc of REFERRAL_SERVICES) {
    await prisma.referralService.create({ data: svc });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
