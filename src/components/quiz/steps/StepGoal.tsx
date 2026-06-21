import { QuizOptionCard } from "@/components/quiz/QuizOptionCard";
import { QuizStepIntro } from "@/components/quiz/QuizField";
import { GOAL_OPTIONS, type GoalId } from "@/types/quiz";

interface StepGoalProps {
  value: GoalId | null;
  error?: string;
  onChange: (goal: GoalId) => void;
}

export function StepGoal({ value, error, onChange }: StepGoalProps) {
  return (
    <section>
      <QuizStepIntro
        title="What are you looking to improve?"
        description="Choose the area that best matches your goals. A licensed physician will review your eligibility."
      />
      <div className="grid gap-3">
        {GOAL_OPTIONS.map((option) => (
          <QuizOptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={value === option.id}
            onClick={() => onChange(option.id)}
          />
        ))}
      </div>
      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
    </section>
  );
}
