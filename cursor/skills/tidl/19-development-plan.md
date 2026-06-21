# 19-development-plan.md

# TIDL Development Plan & Ownership

---

# Purpose

This document defines who owns each part of the codebase.

No two developers should ever edit the same files at the same time.

If ownership is unclear, stop and agree before writing code.

---

# Team

## Ali

Homepage.
Animations.
GSAP.
Visual polish.
Mobile optimization.
Design system.
Figma direction.

---

## Ahmad

Quiz.
Checkout.
Account portal.
Product pages.
Forms.
Validation.
Route logic.

---

# Branch Strategy

```text
main
└── dev
    ├── feature/homepage-refactor   ← Ali
    ├── feature/quiz-flow           ← Ahmad
    ├── feature/product-pages       ← Ahmad
    └── feature/checkout            ← Ahmad
```

---

# Rules

* Never commit directly to main.
* Never commit directly to dev.
* Work on your feature branch only.
* Merge into dev when feature is complete and tested.
* main receives only tested, approved code from dev.

---

# Daily Workflow

```bash
# Start of day
git checkout dev
git pull

git checkout feature/your-branch
git merge dev   # pull in latest changes from teammates

# Work
git add .
git commit -m "clear description of what you did"
git push

# When feature is complete
git checkout dev
git pull
git merge feature/your-branch
git push
```

---

# Ownership Map

## Homepage

Owner: Ali

Files:

```
src/components/sections/HeroSection.tsx
src/components/sections/TrustSection.tsx
src/components/sections/PenSection.tsx
src/components/sections/HowItWorksSection.tsx
src/components/sections/TreatmentCategoriesSection.tsx
src/components/sections/DoctorSection.tsx
src/components/sections/PharmacySection.tsx
src/components/sections/ReviewsSection.tsx
src/components/sections/VideoEducationSection.tsx
src/components/sections/FAQSection.tsx
src/components/sections/FinalCtaSection.tsx
src/components/sections/FooterSection.tsx
src/routes/index.tsx
```

---

## Navigation

Owner: Ali

Files:

```
src/components/sections/NavSection.tsx
src/components/ui/MobileDrawer.tsx
```

---

## GSAP Animation System

Owner: Ali

Files:

```
src/lib/gsap.ts
src/lib/use-lenis.ts
src/lib/typewriter.ts
src/lib/SplitWords.tsx
src/animations/
```

---

## Design System & Shared UI

Owner: Ali

Files:

```
src/components/ui/
src/components/MagneticButton.tsx
src/components/PixelButton.tsx
src/index.css
tailwind.config.ts
```

---

## Quiz Flow

Owner: Ahmad

Files:

```
src/routes/quiz.tsx
src/components/quiz/
src/hooks/useQuiz.ts
```

---

## Checkout

Owner: Ahmad

Files:

```
src/routes/checkout.tsx
src/components/checkout/
src/hooks/useCheckout.ts
```

---

## Order Confirmation

Owner: Ahmad

Files:

```
src/routes/confirmation.tsx
src/components/confirmation/
```

---

## Account Portal

Owner: Ahmad

Files:

```
src/routes/account.tsx
src/routes/account/
src/components/account/
src/hooks/useAccount.ts
```

---

## Product Pages

Owner: Ahmad

Files:

```
src/routes/products/
src/components/product/
```

---

## Shared Types

Both:

```
src/types/
```

Agreement required before editing.

---

## Shared Hooks

Both:

```
src/hooks/
```

Agreement required before editing.

---

# Sprint Plan

## Sprint 1 — Ali

Homepage overhaul.

Deliverables:

* Remove phone app section.
* Remove 90-day timeline.
* Remove metrics dashboard.
* Replace marquee with trust strip.
* Refine HumanSections (remove biomarker chips, add telehealth copy).
* Keep and improve RedMan bento grid (fix dashboard copy).
* Keep VoxelSection as-is.
* Move PenSection higher in page order.
* Add HowItWorks section (6-step care journey).
* Add Doctor Network section.
* Add Pharmacy Network section.
* Add Reviews section.
* Add FAQ section.
* Add mobile navigation (hamburger + drawer).
* Fix all CTAs to "Start Assessment".
* Refactor index.tsx to ≤80 lines.
* Split all sections into src/components/sections/.

