import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/weight-loss")({
  head: () => ({
    meta: [
      { title: "Weight Loss — TIDL" },
      {
        name: "description",
        content:
          "Physician-guided GLP-1 weight loss care with pre-dosed injection pens. Start your assessment to see if you qualify.",
      },
    ],
  }),
  component: WeightLossPage,
});

function WeightLossPage() {
  const category = getCategoryBySlug("weight-loss");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("weight-loss")} />;
}
