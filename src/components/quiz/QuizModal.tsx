import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";

import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { validateQuizStep } from "@/lib/quiz-schema";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { QUIZ_TOTAL_STEPS } from "@/types/quiz";

export function QuizModal() {
  const { isOpen, options, closeModal } = useQuizModal();
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const quiz = useQuiz({
    initialProduct: options.product,
    initialGoal: options.goal,
    noNavigation: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll + pause Lenis while open
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      lockPageScroll();
      return () => unlockPageScroll();
    }
  }, [isOpen, mounted]);

  // Keep wheel/touch scroll inside the quiz pane (don't let Lenis/page steal it)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOpen) return;

    const stopBubble = (event: Event) => {
      event.stopPropagation();
    };

    el.addEventListener("wheel", stopBubble, { passive: true });
    el.addEventListener("touchmove", stopBubble, { passive: true });

    return () => {
      el.removeEventListener("wheel", stopBubble);
      el.removeEventListener("touchmove", stopBubble);
    };
  }, [isOpen, quiz.currentStep]);

  // Reset scroll position when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [quiz.currentStep]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      quiz.resetQuiz();
    }
    wasOpen.current = isOpen;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isRecommendation = quiz.currentStep === QUIZ_TOTAL_STEPS;

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

      {/* Wrapper: sheet flush to bottom */}
      <div
        className="fixed inset-0 z-[91] flex items-end justify-center"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label="Health assessment"
      >
        {/* Sheet: fixed height so the middle row is always scrollable */}
        <div
          style={{
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            transform: isOpen ? "translateY(0)" : "translateY(100%)",
            height: "min(92dvh, 92svh)",
          }}
          className={`grid w-full grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden rounded-t-[36px] bg-[#F7F5F1] shadow-[0_-12px_60px_rgba(0,0,0,0.4)] ${
            isRecommendation ? "sm:max-w-[760px]" : "sm:max-w-[720px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress */}
          <div className="h-1 w-full bg-[#E8E5DF]">
            <div
              className="h-full bg-gradient-to-r from-[#C9A200] to-[#F3C300] transition-all duration-500 ease-out"
              style={{ width: `${quiz.progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 sm:px-8">
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

          {/* Scrollable quiz body: grid row 3, minmax(0,1fr) forces overflow */}
          <div
            ref={contentRef}
            className="no-scrollbar min-h-0 overflow-y-auto overscroll-y-contain px-6 pt-4 pb-6 sm:px-10"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {isRecommendation ? (
              <QuizFlow quiz={quiz} />
            ) : (
              <div className="mx-auto w-full max-w-[480px]">
                <QuizFlow quiz={quiz} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#E8E5DF]/80 bg-[#F7F5F1]">
            {isRecommendation && (
              <div className="px-6 pt-4 sm:px-9">
                <button
                  type="button"
                  onClick={handleGetPlan}
                  className="h-14 w-full rounded-2xl bg-[#1A1816] text-[15px] font-semibold text-white transition-opacity hover:opacity-80 active:scale-[0.98]"
                >
                  Get my plan →
                </button>
              </div>
            )}
            <p className="py-4 text-center text-[11px] text-[#9C9890]">
              Secure &amp; private · Physician reviewed
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
