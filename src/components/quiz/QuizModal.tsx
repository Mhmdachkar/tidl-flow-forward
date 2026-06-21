import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";

import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { validateQuizStep } from "@/lib/quiz-schema";
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

  // ── Automatic advance: every step moves forward on its own once valid ──
  // Steps with typed input get a longer pause so the user can finish typing.
  const TEXT_INPUT_STEPS = new Set([2, 7]);
  useEffect(() => {
    if (!isOpen || isRecommendation) return;
    const result = validateQuizStep(quiz.currentStep, quiz.data);
    if (!result.success) return;
    const delay = TEXT_INPUT_STEPS.has(quiz.currentStep) ? 700 : 340;
    const t = setTimeout(() => quiz.goNext(), delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isRecommendation, quiz.currentStep, quiz.data]);

  const handleGetPlan = () => {
    const success = quiz.completeAndCheckout();
    if (success) {
      closeModal();
      void navigate({ to: "/checkout" });
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          transition: "opacity 0.35s ease",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[3px]"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Wrapper — anchors the sheet to the bottom edge, centered horizontally */}
      <div
        className="fixed inset-0 z-[91] flex items-end justify-center"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label="Health assessment"
      >
        {/* Sheet — rises up from the bottom, flush with the device edge */}
        <div
          style={{
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            transform: isOpen ? "translateY(0)" : "translateY(100%)",
            maxHeight: "92svh",
          }}
          className={`relative flex w-full flex-col overflow-hidden rounded-t-[36px] bg-[#F7F5F1] shadow-[0_-12px_60px_rgba(0,0,0,0.4)] ${
            isRecommendation ? "sm:max-w-[760px]" : "sm:max-w-[720px]"
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

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-6 pt-5 pb-1 sm:px-8">
            {quiz.canGoBack ? (
              <button
                type="button"
                onClick={quiz.goBack}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B6760] transition-colors hover:bg-[#EDEBE7] hover:text-[#1A1816]"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="h-9 w-9" />
            )}

            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9C9890]">
              {quiz.currentStep} / {QUIZ_TOTAL_STEPS}
            </span>

            <button
              type="button"
              onClick={closeModal}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDEBE7] text-[#6B6760] transition-colors hover:bg-[#E0DDD6] hover:text-[#1A1816]"
              aria-label="Close assessment"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content — scrollable with no visible scrollbar.
              Questions sit at a comfortable reading width inside the wider sheet so it
              reads as a balanced square; the recommendation uses the full width. */}
          <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-7 sm:px-10">
            {isRecommendation ? (
              <QuizFlow quiz={quiz} />
            ) : (
              <div className="mx-auto w-full max-w-[480px]">
                <QuizFlow quiz={quiz} />
              </div>
            )}
          </div>

          {/* Final step keeps a single conversion CTA */}
          {isRecommendation && (
            <div className="shrink-0 px-6 pb-4 pt-3 sm:px-9">
              <button
                type="button"
                onClick={handleGetPlan}
                className="h-14 w-full rounded-2xl bg-[#1A1816] text-[15px] font-semibold text-white transition-opacity hover:opacity-80 active:scale-[0.98]"
              >
                Get my plan →
              </button>
            </div>
          )}

          {/* Security line */}
          <p className="shrink-0 pb-5 pt-3 text-center text-[11px] text-[#9C9890]">
            Secure &amp; private · Physician reviewed
          </p>
        </div>
      </div>
    </>,
    document.body,
  );
}
