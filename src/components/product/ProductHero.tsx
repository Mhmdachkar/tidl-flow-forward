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
    <section className="relative overflow-hidden bg-background pb-8 pt-6 sm:pb-12 sm:pt-10 lg:pb-16 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Mobile order: headline → price → CTA → image */}
          <div className="order-1 flex flex-col lg:order-none">
            <span className="pill-tag mb-4 inline-flex w-fit">
              <span className="dot" />
              {product.tag}
            </span>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {product.displayName}
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
              {product.outcomeHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {product.heroCopy}
            </p>

            <div className="order-2 mt-6 lg:order-none">
              <p className="text-sm text-muted-foreground">{product.priceNote}</p>
              <p className="font-display text-3xl font-medium text-foreground sm:text-4xl">
                ${product.startingPrice}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
            </div>

            <div className="order-3 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:order-none">
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

          <div className="order-4 relative flex min-h-[280px] items-center justify-center lg:order-none lg:min-h-[420px]">
            {product.showPenHero ? (
              <div className="relative h-[280px] w-full sm:h-[360px] lg:h-[420px]">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(243,195,0,0.12),transparent_70%)]" />
                <Pen3D className="relative z-10 h-full w-full" />
              </div>
            ) : (
              <div className="relative flex h-64 w-full items-end justify-center sm:h-80 lg:h-96">
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
        </div>
      </div>
    </section>
  );
}
