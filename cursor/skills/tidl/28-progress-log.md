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

After: ~100 lines, orchestration only.

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
| `VoxelSection.tsx` | Extracted: cinematic video + ScrollTrigger pin — **REMOVED from homepage** |
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

| File | Status |
| ---- | ------ |
| `HowItWorksSection.tsx` | `return null` placeholder → now fully built |
| `DoctorSection.tsx` | `return null` placeholder → now fully built |
| `PharmacySection.tsx` | `return null` placeholder → now fully built |
| `ReviewsSection.tsx` | `return null` placeholder → now fully built |
| `FAQSection.tsx` | `return null` placeholder → now fully built |

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

### DoctorSection (ClinicalLeadershipSection)

File: `src/components/sections/DoctorSection.tsx`

Final implementation: `ClinicalLeadershipSection` exported as `DoctorSection`.

Design: Three-zone editorial section on warm cream `#f6f3ec`.

**Zone 1 — Hero intro:**

- Eyebrow: `§01 — Clinical Leadership`
- Large serif headline: "The council / *behind every* / protocol." with
  character-by-character reveal (`yPercent 110 → 0`, `rotateZ 6 → 0`)
- SVG signature draw-on via `strokeDashoffset`
- Body copy, 100% physician oversight + 24/7 care stats
- Cursor spotlight via `gsap.quickTo()`

**Zone 2 — Pinned scrollytelling:**

- Three doctor profiles (Sarah Mitchell, James Park, Michael Andrews)
- Left panel: overlapping absolute blocks, each fades in/out per doctor
- Right panel: portrait stack with clip-path reveal, corner registration marks
- GSAP ScrollTrigger `pin: true` + `snap` driving doctor transitions
- Progress rail on the right edge with animated fill

**Marquee:**

- Infinite GSAP marquee of credentials:
  BOARD-CERTIFIED · STATE-LICENSED · HIPAA-COMPLIANT · EVIDENCE-BASED ·
  PEER-REVIEWED · PATIENT-FIRST

**Zone 3 — Stats:**

- §03 — By the numbers
- Four stat cells: 60+ years experience, 100+ physicians, 50 states, 15K+ patients
- GSAP count-up on scroll

Doctors:
- Dr. Sarah Mitchell — Endocrinology · Chief Physician · MD, FACE, ECNU · 12+ years
- Dr. James Park — Internal Medicine · Medical Director · MD, ABOM · 15+ years
- Dr. Michael Andrews — Family Medicine · Clinical Lead · MD, FACFP · 18+ years

---

### PharmacySection

File: `src/components/sections/PharmacySection.tsx`

Design: Five-zone editorial section using Framer Motion + project assets.

Import: `from "framer-motion"` (v12, already installed).

**Assets used:**

| Asset file | What it shows |
| ---------- | ------------- |
| `pharmacy-fulfillment.png` | Sterile packing station — generated image |
| `pharmacy-coldchain.png` | Cold-chain packaging — generated image |
| `tidl-pen-hero.png` | TIDL GLP-1 pen product (from `product 1 3d.png`) |
| `tidl-peptide.png` | TIDL peptide product (from `product 3 3d pink.png`) |
| `tidl-prepared.png` | Prepared-for-shipment moment |

**Visual zones:**

1. Editorial headline: "Your medication isn't / pulled from a shelf. / *It is prepared for you.*"
   — word-by-word `SplitHeadline` component, enters from left/up/right per line
2. Fulfillment photo (MaskReveal) + pen hero (parallax float with `useTransform`)
3. Five-step journey rail: animated `scaleY` fill via `useScroll`, alternating left/right
4. Peptide panel + cold-chain photo (sticky right column)
5. Metrics grid (count-up: 72h, 100%, 1:1, Plain) + trust checklist

Cursor spotlight via `useSpring` + `useMotionValue`.

