import { createFileRoute } from "@tanstack/react-router";
import { useLenisScroll } from "@/lib/use-lenis";

import { NavSection } from "@/components/sections/NavSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { VoxelSection } from "@/components/sections/VoxelSection";
import { HumanSection } from "@/components/sections/HumanSection";
import { PenSection } from "@/components/sections/PenSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TreatmentCategoriesSection } from "@/components/sections/TreatmentCategoriesSection";
import { RedManSection } from "@/components/sections/RedManSection";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { PharmacySection } from "@/components/sections/PharmacySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FooterSection } from "@/components/sections/FooterSection";

import womenCut from "@/assets/women 3d.png";
import men2 from "@/assets/men 2 3d.png";

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
        <div className="section-card-dark"><VoxelSection /></div>

        <div className="section-card">
          <HumanSection
            img={womenCut}
            align="left"
            tag="Longevity intelligence"
            title="A clinical view of you."
            body="Bloodwork, biomarkers and lifestyle telemetry — synthesised by your care team into a single, evolving plan."
            chips={[
              { label: "Testosterone", value: "812 ng/dL", pos: "top-[12%] left-[-4%]" },
              { label: "Recovery",     value: "Optimal",   pos: "top-[18%] left-[78%]" },
              { label: "Zone 2",       value: "138 W",     pos: "top-[78%] left-[68%]" },
              { label: "Grip",         value: "+18%",      pos: "top-[68%] left-[2%]" },
              { label: "Resting HR",   value: "52 bpm",    pos: "top-[-2%] left-[40%]" },
            ]}
          />
        </div>
      </div>

      <PenSection />

      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="section-card"><HowItWorksSection /></div>
        <div className="section-card"><TreatmentCategoriesSection /></div>
        <RedManSection />

        <div className="section-card">
          <HumanSection
            img={men2}
            align="right"
            tag="Performance"
            title="Built for the long climb."
            body="Hormonal optimisation, metabolic care and recovery science — calibrated to where you're going, not just where you are."
            blendMode="multiply"
            chips={[
              { label: "Testosterone", value: "812 ng/dL", pos: "top-[12%] left-[-4%]" },
              { label: "Recovery",     value: "Optimal",   pos: "top-[18%] left-[78%]" },
              { label: "Zone 2",       value: "138 W",     pos: "top-[78%] left-[68%]" },
              { label: "Grip",         value: "+18%",      pos: "top-[68%] left-[2%]" },
              { label: "Resting HR",   value: "52 bpm",    pos: "top-[-2%] left-[40%]" },
            ]}
          />
        </div>

        <div className="section-card"><DoctorSection /></div>
        <div className="section-card"><PharmacySection /></div>
        <div className="section-card"><ReviewsSection /></div>
        <div className="section-card"><FAQSection /></div>
        <div className="section-card-dark"><CtaSection /></div>
        <div className="section-card-dark"><FooterSection /></div>
      </div>
    </div>
  );
}
