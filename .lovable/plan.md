# Prompt to generate the "Clinical Leadership" section

Paste the block below into Lovable (or any AI builder) as a single message. It is written to produce a section that matches the reference screenshot exactly and feels like a $100M+ telehealth brand — premium typography, glassmorphism, GSAP scroll choreography, and a 3D coverflow doctor carousel.

---

**PROMPT START**

Build a single full-width section called `ClinicalLeadershipSection` for a premium telehealth brand (TIDL). It must look and feel like a company worth hundreds of millions of dollars — Apple x Mayo Clinic x Hims, clinical but cinematic. Do NOT use generic SaaS gradients, purple, or stock card layouts. Match the reference image pixel-for-pixel in layout, hierarchy, and restraint.

## Visual system
- Background: very soft cool off-white `#F4F6F9` with a faint radial glow `radial-gradient(1200px 600px at 70% 0%, rgba(59,130,246,0.06), transparent 60%)`.
- Primary ink: deep navy `#0B1B2B`. Accent: clinical blue `#3B6FA0`. Hairlines: `rgba(11,27,43,0.12)`.
- Type: display serif (Instrument Serif or Fraunces) for "Real doctors. Real oversight." at clamp(48px, 6vw, 96px), -0.02em tracking, leading 0.95. Body: Inter / Geist at 16–18px, `#41566B`. Eyebrows ("CLINICAL LEADERSHIP", "OUR STANDARD"): 11px, uppercase, +0.22em tracking, `#3B6FA0`, with a tiny pulsing dot.
- Glass: `backdrop-blur-xl bg-white/55 border border-white/60 shadow-[0_30px_80px_-40px_rgba(11,27,43,0.25)] rounded-3xl`.

## Layout (desktop ≥1024px, mobile-first underneath)
Two-row composition inside a `max-w-[1440px] mx-auto px-8 py-32`:

**Row 1 — Hero band (12-col grid):**
- Left col 1–5: eyebrow "CLINICAL LEADERSHIP" + pulsing dot, the serif headline on two lines, supporting paragraph, then a CMO signature block (SVG signature, name "Dr. Michael Andrews", role "Chief Medical Officer") separated by a hairline.
- Right col 6–12: a large rounded image (`rounded-[28px]`, aspect 16/10) of three physicians in white coats in a bright clinic. Below it, overlapping by -40px, a floating glass pill bar with shield icon and the text `BORD-CERTIFIED · LICENSED · PATIENT-FOCUSED` (letter-spaced, navy).

**Row 2 — Standard + Coverflow:**
- Left col 1–3: eyebrow "OUR STANDARD" with hairline, then three numbered items (01, 02, 03) — Evidence-Based Care, Personalized Plans, Ongoing Oversight — each with title + 2-line description, separated by hairlines. The active item gets a blue left border and brighter ink.
- Right col 4–12: a 3D **coverflow carousel** of doctor cards. Center card is large (`w-[520px] h-[340px]`), side cards are rotated -25°/+25° on Y, scaled 0.82, with `filter: blur(2px) brightness(0.85)`. Cards are dark navy glass (`bg-[#0B1B2B]/90`), inside: category eyebrow (e.g. "ENDOCRINOLOGY"), serif name, credentials, 2-line bio, "VIEW PROFILE →", and a portrait cut-out on the right with a subtle SVG wave line behind it. Two circular glass arrow buttons left/right. A soft floor reflection under the active card.

**Row 3 — Stats bar:** full-width glass bar with 5 columns separated by hairlines: an animated atom/molecule SVG mark, then `60+ Years Combined Experience`, `100+ Physicians Across the U.S.`, `50 States Covered`, `15K+ Patients Helped`, `You first. Always. — Care Philosophy`. Numbers in serif, labels in micro-caps.

## GSAP + transitions (this is the premium part)
Install `gsap` and use `ScrollTrigger`, `SplitText` (or a manual word/char splitter), and `Flip`. Wrap everything in `useGSAP` with `gsap.context` and clean up on unmount. Respect `prefers-reduced-motion`.

