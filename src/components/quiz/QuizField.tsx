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
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

interface QuizStepIntroProps {
  title: string;
  description: string;
}

export function QuizStepIntro({ title, description }: QuizStepIntroProps) {
  return (
    <div className="mb-8 space-y-3">
      <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
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
              "min-h-[56px] rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
              value === option.id
                ? "border-foreground bg-surface text-foreground shadow-sm"
                : "border-border bg-surface/70 text-muted-foreground hover:border-foreground/30 hover:bg-surface hover:text-foreground",
            )}
            aria-pressed={value === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
