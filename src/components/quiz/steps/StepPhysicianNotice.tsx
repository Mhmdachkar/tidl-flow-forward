import { Shield, Stethoscope, UserCheck } from "lucide-react";

import { QuizStepIntro } from "@/components/quiz/QuizField";
import { cn } from "@/lib/utils";

interface StepPhysicianNoticeProps {
  acknowledged: boolean;
  error?: string;
  onChange: (acknowledged: boolean) => void;
}

const TRUST_POINTS = [
  {
    icon: Stethoscope,
    title: "Licensed physician review",
    description: "Every assessment is reviewed by a licensed medical provider.",
  },
  {
    icon: Shield,
    title: "Prescription required",
    description: "Treatment is prescribed only when medically appropriate.",
  },
  {
    icon: UserCheck,
    title: "Eligibility varies",
    description: "Your doctor determines whether treatment is right for you.",
  },
];

export function StepPhysicianNotice({ acknowledged, error, onChange }: StepPhysicianNoticeProps) {
  return (
    <section>
      <QuizStepIntro
        title="Reviewed by licensed physicians"
        description="Treatment eligibility is determined by your doctor — not by an automated system."
      />

      <div className="space-y-4">
        {TRUST_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2">
              <point.icon className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange(!acknowledged)}
        className={cn(
          "mt-8 flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-all",
          acknowledged
            ? "border-foreground bg-surface shadow-sm"
            : "border-border bg-surface/70 hover:border-foreground/30",
        )}
        aria-pressed={acknowledged}
      >
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
            acknowledged ? "border-foreground bg-foreground text-background" : "border-border",
          )}
        >
          {acknowledged ? "✓" : ""}
        </span>
        <span className="text-sm leading-relaxed text-foreground">
          I understand that a licensed physician will review my information and determine treatment
          eligibility.
        </span>
      </button>

      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
    </section>
  );
}