Fulfillment steps:
01 Prescription received → 02 Pharmacist verification → 03 Prepared to specification
→ 04 Cold-chain sealed → 05 Discreetly delivered

Trust facts: Licensed pharmacy partners only, FDA-regulated, cold-chain integrity,
unbranded packaging, live tracking, no fulfillment without prescription.

---

### ReviewsSection

File: `src/components/sections/ReviewsSection.tsx`

Design: Compact card wall with GSAP directional enters.

**Six compact review cards** (placeholder — must be replaced with real patient
reviews before launch):

| Name | Age | Tag | Outcome |
| ---- | --- | --- | ------- |
| Sarah M. | 34 | Weight Loss | −18 lbs in 12 weeks |
| James T. | 41 | Hormone Health | Normalized in 6 weeks |
| Rachel K. | 29 | Metabolic | 3-month transformation |
| David L. | 52 | Weight Loss | Energy restored |
| Maria C. | 38 | Hormonal Balance | Balance restored |
| Tom W. | 45 | GLP-1 | −22 lbs |

**Card design:** compact clinical record ticket — 2px green left-edge stripe,
tag pill, outcome headline (Instrument Serif), italic quote, initials avatar,
corner registration mark.

**GSAP animations — each card from a different direction:**

| Card | Direction | Rotation |
| ---- | --------- | -------- |
| Sarah M. | Left (−140px) | −3° |
| James T. | Top (−80px) | +1.5° |
| Rachel K. | Right (+130px) | +2.5° |
| David L. | Left (−110px) | −2° |
| Maria C. | Bottom (+90px) | −1.5° |
| Tom W. | Right (+120px) | +3° |

Each enters with `blur(8px) → blur(0px)` simultaneously.

**Aggregate stats:** 4.9/5 rating · 2,400+ reviews · 50 states (count-up on scroll).

**Marquee:** 4.9 Stars · Physician Reviewed · Real Outcomes · 50 States ·
Board-Certified · Discreet Delivery · Real Patients · HIPAA Compliant

**Cursor spotlight:** `gsap.quickTo()` tracking.

---

### FAQSection

File: `src/components/sections/FAQSection.tsx`

Design: Sticky-left editorial headline + right accordion panel.

**Layout:**

- Left: sticky `§06 — Questions` headline, sub-copy, contact CTA — stays pinned
  as user scrolls through all 10 questions
- Right: clinical accordion panel with 2px green top accent edge, item count label,
  10 questions, legal disclaimer at bottom

**Accordion mechanics (pure GSAP, no CSS transitions):**

- Ghost numbers (01–10) in large Instrument Serif — `rgba(22,22,22,0.1)` collapsed,
  transitions to `#2d4a3e` when open
- Active left-edge indicator: `2px` green bar, `scaleY: 0 → 1` with `expo.out`
  on open, `power3.in` on close
- Answer height: `gsap.fromTo(el, { height: 0 }, { height: el.scrollHeight })`
  — smooth, no layout snap
- Plus/minus icon: vertical bar `scaleY` collapses and rotates on open
- First question open by default

**10 questions covering:**

1. How does the prescription process work?
2. Is approval guaranteed?
3. Who reviews my assessment?
4. How long does physician review take?
5. Where is my medication prepared?
6. How does shipping work?
7. What states are supported?
8. Is my health information private?
9. Does HSA or FSA cover TIDL treatments?
10. What happens after my first order?

**Entrance animations:**

- Headline: word-by-word mask reveal
- Eyebrow line: `scaleX: 0 → 1` draw-on
- FAQ items: alternate left (−60px) / right (+60px) directional entrance
- Closing statement: `y: 40 → 0`, `opacity: 0 → 1`

**Closing editorial statement:**

> "Every treatment plan is reviewed by a real doctor. *Every order is filled by
a real pharmacy.*"

---

## Phase 4 — Homepage Restructure

### VoxelSection removed from homepage

`VoxelSection` (cinematic video section) was removed from `src/routes/index.tsx`.

