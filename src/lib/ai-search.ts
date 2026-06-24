import { getRecommendedTreatment, getCategoryBySlug } from "@/lib/products";
import { GOAL_OPTIONS, type GoalId } from "@/types/quiz";
import type { CategoryId, ProductSlug } from "@/types/product";

const CATEGORY_ROUTES: Record<CategoryId, string> = {
  "weight-loss": "/weight-loss",
  longevity: "/longevity",
  metabolic: "/metabolic",
  hormonal: "/hormonal",
  performance: "/performance",
  recovery: "/recovery",
};

export type AiSearchResult = {
  query: string;
  goalId: GoalId;
  goalLabel: string;
  categorySlug: CategoryId;
  categoryTitle: string;
  summary: string;
  productSlug: ProductSlug;
  productName: string;
  productDescription: string;
  startingPrice: number;
  productImage: string;
  confidence: "high" | "medium";
};

const GOAL_KEYWORDS: { goalId: GoalId; categorySlug: CategoryId; patterns: RegExp[] }[] = [
  {
    goalId: "weight-loss",
    categorySlug: "weight-loss",
    patterns: [/weight\s*loss/i, /\bglp[\s-]?1\b/i, /\blose\s+weight\b/i, /\bobes/i, /\bslim/i, /\bsemaglutide\b/i, /\btirzepatide\b/i],
  },
  {
    goalId: "longevity",
    categorySlug: "longevity",
    patterns: [/longevity/i, /\baging\b/i, /\banti[\s-]?aging\b/i, /\bhealthy\s+aging\b/i, /\bcellular\b/i],
  },
  {
    goalId: "hormonal-health",
    categorySlug: "hormonal",
    patterns: [/hormon/i, /\bmenopause\b/i, /\bcycle\b/i, /\bestrogen\b/i, /\bprogesterone\b/i, /\bfemale\s+health\b/i],
  },
  {
    goalId: "metabolic-health",
    categorySlug: "metabolic",
    patterns: [/metabol/i, /\binsulin\b/i, /\bblood\s+sugar\b/i, /\benergy\b/i],
  },
  {
    goalId: "performance",
    categorySlug: "performance",
    patterns: [/performance/i, /\bathletic\b/i, /\boptimize\b/i, /\bstamina\b/i, /\bworkout\b/i],
  },
  {
    goalId: "recovery",
    categorySlug: "recovery",
    patterns: [/recovery/i, /\bresilien/i, /\bheal/i, /\brehab\b/i],
  },
];

const DEFAULT_GOAL: GoalId = "weight-loss";

function normalizeQuery(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function getCategoryPath(slug: CategoryId) {
  return CATEGORY_ROUTES[slug];
}

export function getAiSearchSuggestions() {
  return [
    "I want to lose weight with GLP-1 care",
    "Support healthy aging and longevity",
    "Help with hormonal balance",
    "Improve metabolism and energy",
  ] as const;
}

export function matchGoalFromQuery(raw: string): { goalId: GoalId; categorySlug: CategoryId; confidence: "high" | "medium" } {
  const query = normalizeQuery(raw).toLowerCase();
  if (!query) {
    return { goalId: DEFAULT_GOAL, categorySlug: "weight-loss", confidence: "medium" };
  }

  for (const entry of GOAL_KEYWORDS) {
    if (entry.patterns.some((pattern) => pattern.test(query))) {
      return { goalId: entry.goalId, categorySlug: entry.categorySlug, confidence: "high" };
    }
  }

  return { goalId: DEFAULT_GOAL, categorySlug: "weight-loss", confidence: "medium" };
}

export function getAiSearchResult(raw: string): AiSearchResult {
  const query = normalizeQuery(raw);
  const { goalId, categorySlug, confidence } = matchGoalFromQuery(query);
  const goal = GOAL_OPTIONS.find((g) => g.id === goalId)!;
  const category = getCategoryBySlug(categorySlug);
  const treatment = getRecommendedTreatment(goalId);
  const productSlug = (treatment.productSlug ?? "lirosome") as ProductSlug;

  const summary =
    confidence === "high"
      ? `Based on your goal, ${goal.label.toLowerCase()} care may be a fit. A licensed physician still reviews every assessment, this is a starting point, not a prescription.`
      : `Tell us more in your assessment for a precise match. To start, ${goal.label.toLowerCase()} is a common path on TIDL, always reviewed by a licensed physician before any treatment ships.`;

  return {
    query: query || "Describe your health goal",
    goalId,
    goalLabel: goal.label,
    categorySlug,
    categoryTitle: category?.title ?? goal.label,
    summary,
    productSlug,
    productName: treatment.name,
    productDescription: treatment.description,
    startingPrice: treatment.startingPrice,
    productImage: treatment.image ?? "",
    confidence,
  };
}
