import type { ProductStep } from "@/types/product";

export const CARE_JOURNEY_STEPS: ProductStep[] = [
  {
    step: 1,
    title: "Take assessment",
    description: "Complete a secure medical intake so a licensed physician can review your health history.",
  },
  {
    step: 2,
    title: "Doctor review",
    description: "A licensed physician evaluates your assessment and determines whether treatment is appropriate.",
  },
  {
    step: 3,
    title: "Prescription",
    description: "If approved, your prescription is written and sent to a licensed pharmacy partner.",
  },
  {
    step: 4,
    title: "Pharmacy ships",
    description: "Your medication ships discreetly to your door with clear instructions for use.",
  },
  {
    step: 5,
    title: "Ongoing care",
    description: "Your care team supports refills, dosage adjustments, and follow-up as needed.",
  },
];