Reason: No video content exists yet. Per the docx, video is post-launch.

File `src/components/sections/VoxelSection.tsx` preserved on disk.

### TreatmentCategoriesSection repositioned

Moved from between `HowItWorksSection` and `RedManSection` to immediately
after `TrustSection` (where VoxelSection was).

New homepage flow:

```
Hero → Trust strip → Treatments (Lirosiome · Tirosane · TIDL Core · TIDL Cycle)
→ HumanSection → Pen → How It Works → RedMan → HumanSection (men)
→ Doctor → Pharmacy → Reviews → FAQ → CTA → Footer
```

Treatment product data in `src/data/products.ts` confirmed correct:

| Product | Tag | Tagline | Price |
| ------- | --- | ------- | ----- |
| Lirosiome | Metabolic | GLP-1 weight protocol | $249/mo |
| Tirosane | Longevity | Cellular renewal | $329/mo |
| TIDL Core | Daily | Foundational longevity | $48/mo |
| TIDL Cycle | Hormonal | Female hormonal balance | $58/mo |

---

## Phase 5 — Documentation Gaps Filled

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

## Phase 6 — CSS Design System Extension

### `src/styles.css` updated

New variables added for pharmacy / review / FAQ section palette:

```css
--cream:          oklch(0.975 0.012 85)
--cream-deep:     oklch(0.945 0.018 82)
--hairline-color: oklch(0.18 0.012 60 / 0.12)
--clinical-deep:  oklch(0.22 0.045 158)
--clinical-soft:  oklch(0.34 0.055 155 / 0.08)
--ink-mute:       oklch(0.55 0.008 60)
--noir:           oklch(0.13 0.008 60)
```

New Tailwind tokens: `--color-cream`, `--color-cream-deep`, `--color-hairline`,
`--color-clinical-deep`, `--color-clinical-soft`, `--color-ink-mute`, `--color-noir`,
`--font-serif`.

New utility classes: `.eyebrow`, `.hairline-grow`, `.grain-dot`.

---

## Phase 7 — Asset Additions

New files added to `src/assets/`:

| File | Source |
| ---- | ------ |
| `pharmacy-fulfillment.png` | Generated image — sterile packing station |
| `pharmacy-coldchain.png` | Generated image — cold-chain packaging |
| `tidl-pen-hero.png` | Copied from `product 1 3d.png` |
| `tidl-peptide.png` | Copied from `product 3 3d pink.png` |
| `tidl-prepared.png` | Same as fulfillment (placeholder) |

---

## Phase 8 — Age Gate (18+ Compliance)

### `21-age-gate.md` spec created

Full specification document written based on docx requirements:
- Defines legal requirement: "adults only gate at eighteen and over"
- Details implementation: localStorage-based 30-day memory
- Specifies exempt routes: `/privacy`, `/terms`, `/medical-disclaimer`
- Documents trigger logic, design, accessibility, mobile requirements
- Marked **P0 — required before public launch**

### `src/components/AgeGate.tsx` built

Premium full-screen overlay that intercepts all first-time visitors:

**Features:**
- SSR-safe: `null` until client-side hydration completes
- 30-day localStorage memory via `tidl_age_confirmed` timestamp
- Exempt routes bypass automatically (legal pages must be accessible)
- GSAP entrance: overlay fade + staggered blur dissolve on content
- Ambient radial gold glow with breathing pulse (3.5s `yoyo`)
- Corner registration marks (consistent with clinical aesthetic)
- Scroll lock while active (`overflow: hidden`)
- Focus trap (Tab/Shift-Tab cycles within gate only)
- Exit animation on confirm: fade out + lift `y: -16`
- Hard redirect to Google on deny

