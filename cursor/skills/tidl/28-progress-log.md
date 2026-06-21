# 28-progress-log.md

# TIDL Development Progress Log

---

# Purpose

This document records everything that has been built, fixed, and documented
across all branches to date.

It is the single source of truth for work that is done versus work that is
still pending.

---

# Owner

| Task area                | Owner |
| ------------------------ | ----- |
| Homepage / animations    | Ali   |
| Quiz / checkout / account | Ahmad |

---

# Branch

All homepage work lives on:

```
feature/homepage-refactor
```

---

# Completed Work

---

## Phase 0 — Codebase Stabilisation

### Git strategy and ownership document

Created `19-development-plan.md`.

Defines:

- Branch strategy (`main → dev → feature/*`)
- Team ownership (Ali = homepage, Ahmad = quiz/checkout/account)
- Daily workflow
- Conflict prevention rules

---

### Ahmad's missing modules resolved

Ahmad pushed code to `feature/homepage-refactor` that referenced files
only present on his own feature branches.

Files cherry-picked from Ahmad's branches onto `feature/homepage-refactor`:

- `src/providers/auth-provider.tsx` + auth types and lib
- `src/data/products.ts` + product types and lib
- `src/types/quiz.ts` + quiz schema and storage
- `src/lib/order-storage.ts`, `src/lib/pricing.ts`
- All quiz components (`src/components/quiz/*`)
- All account components (`src/components/account/*`)
- All checkout components (`src/components/checkout/*`)
- All product components (`src/components/product/*`, `src/components/category/*`)
- All route files (`/quiz`, `/login`, `/signup`, `/account/*`,
  `/products/$slug`, `/checkout`, `/confirmation`,
  `/weight-loss`, `/longevity`, `/hormonal`, `/performance`,
  `/metabolic`, `/recovery`)
- `routeTree.gen.ts` regenerated with all routes

Result: zero TypeScript errors, clean `vite build`.

---

### AuthProvider added to app root

`src/routes/__root.tsx` updated to wrap `<Outlet />` with `<AuthProvider>`.

Fixed the blank page caused by `useAuth must be used within AuthProvider`
runtime crash.

---

## Phase 1 — Homepage Demolition

### P0 sections removed from `src/routes/index.tsx`

| Section removed            | Reason                          |
| -------------------------- | ------------------------------- |
| `PhoneSection`             | TIDL has no app                 |
| `ProtocolTimelineSection`  | No 90-day program               |
| `ScienceMetricsSection`    | Dashboard-feel violates brand   |

---

### `src/routes/index.tsx` rewritten

Before: ~2 700 lines, monolithic.

After: ~85 lines, orchestration only.

All sections imported from `src/components/sections/`.

---

### `src/lib/SplitWords.tsx` created

Extracted GSAP word-by-word animation helper from the old `index.tsx`.

---

## Phase 2 — Section Extraction and Scaffold

The following sections were extracted from the old `index.tsx` into
dedicated component files.

---

### Extracted (real components)

| File | Source |
| ---- | ------ |
| `NavSection.tsx` | Extracted: nav, auth state, mobile drawer, scroll styling |
| `HeroSection.tsx` | Extracted: hero copy, product image, animations |
| `VoxelSection.tsx` | Extracted: cinematic video + ScrollTrigger pin |
| `HumanSection.tsx` | Extracted: lifestyle storytelling, chip data |
| `RedManSection.tsx` | Extracted: bento-grid care heroes and categories |
| `TreatmentCategoriesSection.tsx` | Extracted: product card grid |
| `PenSection.tsx` | Extracted: animated 3D pen + typewriter |
| `CtaSection.tsx` | Extracted: CTA with animated buttons |
| `FooterSection.tsx` | Extracted: footer with wordmark |

---

### New (real implementation, not extracted)

| File | Description |
| ---- | ----------- |
| `TrustSection.tsx` | New horizontal trust strip — replaces the old Marquee. Content: "Physician reviewed", "Licensed providers", "Secure checkout", "HIPAA compliant", "Nationwide cold shipping", "HSA / FSA accepted". CSS marquee animation. |

---

### New stubs (built out in Phase 3)

| File | Status at stub stage |
| ---- | -------------------- |
| `HowItWorksSection.tsx` | `return null` placeholder |
| `DoctorSection.tsx` | `return null` placeholder |
| `PharmacySection.tsx` | `return null` placeholder |
| `ReviewsSection.tsx` | `return null` placeholder |
| `FAQSection.tsx` | `return null` placeholder |

---

## Phase 3 — New Section Builds

---

### HowItWorksSection

File: `src/components/sections/HowItWorksSection.tsx`

Design: Full-viewport pinned step-by-step viewer.

Visual:

- Background `#F3C300` (brand gold) with dark clinical grid overlay
- GSAP-driven SVG shapes that **draw themselves** per step
  via `stroke-dashoffset` animation
- A continuous **progress ring** that fills 0 → 100% as you scroll
- 5 step position dots on the ring
- Step content (label + large display headline + body) cross-fades
  on scroll scrub
- Counter `01 / 05` updates with each step

GSAP technique:

