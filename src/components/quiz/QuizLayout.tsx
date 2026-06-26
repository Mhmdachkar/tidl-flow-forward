import { Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import type { ReactNode } from "react";

import { QUIZ_TOTAL_STEPS } from "@/types/quiz";

interface QuizLayoutProps {
  currentStep: number;
  progress: number;
  children: ReactNode;
  onBack?: () => void;
  canGoBack?: boolean;
  footer?: ReactNode;
  wide?: boolean;
}

export function QuizLayout({
  currentStep,
  progress,
  children,
  onBack,
  canGoBack = false,
  footer,
  wide = false,
}: QuizLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#0F0E0C] px-4 py-8 sm:py-10">
      {/* Card */}
      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-[28px] bg-[#F7F5F1] shadow-[0_32px_80px_rgba(0,0,0,0.5)] ${
          wide ? "max-w-2xl" : "max-w-[480px]"
        }`}
      >
        {/* Progress bar at very top */}
        <div className="h-1 w-full bg-[#E8E5DF]">
          <div
            className="h-full bg-gradient-to-r from-[#b85c00] to-[#e07b0a] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Card header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div className="flex items-center gap-2">
            {canGoBack && onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6760] transition-colors hover:bg-[#EDEBE7] hover:text-[#1A1816]"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>

          {/* Step counter */}
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9C9890]">
            {currentStep} / {QUIZ_TOTAL_STEPS}
          </span>

          {/* Close */}
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDEBE7] text-[#6B6760] transition-colors hover:bg-[#E0DDD6] hover:text-[#1A1816]"
            aria-label="Close and return home"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 pb-4 pt-5 sm:px-8 sm:pt-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-7 pb-7 pt-3 sm:px-8 sm:pb-8">
            {footer}
          </div>
        )}

        {/* Security line */}
        <p className="pb-5 text-center text-[11px] text-[#9C9890]">
          Secure & private · Physician reviewed
        </p>
      </div>
    </div>
  );
}