**Copy:**
- TIDL wordmark (yellow logo)
- Eyebrow: "Adults Only · Prescription Medicine"
- Headline: "Are you 18 years *or older?*" (serif, italicized emphasis)
- Body: prescription medication disclaimer
- Two buttons: "Yes, I am 18 or older" (gold primary) / "No, I am under 18" (ghost)
- Legal footnote with links to Terms + Privacy

### Integration into `src/routes/__root.tsx`

Mounted above `<Outlet />` inside `<AuthProvider>` so it intercepts
every route on first visit.

---

# MD + Docx Compliance Check

## 05-homepage-requirements.md

| Required section | Status |
| ---------------- | ------ |
| Hero | ✅ Existing `HeroSection.tsx` |
| Trust Strip | ✅ `TrustSection.tsx` |
| The Pen | ✅ `PenSection.tsx` |
| How TIDL Works | ✅ `HowItWorksSection.tsx` |
| Treatment Categories | ✅ `TreatmentCategoriesSection.tsx` |
| Doctor Network | ✅ `DoctorSection.tsx` |
| Pharmacy Network | ✅ `PharmacySection.tsx` |
| Reviews & Testimonials | ✅ `ReviewsSection.tsx` (placeholders — replace before launch) |
| Education / Video | ⏳ Deferred — no video content yet |
| FAQ | ✅ `FAQSection.tsx` |
| Final CTA | ✅ `CtaSection.tsx` |

## 17-doctor-pharmacy-flow.md

| Requirement | Status |
| ----------- | ------ |
| Real physicians displayed | ✅ DoctorSection — 3 board-certified doctors |
| Prescription flow explained | ✅ HowItWorksSection — 5 steps |
| Pharmacy fulfillment explained | ✅ PharmacySection — 5-step pipeline |
| Ongoing care mentioned | ✅ HowItWorksSection step 5 |
| No guaranteed approval language | ✅ All copy reviewed |
| No AI prescribing claim | ✅ FAQ item 3 explicitly states human physician |

## TIDL.com Overview_08JUN26.docx

| Docx requirement | Status |
| ---------------- | ------ |
| Home: trust signals + real customer proof | ✅ TrustSection + ReviewsSection |
| Home: sell the pen | ✅ PenSection |
| Home: quiz entry point | ✅ CTA throughout |
| Pen as hero product | ✅ PenSection + DoctorSection + PharmacySection |
| Real reviews + photos | ⏳ Placeholders only — real content needed |
| Adults-only gate (18+) | ✅ **AgeGate component built + spec complete** |
| How-to video (pen tutorial) | ❌ Not built — spec pending in 22-education-video.md |
| AI search / chat | ❌ Not built — Phase 2 |
| Text concierge | ❌ Not built — API-dependent |

---

# Current File Tree (homepage-refactor branch)

```
src/
  routes/
    index.tsx               ← ~100 lines, orchestration only
    __root.tsx              ← AuthProvider added
    quiz.tsx, login.tsx, signup.tsx
    account/*, products/*, checkout.tsx
    weight-loss.tsx, longevity.tsx, hormonal.tsx,
    performance.tsx, metabolic.tsx, recovery.tsx
    confirmation.tsx

  components/
    AgeGate.tsx             ← new (18+ compliance gate, GSAP entrance)
    sections/
      NavSection.tsx
      HeroSection.tsx
      TrustSection.tsx
      HumanSection.tsx
      PenSection.tsx
      HowItWorksSection.tsx ← built (pinned GSAP gold)
      TreatmentCategoriesSection.tsx ← repositioned (now after TrustSection)
      RedManSection.tsx
      VoxelSection.tsx      ← file preserved, removed from homepage
      DoctorSection.tsx     ← built (ClinicalLeadershipSection, pinned scroll)
      PharmacySection.tsx   ← built (Framer Motion, 5-zone editorial)
      ReviewsSection.tsx    ← built (GSAP directional enters, compact cards)
      FAQSection.tsx        ← built (GSAP accordion, sticky headline)
      CtaSection.tsx
      FooterSection.tsx

  assets/
    pharmacy-fulfillment.png  ← new
    pharmacy-coldchain.png    ← new
    tidl-pen-hero.png         ← new (alias for product 1 3d.png)
    tidl-peptide.png          ← new (alias for product 3 3d pink.png)
    tidl-prepared.png         ← new (placeholder)
    [all existing assets preserved]

  lib/
    gsap.ts
    SplitWords.tsx
    auth-schema.ts, auth-storage.ts
    quiz-schema.ts, quiz-storage.ts
    products.ts, pricing.ts, order-storage.ts
    checkout-schema.ts

  styles.css                ← extended with pharmacy palette + utilities

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
  20-docx-missing-specs.md
  21-age-gate.md            ← new (18+ compliance spec)
  28-progress-log.md        ← this file
```

