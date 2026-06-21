import { QuizField, QuizStepIntro } from "@/components/quiz/QuizField";
import { QuizSegmentedControl } from "@/components/quiz/QuizSegmentedControl";
import { Input } from "@/components/ui/input";
import { SEX_OPTIONS, type Sex } from "@/types/quiz";

interface StepAboutYouProps {
  age: number | null;
  sex: Sex | null;
  heightFeet: number | null;
  heightInches: number | null;
  weightLbs: number | null;
  errors: Record<string, string>;
  onChange: (values: {
    age?: number | null;
    sex?: Sex | null;
    heightFeet?: number | null;
    heightInches?: number | null;
    weightLbs?: number | null;
  }) => void;
}

function parseNumber(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function StepAboutYou({
  age,
  sex,
  heightFeet,
  heightInches,
  weightLbs,
  errors,
  onChange,
}: StepAboutYouProps) {
  return (
    <section>
      <QuizStepIntro
        title="Tell us about yourself"
        description="This helps your physician review eligibility. You must be 18 or older to continue."
      />

      <div className="space-y-6">
        <QuizField label="Age" error={errors.age}>
          <Input
            type="number"
            inputMode="numeric"
            min={18}
            max={120}
            value={age ?? ""}
            onChange={(event) => onChange({ age: parseNumber(event.target.value) })}
            className="h-14 rounded-2xl px-4 text-base"
            placeholder="Enter your age"
          />
        </QuizField>

        <QuizField label="Sex assigned at birth" error={errors.sex}>
          <QuizSegmentedControl value={sex} options={SEX_OPTIONS} onChange={(value) => onChange({ sex: value })} />
        </QuizField>

        <QuizField label="Height" error={errors.heightFeet || errors.heightInches}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="numeric"
              min={3}
              max={8}
              value={heightFeet ?? ""}
              onChange={(event) => onChange({ heightFeet: parseNumber(event.target.value) })}
              className="h-14 rounded-2xl px-4 text-base"
              placeholder="Feet"
              aria-label="Height in feet"
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={11}
              value={heightInches ?? ""}
              onChange={(event) => onChange({ heightInches: parseNumber(event.target.value) })}
              className="h-14 rounded-2xl px-4 text-base"
              placeholder="Inches"
              aria-label="Height in inches"
            />
          </div>
        </QuizField>

        <QuizField label="Weight (lbs)" error={errors.weightLbs}>
          <Input
            type="number"
            inputMode="decimal"
            min={50}
            max={700}
            value={weightLbs ?? ""}
            onChange={(event) => onChange({ weightLbs: parseNumber(event.target.value) })}
            className="h-14 rounded-2xl px-4 text-base"
            placeholder="Enter your weight"
          />
        </QuizField>
      </div>
    </section>
  );
}
