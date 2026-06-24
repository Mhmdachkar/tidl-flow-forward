import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPageShell } from "@/components/category/CategoryPageShell";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";

export const Route = createFileRoute("/metabolic")({
  head: () => ({
    meta: [
      { title: "Metabolic Care · TIDL" },
      {
        name: "description",
        content:
          "Physician-guided metabolic care including GLP-1 protocols. Start your assessment today.",
      },
    ],
  }),
  component: MetabolicPage,
});

function MetabolicPage() {
  const category = getCategoryBySlug("metabolic");
  if (!category) throw notFound();
  return <CategoryPageShell category={category} products={getProductsByCategory("metabolic")} />;
}
