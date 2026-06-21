import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";

import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { QUIZ_TOTAL_STEPS } from "@/types/quiz";

export function QuizModal() {
  const { isOpen, options, closeModal } = useQuizModal();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const quiz = useQuiz({
    initialProduct: options.product,
    initialGoal: options.goal,
    noNavigation: true,
  });

  // Mount guard for portal (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  // Reset quiz to step 1 whenever modal opens fresh
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      quiz.resetQuiz();
    }
    wasOpen.current = isOpen;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isRecommendation = quiz.currentStep === QUIZ_TOTAL_STEPS;

  const handleContinue = () => {
    if (isRecommendation) {
      const success = quiz.completeAndCheckout();
      if (success) {
        closeModal();
        void navigate({ to: "/checkout" });
      }
      return;
    }
    quiz.goNext();
  };

  // Auto-advance steps that don't need a button (handled in QuizFlow via callback)
  const AUTO_ADVANCE_STEPS = new Set([1]);
  const needsButton = !AUTO_ADVANCE_STEPS.has(quiz.currentStep);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          transition: "opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-[3px]"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Card wrapper — centers card, absorbs clicks outside */}
      <div
        className="fixed inset-0 z-[91] flex items-center justify-center p-4"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label="Health assessment"
      >
        {/* Animated card */}
        <div
          style={{
            transition: "opacity 0.35s cubic-bezier(0.34,1.2,0.64,1), transform 0.35s cubic-bezier(0.34,1.2,0.64,1)",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.92) translateY(24px)",
            maxHeight: "92svh",
          }}
          className={`relative flex w-full flex-col overflow-hidden rounded-[28px] bg-[#F7F5F1] shadow-[0_32px_80px_rgba(0,0,0,0.45)] ${
            isRecommendation ? "max-w-[560px]" : "max-w-[460px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gold progress bar */}
          <div className="h-1 w-full shrink-0 bg-[#E8E5DF]">
            <div
              className="h-full bg-gradient-to-r from-[#C9A200] to-[#F3C300] transition-all duration-500 ease-out"
              style={{ width: `${quiz.progress}%` }}
            />
          </div>

          {/* Card header */}
          <div className="flex shrink-0 items-center justify-between px-6 pt-5 pb-1">
            {quiz.canGoBack ? (
              <button
                type="button"
                onClick={quiz.goBack}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6760] transition-colors hover:bg-[#EDEBE7] hover:text-[#1A1816]"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="h-8 w-8" />
            )}

            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9C9890]">
              {quiz.currentStep} / {QUIZ_TOTAL_STEPS}
            </span>

            <button
              type="button"
              onClick={closeModal}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDEBE7] text-[#6B6760] transition-colors hover:bg-[#E0DDD6] hover:text-[#1A1816]"
              aria-label="Close assessment"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto px-7 pb-4 pt-5 sm:px-8 sm:pt-6"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            <QuizFlow quiz={quiz} onAutoAdvance={() => quiz.goNext()} />
          </div>

          {/* Continue button — only for form/multi-select steps */}
          {needsButton && (
            <div className="shrink-0 px-7 pb-7 pt-3 sm:px-8 sm:pb-8">
              <button
                type="button"
                onClick={handleContinue}
                className="h-14 w-full rounded-2xl bg-[#1A1816] text-[15px] font-semibold text-white transition-opacity hover:opacity-80 active:scale-[0.98]"
              >
                {isRecommendation ? "Get my plan →" : "Continue"}
              </button>
            </div>
          )}

          {/* Security line */}
          <p className="shrink-0 pb-5 text-center text-[11px] text-[#9C9890]">
            Secure &amp; private · Physician reviewed
          </p>
        </div>
      </div>
    </>,
    document.body,
  );
}
