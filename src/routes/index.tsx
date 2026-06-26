import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLenisScroll } from "@/lib/use-lenis";
import { useGlobalScrollReveal } from "@/lib/use-scroll-reveal";

import { NavSection } from "@/components/sections/NavSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { AiSearchSection } from "@/components/sections/AiSearchSection";
import { DeferredProductShowcase } from "@/components/sections/DeferredProductShowcase";
import { TrustBridgeSection } from "@/components/sections/TrustBridgeSection";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { CareJourneySection } from "@/components/sections/CareJourneySection";
import { TIDL_BRAND_STYLES } from "@/lib/tidl-brand";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
const EducationSection = lazy(() =>
  import("@/components/sections/EducationSection").then((m) => ({ default: m.EducationSection })),
);
const FAQSection = lazy(() =>
  import("@/components/sections/FAQSection").then((m) => ({ default: m.FAQSection })),
);
const CtaSection = lazy(() =>
  import("@/components/sections/CtaSection").then((m) => ({ default: m.CtaSection })),
);
const FooterSection = lazy(() =>
  import("@/components/sections/FooterSection").then((m) => ({ default: m.FooterSection })),
);

function SectionFallback({ minHeight = "28rem" }: { minHeight?: string }) {
  return <div aria-hidden className="w-full" style={{ minHeight }} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIDL. Physician-supervised longevity care" },
      { name: "description", content: "TIDL pairs licensed physicians with metabolic, hormonal and longevity therapies. delivered to your door." },
      { property: "og:title", content: "TIDL. Physician-supervised longevity care" },
      { property: "og:description", content: "Personalised, physician-supervised longevity care." },
    ],
  }),
  component: Index,
});

function Index() {
  useLenisScroll();
  useGlobalScrollReveal();
  return (
    <div className="relative bg-[#e2e2e2] text-foreground">
      <div className="scroll-progress" />

      <NavSection integrateAtTop />
      <HeroSection />

      <DeferredProductShowcase />

      <TrustBridgeSection />

      <AiSearchSection />

      <CareJourneySection />

      <DoctorSection />

      <div className="tidl-brand-section flex flex-col gap-2 px-2 pb-2" style={{ marginTop: 0 }}>
        <style>{TIDL_BRAND_STYLES}</style>
        <div className="section-card" data-reveal><ReviewsSection /></div>
        <Suspense fallback={<SectionFallback minHeight="28rem" />}>
          <div data-reveal><EducationSection /></div>
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight="32rem" />}>
          <div className="section-card"><FAQSection /></div>
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight="20rem" />}>
          <div className="section-card-dark" data-reveal><CtaSection /></div>
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight="24rem" />}>
          <div className="section-card-dark" data-reveal><FooterSection /></div>
        </Suspense>
      </div>
    </div>
  );
}
