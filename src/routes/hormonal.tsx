import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/hormonal")({
  head: () => ({
    meta: [
      { title: "Hormonal Balance · TIDL" },
      {
        name: "description",
        content:
          "Physician-guided female hormonal balance care. Complete your assessment to see if you qualify.",
      },
    ],
  }),
  component: HormonalPage,
});

function HormonalPage() {
  const category = getCategoryBySlug("hormonal");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("hormonal")} />;
}
