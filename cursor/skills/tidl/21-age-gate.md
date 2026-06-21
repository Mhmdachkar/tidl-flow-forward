# 21-age-gate.md

# Age Gate — Adults Only Entry Screen

---

## Source

Docx verbatim (Trust, privacy, and safety section):
> "Clear policies, secure checkout, an adults only gate at eighteen and over,
> accessibility for every user, and privacy controls. The whole site is
> designed to read as a legitimate medical brand."

Docx verbatim (Design Principles section):
> "Adults only. The product is prescription only and gated to eighteen and over."

---

## Why It Exists

TIDL sells prescription medications. GLP-1 therapies and peptides are
approved for adults only. Any site that markets or sells prescription
medication must prevent access by minors and carry a visible declaration
that its products are for adults only.

This is both a legal requirement and a brand credibility signal —
it positions TIDL as a legitimate clinical brand, not a gray-market
supplement shop.

---

## Requirement

**Every first-time visitor must confirm they are 18 or older before seeing
any page content.**

This applies to:
- The homepage
- All category pages
- All product pages
- The quiz entry point

It does NOT apply to:
- `/privacy`, `/terms`, `/medical-disclaimer` (legal pages must be
  accessible without consent so users can read what they are agreeing to)

---

## Trigger Logic

| Condition | Behaviour |
| --------- | --------- |
| First visit (no localStorage flag) | Gate overlay appears, page content hidden behind it |
| User confirms 18+ | Flag set, gate dismissed, page visible |
| User denies | Redirect to `https://www.google.com` |
| Return visit (flag present and not expired) | Gate skipped entirely |
| Flag expired (30 days) | Gate shown again |

Storage key: `tidl_age_confirmed`
Storage value: ISO timestamp of confirmation
Expiry: 30 days from confirmation date

---

## Design Requirements

### Visual

- Full-screen overlay, `z-index: 9999`, covers 100vw × 100vh
- Background: `oklch(0.13 0.008 60)` (TIDL noir — dark, clinical)
- No scroll on background while gate is active (same lock as quiz modal)
- TIDL wordmark centered, top area
- Short legal statement
- Two buttons only: **Yes, I am 18 or older** / **No, exit**

### Copy

```
[TIDL wordmark]

This site contains prescription medication information
and is intended for adults only.

Are you 18 years of age or older?

[ Yes, I am 18 or older ]     [ No, exit ]

By continuing you confirm you are of legal age and agree
to our Terms of Use and Privacy Policy.
```

### Buttons

| Button | Style | Action |
| ------ | ----- | ------ |
| Yes, I am 18 or older | Primary — dark bg, gold text, full width | Set flag, dismiss gate |
| No, exit | Ghost — subtle border, muted text | `window.location.href = "https://google.com"` |

### Animation

- Gate fades in on page load with `opacity: 0 → 1`, duration 0.4s
- On confirm: gate fades out `opacity: 1 → 0`, duration 0.5s, then unmounts
- On deny: no animation, hard redirect

---

## Component Spec

### File

`src/components/AgeGate.tsx`

### Props

None. Reads/writes directly from `localStorage`.

### Behaviour

```tsx
// On mount:
const confirmed = localStorage.getItem("tidl_age_confirmed");
if (confirmed) {
  const age = Date.now() - new Date(confirmed).getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (age < thirtyDays) return null; // skip gate
}
// Show gate overlay

// On confirm:
localStorage.setItem("tidl_age_confirmed", new Date().toISOString());
// Dismiss gate

// On deny:
window.location.href = "https://www.google.com";
```

### Integration

Mount in `src/routes/__root.tsx`, before `<Outlet />`, so it intercepts
every page:

```tsx
<AgeGate />
<Outlet />
```

---

## Accessibility

- Gate overlay must trap focus (no tabbing to background content)
- "No, exit" button must be reachable by keyboard
- `aria-modal="true"` on the overlay element
- `role="dialog"` with `aria-labelledby` pointing to the heading

---

## Mobile

- Full-screen on all breakpoints
- Buttons are `min-h-[52px]` for touch target compliance
- TIDL wordmark scales down on small screens, never clips

---

## Legal Notes

- No DOB input required — a simple yes/no declaration is the industry
  standard for this category (Hims, Ro, Noom all use this pattern)
- The legal disclaimer line links to `/terms` and `/privacy`
- This gate is the minimum compliance baseline — counsel should review
  before launch

---

## Priority

**P0 — Required before public launch.**

The site must not be publicly accessible without this gate in place.

---

## Status

Not built. Ready to implement.

Implementation estimate: ~2 hours (component + integration + tests).