- `gsap.context()` for clean cleanup
- `ScrollTrigger.create({ pin: true, end: "+=500%" })`
- Single scrubbed timeline (`scrub: 1.6`) driving all transitions
- `path.getTotalLength()` used to set `strokeDasharray`/`strokeDashoffset`
  for per-step SVG drawing
- Separate scrubbed `fromTo` for ring fill and bottom progress bar

Steps shown:

1. Take the Assessment
2. Doctor Review
3. Receive Prescription
4. Pharmacy Fulfillment
5. Delivered to Your Door

---

### DoctorSection

File: `src/components/sections/DoctorSection.tsx`

Design: Editorial trust section on cream background.

Visual:

- `#f8f7f3` cream background with bg-grid + gold glow parallax
- Three glass credential cards (border + white/80 backdrop-blur)
  with gold shimmer on hover
- Three trust metrics strip
- `font-display` editorial heading

GSAP technique:

- `gsap.context()` for cleanup
- ScrollTrigger entrance timeline (eyebrow → heading → body → CTA → cards stagger → metrics stagger)
- Cards enter with `rotateX: -8` → `0` (depth feel)
- Parallax on glow (`scrub: 1.3`) and grid container (`scrub: 1.1`)

Content:

- Licensed physicians across active states
- Board-certified telehealth providers
- Human escalation for medical questions
- Metrics: 24h review window, 100% human prescription, 50+ clinical checks
- CTA: "Start your assessment" → `/quiz`

---

### Pending Section Stubs

| Section | Status |
| ------- | ------ |
| `PharmacySection` | Stub — next to build |
| `ReviewsSection` | Stub — pending |
| `FAQSection` | Stub — pending |

---

## Phase 4 — Documentation Gaps Filled

### `20-docx-missing-specs.md` created

Catalogues 7 features present in `TIDL.com Overview_08JUN26.docx`
that had no dedicated MD spec:

| Feature | Planned file |
| ------- | ------------ |
| 18+ age gate | `21-age-gate.md` |
| Education / pen tutorial video | `22-education-video.md` |
| Clinic / wholesale portal | `23-clinic-wholesale.md` |
| Quiz resume (continue where stopped) | `24-quiz-resume.md` |
| SEO + AI answer optimisation | `25-seo-ai-optimization.md` |
| SMS / text concierge (API) | `26-sms-concierge.md` |
| Lifecycle messaging (API) | `27-lifecycle-messaging.md` |

Non-API specs are ordered first.
API-dependent specs are kept at the end.

---

# Current File Tree (homepage-refactor branch)

```
src/
  routes/
    index.tsx               ← ~85 lines, orchestration only
    __root.tsx              ← AuthProvider added
    quiz.tsx, login.tsx, signup.tsx
    account/*, products/*, checkout.tsx
    weight-loss.tsx, longevity.tsx, hormonal.tsx,
    performance.tsx, metabolic.tsx, recovery.tsx
    confirmation.tsx

  components/
    sections/
      NavSection.tsx
      HeroSection.tsx
      TrustSection.tsx      ← new real component
      VoxelSection.tsx
      HumanSection.tsx
      PenSection.tsx
      HowItWorksSection.tsx ← built (pinned GSAP)
      TreatmentCategoriesSection.tsx
      RedManSection.tsx
      DoctorSection.tsx     ← built (GSAP entrance)
      PharmacySection.tsx   ← stub
      ReviewsSection.tsx    ← stub
      FAQSection.tsx        ← stub
      CtaSection.tsx
      FooterSection.tsx

  lib/
    SplitWords.tsx
    auth-schema.ts, auth-storage.ts
    quiz-schema.ts, quiz-storage.ts
    products.ts, pricing.ts, order-storage.ts
    checkout-schema.ts

  providers/
    auth-provider.tsx

  data/
    products.ts, categories.ts, shared-care-steps.ts

  types/
    auth.ts, product.ts, quiz.ts, order.ts

  hooks/
    use-quiz.ts

cursor/skills/tidl/
  00-project-overview.md
  01-business-model.md
  02-client-feedback.md
  03-design-direction.md
  04-ux-requirements.md
  05-homepage-requirements.md
  06-page-roadmap.md
  07-animation-system.md
  08-mobile-first.md
  09-code-standards.md
  10-things-to-avoid.md
  11-current-audit.md
  12-product-page.md
  13-quiz-flow.md
  14-checkout-flow.md
  15-account-portal.md
  16-ai-search.md
  17-doctor-pharmacy-flow.md
  18-launch-roadmap.md
  19-development-plan.md
  20-docx-missing-specs.md ← new
  28-progress-log.md       ← this file
```

---

# What Is Left on This Branch

| Section | Priority |
| ------- | -------- |
| `PharmacySection` — cold-chain / licensed pharmacy trust | P1 |
| `ReviewsSection` — testimonials and social proof | P1 |
| `FAQSection` — shipping, prescriptions, eligibility, states | P1 |
| Mobile polish pass (all sections) | P1 |
| Create spec files `21` through `25` (non-API) | P2 |

---

# TypeScript and Build Status

- TypeScript errors: **0**
- `vite build`: **passes**
- Dev server: **running on localhost:8080**

---