Estimated: 2–3 days.

Branch: feature/homepage-refactor

---

## Sprint 2 — Ahmad

Quiz flow.

Deliverables:

* 8-step assessment flow.
* Progress bar (persistent).
* Save progress / resume later.
* Mobile-first layout.
* Doctor review messaging throughout.
* Large tap targets (48px minimum).
* No dead ends.

Branch: feature/quiz-flow

---

## Sprint 3 — Ahmad

Checkout.

Deliverables:

* Order summary.
* Consultation + treatment pricing.
* Shipping.
* HSA/FSA payment support.
* HIPAA notice.
* Physician review notice.
* No countdown timers. No urgency banners.
* Confirmation screen with care timeline.

Branch: feature/checkout

---

## Sprint 4 — Ahmad

Product Detail Pages (PDPs).

Deliverables:

* Hero (outcome + floating pen).
* Trust bar.
* Benefits.
* How it works (5-step).
* Safety section.
* Reviews.
* FAQ.
* Final CTA: "Start Assessment".

Routes:

* /products/lirosome
* /products/tirosane
* /products/tidl-core
* /products/tidl-cycle

Branch: feature/product-pages

---

## Sprint 5 — Ahmad

Account Portal.

Deliverables:

* Dashboard: current status card.
* Orders: tracking, status timeline.
* Reorder: one-click refill flow.
* Support escalation.
* Physician review status.

Branch: feature/account

---

# Integration Rules

1. Feature branch → dev (via merge, after review).
2. dev → main (after full integration test, both developers confirm).
3. Never skip dev.
4. Merge conflicts: resolve together, do not guess.

---

# File Conflict Prevention

If you are about to edit a file not in your ownership section:

STOP.

Message the other developer first.

Agree who makes the change.

One person makes it.

---

# Shared Components (Read-Only for Both Unless Agreed)

```
src/lib/gsap.ts           ← Ali owns, Ahmad can import
src/components/ui/        ← Ali owns, Ahmad can use
src/types/                ← Either, by agreement
```

---

# Communication Protocol

Daily:

* Tell your teammate what you committed.
* Tell your teammate if you changed a shared file.

Before merging to dev:

* Confirm with your teammate.
* Run the build locally first.

Before merging to main:

* Both developers agree.
* Full build passes.
* Mobile tested.

---

# Definition of Done

A feature is done when:

* It builds without errors.
* It works on mobile (375px).
* It works on desktop (1440px).
* No TypeScript errors.
* Animations work correctly.
* All CTAs say "Start Assessment" or the correct contextual label.
* No app references.
* No 90-day plan references.
* No fake dashboard data.

---

# Launch Readiness Checklist

Homepage:           □  (Ali — Sprint 1)
Trust section:      □  (Ali — Sprint 1)
How It Works:       □  (Ali — Sprint 1)
Doctor section:     □  (Ali — Sprint 1)
Pharmacy section:   □  (Ali — Sprint 1)
Reviews:            □  (Ali — Sprint 1)
FAQ:                □  (Ali — Sprint 1)
Mobile nav:         □  (Ali — Sprint 1)
Quiz:               □  (Ahmad — Sprint 2)
Checkout:           □  (Ahmad — Sprint 3)
Confirmation:       □  (Ahmad — Sprint 3)
Product pages:      □  (Ahmad — Sprint 4)
Account portal:     □  (Ahmad — Sprint 5)
Legal pages:        □  (Ahmad — Sprint 5)
SEO meta:           □  (Both)
Performance audit:  □  (Both)
Mobile audit:       □  (Both)

---

# Notes

The quiz is the highest conversion priority.

The homepage must be finished first because it drives the quiz.

Without the homepage in correct state, advertising cannot begin.

Without the quiz, nothing converts.

The sequence matters:

Homepage → Quiz → Checkout → Product Pages → Account.
