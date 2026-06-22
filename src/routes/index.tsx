import { createFileRoute } from "@tanstack/react-router";
import { useLenisScroll } from "@/lib/use-lenis";

import { NavSection } from "@/components/sections/NavSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { TreatmentCategoriesSection } from "@/components/sections/TreatmentCategoriesSection";
import { PenSection } from "@/components/sections/PenSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { PharmacySection } from "@/components/sections/PharmacySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FooterSection } from "@/components/sections/FooterSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIDL — Physician-supervised longevity care" },
      { name: "description", content: "TIDL pairs licensed physicians with metabolic, hormonal and longevity therapies — delivered to your door." },
      { property: "og:title", content: "TIDL — Physician-supervised longevity care" },
      { property: "og:description", content: "Personalised, physician-supervised longevity care." },
    ],
  }),
  component: Index,
});

function Index() {
  useLenisScroll();
  return (
    <div className="relative bg-[#e2e2e2] text-foreground overflow-x-clip">
      <div className="scroll-progress" />

      <NavSection />
      <HeroSection />

      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="overflow-hidden bg-surface"><TrustSection /></div>
      </div>

      <PenSection />

      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="section-card"><HowItWorksSection /></div>
        <div className="section-card"><TreatmentCategoriesSection /></div>
        <div className="section-card"><DoctorSection /></div>
        <div className="section-card"><PharmacySection /></div>
        <div className="section-card"><ReviewsSection /></div>
        <div className="section-card"><EducationSection /></div>
        <div className="section-card"><FAQSection /></div>
        <div className="section-card-dark"><CtaSection /></div>
        <div className="section-card-dark"><FooterSection /></div>
      </div>
    </div>
  );
}