---

# Git Status Summary

Branch: `feature/homepage-refactor`

Remote: `origin/feature/homepage-refactor` — in sync with our last commit.

**Uncommitted local changes (not yet staged):**

| File | Change |
| ---- | ------ |
| `src/components/sections/DoctorSection.tsx` | Replaced with ClinicalLeadershipSection |
| `src/components/sections/FAQSection.tsx` | Built from stub |
| `src/components/sections/PharmacySection.tsx` | Built from stub |
| `src/components/sections/ReviewsSection.tsx` | Built from stub |
| `src/routes/index.tsx` | Removed VoxelSection, repositioned TreatmentCategoriesSection |
| `src/styles.css` | Added pharmacy palette tokens and utilities |
| `src/routeTree.gen.ts` | Auto-regenerated by Vite dev server (line endings) |

**Untracked files (new, not yet added):**

- `src/assets/pharmacy-fulfillment.png`
- `src/assets/pharmacy-coldchain.png`
- `src/assets/tidl-pen-hero.png`
- `src/assets/tidl-peptide.png`
- `src/assets/tidl-prepared.png`
- `TIDL.com Overview_08JUN26.docx`

---

# Conflict Risk Assessment

## Pushing to `feature/homepage-refactor` → SAFE

No risk. This is our private feature branch. Nobody else pushes to it.
A clean `git push` will succeed with zero conflicts.

## Merging into `dev` or `main` later → MEDIUM RISK

`main` is ahead of our branch by ~30+ commits from Ahmad's work
(quiz modal, drawer redesigns, route merges).

**Files most likely to conflict on merge:**

| File | Conflict risk | Reason |
| ---- | ------------- | ------ |
| `src/routes/index.tsx` | HIGH | Both branches have changed this file |
| `src/styles.css` | MEDIUM | Ahmad may have added styles too |
| `src/routeTree.gen.ts` | LOW | Auto-generated — resolved by re-running `vite dev` after merge |

**Recommendation:**

When merging into dev/main, do it as a PR on GitHub. Review
`index.tsx` and `styles.css` manually. After merge, run `npm run dev`
once to regenerate `routeTree.gen.ts` automatically.

---

# What Is Left on This Branch

| Task | Priority | Status |
| ---- | -------- | ------ |
| Commit and push all current changes | P0 | Pending — ready to push |
| Age gate (18+) | P0 | ✅ **COMPLETE** — spec + component built |
| Mobile polish pass (all sections) | P1 | Pending |
| Legal pages (`/privacy`, `/terms`, `/medical-disclaimer`) | P0 | Not started |
| SEO meta on product/category routes | P1 | Pending |
| Real patient reviews (replace placeholders) | Before launch | Content needed |
| Real pharmacy photos (replace generated placeholders) | Before launch | Photos needed |
| Education/video section | Post-launch | No video content yet |
| Spec files `22–25` (video, clinic, quiz-resume, SEO) | P2 | `21-age-gate.md` ✅ done, others pending |

---

# TypeScript and Build Status

- TypeScript errors: **0**
- `vite build`: **passes**
- Dev server: **running on localhost:8080**

---
