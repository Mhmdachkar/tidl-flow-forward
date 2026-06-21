import { Check, Clock, Package, ShieldCheck, Stethoscope, Truck } from "lucide-react";

import { getProductBySlug, getRecommendedTreatment } from "@/lib/products";
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

const INCLUDED_ICONS = [Package, Stethoscope, Truck, ShieldCheck, Clock];

const NEXT_STEPS = [
  { step: "1", title: "Physician review", desc: "A licensed doctor reviews your assessment within 24–48 hours." },
  { step: "2", title: "Personalized plan", desc: "If approved, your treatment plan is tailored to your goals." },
  { step: "3", title: "Discreet delivery", desc: "Medication ships from a licensed pharmacy to your door." },
];

export function StepRecommendation({ goal, productSlug }: StepRecommendationProps) {
  const treatment = getRecommendedTreatment(goal, productSlug);
  const product = treatment.productSlug ? getProductBySlug(treatment.productSlug) : null;
  const bullets = (goal && GOAL_BULLETS[goal]) ?? DEFAULT_BULLETS;

  return (
    <div className="pb-2">
      {/* Inset hero card */}
      <div
        className="mx-auto w-[90%] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3D3220] via-[#4A3820] to-[#2A1F0A]"
        style={{ marginTop: "0.5cm" }}
      >
        <div className="relative flex min-h-[200px] items-stretch sm:min-h-[220px]">
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

      {/* ── Recommended plan sections ── */}
      <div className="mx-auto mt-7 w-[90%] space-y-5">

        {/* Section header + badges */}
        <div>
          <span className="inline-flex items-center rounded-full bg-[#FFF3CC] px-3 py-1 text-[11px] font-semibold text-[#8A6D00]">
            FSA &amp; HSA eligible
          </span>
          <h3 className="mt-3 font-display text-[22px] font-medium leading-tight text-[#1A1816] sm:text-[24px]">
            Your personalized plan
          </h3>
          <p className="mt-1.5 text-[13px] text-[#7A766D]">
            Based on your assessment, this is the treatment your physician will review first.
          </p>
        </div>

        {/* Product card */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E5DF] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-4 p-4 sm:p-5">
            {treatment.image && (
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-[#F7F5F1] p-2">
                <img src={treatment.image} alt="" className="h-full w-full object-contain" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {product?.tag && (
                  <span className="rounded-full bg-[#F7F5F1] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A766D]">
                    {product.tag}
                  </span>
                )}
                <span className="rounded-full border border-[#C9A200]/40 bg-[#FFF9E0] px-2.5 py-0.5 text-[10px] font-semibold text-[#8A6D00]">
                  Rx
                </span>
              </div>
              <h4 className="mt-1.5 text-[18px] font-semibold text-[#1A1816]">{treatment.name}</h4>
              {product?.tagline && (
                <p className="mt-0.5 text-[12px] font-medium text-[#C9A200]">{product.tagline}</p>
              )}
              <p className="mt-2 text-[13px] leading-relaxed text-[#7A766D]">{treatment.description}</p>
            </div>
          </div>

          {/* Price strip */}
          <div className="flex items-center justify-between border-t border-[#E8E5DF] bg-[#FAFAF8] px-4 py-3.5 sm:px-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9C9890]">
                {product?.priceNote ?? "If prescribed after physician review"}
              </p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-[26px] font-bold text-[#1A1816]">${treatment.startingPrice}</span>
                <span className="text-[13px] text-[#9C9890]">/month</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-[#7A766D]">Cancel anytime</p>
              <p className="text-[11px] text-[#9C9890]">No commitment</p>
            </div>
          </div>
        </div>

        {/* What's included */}
        {product?.included && product.included.length > 0 && (
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9890]">
              What's included
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {product.included.slice(0, 4).map((item, i) => {
                const Icon = INCLUDED_ICONS[i % INCLUDED_ICONS.length];
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-[#E8E5DF] bg-white px-3.5 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF9E0]">
                      <Icon className="h-4 w-4 text-[#C9A200]" />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A1816]">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#7A766D]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What to expect */}
        {product?.outcomes && (
          <div className="rounded-2xl bg-[#FAFAF8] p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9890]">
              What to expect
            </p>
            <p className="mt-1 text-[15px] font-semibold text-[#1A1816]">{product.outcomes.headline}</p>
            <ul className="mt-3 space-y-2.5">
              {product.outcomes.items.map((item) => (
                <li key={item.label} className="flex gap-3 border-b border-[#E8E5DF]/80 pb-2.5 last:border-0 last:pb-0">
                  <span className="w-[90px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9C9890]">
                    {item.label}
                  </span>
                  <span className="text-[12px] leading-snug text-[#1A1816]">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What happens next */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9890]">
            What happens next
          </p>
          <ol className="space-y-2">
            {NEXT_STEPS.map((s) => (
              <li
                key={s.step}
                className="flex items-start gap-3 rounded-xl border border-[#E8E5DF] bg-white px-3.5 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A1816] text-[11px] font-bold text-white">
                  {s.step}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1A1816]">{s.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#7A766D]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Physician notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[#E8E5DF] bg-white px-4 py-3.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A200]" />
          <p className="text-[12px] leading-relaxed text-[#7A766D]">
            <span className="font-semibold text-[#1A1816]">Physician review required.</span>{" "}
            A licensed physician must review and approve your assessment before any prescription is
            issued. Prescription is not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
