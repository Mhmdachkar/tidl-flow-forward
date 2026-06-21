import { Link } from "@tanstack/react-router";

import type { Product } from "@/types/product";

interface CategoryProductGridProps {
  products: Product[];
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
          Available protocols
        </h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Each protocol is physician-reviewed. Complete an assessment to see if you qualify.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageFilter = product.lightProduct
              ? "drop-shadow(0 40px 50px rgba(40,60,100,0.2))"
              : "drop-shadow(0 18px 24px rgba(20,30,60,0.18))";

            return (
              <Link
                key={product.slug}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-40 items-end justify-center">
                  <img
                    src={product.image}
                    alt={product.displayName}
                    className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{ filter: imageFilter }}
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {product.tag}
                </p>
                <h3 className="mt-1 font-display text-xl text-foreground">
                  {product.displayName}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-display text-lg text-foreground">
                    ${product.startingPrice}
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </p>
                  <span className="text-sm font-medium text-clinical transition-transform group-hover:translate-x-1">
                    Learn more →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
