import { Star } from "lucide-react";

import type { ProductReview } from "@/types/product";

interface ReviewsSectionProps {
  reviews: ProductReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="bg-surface py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
            Patient experiences
          </h2>
          <p className="text-xs text-muted-foreground">
            Illustrative examples for prototype — not verified testimonials.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-clinical text-clinical" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-foreground">
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                {review.name} · {review.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
