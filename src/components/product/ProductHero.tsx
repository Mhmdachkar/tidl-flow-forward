import { useQuizModal } from "@/providers/quiz-modal-provider";
import { Pen3D } from "@/components/three/Pen3D";
import type { Product } from "@/types/product";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const { openModal } = useQuizModal();
  const imageFilter = product.lightProduct
    ? "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))"
    : "drop-shadow(0 22px 28px rgba(20,30,60,0.22))";

  return (
    <section className="relative overflow-hidden bg-background pb-8 pt-4 sm:pb-12 sm:pt-10 lg:pb-16 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Image — first on mobile, right on desktop */}
          <div className="order-1 relative flex items-center justify-center lg:order-2 lg:min-h-[420px]">
            {product.showPenHero ? (
              <div className="relative h-[240px] w-full sm:h-[360px] lg:h-[420px]">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(243,195,0,0.12),transparent_70%)]" />
                <Pen3D className="relative z-10 h-full w-full" />
              </div>
            ) : (
              <div className="relative flex h-56 w-full items-end justify-center sm:h-80 lg:h-96">
                <div
                  className="absolute inset-x-12 bottom-6 h-6 rounded-full blur-2xl opacity-60"
                  style={{
                    background: "radial-gradient(closest-side, rgba(243,195,0,0.35), transparent 70%)",
                  }}
                />
                <img
                  src={product.image}
                  alt={product.displayName}
                  className="relative z-10 max-h-full w-auto max-w-full object-contain"
                  style={{ filter: imageFilter }}
                />
              </div>
            )}
          </div>

          {/* Text — after image on mobile, left on desktop */}
          <div className="order-2 flex flex-col lg:order-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="pill-tag inline-flex w-fit">
                <span className="dot" />
                {product.tag}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {product.displayName}
              </span>
            </div>

            <h1 className="mt-4 font-display text-[clamp(1.9rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
              {product.outcomeHeadline}
            </h1>

            {/* trimmed on mobile to reduce clutter, full copy on larger screens */}
            <p className="mt-3 line-clamp-2 max-w-xl text-base leading-relaxed text-muted-foreground sm:line-clamp-none sm:text-lg">
              {product.heroCopy}
            </p>

            <div className="mt-5">
              <p className="text-sm text-muted-foreground">{product.priceNote}</p>
              <p className="font-display text-3xl font-medium text-foreground sm:text-4xl">
                ${product.startingPrice}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openModal({ product: product.slug })}
                className="btn-primary inline-flex justify-center px-8 py-3.5 text-sm"
              >
                Start Assessment
              </button>
              <a
                href="#how-it-works"
                className="inline-flex justify-center rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
