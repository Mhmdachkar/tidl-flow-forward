import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { validateQuizStep } from "@/lib/quiz-schema";
import { clearQuizState, loadQuizState, saveQuizState } from "@/lib/quiz-storage";
import { getProductBySlug } from "@/lib/products";
import {
  QUIZ_TOTAL_STEPS,
  createDefaultQuizData,
  type GoalId,
  type QuizFormData,
} from "@/types/quiz";
import type { ProductSlug } from "@/types/product";

interface UseQuizOptions {
  initialStep?: number;
  initialProduct?: string;
  initialGoal?: GoalId;
}

function hasInProgressQuiz(stored: ReturnType<typeof loadQuizState>) {
  if (!stored) return false;
  return stored.currentStep > 1 || stored.data.goal !== null;
}

export function useQuiz({ initialStep, initialProduct, initialGoal }: UseQuizOptions = {}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<QuizFormData>(() => createDefaultQuizData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadQuizState();
    const resumeStep = initialStep ?? stored?.currentStep ?? 1;

    if (stored) {
      setData(stored.data);
    } else {
      const defaults = createDefaultQuizData();
      const product = initialProduct ? getProductBySlug(initialProduct) : null;

      if (product) {
        defaults.productSlug = product.slug;
        defaults.goal = product.goalId;
      } else if (initialGoal) {
        defaults.goal = initialGoal;
      }

      setData(defaults);
    }

    if (stored && !hasInProgressQuiz(stored)) {
      const product = initialProduct ? getProductBySlug(initialProduct) : null;
      if (product) {
        setData((prev) => ({
          ...prev,
          productSlug: product.slug as ProductSlug,
          goal: product.goalId,
        }));
      } else if (initialGoal) {
        setData((prev) => ({ ...prev, goal: initialGoal }));
      }
    }

    setCurrentStep(resumeStep);
    setHydrated(true);
  }, [initialStep, initialProduct, initialGoal]);

  useEffect(() => {
    if (!hydrated) return;
    saveQuizState(currentStep, data);
  }, [currentStep, data, hydrated]);

  const progress = useMemo(
    () => Math.round((currentStep / QUIZ_TOTAL_STEPS) * 100),
    [currentStep],
  );

  const updateData = useCallback((partial: Partial<QuizFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setErrors({});
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      const nextStep = Math.min(Math.max(step, 1), QUIZ_TOTAL_STEPS);
      setCurrentStep(nextStep);
      setErrors({});
      void navigate({
        to: "/quiz",
        search: nextStep > 1 ? { step: nextStep } : {},
        replace: true,
      });
    },
    [navigate],
  );

  const goBack = useCallback(() => {
    if (currentStep <= 1) return;
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const goNext = useCallback(() => {
    const result = validateQuizStep(currentStep, data);
    if (!result.success) {
      setErrors(result.errors);
      return false;
    }

    setErrors({});
    if (currentStep >= QUIZ_TOTAL_STEPS) {
      return true;
    }

    goToStep(currentStep + 1);
    return true;
  }, [currentStep, data, goToStep]);

  const completeAndCheckout = useCallback(() => {
    const result = validateQuizStep(currentStep, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    saveQuizState(QUIZ_TOTAL_STEPS, data);
    void navigate({ to: "/checkout" });
  }, [currentStep, data, navigate]);

  const resetQuiz = useCallback(() => {
    clearQuizState();
    setData(createDefaultQuizData());
    setErrors({});
    goToStep(1);
  }, [goToStep]);

  return {
    currentStep,
    data,
    errors,
    progress,
    hydrated,
    totalSteps: QUIZ_TOTAL_STEPS,
    updateData,
    goBack,
    goNext,
    goToStep,
    completeAndCheckout,
    resetQuiz,
    canGoBack: currentStep > 1,
  };
}

export type UseQuizReturn = ReturnType<typeof useQuiz>;
