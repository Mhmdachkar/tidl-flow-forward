import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ShieldCheck, X } from "lucide-react";

import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { QUIZ_TOTAL_STEPS } from "@/types/quiz";
import heroImage from "@/assets/hero image 3d.png";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";

const HERO_BULLETS = [
  "Reviewed by licensed physicians",
  "Personalized to your biology",
  "Delivered discreetly to your door",
];

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

  // Step 1 (goal selection) auto-advances on click — no continue button
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
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[3px]"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Card wrapper — centers card, absorbs clicks outside */}
      <div
        className="fixed inset-0 z-[91] flex items-center justify-center p-4 sm:p-6"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label="Health assessment"
      >
        {/* Animated card */}
        <div
          style={{
            transition:
              "opacity 0.35s cubic-bezier(0.34,1.2,0.64,1), transform 0.35s cubic-bezier(0.34,1.2,0.64,1)",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.94) translateY(24px)",
            maxHeight: "90svh",
          }}
          className={`relative flex w-full overflow-hidden rounded-[32px] bg-[#F7F5F1] shadow-[0_40px_100px_rgba(0,0,0,0.5)] lg:h-[640px] ${
            isRecommendation ? "max-w-[640px]" : "max-w-[980px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Left hero panel (desktop only, hidden on recommendation) ── */}
          {!isRecommendation && (
            <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2A1F0A] via-[#3D2D0F] to-[#171008] p-9 lg:flex">
              {/* Top: brand */}
              <div className="relative z-10">
                <img src={tidlLogoYellow} alt="TIDL" className="h-7 w-auto" />
                <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-[#F3C300]/80">
                  Medical assessment
                </p>
                <h2 className="mt-3 text-[28px] font-bold leading-[1.15] text-white">
                  Care designed<br />around you
                </h2>
                <p className="mt-3 max-w-[260px] text-[13px] leading-relaxed text-white/65">
                  A few quick questions help our physicians build the right plan for your goals.
                </p>

                <ul className="mt-7 space-y-3">
                  {HERO_BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F3C300]/20">
                        <Check className="h-2.5 w-2.5 text-[#F3C300]" strokeWidth={3} />
                      </span>
                      <span className="text-[13px] leading-snug text-white/85">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom: product image + trust line */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[12px] text-white/55">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#F3C300]/80" />
                  <span>Secure, private &amp; HIPAA-conscious</span>
                </div>
              </div>

              {/* Floating product image */}
              <img
                src={heroImage}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -right-10 z-0 w-[78%] max-w-none opacity-90 drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
              />
            </aside>
          )}

          {/* ── Right content panel ── */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Gold progress bar */}
            <div className="h-1 w-full shrink-0 bg-[#E8E5DF]">
              <div
                className="h-full bg-gradient-to-r from-[#C9A200] to-[#F3C300] transition-all duration-500 ease-out"
                style={{ width: `${quiz.progress}%` }}
              />
            </div>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-7 pt-5 pb-1 sm:px-9">
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

            {/* Scrollable content — vertically centered so no empty bottom gap */}
            <div
              className={`flex flex-1 flex-col overflow-y-auto px-7 py-6 sm:px-10 sm:py-8 ${
                isRecommendation ? "justify-start" : "justify-center"
              }`}
              style={{ scrollbarWidth: "none" } as React.CSSProperties}
            >
              <QuizFlow quiz={quiz} onAutoAdvance={() => quiz.goNext()} />
            </div>

            {/* Continue button */}
            {needsButton && (
              <div className="shrink-0 px-7 pb-5 pt-2 sm:px-10">
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
      </div>
    </>,
    document.body,
  );
}
