// Mock data for the Support Services section.

export const SUPPORT_CATEGORIES = [
  {
    id: "mental-health",
    title: "Mental Health",
    description: "Talk to someone about stress, anxiety, depression or anything weighing on your mind.",
    surface: "bg-surface-lavender",
    text: "text-brand-purple",
    banner: "bg-brand-purple",
  },
  {
    id: "srh",
    title: "Sexual & Reproductive Health",
    description: "Confidential information and services about your body, relationships and health.",
    surface: "bg-surface-peach",
    text: "text-brand-pink",
    banner: "bg-brand-pink",
  },
  {
    id: "gbv",
    title: "Gender-Based Violence",
    description: "Safe, confidential support if you or someone you know is experiencing violence.",
    surface: "bg-surface-blue",
    text: "text-brand-blue",
    banner: "bg-brand-blue",
  },
  {
    id: "substance-abuse",
    title: "Substance Abuse",
    description: "Help and guidance with alcohol, drugs and other substance-related challenges.",
    surface: "bg-surface-mint",
    text: "text-brand-teal",
    banner: "bg-brand-teal",
  },
  {
    id: "legal-aid",
    title: "Legal Aid",
    description: "Know your rights and get connected to free legal advice and support.",
    surface: "bg-surface-yellow",
    text: "text-brand-navy",
    banner: "bg-brand-yellow",
  },
  {
    id: "child-protection",
    title: "Child Protection",
    description: "Report abuse or get help to keep yourself and other children safe.",
    surface: "bg-surface-lilac",
    text: "text-brand-purple",
    banner: "bg-brand-purple",
  },
];

export function getSupportCategory(id) {
  return SUPPORT_CATEGORIES.find((c) => c.id === id);
}

export const SUPPORT_SERVICES = [
  {
    id: "s1",
    name: "Lusaka Youth Wellness Centre",
    category: "Mental Health",
    province: "Lusaka",
    district: "Lusaka",
    location: "Cairo Road, Lusaka",
    phone: "+260 211 123 456",
    hours: "Mon–Fri, 08:00 – 17:00",
  },
  {
    id: "s2",
    name: "Child Helpline Zambia",
    category: "Child Protection",
    province: "Lusaka",
    district: "Lusaka",
    location: "Nationwide (toll-free)",
    phone: "116",
    hours: "24 hours, every day",
  },
  {
    id: "s3",
    name: "Copperbelt SRH Clinic",
    category: "Sexual & Reproductive Health",
    province: "Copperbelt",
    district: "Ndola",
    location: "Broadway, Ndola",
    phone: "+260 212 987 654",
    hours: "Mon–Sat, 08:00 – 16:00",
  },
  {
    id: "s4",
    name: "GBV Survivor Support Unit",
    category: "Gender-Based Violence",
    province: "Lusaka",
    district: "Lusaka",
    location: "Police HQ, Lusaka",
    phone: "+260 211 222 333",
    hours: "24 hours, every day",
  },
  {
    id: "s5",
    name: "Hope Recovery Centre",
    category: "Substance Abuse",
    province: "Copperbelt",
    district: "Kitwe",
    location: "Parklands, Kitwe",
    phone: "+260 212 444 555",
    hours: "Mon–Fri, 09:00 – 18:00",
  },
  {
    id: "s6",
    name: "Legal Resources Foundation",
    category: "Legal Aid",
    province: "Southern",
    district: "Livingstone",
    location: "Mosi-oa-Tunya Rd, Livingstone",
    phone: "+260 213 666 777",
    hours: "Mon–Fri, 08:30 – 16:30",
  },
  {
    id: "s7",
    name: "Eastern Province Mental Health Unit",
    category: "Mental Health",
    province: "Eastern",
    district: "Chipata",
    location: "Chipata General Hospital",
    phone: "+260 216 888 999",
    hours: "Mon–Fri, 08:00 – 16:00",
  },
];

export const SUPPORT_PROVINCES = [
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

export const SUPPORT_DISTRICTS = {
  Lusaka: ["Lusaka", "Chongwe", "Kafue"],
  Copperbelt: ["Ndola", "Kitwe", "Chingola"],
  Southern: ["Livingstone", "Choma", "Mazabuka"],
  Eastern: ["Chipata", "Petauke"],
};

export const CONTACT_METHODS = [
  { id: "phone", label: "Phone call", description: "A counsellor will call you on your number." },
  { id: "visit", label: "In-person visit", description: "Meet a counsellor at a nearby service." },
  { id: "anonymous", label: "Stay anonymous", description: "Get help without sharing your identity." },
];

// ---------- Wellbeing resources ----------

export const WELLBEING_TOPICS = [
  "Mental Health",
  "Relationships",
  "Body Safety",
  "Healthy Living",
];

export const WELLBEING_RESOURCES = [
  { id: "w1", title: "Managing Exam Stress", type: "Article", topic: "Mental Health", summary: "Simple techniques to stay calm and focused during exam season.", readTime: "5 min read" },
  { id: "w2", title: "Breathing for Calm", type: "Video", topic: "Mental Health", summary: "A 4-minute guided breathing exercise you can do anywhere.", readTime: "4 min watch" },
  { id: "w3", title: "Healthy Friendships", type: "Article", topic: "Relationships", summary: "How to recognise supportive friendships and set boundaries.", readTime: "6 min read" },
  { id: "w4", title: "Saying No With Confidence", type: "Tip", topic: "Relationships", summary: "Quick scripts to help you say no to peer pressure.", readTime: "2 min read" },
  { id: "w5", title: "Your Body, Your Rights", type: "Article", topic: "Body Safety", summary: "Understanding consent, personal space and safe touch.", readTime: "7 min read" },
  { id: "w6", title: "Recognising Unsafe Situations", type: "Video", topic: "Body Safety", summary: "Learn the warning signs and who you can turn to for help.", readTime: "6 min watch" },
  { id: "w7", title: "Eating Well on a Budget", type: "Tip", topic: "Healthy Living", summary: "Affordable, nutritious meal ideas for busy students.", readTime: "3 min read" },
  { id: "w8", title: "Why Sleep Matters", type: "Article", topic: "Healthy Living", summary: "How good sleep boosts your mood, memory and energy.", readTime: "5 min read" },
];
