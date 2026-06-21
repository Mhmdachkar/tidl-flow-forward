import { Link } from "@tanstack/react-router";

import { useQuizModal } from "@/providers/quiz-modal-provider";
import { HowItWorksSection } from "@/components/product/HowItWorksSection";
import { IncludedSection } from "@/components/product/IncludedSection";
import { OutcomesSection } from "@/components/product/OutcomesSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { ProductFinalCTA } from "@/components/product/ProductFinalCTA";
import { ProductHero } from "@/components/product/ProductHero";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { SafetySection } from "@/components/product/SafetySection";
import { TimelineSection } from "@/components/product/TimelineSection";
import { TrustBar } from "@/components/product/TrustBar";
import { WhyPenSection } from "@/components/product/WhyPenSection";
import type { Product } from "@/types/product";

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const { openModal } = useQuizModal();
  return (
    <div className="min-h-svh bg-background pb-24 lg:pb-0">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← TIDL
          </Link>
          <button
            type="button"
            onClick={() => openModal({ product: product.slug })}
            className="text-sm font-medium text-foreground hover:text-clinical"
          >
            Start Assessment
          </button>
        </div>
      </header>

      <ProductHero product={product} />
      <TrustBar />
      <OutcomesSection outcomes={product.outcomes} />
      <WhyPenSection showPen={product.showPenHero} />
      <HowItWorksSection steps={product.howItWorks} />
      <IncludedSection items={product.included} />
      <TimelineSection timeline={product.timeline} />
      <SafetySection safety={product.safety} />
      <ReviewsSection reviews={product.reviews} />
      <ProductFAQSection faqs={product.faqs} />
      <ProductFinalCTA productSlug={product.slug} />
    </div>
  );
}
