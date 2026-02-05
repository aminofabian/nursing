// Pricing in USD (stored in cents)
export const PRICING = {
  MONTHLY: 999, // $9.99
  YEARLY: 7999, // $79.99
} as const;

// Format price from cents to display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

// Resource types with display names
export const RESOURCE_TYPES = {
  NOTES: { label: "Study Notes", slug: "notes", icon: "BookOpen" },
  PRACTICE_EXAM: { label: "Practice Exams", slug: "practice-exams", icon: "FileText" },
  CARE_PLAN: { label: "Care Plans", slug: "care-plans", icon: "ClipboardList" },
  DRUG_GUIDE: { label: "Drug Guides", slug: "drug-guides", icon: "Pill" },
  NCLEX: { label: "NCLEX Prep", slug: "nclex", icon: "GraduationCap" },
  CLINICAL: { label: "Clinical Guides", slug: "clinical", icon: "Stethoscope" },
} as const;

export type ResourceTypeKey = keyof typeof RESOURCE_TYPES;

// Year levels
export const YEAR_LEVELS = [
  { value: 1, label: "Year 1" },
  { value: 2, label: "Year 2" },
  { value: 3, label: "Year 3" },
  { value: 4, label: "Year 4" },
] as const;

// Program types
export const PROGRAM_TYPES = [
  { value: "BSN", label: "BSN (Bachelor of Science in Nursing)" },
  { value: "ADN", label: "ADN (Associate Degree in Nursing)" },
  { value: "LPN", label: "LPN/LVN Program" },
  { value: "MSN", label: "MSN (Master of Science in Nursing)" },
  { value: "DNP", label: "DNP (Doctor of Nursing Practice)" },
  { value: "OTHER", label: "Other" },
] as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

// App metadata
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NurseHub";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_DESCRIPTION =
  "Your one-stop platform for nursing study resources. Notes, practice exams, care plans, and NCLEX prep.";

// Subscription benefits
export const SUBSCRIPTION_BENEFITS = [
  "Access to all study notes",
  "All practice exams with rationales",
  "Care plan templates",
  "Drug guides & calculations",
  "NCLEX preparation materials",
  "Clinical rotation guides",
  "New uploads automatically",
  "Download resources offline",
] as const;

// Pay-per-resource prices (in cents)
export const SINGLE_RESOURCE_PRICES = {
  PRACTICE_EXAM: 499, // $4.99
  CARE_PLAN_BUNDLE: 999, // $9.99
  EXAM_PREP_KIT: 1999, // $19.99
} as const;
