import { Check } from "lucide-react";

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
    <div className="pb-2">
      {/* Inset hero card — ~90% width, 0.5cm from top, rounded like Hims */}
      <div
        className="mx-auto w-[90%] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3D3220] via-[#4A3820] to-[#2A1F0A]"
        style={{ marginTop: "0.5cm" }}
      >
        <div className="relative flex min-h-[200px] items-stretch sm:min-h-[220px]">
          {/* Text — left */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-6 sm:px-6 sm:py-7">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F3C300]/90">
              Your match
            </p>
            <h2 className="text-[22px] font-bold leading-[1.15] text-white sm:text-[24px]">
              You're in the<br />right hands
            </h2>
            <ul className="mt-4 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#F3C300]/25">
                    <Check className="h-2 w-2 text-[#F3C300]" strokeWidth={3} />
                  </span>
                  <span className="text-[12px] leading-snug text-white/85">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product image — right, contained */}
          {treatment.image && (
            <div className="relative w-[38%] shrink-0 sm:w-[40%]">
              <img
                src={treatment.image}
                alt={treatment.name}
                className="absolute inset-0 h-full w-full object-contain object-right-bottom p-3 pb-0 pr-2 sm:p-4 sm:pr-3"
              />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#3D3220] to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Treatment details */}
      <div className="mx-auto mt-6 w-[90%] px-1">
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
