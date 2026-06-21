import { CheckCircle2 } from "lucide-react";

import { QuizStepIntro } from "@/components/quiz/QuizField";
import { getRecommendedTreatment } from "@/lib/products";
import type { GoalId, QuizFormData } from "@/types/quiz";

interface StepRecommendationProps {
  goal: GoalId | null;
  productSlug: QuizFormData["productSlug"];
}

export function StepRecommendation({ goal, productSlug }: StepRecommendationProps) {
  const treatment = getRecommendedTreatment(goal, productSlug);

  return (
    <section>
      <QuizStepIntro
        title="Your recommended treatment"
        description="Based on your assessment, this is the treatment your physician will review first."
      />

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Physician review required
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-foreground sm:text-3xl">
          {treatment.name}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {treatment.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Starting at</p>
            <p className="font-display text-3xl font-medium text-foreground">
              ${treatment.startingPrice}
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {[
          "A licensed physician will review your assessment.",
          "Prescription is required and not guaranteed.",
          "Medication ships from a licensed pharmacy if approved.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
