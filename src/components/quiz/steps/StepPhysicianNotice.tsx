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
        description="Treatment eligibility is determined by your doctor, not by an automated system."
      />

      <div className="space-y-3">
        {TRUST_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex gap-4 rounded-2xl border border-[#DDD9D1] bg-white px-5 py-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDEBE7]">
              <point.icon className="h-4.5 w-4.5 text-[#1A1816]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1A1816]">{point.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-[#7A766D]">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange(!acknowledged)}
        className={cn(
          "mt-6 flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-150",
          acknowledged
            ? "border-[#1A1816] bg-white shadow-sm"
            : "border-[#DDD9D1] bg-white hover:border-[#BFBBAF]",
        )}
        aria-pressed={acknowledged}
      >
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[12px]",
            acknowledged ? "border-[#1A1816] bg-[#1A1816] text-white" : "border-[#BFBBAF]",
          )}
        >
          {acknowledged ? "✓" : ""}
        </span>
        <span className="text-[13px] leading-relaxed text-[#1A1816]">
          I understand that a licensed physician will review my information and determine treatment
          eligibility.
        </span>
      </button>

      {error ? <p className="mt-3 text-[13px] font-medium text-red-500">{error}</p> : null}
    </section>
  );
}
