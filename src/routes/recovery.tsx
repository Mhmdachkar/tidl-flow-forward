import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery — TIDL" },
      {
        name: "description",
        content:
          "Physician-guided recovery and resilience care. Explore TIDL protocols and start your assessment.",
      },
    ],
  }),
  component: RecoveryPage,
});

function RecoveryPage() {
  const category = getCategoryBySlug("recovery");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("recovery")} />;
}
