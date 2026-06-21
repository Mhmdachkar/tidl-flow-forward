# overview-notes.md

# TIDL Home Page — Overview Notes

Findings from rescanning `src/assets/TIDL.com Overview_08JUN26.docx` and cross-checking against `05-homepage-requirements.md` and the live home page (`src/routes/index.tsx`).

Date scanned: 22 Jun 2026

---

# Sources Used

- Primary spec: `TIDL.com Overview_08JUN26.docx` (extracted full text)
- Canonical home spec: `05-homepage-requirements.md`
- Live composition: `src/routes/index.tsx`
- Section components: `src/components/sections/*`

---

# Spec vs Current Home Page

Required home order (per `05-homepage-requirements.md`) and current status:

| # | Spec section | Present on home? | Component |
|---|--------------|------------------|-----------|
| 1 | Hero | Yes | `HeroSection` |
| 2 | Trust Strip | Yes | `TrustSection` |
| 3 | The Pen | Yes | `PenSection` |
| 4 | How TIDL Works | Yes | `HowItWorksSection` |
| 5 | Treatment Categories | Yes | `TreatmentCategoriesSection` |
| 6 | Doctor Network | Yes | `DoctorSection` |
| 7 | Pharmacy Network | Yes | `PharmacySection` |
| 8 | Reviews & Social Proof | Yes | `ReviewsSection` |
| 9 | Education / Video | NO — MISSING | (none) |
| 10 | FAQ | Yes | `FAQSection` |
| 11 | Final CTA | Yes | `CtaSection` |

---

# MISSING (needs to be added)

## 1. Education / Video section — REQUIRED

- Status: Not present on the home page; no video component exists anywhere in the codebase.
- Why: The docx ("Education — a short how-to video on using the pen, dosing, and storage") and the spec ("Section 09 — Education Section. Required. The client explicitly requested video.") both require it.
- Expected content:
  - Large video card with play button.
  - Topics: how to use the pen, dosing basics, storage instructions, physician explanation.
  - Transcript / text-step fallback for no-autoplay / low bandwidth.
  - Compliance note: educational, not diagnosis.
- Priority: HIGH (only true content gap).

## 2. AI Search / conversational discovery entry point — RECOMMENDED

- Status: No link or entry into AI search anywhere on the home page.
- Why: The docx calls AI search "the primary way to discover products… not a chatbot bolted on the side."
- Note: The home spec treats AI search as its own page, so this is a recommendation, not a hard requirement on the home page. Adding a clear home entry point is advised given how central the docx makes it.
- Priority: MEDIUM.

## 3. Section ordering deviates from spec — FIX

- Spec order: Hero → Trust → Pen → How It Works → Treatment Categories → Doctor → Pharmacy → Reviews → Education → FAQ → Final CTA.
- Current order puts Treatment Categories (and two lifestyle blocks) before the Pen and interleaves extra sections.
- Action: Reorder so the Pen and How It Works come right after the Trust strip.
- Priority: MEDIUM.

---

# TO DELETE (remove from home / project)

## 1. Both `HumanSection` blocks — DELETE

- Instances on home:
  - Women: "A clinical view of you." (`tag="Longevity intelligence"`)
  - Men: "Built for the long climb." (`tag="Performance"`)
- Reason: They render floating biomarker dashboard chips — "Testosterone 812 ng/dL", "Recovery Optimal", "Zone 2 138 W", "Grip +18%", "Resting HR 52 bpm". The spec explicitly lists this under "Sections To Remove → Fake Dashboard Metrics: health dashboards, app statistics, tracking screens."
- Extra conflicts:
  - Triggers spec failure condition: "Is this an app?"
  - CTA "See the protocol →" conflicts with the "no 90-day plan / staged protocols" rule.
- Alternative if keeping the imagery: strip the dashboard chips and remove the "protocol" CTA.
- Priority: HIGH.

## 2. `RedManSection` ("Whole-system care") — DELETE / CONSOLIDATE

- Reason: It is a second category/promo grid (links to `/hormonal`, `/metabolic`, `/recovery`, `/longevity`), duplicating `TreatmentCategoriesSection`. Two treatment-category blocks on one page is redundant.
- Action: Delete it, or fold its content into the single Treatment Categories section.
- Priority: MEDIUM.

