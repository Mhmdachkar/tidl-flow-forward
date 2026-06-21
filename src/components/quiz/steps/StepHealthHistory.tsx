import { QuizField, QuizStepIntro, QuizYesNo } from "@/components/quiz/QuizField";
import { QuizOptionCard } from "@/components/quiz/QuizOptionCard";
import { HEALTH_CONDITION_OPTIONS, type HealthConditionId } from "@/types/quiz";

interface StepHealthHistoryProps {
  healthConditions: HealthConditionId[];
  takingMedications: boolean | null;
  hasAllergies: boolean | null;
  errors: Record<string, string>;
  onChange: (values: {
    healthConditions?: HealthConditionId[];
    takingMedications?: boolean | null;
    hasAllergies?: boolean | null;
  }) => void;
}

export function StepHealthHistory({
  healthConditions,
  takingMedications,
  hasAllergies,
  errors,
  onChange,
}: StepHealthHistoryProps) {
  const toggleCondition = (id: HealthConditionId) => {
    if (id === "none") {
      onChange({ healthConditions: healthConditions.includes("none") ? [] : ["none"] });
      return;
    }

    const withoutNone = healthConditions.filter((item) => item !== "none");
    const next = withoutNone.includes(id)
      ? withoutNone.filter((item) => item !== id)
      : [...withoutNone, id];

    onChange({ healthConditions: next });
  };

  return (
    <section>
      <QuizStepIntro
        title="Your health history"
        description="Answer a few simple questions so your physician can review your case safely."
      />

      <div className="space-y-8">
        <QuizField
          label="Do any of these apply to you?"
          hint="Select all that apply."
          error={errors.healthConditions}
        >
          <div className="grid gap-3">
            {HEALTH_CONDITION_OPTIONS.map((option) => (
              <QuizOptionCard
                key={option.id}
                label={option.label}
                selected={healthConditions.includes(option.id)}
                onClick={() => toggleCondition(option.id)}
              />
            ))}
          </div>
        </QuizField>

        <QuizField label="Are you currently taking any medications?" error={errors.takingMedications}>
          <QuizYesNo
            value={takingMedications}
            onChange={(value) => onChange({ takingMedications: value })}
          />
        </QuizField>

        <QuizField label="Do you have any medication allergies?" error={errors.hasAllergies}>
          <QuizYesNo value={hasAllergies} onChange={(value) => onChange({ hasAllergies: value })} />
        </QuizField>
      </div>
    </section>
  );
}