1. **Headline reveal:** split the serif headline into words, then chars. On enter (`start: "top 75%"`), stagger chars with `y: 110%, rotateX: -40deg, opacity: 0 → 0, 0, 1`, duration 1.1, ease `expo.out`, stagger 0.012. The eyebrow dot scales from 0 with a 0.6s `back.out(2)` and then loops a soft 2s `scale 1 ↔ 1.4 / opacity 1 ↔ 0.4`.
2. **Hero image:** mask reveal using `clip-path: inset(0 0 100% 0)` → `inset(0)` over 1.4s `expo.out`, combined with an internal `scale 1.15 → 1` on the `<img>` for a parallax feel. The glass certification pill slides up `y: 40 → 0`, fades in, with a 0.15s delay after the image.
3. **Pinned scroll choreography:** pin the whole section for ~`+=120%` of viewport height. Within the pinned timeline, scrub:
   - The three "OUR STANDARD" items advance one-by-one; the active index drives the coverflow carousel (cards rotate Y by -60°/0°/+60° using `gsap.to` with `overwrite: 'auto'`, ease `power3.inOut`, 0.9s).
   - Use **GSAP Flip** for the active card swap: capture `Flip.getState(cards)`, change which card has the `.is-active` class, then `Flip.from(state, { duration: 0.9, ease: "power3.inOut", absolute: true, scale: true })`. This gives the buttery "card flies into the center, others slide back" feeling.
4. **Stats bar:** counters animate from 0 to target using a tweened proxy `{ v: 0 }` with `onUpdate` writing `Math.round` into the DOM. Trigger when the bar enters at 80%. Hairlines draw in with `scaleX: 0 → 1 transform-origin: left`.
5. **Atom mark:** continuously rotate the outer ring 30s linear infinite, inner dots pulse opacity on a 2s sine.
6. **Cursor affordance:** on hover over arrows, magnetic effect (translate the button up to 8px toward the cursor with `gsap.quickTo`). Card hover: `rotateY += 4deg`, `scale 1.02`, shadow deepens — all via `quickTo` for 60fps.
7. **Section enter:** use a master timeline; orchestrate eyebrow → headline → paragraph → signature → image mask → pill → left standard list (stagger 0.08) → coverflow assembly (cards fly in from `z: -400, opacity: 0`) → stats bar. Total intro ~1.8s.

## Responsive
- < 1024px: stack to single column, headline clamp scales down, coverflow becomes a horizontal snap scroller (`scroll-snap-type: x mandatory`) with the same card design; disable pinning via `ScrollTrigger.matchMedia`.
- Add proper `min-w-0`, `shrink-0`, `truncate` on flex children.

## Code expectations
- One file: `src/components/sections/ClinicalLeadershipSection.tsx`.
- Tailwind v4 + semantic tokens already in `src/styles.css`; add any new tokens there, never hardcode color utility classes for brand colors.
- TypeScript strict, no `any`. Use refs (`useRef`), `useGSAP` from `@gsap/react`, and `ScrollTrigger.create` cleanly disposed.
- Use real Unsplash or provided portraits via `<img>` with `loading="lazy"` and explicit width/height. Provide placeholder URLs I can swap.
- Accessibility: arrows are `<button aria-label>`, carousel has `role="region" aria-roledescription="carousel"`, reduced-motion fallback disables splits/pins and just fades.
- No external UI kit for this section. No framer-motion. GSAP only.

Deliver the finished component wired into the homepage between the existing Hero and Products sections, with all animations verified in the preview.

**PROMPT END**

---

## Notes
- Swap "TIDL" / brand names if reusing on another project.
- If your target builder doesn't have `SplitText` (paid GSAP plugin), tell it to "use a manual word/char split with spans" — the prompt already implies that fallback.
- For the doctor portraits, upload 3 transparent PNG cut-outs first; the coverflow looks cheap with stock square photos.