import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { getRecommendedTreatment } from "@/lib/products";
import type { GoalId, QuizFormData } from "@/types/quiz";

interface StepRecommendationProps {
  goal: GoalId | null;
  productSlug: QuizFormData["productSlug"];
}

const GOAL_BULLETS: Partial<Record<GoalId, string[]>> = {
  "weight-loss": [
    "Clinically-backed GLP-1 weight protocols",
    "Results you can see and measure",
    "Plans built to sustain progress",
  ],
  longevity: [
    "Science-driven longevity protocols",
    "Physician-reviewed at every stage",
    "Built for the long game",
  ],
  "metabolic-health": [
    "Metabolic optimization from the inside out",
    "Evidence-based treatments",
    "Ongoing physician oversight",
  ],
  "hormonal-health": [
    "Hormone balance, restored",
    "Personalized to your biology",
    "Physician-led care, every step",
  ],
  performance: [
    "Peak performance, sustained",
    "Treatments tailored to your goals",
    "Medical-grade support",
  ],
  recovery: [
    "Accelerate recovery the right way",
    "Clinically-backed protocols",
    "Physician care included",
  ],
};

const DEFAULT_BULLETS = [
  "Physician reviews every assessment",
  "Treatments tailored to your goals",
  "Medication ships from licensed pharmacy",
];

export function StepRecommendation({ goal, productSlug }: StepRecommendationProps) {
  const treatment = getRecommendedTreatment(goal, productSlug);
  const bullets = (goal && GOAL_BULLETS[goal]) ?? DEFAULT_BULLETS;

  return (
    <div className="-mx-7 -mt-5 sm:-mx-8 sm:-mt-6">
      {/* Hero split panel */}
      <div className="relative overflow-hidden rounded-t-none rounded-b-2xl bg-gradient-to-br from-[#2A1F0A] via-[#3D2D0F] to-[#1A1208]">
        {/* Product image — float right */}
        <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-70">
          <img
            src={treatment.image}
            alt={treatment.name}
            className="h-full w-full object-cover object-center mix-blend-luminosity"
          />
          {/* Fade overlay from left */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#2A1F0A] to-transparent" />
        </div>

        <div className="relative z-10 px-7 py-9 sm:px-8 sm:py-10">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#F3C300]/80">
            Your match
          </p>
          <h2 className="text-[26px] font-bold leading-tight text-white sm:text-[30px]">
            You're in the<br />right hands
          </h2>
          <ul className="mt-5 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F3C300]/20">
                  <Check className="h-2.5 w-2.5 text-[#F3C300]" strokeWidth={3} />
                </span>
                <span className="text-[13px] leading-snug text-white/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Treatment card */}
      <div className="px-7 py-6 sm:px-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9890]">
          Recommended for you
        </p>
        <h3 className="text-[20px] font-semibold text-[#1A1816]">{treatment.name}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#7A766D]">{treatment.description}</p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-[11px] text-[#9C9890]">Starting at</span>
          <span className="text-[22px] font-bold text-[#1A1816]">${treatment.startingPrice}</span>
          <span className="text-[13px] text-[#9C9890]">/month</span>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-[#9C9890]">
          A physician must review and approve your assessment before any prescription is issued.
        </p>
      </div>
    </div>
  );
}
