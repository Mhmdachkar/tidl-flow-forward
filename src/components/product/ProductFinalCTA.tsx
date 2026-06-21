import { useQuizModal } from "@/providers/quiz-modal-provider";
import type { ProductSlug } from "@/types/product";

interface ProductFinalCTAProps {
  productSlug: ProductSlug;
  headline?: string;
}

export function ProductFinalCTA({
  productSlug,
  headline = "Ready to see if you qualify?",
}: ProductFinalCTAProps) {
  const { openModal } = useQuizModal();
  return (
    <>
      <section className="border-t border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
            {headline}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Complete a secure medical assessment. A licensed physician will review your
            information and determine whether treatment is appropriate.
          </p>
          <button
            type="button"
            onClick={() => openModal({ product: productSlug })}
            className="btn-primary mt-8 inline-flex justify-center px-10 py-3.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Physician review required</p>
          <button
            type="button"
            onClick={() => openModal({ product: productSlug })}
            className="btn-primary shrink-0 px-6 py-2.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </>
  );
}
