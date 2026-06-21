import type { GoalId } from "@/types/quiz";

export type CategoryId =
  | "weight-loss"
  | "longevity"
  | "metabolic"
  | "hormonal"
  | "performance"
  | "recovery";

export type ProductSlug = "lirosome" | "tirosane" | "tidl-core" | "tidl-cycle";

export interface ProductOutcome {
  label: string;
  value: string;
  disclaimer?: string;
}

export interface ProductStep {
  step: number;
  title: string;
  description: string;
}

export interface ProductIncludedItem {
  title: string;
  description: string;
}

export interface ProductTimelinePhase {
  period: string;
  title: string;
  description: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductReview {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface Product {
  slug: ProductSlug;
  displayName: string;
  tag: string;
  categoryIds: CategoryId[];
  goalId: GoalId;
  tagline: string;
  outcomeHeadline: string;
  heroCopy: string;
  startingPrice: number;
  priceNote: string;
  image: string;
  lightProduct?: boolean;
  showPenHero: boolean;
  metaDescription: string;
  outcomes: {
    headline: string;
    items: ProductOutcome[];
    disclaimer: string;
  };
  howItWorks: ProductStep[];
  included: ProductIncludedItem[];
  timeline?: ProductTimelinePhase[];
  safety: {
    headline: string;
    items: string[];
    disclaimer: string;
  };
  faqs: ProductFAQ[];
  reviews: ProductReview[];
}

export interface Category {
  slug: CategoryId;
  title: string;
  heroHeadline: string;
  heroCopy: string;
  focusAreas: string[];
  featuredProductSlugs: ProductSlug[];
  defaultGoalId: GoalId;
  educationHeadline?: string;
  educationCopy?: string;
  showPenSection: boolean;
  faqs: ProductFAQ[];
  metaDescription: string;
}

export interface RecommendedTreatment {
  name: string;
  description: string;
  startingPrice: number;
  productSlug?: ProductSlug;
  image?: string;
}
