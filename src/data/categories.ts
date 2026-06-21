import type { Category, CategoryId } from "@/types/product";

export const CATEGORIES: Category[] = [
  {
    slug: "weight-loss",
    title: "Weight Loss",
    heroHeadline: "Physician-guided GLP-1 weight management.",
    heroCopy:
      "Lose weight with prescription care reviewed by licensed physicians — not off-the-shelf products. Pre-dosed pens, pharmacy fulfillment, ongoing support.",
    focusAreas: ["GLP-1 protocols", "Metabolic support", "Physician oversight", "Pharmacy delivery"],
    featuredProductSlugs: ["lirosome"],
    defaultGoalId: "weight-loss",
    educationHeadline: "What is GLP-1 care?",
    educationCopy:
      "GLP-1 medications are prescription treatments that support weight management under physician supervision. TIDL connects you with licensed physicians who review your health history, determine eligibility, and coordinate pharmacy fulfillment if appropriate.",
    showPenSection: true,
    metaDescription:
      "Physician-guided GLP-1 weight loss care with pre-dosed injection pens. Start your assessment to see if you qualify.",
    faqs: [
      {
        question: "Do I need a prescription for GLP-1 treatment?",
        answer:
          "Yes. All GLP-1 treatments on TIDL require a prescription after physician review of your medical assessment.",
      },
      {
        question: "How quickly can I start?",
        answer:
          "After completing your assessment, a physician typically reviews your information within 24–48 hours. Pharmacy fulfillment follows if you are approved.",
      },
      {
        question: "What makes TIDL different?",
        answer:
          "TIDL is telehealth — not ecommerce. Pre-dosed pens, licensed physicians, and pharmacy partners are built into every step.",
      },
    ],
  },
  {
    slug: "longevity",
    title: "Longevity",
    heroHeadline: "Healthy aging with physician-guided care.",
    heroCopy:
      "Prevention-focused protocols for cellular health, metabolic support, and long-term wellness — reviewed by licensed physicians.",
    focusAreas: ["Healthy aging", "Cellular health", "Prevention", "Metabolic support"],
    featuredProductSlugs: ["tirosane", "tidl-core"],
    defaultGoalId: "longevity",
    showPenSection: false,
    metaDescription:
      "Longevity and healthy aging care reviewed by licensed physicians. Explore TIDL protocols and start your assessment.",
    faqs: [
      {
        question: "Is longevity care the same as anti-aging supplements?",
        answer:
          "No. TIDL provides physician-reviewed prescription care — not over-the-counter supplements or unregulated products.",
      },
      {
        question: "Which product is right for me?",
        answer:
          "Complete the assessment and a licensed physician will recommend the most appropriate protocol based on your goals and health history.",
      },
    ],
  },
  {
    slug: "metabolic",
    title: "Metabolic Care",
    heroHeadline: "Support metabolism with clinical oversight.",
    heroCopy:
      "Metabolic health protocols reviewed by licensed physicians — from GLP-1 weight management to targeted metabolic support.",
    focusAreas: ["Metabolism", "Insulin support", "Energy", "Weight management"],
    featuredProductSlugs: ["lirosome"],
    defaultGoalId: "metabolic-health",
    educationHeadline: "Metabolic care at TIDL",
    educationCopy:
      "Metabolic health affects energy, weight, and long-term wellness. TIDL connects you with physicians who evaluate your history and recommend appropriate prescription protocols when clinically indicated.",
    showPenSection: true,
    metaDescription:
      "Physician-guided metabolic care including GLP-1 protocols. Start your assessment today.",
    faqs: [
      {
        question: "What conditions does metabolic care address?",
        answer:
          "Metabolic protocols may support weight management, energy, and insulin-related goals. Your physician determines what is appropriate for your situation.",
      },
    ],
  },
  {
    slug: "hormonal",
    title: "Hormonal Balance",
    heroHeadline: "Personalized hormonal care for women.",
    heroCopy:
      "Physician-reviewed hormonal balance protocols designed with clinical rigor — assessment first, prescription only if appropriate.",
    focusAreas: ["Hormone balance", "Female health", "Personalized protocols", "Ongoing care"],
    featuredProductSlugs: ["tidl-cycle"],
    defaultGoalId: "hormonal-health",
    showPenSection: false,
    metaDescription:
      "Physician-guided female hormonal balance care. Complete your assessment to see if you qualify.",
    faqs: [
      {
        question: "How is hormonal care personalized?",
        answer:
          "Your physician reviews your full health history, symptoms, and goals during assessment before recommending any protocol.",
      },
    ],
  },
  {
    slug: "performance",
    title: "Performance",
    heroHeadline: "Optimize recovery and physical performance.",
    heroCopy:
      "Physician-supervised care for patients focused on recovery, resilience, and physical optimization — not unregulated enhancers.",
    focusAreas: ["Recovery", "Physical optimization", "Resilience", "Physician oversight"],
    featuredProductSlugs: ["tidl-core"],
    defaultGoalId: "performance",
    showPenSection: false,
    metaDescription:
      "Physician-guided performance and recovery care. Start your assessment with TIDL.",
    faqs: [
      {
        question: "Is this for athletes only?",
        answer:
          "Performance care is for anyone seeking physician-guided support for recovery and optimization, as determined appropriate by your doctor.",
      },
    ],
  },
  {
    slug: "recovery",
    title: "Recovery",
    heroHeadline: "Build resilience with foundational daily care.",
    heroCopy:
      "Recovery-focused protocols reviewed by licensed physicians — designed to support resilience, healing, and everyday wellness.",
    focusAreas: ["Recovery science", "Resilience", "Daily support", "Physician review"],
    featuredProductSlugs: ["tidl-core"],
    defaultGoalId: "recovery",
    showPenSection: false,
    metaDescription:
      "Physician-guided recovery and resilience care. Explore TIDL protocols and start your assessment.",
    faqs: [
      {
        question: "How is recovery care different from rest?",
        answer:
          "TIDL recovery protocols are physician-reviewed care plans that may include prescription support when clinically appropriate — not generic wellness products.",
      },
    ],
  },
];

export const CATEGORY_BY_SLUG: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategoryId, Category>;
