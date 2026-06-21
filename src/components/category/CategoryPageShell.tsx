import { Link } from "@tanstack/react-router";

import { HowItWorksSection } from "@/components/product/HowItWorksSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { TrustBar } from "@/components/product/TrustBar";
import { WhyPenSection } from "@/components/product/WhyPenSection";
import { CategoryProductGrid } from "@/components/category/CategoryProductGrid";
import { CARE_JOURNEY_STEPS } from "@/data/shared-care-steps";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import type { Category } from "@/types/product";
import type { Product } from "@/types/product";

interface CategoryPageProps {
  category: Category;
  products: Product[];
}

export function CategoryPageShell({ category, products }: CategoryPageProps) {
  const { openModal } = useQuizModal();
  const quizOpts = products[0]
    ? { product: products[0].slug }
    : { goal: category.defaultGoalId };

  return (
    <div className="min-h-svh bg-background pb-24 lg:pb-0">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← TIDL
          </Link>
          <button
            type="button"
            onClick={() => openModal(quizOpts)}
            className="text-sm font-medium text-foreground hover:text-clinical"
          >
            Start Assessment
          </button>
        </div>
      </header>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="pill-tag mb-4 inline-flex w-fit">
            <span className="dot" />
            {category.title}
          </span>
          <h1 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
            {category.heroHeadline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {category.heroCopy}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {category.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted-foreground"
              >
                {area}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => openModal(quizOpts)}
            className="btn-primary mt-8 inline-flex justify-center px-8 py-3.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </section>

      <TrustBar />

      {category.educationHeadline && category.educationCopy ? (
        <section className="bg-surface py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight text-foreground">
              {category.educationHeadline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {category.educationCopy}
            </p>
          </div>
        </section>
      ) : null}

      <CategoryProductGrid products={products} />
      <WhyPenSection showPen={category.showPenSection} />
      <HowItWorksSection steps={CARE_JOURNEY_STEPS} />
      <ProductFAQSection faqs={category.faqs} />

      <section className="border-t border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-foreground">
            See if you qualify
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Complete a secure assessment. A licensed physician reviews your information
            before any prescription is written.
          </p>
          <button
            type="button"
            onClick={() => openModal(quizOpts)}
            className="btn-primary mt-8 inline-flex justify-center px-10 py-3.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{category.title}</p>
          <button
            type="button"
            onClick={() => openModal(quizOpts)}
            className="btn-primary shrink-0 px-6 py-2.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
