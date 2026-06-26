import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface QuizFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function QuizField({ label, hint, error, children, className }: QuizFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#7A766D]">{label}</p>
        {hint ? <p className="mt-1 text-[13px] text-[#7A766D]">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-[13px] font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

interface QuizStepIntroProps {
  title: string;
  description: string;
}

export function QuizStepIntro({ title, description }: QuizStepIntroProps) {
  return (
    <div className="mb-7 space-y-2.5 text-center">
      <h1 className="text-[22px] font-semibold leading-snug tracking-tight text-[#1A1816] sm:text-[24px]">
        {title}
      </h1>
      <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-[#7A766D]">
        {description}
      </p>
    </div>
  );
}

interface QuizYesNoProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  error?: string;
}

export function QuizYesNo({ value, onChange, error }: QuizYesNoProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: true, label: "Yes" },
          { id: false, label: "No" },
        ].map((option) => (
          <button
            key={String(option.id)}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-[56px] rounded-2xl border px-4 py-3 text-[15px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85c00]/40",
              value === option.id
                ? "border-[#1A1816] bg-[#1A1816] text-white shadow-sm"
                : "border-[#DDD9D1] bg-white text-[#1A1816] hover:border-[#BFBBAF] hover:shadow-sm",
            )}
            aria-pressed={value === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error ? <p className="text-[13px] font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
