import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QUIZ_STEP_LABELS, QUIZ_TOTAL_STEPS } from "@/types/quiz";

interface QuizLayoutProps {
  currentStep: number;
  progress: number;
  children: ReactNode;
  onBack?: () => void;
  canGoBack?: boolean;
  footer?: ReactNode;
}

export function QuizLayout({
  currentStep,
  progress,
  children,
  onBack,
  canGoBack = false,
  footer,
}: QuizLayoutProps) {
  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {canGoBack && onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-surface-2"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-sm font-medium transition-colors hover:bg-surface-2"
                aria-label="Back to home"
              >
                T
              </Link>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Medical assessment
              </p>
              <p className="font-display text-lg font-medium">
                Step {currentStep} of {QUIZ_TOTAL_STEPS}
              </p>
            </div>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {QUIZ_STEP_LABELS[currentStep]}
          </p>
        </div>
        <QuizProgress value={progress} />
        <div className="hairline" />
      </header>

      {/* Scrollable content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </main>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-clinical" />
            <span>A physician reviews every assessment. Secure and private.</span>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
