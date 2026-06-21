import { QuizField, QuizStepIntro, QuizYesNo } from "@/components/quiz/QuizField";

interface StepTreatmentHistoryProps {
  usedGlp1Before: boolean | null;
  previousWeightLossMeds: boolean | null;
  errors: Record<string, string>;
  onChange: (values: {
    usedGlp1Before?: boolean | null;
    previousWeightLossMeds?: boolean | null;
  }) => void;
}

export function StepTreatmentHistory({
  usedGlp1Before,
  previousWeightLossMeds,
  errors,
  onChange,
}: StepTreatmentHistoryProps) {
  return (
    <section>
      <QuizStepIntro
        title="Treatment history"
        description="Tell us about any previous treatments so your physician can make an informed decision."
      />

      <div className="space-y-8">
        <QuizField label="Have you used GLP-1 medications before?" error={errors.usedGlp1Before}>
          <QuizYesNo
            value={usedGlp1Before}
            onChange={(value) => onChange({ usedGlp1Before: value })}
          />
        </QuizField>

        <QuizField
          label="Have you tried other prescription weight loss medications?"
          error={errors.previousWeightLossMeds}
        >
          <QuizYesNo
            value={previousWeightLossMeds}
            onChange={(value) => onChange({ previousWeightLossMeds: value })}
          />
        </QuizField>
      </div>
    </section>
  );
}
