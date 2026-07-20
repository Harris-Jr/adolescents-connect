// Maps DB category strings to display label + Tailwind classes
const CATEGORY_MAP = {
  career_guidance:  { label: "Career Guidance",  surface: "bg-surface-yellow",  text: "text-brand-navy",   banner: "bg-brand-yellow" },
  civic_education:  { label: "Civic Education",  surface: "bg-surface-mint",    text: "text-brand-teal",   banner: "bg-brand-teal" },
  leadership:       { label: "Leadership",        surface: "bg-surface-lavender",text: "text-brand-purple", banner: "bg-brand-purple" },
  digital_safety:   { label: "Digital Safety",   surface: "bg-surface-blue",    text: "text-brand-blue",   banner: "bg-brand-blue" },
  health_wellbeing: { label: "Health & Wellbeing",surface: "bg-surface-peach",  text: "text-brand-pink",   banner: "bg-brand-pink" },
  debate:           { label: "Debate",            surface: "bg-surface-lavender",text: "text-brand-purple", banner: "bg-brand-purple" },
  environmental:    { label: "Environmental",     surface: "bg-surface-mint",    text: "text-brand-teal",   banner: "bg-brand-teal" },
};

const FALLBACK = { label: "Club", surface: "bg-surface-lavender", text: "text-brand-purple", banner: "bg-brand-purple" };

export function getCategoryStyle(cat) {
  return CATEGORY_MAP[cat?.toLowerCase()] ?? FALLBACK;
}

export function getCategoryLabel(cat) {
  return (CATEGORY_MAP[cat?.toLowerCase()] ?? FALLBACK).label;
}

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_MAP).map(([id, { label }]) => ({ id, label }));
