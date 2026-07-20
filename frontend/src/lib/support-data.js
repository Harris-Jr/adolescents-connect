// Support page static config.
//
// The referral directory (categories, services, provinces, districts) is now
// served live from the API — see /api/support/services and /api/support/meta,
// consumed by Support.jsx and SupportServices.jsx.
//
// What remains here is static UI config (contact-method options) and the
// Wellbeing Resources content, which is STILL MOCK — see note below.

export const CONTACT_METHODS = [
  { id: "phone", label: "Phone call", description: "A counsellor will call you on your number." },
  { id: "visit", label: "In-person visit", description: "Meet a counsellor at a nearby service." },
  { id: "anonymous", label: "Stay anonymous", description: "Get help without sharing your identity." },
];

// ---------- Wellbeing resources ----------
// NOT YET REAL — these articles/videos/tips are mock content rendered by
// SupportResources.jsx. There is no WellbeingResource model or endpoint.
// TODO: model + seed real wellbeing content and fetch it from the API.

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
