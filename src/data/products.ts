import product1 from "@/assets/product 1 3d.png";
import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";

import { CARE_JOURNEY_STEPS } from "@/data/shared-care-steps";
import type { Product, ProductSlug } from "@/types/product";

const SHARED_REVIEWS = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    quote:
      "The process felt clinical and thoughtful, not like ordering something online. My physician reviewed everything before anything shipped.",
    rating: 5,
  },
  {
    name: "James R.",
    location: "Denver, CO",
    quote:
      "Pre-dosed pens made it straightforward. I appreciated knowing a doctor was involved at every step.",
    rating: 5,
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "lirosome",
    displayName: "Lirosiome",
    tag: "Metabolic",
    categoryIds: ["weight-loss", "metabolic"],
    goalId: "weight-loss",
    tagline: "GLP-1 weight protocol",
    outcomeHeadline: "Lose weight with physician-guided GLP-1 care.",
    heroCopy:
      "Pre-dosed injection pens. No mixing. No measuring. Doctor reviewed. Delivered to your door.",
    startingPrice: 249,
    priceNote: "Starting at, if prescribed after physician review",
    image: product1,
    showPenHero: true,
    metaDescription:
      "Physician-guided GLP-1 weight management with pre-dosed injection pens. Start your assessment to see if you qualify.",
    outcomes: {
      headline: "Designed for meaningful weight loss.",
      items: [
        { label: "Typical timeline", value: "Results vary; many patients notice changes within the first few months" },
        { label: "Care model", value: "Physician-reviewed, pharmacy-fulfilled treatment" },
        { label: "Delivery", value: "Pre-dosed pens shipped to your door if prescribed" },
      ],
      disclaimer:
        "Individual results vary. Prescription required. Not all patients qualify. A licensed physician determines eligibility.",
    },
    howItWorks: CARE_JOURNEY_STEPS,
    included: [
      { title: "Medication", description: "Physician-prescribed GLP-1 treatment if approved" },
      { title: "Pre-dosed pen", description: "No mixing or measuring required" },
      { title: "Instructions", description: "Clear guidance for safe use" },
      { title: "Physician review", description: "Licensed doctor evaluates your assessment" },
      { title: "Ongoing support", description: "Care team available for refills and follow-up" },
    ],
    safety: {
      headline: "Important safety information",
      items: [
        "GLP-1 medications are prescription-only and not appropriate for everyone.",
        "Common side effects may include nausea, vomiting, and digestive discomfort.",
        "Tell your physician about all medications and health conditions.",
        "Do not use if pregnant, planning pregnancy, or breastfeeding without physician guidance.",
      ],
      disclaimer:
        "This information is not medical advice. A licensed physician will review your full history before prescribing.",
    },
    faqs: [
      {
        question: "Do I need a prescription?",
        answer:
          "Yes. Lirosiome is a prescription treatment. A licensed physician reviews your assessment and determines whether it is appropriate for you.",
      },
      {
        question: "How is this different from buying online?",
        answer:
          "TIDL is a telehealth platform. You complete a medical assessment, a physician reviews it, and medication ships from a licensed pharmacy only if prescribed.",
      },
      {
        question: "What if I don't qualify?",
        answer:
          "If a physician determines treatment is not appropriate, you will not be charged for medication. Your assessment helps identify the right path for your care.",
      },
      {
        question: "Is HSA/FSA eligible?",
        answer:
          "Many prescription treatments may be eligible. Check with your benefits provider for your specific plan.",
      },
    ],
    reviews: SHARED_REVIEWS,
  },
  {
    slug: "tirosane",
    displayName: "Tirosane",
    tag: "Longevity",
    categoryIds: ["longevity"],
    goalId: "longevity",
    tagline: "Cellular renewal",
    outcomeHeadline: "Support healthy aging with physician-guided longevity care.",
    heroCopy:
      "Cellular-focused protocols reviewed by licensed physicians. Delivered with the precision you expect from premium care.",
    startingPrice: 329,
    priceNote: "Starting at, if prescribed after physician review",
    image: product4,
    showPenHero: true,
    metaDescription:
      "Physician-reviewed longevity care focused on healthy aging and cellular health. Start your assessment today.",
    outcomes: {
      headline: "Built for prevention-focused longevity.",
      items: [
        { label: "Focus", value: "Healthy aging, cellular health, and metabolic support" },
        { label: "Care model", value: "Physician-reviewed protocols tailored to your goals" },
        { label: "Delivery", value: "Discreet shipping from licensed pharmacy partners" },
      ],
      disclaimer:
        "Outcomes vary by individual. Prescription required where applicable. A licensed physician determines appropriate care.",
    },
    howItWorks: CARE_JOURNEY_STEPS,
    included: [
      { title: "Treatment protocol", description: "Physician-reviewed longevity care if approved" },
      { title: "Delivery device", description: "Pre-dosed format where applicable" },
      { title: "Instructions", description: "Clear protocol guidance" },
      { title: "Physician review", description: "Licensed doctor evaluates your assessment" },
      { title: "Ongoing support", description: "Follow-up and refill coordination" },
    ],
    safety: {
      headline: "Important safety information",
      items: [
        "Longevity protocols require physician evaluation before treatment.",
        "Share your full medication list and health history during assessment.",
        "Not all protocols are appropriate for every patient.",
        "Follow your physician's guidance and report any adverse effects promptly.",
      ],
      disclaimer:
        "This information is not medical advice. Treatment decisions are made by your licensed physician.",
    },
    faqs: [
      {
        question: "What is Tirosane?",
        answer:
          "Tirosane is TIDL's longevity-focused care protocol, reviewed by licensed physicians and tailored to healthy aging goals.",
      },
      {
        question: "How do I get started?",
        answer:
          "Complete the medical assessment. A physician reviews your information and recommends appropriate care if you qualify.",
      },
      {
        question: "Is this a supplement?",
        answer:
          "No. TIDL provides physician-guided prescription care, not over-the-counter supplements.",
      },
    ],
    reviews: SHARED_REVIEWS,
  },
  {
    slug: "tidl-core",
    displayName: "TIDL Core",
    tag: "Daily",
    categoryIds: ["longevity", "recovery"],
    goalId: "recovery",
    tagline: "Foundational longevity",
    outcomeHeadline: "Daily foundational support for resilience and recovery.",
    heroCopy:
      "Physician-reviewed daily care designed to support foundational health, recovery, and long-term wellness.",
    startingPrice: 48,
    priceNote: "Starting at, if prescribed after physician review",
    image: product2,
    lightProduct: true,
    showPenHero: false,
    metaDescription:
      "Foundational daily longevity and recovery support with physician-guided care. Start your assessment.",
    outcomes: {
      headline: "Designed for everyday foundational care.",
      items: [
        { label: "Focus", value: "Recovery, resilience, and daily wellness support" },
        { label: "Format", value: "Simple daily protocol if prescribed" },
        { label: "Care model", value: "Physician-reviewed, not self-directed" },
      ],
      disclaimer:
        "Individual results vary. Prescription required where applicable. Eligibility determined by a licensed physician.",
    },
    howItWorks: CARE_JOURNEY_STEPS,
    included: [
      { title: "Daily protocol", description: "Physician-reviewed foundational care if approved" },
      { title: "Instructions", description: "Clear daily guidance" },
      { title: "Physician review", description: "Licensed doctor evaluates your assessment" },
      { title: "Pharmacy fulfillment", description: "Shipped from licensed partners" },
      { title: "Ongoing support", description: "Refill and follow-up coordination" },
    ],
    safety: {
      headline: "Important safety information",
      items: [
        "Share all medications and supplements with your physician during assessment.",
        "Not intended to replace emergency or acute medical care.",
        "Follow prescribed dosing instructions exactly.",
      ],
      disclaimer:
        "This information is not medical advice. Your physician determines whether TIDL Core is appropriate for you.",
    },
    faqs: [
      {
        question: "Is TIDL Core a daily supplement?",
        answer:
          "No. TIDL Core is a physician-guided care protocol, not an over-the-counter supplement.",
      },
      {
        question: "Who is this for?",
        answer:
          "Patients seeking foundational daily support for recovery and wellness, as determined appropriate by a licensed physician.",
      },
    ],
    reviews: SHARED_REVIEWS,
  },
  {
    slug: "tidl-cycle",
    displayName: "TIDL Cycle",
    tag: "Hormonal",
    categoryIds: ["hormonal"],
    goalId: "hormonal-health",
    tagline: "Female hormonal balance",
    outcomeHeadline: "Personalized hormonal care reviewed by licensed physicians.",
    heroCopy:
      "Physician-guided hormonal balance protocols designed for women. Assessment-first care with pharmacy fulfillment.",
    startingPrice: 58,
    priceNote: "Starting at, if prescribed after physician review",
    image: product3,
    showPenHero: false,
    metaDescription:
      "Physician-guided female hormonal balance care. Complete your assessment to see if you qualify.",
    outcomes: {
      headline: "Designed for hormonal balance and wellness.",
      items: [
        { label: "Focus", value: "Female hormonal health and balance" },
        { label: "Care model", value: "Personalized physician review" },
        { label: "Delivery", value: "Discreet pharmacy shipping if prescribed" },
      ],
      disclaimer:
        "Individual results vary. Prescription required. Eligibility determined by a licensed physician.",
    },
    howItWorks: CARE_JOURNEY_STEPS,
    included: [
      { title: "Treatment protocol", description: "Physician-reviewed hormonal care if approved" },
      { title: "Instructions", description: "Clear protocol guidance" },
      { title: "Physician review", description: "Licensed doctor evaluates your assessment" },
      { title: "Pharmacy fulfillment", description: "Shipped from licensed partners" },
      { title: "Ongoing support", description: "Follow-up and refill coordination" },
    ],
    safety: {
      headline: "Important safety information",
      items: [
        "Hormonal treatments require thorough physician evaluation.",
        "Share pregnancy status, medications, and full health history during assessment.",
        "Not all patients are candidates for hormonal therapy.",
        "Report any adverse effects to your care team promptly.",
      ],
      disclaimer:
        "This information is not medical advice. Treatment decisions are made by your licensed physician.",
    },
    faqs: [
      {
        question: "Is TIDL Cycle only for women?",
        answer:
          "TIDL Cycle is designed for female hormonal health. Your physician will confirm whether it is appropriate for your situation.",
      },
      {
        question: "How does the assessment work?",
        answer:
          "You complete a secure medical intake. A licensed physician reviews your history and determines eligibility before any prescription is written.",
      },
    ],
    reviews: SHARED_REVIEWS,
  },
];

export const PRODUCT_BY_SLUG: Record<ProductSlug, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
) as Record<ProductSlug, Product>;

export function getProductListItems() {
  return PRODUCTS.map(({ slug, displayName, tag, tagline, startingPrice, image, lightProduct }) => ({
    slug,
    displayName,
    tag,
    tagline,
    startingPrice,
    image,
    lightProduct,
  }));
}
