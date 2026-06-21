# New Change — 5:43 AM

Summary of work completed in this chat session for the TIDL project.

---

## Feature: Login / Signup as a slide-in panel (no separate page)

The login/signup flow was converted from a full standalone page (`/login`, `/signup`) into a
premium **slide-out drawer that animates in from the right**, matching the style and behavior of the
redesigned hamburger menu and the Hims-style quiz modal. It is fully scrollable, locks the
background page, and toggles between login and signup in place (no navigation / page reload).

### New files

| File | Purpose |
|------|---------|
| `src/providers/auth-modal-provider.tsx` | Global React context (`useAuthModal`) exposing `isOpen`, `mode` (`"login"` \| `"signup"`), `redirectTo`, `openModal({ mode, redirectTo })`, `setMode`, and `closeModal`. Mirrors the `quiz-modal-provider` pattern. |
| `src/components/auth/AuthModal.tsx` | The slide-in auth panel itself, rendered via `createPortal` to `document.body`. Contains inline login and signup forms (React Hook Form + Zod), social buttons, and a promo card. |

### Modified files

| File | Change |
|------|--------|
| `src/routes/__root.tsx` | Wrapped the app in `<AuthModalProvider>` and mounted `<AuthModal />` globally (alongside the existing `<QuizModal />`). |
| `src/components/SiteNav.tsx` | Imported `useAuthModal`; converted all three "Log in" entry points (desktop header pill, guest card in the drawer, sticky drawer footer button) from `<Link to="/login">` into buttons that call `openAuthModal({ mode: "login" })`. |
| `src/routes/index.tsx` | Same conversion as `SiteNav` for the homepage's own `Nav` component — desktop header, guest card, and drawer footer "Log in" now open the modal instead of routing to `/login`. |

---

## Behavior & UX details

- **Slide-in animation:** panel transitions `translateX(100%) → 0` over `0.5s cubic-bezier(0.22,1,0.36,1)` with a dimmed, blurred backdrop (`bg-black/30 backdrop-blur`).
- **Right-anchored, app-style sheet:** full-width on mobile, `sm:w-[460px] lg:w-[500px]` on larger screens, with a soft left-edge shadow.
- **Scrollable without a visible scrollbar:** body uses `no-scrollbar`, `overscroll-contain`, and `data-lenis-prevent` so it scrolls independently of the page (same technique used for the drawer and quiz modal).
- **Background scroll lock:** uses `lockPageScroll()` / `unlockPageScroll()` (which also pauses Lenis) while the panel is open.
- **Header:** centered "Login" / "Create account" title with an `X` close button on the top-left.
- **Login view:** "Welcome back" heading, Email + Password fields, "Forgot your password?" link, black **Log in** button, and a "First time here? Create an account" toggle.
- **Signup view:** First/Last name, Email, Phone, Password, Confirm password, **Create account** button, and an "Already have an account? Log in" toggle.
- **In-place mode switching:** login ↔ signup swap instantly via `setMode` — no navigation, no reload.
- **Social options:** "Continue with Google" and "Continue with Apple" buttons (inline brand SVG glyphs), plus a gold gradient "Get the most out of your care" promo card.
- **Dismissal:** closes on backdrop click, the `Escape` key, or a successful login/signup (then navigates to `redirectTo`, default `/account`).
- **Validation:** reuses the existing `loginSchema` / `signupSchema` (Zod) and the `useAuth()` `login` / `signup` methods; inline per-field and root error messages.

### Notes

- The existing `/login` and `/signup` routes remain as working fallbacks (e.g. for the
  `/account` unauthenticated redirect and direct deep-links). The primary UX is now the popup.
- All gold/brand accents (`#C9A200`, `#F3C300`) and dark `#1A1816` button styling kept consistent
  with the rest of the app.

---

## Verification

- `npx tsc --noEmit` — passes with no errors.
- No linter errors in the new or modified files.
