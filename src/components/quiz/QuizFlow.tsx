import { AnimatePresence, motion } from "framer-motion";
import type { UseQuizReturn } from "@/hooks/use-quiz";

import { StepAboutYou } from "@/components/quiz/steps/StepAboutYou";
import { StepAccount } from "@/components/quiz/steps/StepAccount";
import { StepGoal } from "@/components/quiz/steps/StepGoal";
import { StepHealthHistory } from "@/components/quiz/steps/StepHealthHistory";
import { StepLifestyle } from "@/components/quiz/steps/StepLifestyle";
import { StepPhysicianNotice } from "@/components/quiz/steps/StepPhysicianNotice";
import { StepRecommendation } from "@/components/quiz/steps/StepRecommendation";
import { StepTreatmentHistory } from "@/components/quiz/steps/StepTreatmentHistory";

interface QuizFlowProps {
  quiz: UseQuizReturn;
}

export function QuizFlow({ quiz }: QuizFlowProps) {
  const { currentStep, data, errors, updateData } = quiz;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {currentStep === 1 ? (
          <StepGoal
            value={data.goal}
            error={errors.goal}
            onChange={(goal) => updateData({ goal, productSlug: null })}
          />
        ) : null}

        {currentStep === 2 ? (
          <StepAboutYou
            age={data.age}
            sex={data.sex}
            heightFeet={data.heightFeet}
            heightInches={data.heightInches}
            weightLbs={data.weightLbs}
            errors={errors}
            onChange={updateData}
          />
        ) : null}

        {currentStep === 3 ? (
          <StepHealthHistory
            healthConditions={data.healthConditions}
            takingMedications={data.takingMedications}
            hasAllergies={data.hasAllergies}
            errors={errors}
            onChange={updateData}
          />
        ) : null}

        {currentStep === 4 ? (
          <StepLifestyle
            exercise={data.exercise}
            sleep={data.sleep}
            eatingHabits={data.eatingHabits}
            errors={errors}
            onChange={updateData}
          />
        ) : null}

        {currentStep === 5 ? (
          <StepTreatmentHistory
            usedGlp1Before={data.usedGlp1Before}
            previousWeightLossMeds={data.previousWeightLossMeds}
            errors={errors}
            onChange={updateData}
          />
        ) : null}

        {currentStep === 6 ? (
          <StepPhysicianNotice
            acknowledged={data.physicianNoticeAcknowledged}
            error={errors.physicianNoticeAcknowledged}
            onChange={(physicianNoticeAcknowledged) => updateData({ physicianNoticeAcknowledged })}
          />
        ) : null}

        {currentStep === 7 ? (
          <StepAccount
            email={data.email}
            phone={data.phone}
            password={data.password}
            errors={errors}
            onChange={updateData}
          />
        ) : null}

        {currentStep === 8 ? (
          <StepRecommendation goal={data.goal} productSlug={data.productSlug} />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
