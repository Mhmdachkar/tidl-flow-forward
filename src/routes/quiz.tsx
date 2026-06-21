import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { QuizFlow } from "@/components/quiz/QuizFlow";
import { QuizLayout } from "@/components/quiz/QuizLayout";
import { useQuiz } from "@/hooks/use-quiz";
import { GOAL_OPTIONS, type GoalId } from "@/types/quiz";

const goalIds = GOAL_OPTIONS.map((option) => option.id) as [GoalId, ...GoalId[]];

const quizSearchSchema = z.object({
  step: z.coerce.number().int().min(1).max(8).optional(),
  product: z.string().optional(),
  goal: z.enum(goalIds).optional(),
});

export const Route = createFileRoute("/quiz")({
  validateSearch: (search) => quizSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Start Assessment — TIDL" },
      {
        name: "description",
        content:
          "Complete your medical assessment. A licensed physician will review your information and determine treatment eligibility.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { step, product, goal } = Route.useSearch();
  const quiz = useQuiz({
    initialStep: step,
    initialProduct: product,
    initialGoal: goal,
  });

  const isFinalStep = quiz.currentStep === quiz.totalSteps;
  const primaryLabel = isFinalStep ? "Continue to Checkout" : "Continue";

  const handleContinue = () => {
    if (isFinalStep) {
      quiz.completeAndCheckout();
      return;
    }
    quiz.goNext();
  };

  return (
    <QuizLayout
      currentStep={quiz.currentStep}
      progress={quiz.progress}
      canGoBack={quiz.canGoBack}
      onBack={quiz.goBack}
      footer={
        <button type="button" onClick={handleContinue} className="btn-primary h-14 w-full justify-center text-base">
          {primaryLabel}
        </button>
      }
    >
      <QuizFlow quiz={quiz} />
    </QuizLayout>
  );
}
