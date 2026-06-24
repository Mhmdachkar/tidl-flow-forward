import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance · TIDL" },
      {
        name: "description",
        content:
          "Physician-guided performance and recovery care. Start your assessment with TIDL.",
      },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  const category = getCategoryBySlug("performance");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("performance")} />;
}
