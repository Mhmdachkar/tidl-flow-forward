import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductPage } from "@/components/product/ProductPage";
import { getProductBySlug } from "@/lib/products";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const product = getProductBySlug(params.slug);
    return {
      meta: product
        ? [
            { title: `${product.displayName} — TIDL` },
            { name: "description", content: product.metaDescription },
          ]
        : [{ title: "Product not found — TIDL" }],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = getProductBySlug(slug);

  if (!product) {
    throw notFound();
  }

  return <ProductPage product={product} />;
}
