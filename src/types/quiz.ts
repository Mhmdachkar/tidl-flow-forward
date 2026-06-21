export const QUIZ_TOTAL_STEPS = 8;
export const QUIZ_STORAGE_KEY = "tidl-quiz-v1";
export const QUIZ_STORAGE_VERSION = 1 as const;

export const GOAL_OPTIONS = [
  {
    id: "weight-loss",
    label: "Weight loss",
    description: "Physician-guided GLP-1 weight management",
  },
  {
    id: "longevity",
    label: "Longevity",
    description: "Healthy aging and prevention-focused care",
  },
  {
    id: "metabolic-health",
    label: "Metabolic health",
    description: "Metabolism, energy, and insulin support",
  },
  {
    id: "hormonal-health",
    label: "Hormonal health",
    description: "Hormone balance and optimization",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Recovery and physical optimization",
  },
  {
    id: "recovery",
    label: "Recovery",
    description: "Resilience and healing support",
  },
] as const;

export type GoalId = (typeof GOAL_OPTIONS)[number]["id"];

export const SEX_OPTIONS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other" },
] as const;

export type Sex = (typeof SEX_OPTIONS)[number]["id"];

export const HEALTH_CONDITION_OPTIONS = [
  { id: "diabetes", label: "Diabetes or prediabetes" },
  { id: "heart", label: "Heart condition" },
  { id: "hypertension", label: "High blood pressure" },
  { id: "thyroid", label: "Thyroid condition" },
  { id: "kidney", label: "Kidney disease" },
  { id: "none", label: "None of the above" },
] as const;

export type HealthConditionId = (typeof HEALTH_CONDITION_OPTIONS)[number]["id"];

export const EXERCISE_OPTIONS = [
  { id: "rarely", label: "Rarely" },
  { id: "1-2", label: "1–2 days per week" },
  { id: "3-4", label: "3–4 days per week" },
  { id: "5+", label: "5+ days per week" },
] as const;

export type ExerciseLevel = (typeof EXERCISE_OPTIONS)[number]["id"];

export const SLEEP_OPTIONS = [
  { id: "poor", label: "Poor" },
  { id: "fair", label: "Fair" },
  { id: "good", label: "Good" },
  { id: "excellent", label: "Excellent" },
] as const;

export type SleepQuality = (typeof SLEEP_OPTIONS)[number]["id"];

export const EATING_OPTIONS = [
  { id: "balanced", label: "Mostly balanced" },
  { id: "inconsistent", label: "Inconsistent" },
  { id: "high-processed", label: "High processed foods" },
  { id: "special-diet", label: "Special diet" },
] as const;

export type EatingHabits = (typeof EATING_OPTIONS)[number]["id"];

import type { ProductSlug } from "@/types/product";

export interface QuizFormData {
  goal: GoalId | null;
  productSlug: ProductSlug | null;
  age: number | null;
  sex: Sex | null;
  heightFeet: number | null;
  heightInches: number | null;
  weightLbs: number | null;
  healthConditions: HealthConditionId[];
  takingMedications: boolean | null;
  hasAllergies: boolean | null;
  exercise: ExerciseLevel | null;
  sleep: SleepQuality | null;
  eatingHabits: EatingHabits | null;
  usedGlp1Before: boolean | null;
  previousWeightLossMeds: boolean | null;
  email: string;
  phone: string;
  password: string;
  physicianNoticeAcknowledged: boolean;
}

export interface StoredQuizState {
  version: typeof QUIZ_STORAGE_VERSION;
  currentStep: number;
  data: QuizFormData;
  updatedAt: string;
}

export const QUIZ_STEP_LABELS: Record<number, string> = {
  1: "Your goal",
  2: "About you",
  3: "Health history",
  4: "Lifestyle",
  5: "Treatment history",
  6: "Physician review",
  7: "Your account",
  8: "Recommendation",
};

export function createDefaultQuizData(): QuizFormData {
  return {
    goal: null,
    productSlug: null,
    age: null,
    sex: null,
    heightFeet: null,
    heightInches: null,
    weightLbs: null,
    healthConditions: [],
    takingMedications: null,
    hasAllergies: null,
    exercise: null,
    sleep: null,
    eatingHabits: null,
    usedGlp1Before: null,
    previousWeightLossMeds: null,
    email: "",
    phone: "",
    password: "",
    physicianNoticeAcknowledged: false,
  };
}
