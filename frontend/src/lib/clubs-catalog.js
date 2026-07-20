// Clubs catalog: club categories, locations, challenge templates, and infrastructure
// This is the content/template library representing what the platform offers.
// No real personal data (named members, specific learner/teacher records) here.

export const CLUB_CATEGORIES = [
  { id: "Debate", surface: "bg-surface-lavender", text: "text-brand-purple", banner: "bg-brand-purple" },
  { id: "Environmental", surface: "bg-surface-mint", text: "text-brand-teal", banner: "bg-brand-teal" },
  { id: "Health Champions", surface: "bg-surface-peach", text: "text-brand-pink", banner: "bg-brand-pink" },
  { id: "Digital Leaders", surface: "bg-surface-blue", text: "text-brand-blue", banner: "bg-brand-blue" },
  { id: "Arts & Culture", surface: "bg-surface-lilac", text: "text-brand-purple", banner: "bg-brand-purple" },
  { id: "Sports", surface: "bg-surface-yellow", text: "text-brand-navy", banner: "bg-brand-yellow" },
  { id: "Community Action", surface: "bg-surface-mint", text: "text-brand-teal", banner: "bg-brand-teal" },
];

export function getCategoryStyle(cat) {
  return CLUB_CATEGORIES.find((c) => c.id === cat) ?? CLUB_CATEGORIES[0];
}

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

export const DISTRICTS = {
  Lusaka: ["Lusaka", "Chongwe", "Kafue", "Chilanga"],
  Copperbelt: ["Ndola", "Kitwe", "Chingola", "Luanshya"],
  Southern: ["Livingstone", "Choma", "Mazabuka", "Monze"],
  Eastern: ["Chipata", "Petauke", "Katete"],
  Central: ["Kabwe", "Kapiri Mposhi", "Mkushi"],
};

// Club templates: each is a skeleton for a real club
// Members array starts empty until real users join
export const CLUBS = [
  {
    id: "club-debate-1",
    name: "Voices of Tomorrow",
    school: "Lusaka Secondary School",
    province: "Lusaka",
    district: "Lusaka",
    category: "Debate",
    members: 0,
    description: "A vibrant debate club where students sharpen critical thinking, public speaking and argumentation skills through weekly motions and inter-school competitions.",
    schedule: "Wednesdays, 15:00 – 16:30",
    memberList: [],
  },
  {
    id: "club-env-1",
    name: "Green Guardians",
    school: "Kitwe Boys High School",
    province: "Copperbelt",
    district: "Kitwe",
    category: "Environmental",
    members: 0,
    description: "Protecting our planet one action at a time. We organise tree-planting drives, clean-up campaigns and awareness workshops on climate change.",
    schedule: "Fridays, 14:00 – 15:30",
    memberList: [],
  },
  {
    id: "club-health-1",
    name: "Health Champions Crew",
    school: "Ndola Girls Secondary",
    province: "Copperbelt",
    district: "Ndola",
    category: "Health Champions",
    members: 0,
    description: "Peer educators promoting healthy living, mental wellbeing and informed choices among fellow adolescents.",
    schedule: "Tuesdays, 15:30 – 16:30",
    memberList: [],
  },
  {
    id: "club-digital-1",
    name: "Digital Leaders Hub",
    school: "Livingstone Secondary School",
    province: "Southern",
    district: "Livingstone",
    category: "Digital Leaders",
    members: 0,
    description: "Building digital literacy, online safety and coding skills for the leaders of the digital age.",
    schedule: "Mondays, 15:00 – 16:30",
    memberList: [],
  },
  {
    id: "club-arts-1",
    name: "Creative Sparks",
    school: "Chipata Day Secondary",
    province: "Eastern",
    district: "Chipata",
    category: "Arts & Culture",
    members: 0,
    description: "Celebrating creativity through music, dance, drama and visual arts while preserving our rich cultural heritage.",
    schedule: "Thursdays, 14:30 – 16:00",
    memberList: [],
  },
  {
    id: "club-sports-1",
    name: "Champions United",
    school: "Kabwe Secondary School",
    province: "Central",
    district: "Kabwe",
    category: "Sports",
    members: 0,
    description: "Promoting teamwork, fitness and fair play through football, netball, athletics and more.",
    schedule: "Daily, 16:00 – 17:30",
    memberList: [],
  },
  {
    id: "club-community-1",
    name: "Changemakers Collective",
    school: "Mazabuka High School",
    province: "Southern",
    district: "Mazabuka",
    category: "Community Action",
    members: 0,
    description: "Driving positive change through volunteering, community service projects and youth-led advocacy.",
    schedule: "Saturdays, 09:00 – 11:00",
    memberList: [],
  },
];

export function getClub(id) {
  return CLUBS.find((c) => c.id === id);
}

// ---------- Challenge Templates ----------

// Challenge templates represent challenges available on the platform.
// Removed: participants count (implies real people, which is fake data).
export const CHALLENGES = [
  {
    id: "ch1",
    name: "30-Day Kindness Challenge",
    description: "Perform one act of kindness every day and log it. Build empathy and brighten someone's day.",
    subject: "Life Skills",
    points: 300,
    deadline: "Jun 30, 2026",
    steps: 30,
  },
  {
    id: "ch2",
    name: "Digital Detox Week",
    description: "Reduce screen time and reflect on your relationship with technology for one week.",
    subject: "Digital Safety",
    points: 150,
    deadline: "Jun 22, 2026",
    steps: 7,
  },
  {
    id: "ch3",
    name: "Eco Warrior Sprint",
    description: "Complete 5 environmental actions: recycle, plant, save water, reduce waste and educate a friend.",
    subject: "Environmental",
    points: 200,
    deadline: "Jul 5, 2026",
    steps: 5,
  },
  {
    id: "ch4",
    name: "Leadership Quiz Marathon",
    description: "Score 80%+ on all leadership quizzes to earn your Leadership Champion badge.",
    subject: "Leadership",
    points: 250,
    deadline: "Jun 28, 2026",
    steps: 4,
  },
  {
    id: "ch5",
    name: "Healthy Habits Tracker",
    description: "Track sleep, water, exercise and nutrition for 14 days straight.",
    subject: "Health & Wellbeing",
    points: 180,
    deadline: "Jul 1, 2026",
    steps: 14,
  },
];

export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id);
}

export const AMBASSADOR_REQUIREMENTS = [
  "Be an active A-LINKS member for at least 30 days",
  "Have completed at least one club challenge",
  "Maintain good standing in the community",
  "Show genuine interest in mentoring and supporting peers",
  "Be enrolled in school or actively involved in youth programs",
];
