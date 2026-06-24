import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "Longevity · TIDL" },
      {
        name: "description",
        content:
          "Longevity and healthy aging care reviewed by licensed physicians. Explore TIDL protocols and start your assessment.",
      },
    ],
  }),
  component: LongevityPage,
});

function LongevityPage() {
  const category = getCategoryBySlug("longevity");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("longevity")} />;
}