## 3. `src/components/PhoneApp.tsx` — DELETE (dead code)

- Status: Not used on the home page (not imported in `index.tsx`), but still present in the repo.
- Reason: Client rule — "We do not have an app." Should be removed project-wide so it cannot be reintroduced.
- Priority: LOW (cleanup).

---

# Already Handled (no action needed)

- "How TIDL Works" section — now present (`HowItWorksSection`).
- 18+ age gate — present (`AgeGate`).
- Protocol Timeline / 90-day journey — no such section found on home.
- Phone App — not rendered on home (only the unused component file remains; see delete list).

---

# Suggested Action Plan (order)

1. Remove both `HumanSection` blocks from `index.tsx`.
2. Remove or consolidate `RedManSection`.
3. Add an Education / Video section (Section 09) before the FAQ.
4. Reorder remaining sections to match the spec.
5. Delete `src/components/PhoneApp.tsx` (dead code).
6. (Optional) Add a home entry point into AI search.

---

# Done Criteria

- Education/Video section exists on home with a text-step fallback.
- No dashboard-metric / fake-tracking visuals remain on home.
- Only one treatment-category section on home.
- Section order matches `05-homepage-requirements.md`.
- `PhoneApp.tsx` removed from the project.

---

# Education Video — AI Generation Prompt

Use this to generate the real "how to use your pen" clip for the Education section
(`src/components/sections/EducationSection.tsx`). It currently plays a placeholder
(`Video Project 2.mp4`). Works with Sora, Runway Gen-3, Kling, Luma, or Veo.

## Specs

- Aspect ratio: **16:9** (the card is `aspect-video`).
- Duration: **20–40s** (loop-friendly; no hard ending).
- Resolution: 1080p or higher.
- Audio: none / ambient only (the card autoplays muted, with controls on click).
- Vibe: calm, clinical, premium, editorial — NOT an ad, NOT salesy.

## Master prompt (copy-paste)

```
A premium, calm product film showing how to use a TIDL auto-injector medical pen.
Cinematic macro and medium shots on a clean cream-colored surface (#f6f3ec) with soft,
diffused studio light and shallow depth of field. The pen is matte white with a brushed
gold/bronze cap and a small clear dose window. A person's hands (neutral, well-lit, no
face, no logos on skin) calmly demonstrate three steps:
1) Remove the cap from a pre-dosed pen.
2) Press the pen flat against the skin of the upper arm/abdomen and click once.
3) Place the pen back into a small refrigerated TIDL case for cold storage.
Slow, deliberate, confident motion. Editorial pharmaceutical aesthetic, muted natural
palette of cream, soft greys, deep clinical green (#2d4a3e), and warm gold accents.
Smooth slow camera moves (gentle push-ins and subtle parallax), 35mm look, true-to-life
color, soft shadows, premium skincare/medtech commercial quality. Quiet and reassuring,
not flashy.
```

## Shot list (if your tool supports multi-shot / storyboard)

1. Macro: the closed white-and-gold pen resting on cream surface, light sweeps across it (3–5s).
2. Hands lift the pen and remove the cap; dose window briefly in focus (4–6s).
3. Pen pressed flat to skin (upper arm), a single confident click, slight recoil (4–6s).
4. Pen placed into a small cold-chain case; lid closes gently (4–6s).
5. Hero beauty shot of the pen + case together, soft rack focus, calm hold (3–5s).

## Negative prompt (avoid)

```
no faces, no text overlays, no on-screen captions, no brand logos, no needles shown
graphically, no blood, no clinical gore, no busy backgrounds, no neon, no harsh lighting,
no fast cuts, no glitch effects, no cartoon/3D-render look, no stock-footage feel,
no dashboards or app UI, no phones, no watermark, no distorted hands.
```

## After generating

1. Export as `.mp4` (H.264).
2. Save into `src/assets/` (e.g. `pen-how-to.mp4`).
3. In `src/components/sections/EducationSection.tsx`, replace the placeholder import
   `import eduVideo from "@/assets/Video Project 2.mp4";`
   with the new file. Keep `tidl-pen-hero.png` as the poster (or export a clean frame).
4. Compliance: keep it educational only — no dosing numbers, no medical claims on screen.
