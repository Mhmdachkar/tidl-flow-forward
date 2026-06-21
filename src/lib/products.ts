import { PRODUCT_BY_SLUG, PRODUCTS } from "@/data/products";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import type {
  Category,
  CategoryId,
  Product,
  ProductSlug,
  RecommendedTreatment,
} from "@/types/product";
import type { GoalId } from "@/types/quiz";

export function getProductBySlug(slug: string): Product | null {
  return PRODUCT_BY_SLUG[slug as ProductSlug] ?? null;
}

export function getAllProductSlugs(): ProductSlug[] {
  return PRODUCTS.map((p) => p.slug);
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.categoryIds.includes(categoryId));
}

export function getCategoryBySlug(slug: string): Category | null {
  return CATEGORY_BY_SLUG[slug as CategoryId] ?? null;
}

export function getAllCategorySlugs(): CategoryId[] {
  return Object.keys(CATEGORY_BY_SLUG) as CategoryId[];
}

const GOAL_FALLBACK_PRODUCT: Partial<Record<GoalId, ProductSlug>> = {
  "weight-loss": "lirosome",
  "metabolic-health": "lirosome",
  longevity: "tirosane",
  "hormonal-health": "tidl-cycle",
  performance: "tidl-core",
  recovery: "tidl-core",
};

export function getRecommendedTreatment(
  goal: GoalId | null,
  productSlug?: ProductSlug | null,
): RecommendedTreatment {
  if (productSlug) {
    const product = getProductBySlug(productSlug);
    if (product) {
      return {
        name: product.displayName,
        description: product.heroCopy,
        startingPrice: product.startingPrice,
        productSlug: product.slug,
      };
    }
  }

  if (goal) {
    const fallbackSlug = GOAL_FALLBACK_PRODUCT[goal];
    if (fallbackSlug) {
      const product = getProductBySlug(fallbackSlug);
      if (product) {
        return {
          name: product.displayName,
          description: product.heroCopy,
          startingPrice: product.startingPrice,
          productSlug: product.slug,
        };
      }
    }
  }

  return {
    name: "Physician-Guided Treatment",
    description:
      "A licensed physician will review your assessment and recommend appropriate care.",
    startingPrice: 249,
  };
}
