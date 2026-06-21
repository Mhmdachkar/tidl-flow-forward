import { z } from "zod";

import type { QuizFormData } from "@/types/quiz";

const goalSchema = z.object({
  goal: z.enum(
    ["weight-loss", "longevity", "metabolic-health", "hormonal-health", "performance", "recovery"],
    { required_error: "Please select a goal before continuing." },
  ),
});

const aboutYouSchema = z.object({
  age: z
    .number({ required_error: "Please enter your age." })
    .int("Age must be a whole number.")
    .min(18, "You must be 18 or older to continue.")
    .max(120, "Please enter a valid age."),
  sex: z.enum(["female", "male", "other"], {
    required_error: "Please select an option.",
  }),
  heightFeet: z
    .number({ required_error: "Please enter your height." })
    .int()
    .min(3, "Please enter a valid height.")
    .max(8, "Please enter a valid height."),
  heightInches: z
    .number({ required_error: "Please enter your height." })
    .int()
    .min(0, "Inches must be between 0 and 11.")
    .max(11, "Inches must be between 0 and 11."),
  weightLbs: z
    .number({ required_error: "Please enter your weight." })
    .min(50, "Please enter a valid weight.")
    .max(700, "Please enter a valid weight."),
});

const healthHistorySchema = z
  .object({
    healthConditions: z
      .array(
        z.enum(["diabetes", "heart", "hypertension", "thyroid", "kidney", "none"]),
      )
      .min(1, "Please select at least one option."),
    takingMedications: z.boolean({
      required_error: "Please select an option.",
      invalid_type_error: "Please select an option.",
    }),
    hasAllergies: z.boolean({
      required_error: "Please select an option.",
      invalid_type_error: "Please select an option.",
    }),
  })
  .superRefine((value, ctx) => {
    const hasNone = value.healthConditions.includes("none");
    const hasOther = value.healthConditions.some((item) => item !== "none");

    if (hasNone && hasOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select "None of the above" or specific conditions, not both.',
        path: ["healthConditions"],
      });
    }
  });

const lifestyleSchema = z.object({
  exercise: z.enum(["rarely", "1-2", "3-4", "5+"], {
    required_error: "Please select an option.",
  }),
  sleep: z.enum(["poor", "fair", "good", "excellent"], {
    required_error: "Please select an option.",
  }),
  eatingHabits: z.enum(["balanced", "inconsistent", "high-processed", "special-diet"], {
    required_error: "Please select an option.",
  }),
});

const treatmentHistorySchema = z.object({
  usedGlp1Before: z.boolean({
    required_error: "Please select an option.",
    invalid_type_error: "Please select an option.",
  }),
  previousWeightLossMeds: z.boolean({
    required_error: "Please select an option.",
    invalid_type_error: "Please select an option.",
  }),
});

const physicianNoticeSchema = z.object({
  physicianNoticeAcknowledged: z.literal(true, {
    errorMap: () => ({ message: "Please acknowledge before continuing." }),
  }),
});

const accountSchema = z.object({
  email: z.string().min(1, "Please enter your email.").email("Please enter a valid email."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number.")
    .regex(/^[\d\s()+-]+$/, "Please enter a valid phone number."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export type StepValidationResult =
  | { success: true }
  | { success: false; errors: Record<string, string> };

function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function validateQuizStep(step: number, data: QuizFormData): StepValidationResult {
  let result: z.SafeParseReturnType<unknown, unknown>;

  switch (step) {
    case 1:
      result = goalSchema.safeParse({ goal: data.goal });
      break;
    case 2:
      result = aboutYouSchema.safeParse({
        age: data.age,
        sex: data.sex,
        heightFeet: data.heightFeet,
        heightInches: data.heightInches,
        weightLbs: data.weightLbs,
      });
      break;
    case 3:
      result = healthHistorySchema.safeParse({
        healthConditions: data.healthConditions,
        takingMedications: data.takingMedications,
        hasAllergies: data.hasAllergies,
      });
      break;
    case 4:
      result = lifestyleSchema.safeParse({
        exercise: data.exercise,
        sleep: data.sleep,
        eatingHabits: data.eatingHabits,
      });
      break;
    case 5:
      result = treatmentHistorySchema.safeParse({
        usedGlp1Before: data.usedGlp1Before,
        previousWeightLossMeds: data.previousWeightLossMeds,
      });
      break;
    case 6:
      result = physicianNoticeSchema.safeParse({
        physicianNoticeAcknowledged: data.physicianNoticeAcknowledged,
      });
      break;
    case 7:
      result = accountSchema.safeParse({
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      break;
    case 8:
      return { success: true };
    default:
      return { success: false, errors: { form: "Invalid step." } };
  }

  if (result.success) {
    return { success: true };
  }

  return { success: false, errors: formatZodErrors(result.error) };
}

export const quizSchemas = {
  goal: goalSchema,
  aboutYou: aboutYouSchema,
  healthHistory: healthHistorySchema,
  lifestyle: lifestyleSchema,
  treatmentHistory: treatmentHistorySchema,
  physicianNotice: physicianNoticeSchema,
  account: accountSchema,
};
