import { QuizField, QuizStepIntro } from "@/components/quiz/QuizField";
import { QuizSegmentedControl } from "@/components/quiz/QuizSegmentedControl";
import {
  EATING_OPTIONS,
  EXERCISE_OPTIONS,
  SLEEP_OPTIONS,
  type EatingHabits,
  type ExerciseLevel,
  type SleepQuality,
} from "@/types/quiz";

interface StepLifestyleProps {
  exercise: ExerciseLevel | null;
  sleep: SleepQuality | null;
  eatingHabits: EatingHabits | null;
  errors: Record<string, string>;
  onChange: (values: {
    exercise?: ExerciseLevel | null;
    sleep?: SleepQuality | null;
    eatingHabits?: EatingHabits | null;
  }) => void;
}

export function StepLifestyle({ exercise, sleep, eatingHabits, errors, onChange }: StepLifestyleProps) {
  return (
    <section>
      <QuizStepIntro
        title="Your lifestyle"
        description="These answers help your physician understand your daily context."
      />

      <div className="space-y-8">
        <QuizField label="How often do you exercise?" error={errors.exercise}>
          <QuizSegmentedControl
            value={exercise}
            options={EXERCISE_OPTIONS}
            onChange={(value) => onChange({ exercise: value })}
          />
        </QuizField>

        <QuizField label="How would you describe your sleep?" error={errors.sleep}>
          <QuizSegmentedControl
            value={sleep}
            options={SLEEP_OPTIONS}
            columns={4}
            onChange={(value) => onChange({ sleep: value })}
          />
        </QuizField>

        <QuizField label="How would you describe your eating habits?" error={errors.eatingHabits}>
          <QuizSegmentedControl
            value={eatingHabits}
            options={EATING_OPTIONS}
            onChange={(value) => onChange({ eatingHabits: value })}
          />
        </QuizField>
      </div>
    </section>
  );
}
