import { LogOut, X, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useAuth } from "@/providers/auth-provider";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { getScrollPosition, hasLenis } from "@/lib/lenis-store";
import { useNavSectionTheme } from "@/lib/use-nav-section-theme";
import { TidlNavLogo } from "@/components/TidlNavLogo";

const DISCOVER_ITEM = {
  title: "Find your treatment",
  description: "Describe your goal, grounded recommendations for physician-guided care",
  to: "/search" as const,
};

const EXPLORE_ITEMS = [
  { title: "Weight Loss",      description: "Personalized treatment plans and physician-guided options", to: "/weight-loss" as const },
  { title: "Longevity",        description: "Support long-term wellness and healthy aging",              to: "/longevity"   as const },
  { title: "Hormonal Health",  description: "Personalized balance and optimization programs",            to: "/hormonal"    as const },
  { title: "Performance",      description: "Improve energy, lifestyle, and daily performance",          to: "/performance" as const },
];

const POPULAR_ITEMS = [
  { title: "GLP-1 Programs",          description: "Physician-guided metabolic and weight care",       slug: "lirosome"  as const },
  { title: "Personalized Treatments", description: "Tailored protocols built around your goals",       slug: "tirosane"  as const },
  { title: "Wellness Plans",          description: "Foundational programs for long-term health",       slug: "tidl-core" as const },
];

const RESOURCE_ITEMS = [
  { title: "FAQs",              description: "Answers to common care questions",          href: "/#faqs"         },
  { title: "Contact support",   description: "Reach our care team whenever you need",    href: "/account/support"},
];

const CARD_BASE =
  "group block rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#E8C84A]/60 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]";

function NavArrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-4 mt-0.5 shrink-0 text-[18px] font-light leading-none text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/60"
    >
      &rsaquo;
    </span>
  );
}

function Avatar({ user }: { user: { firstName: string; lastName?: string } | null }) {
  if (!user) return null;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A200] to-[#F3C300] text-[11px] font-bold text-black shadow-[0_0_0_2px_rgba(243,195,0,0.3)]"
      aria-label={`${user.firstName} ${user.lastName ?? ""}`}
    >
      {initials}
    </span>
  );
}

function NavAvatar({
  user, scrolled, size = "sm",
}: { user: { firstName: string; lastName?: string; email?: string } | null; scrolled?: boolean; size?: "sm" | "md" }) {
  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "?";
  const dim = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-[11px]";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A200] to-[#F3C300] font-bold text-black shadow-[0_0_0_2px_rgba(243,195,0,0.35)] transition-shadow hover:shadow-[0_0_0_3px_rgba(243,195,0,0.5)] ${dim} ${scrolled === false ? "shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" : ""}`}
      aria-label={user ? `${user.firstName} ${user.lastName ?? ""}` : "Account"}
    >
      {initials}
    </span>
  );
}

const ANNOUNCEMENT_HEIGHT_PX = 45;

interface NavSectionProps {
  /** Homepage: header sits in page flow at top, pins + follows on scroll (Hims-style). */
  integrateAtTop?: boolean;
}

export function NavSection({ integrateAtTop = false }: NavSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [legacyScrolled, setLegacyScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { openModal: openQuiz } = useQuizModal();
  const { openModal: openAuthModal } = useAuthModal();

  const sectionNav = useNavSectionTheme(integrateAtTop, headerHeight);
  const isDark = integrateAtTop ? sectionNav.theme.variant === "dark" : legacyScrolled;
  const isPinned = integrateAtTop ? sectionNav.isPinned : true;
  const showHeroChrome = integrateAtTop && sectionNav.zone === "hero" && sectionNav.scrollY <= 8;
  const navTheme = integrateAtTop ? sectionNav.theme : null;

  useEffect(() => {
    if (integrateAtTop || !ref.current) return;
    gsap.from(ref.current, {
      y: -40,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.3,
      clearProps: "transform,opacity",
    });
  }, [integrateAtTop]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setHeaderHeight(el.offsetHeight);
    measure();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [headerHeight, menuOpen, integrateAtTop, showHeroChrome, isDark]);

  useEffect(() => {
    if (integrateAtTop) return;

    let lastScrolled = false;
    let pendingY = getScrollPosition();
    let frame = 0;

    const apply = (scrollY: number) => {
      const nextScrolled = scrollY > 48;
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setLegacyScrolled(nextScrolled);
      }
    };

    const schedule = (scrollY: number) => {
      pendingY = scrollY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply(pendingY);
      });
    };

    const onNativeScroll = () => {
      if (hasLenis()) return;
      schedule(window.scrollY);
    };

    const onLenisScroll = (event: Event) => {
      const detail = (event as CustomEvent<{ scroll: number }>).detail;
      if (typeof detail?.scroll === "number") schedule(detail.scroll);
    };

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("tidl:lenis-scroll", onLenisScroll);
    apply(getScrollPosition());

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("tidl:lenis-scroll", onLenisScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [integrateAtTop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      lockPageScroll();
      return () => unlockPageScroll();
    }
  }, [menuOpen]);

  return (
    <>
      {/* Spacer prevents layout jump when homepage header pins on scroll */}
      {integrateAtTop && isPinned && headerHeight > 0 && (
        <div aria-hidden style={{ height: headerHeight }} />
      )}

      <div
        className={`z-50 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isPinned ? "fixed top-0 left-0 right-0" : "relative"
        }`}
        style={{ paddingTop: isPinned ? "env(safe-area-inset-top, 0px)" : undefined }}
      >
      <header
        ref={ref}
        className="transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          backgroundColor: integrateAtTop ? navTheme?.headerBg : legacyScrolled ? "#000000" : "#FAFAF7",
          boxShadow: integrateAtTop
            ? navTheme?.shadow
            : legacyScrolled
              ? "0 4px 20px -4px rgba(0,0,0,0.45)"
              : undefined,
        }}
      >
        {showHeroChrome && (
          <div style={{ height: `${ANNOUNCEMENT_HEIGHT_PX}px`, minHeight: `${ANNOUNCEMENT_HEIGHT_PX}px`, maxHeight: `${ANNOUNCEMENT_HEIGHT_PX}px`, background: "#F3C300", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxSizing: "border-box" }}>
            <div className="flex items-center justify-center gap-2 px-4 sm:gap-3">
              <span style={{ fontSize: "11px", lineHeight: 1, color: "#231f20" }}>
                Personalised longevity care is here.
              </span>
              <a
                href="/weight-loss"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  borderRadius: "999px", background: "rgba(0,0,0,0.15)",
                  padding: "3px 10px", fontSize: "10px", fontWeight: 500,
                  color: "#231f20", textDecoration: "none", lineHeight: 1, whiteSpace: "nowrap",
                }}
              >
                Check it out →
              </a>
            </div>
          </div>
        )}

        <div style={{ background: showHeroChrome ? "#F3C300" : "transparent" }}>
          <nav
            className={`px-4 sm:px-6 lg:px-10 transition-[background-color,border-radius,box-shadow,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showHeroChrome ? "py-2.5" : "py-1.5"
            }`}
            style={{
              backgroundColor: integrateAtTop ? navTheme?.navBg : legacyScrolled ? "transparent" : "#FAFAF7",
              borderTopLeftRadius: showHeroChrome ? "1.75rem" : undefined,
              borderTopRightRadius: showHeroChrome ? "1.75rem" : undefined,
              boxShadow: showHeroChrome ? undefined : "none",
            }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <Link to="/" className="flex items-center" aria-label="TIDL home">
                <TidlNavLogo
                  variant={isDark ? "dark" : "light"}
                  size={showHeroChrome ? "lg" : "md"}
                />
              </Link>

              <div />

              <div className="flex items-center gap-1.5 sm:gap-2">
                {isAuthenticated ? (
                  <Link to="/account" aria-label="My account" className="hidden items-center gap-2 sm:flex">
                    <NavAvatar user={user} scrolled={isDark} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal({ mode: "login" })}
                    className={`hidden rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block ${
                      isDark
                        ? "border border-transparent bg-[#F3C300] px-2.5 py-0.5 text-[10px] text-black hover:bg-[#F9DC6B]"
                        : showHeroChrome
                          ? "border border-ink/15 bg-white px-3 py-1 text-[11px] text-ink hover:bg-ink/[0.03] sm:px-3.5"
                          : "border border-ink/15 bg-white px-2.5 py-0.5 text-[10px] text-ink hover:bg-ink/[0.03]"
                    }`}
                  >
                    Log in
                  </button>
                )}

                <button
                  type="button"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`tidl-touch-target flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-65 ${
                    isDark ? "text-white" : "text-ink"
                  }`}
                >
                  {menuOpen
                    ? <X width={isDark || !showHeroChrome ? 16 : 18} height={isDark || !showHeroChrome ? 16 : 18} />
                    : <Menu width={isDark || !showHeroChrome ? 16 : 18} height={isDark || !showHeroChrome ? 16 : 18} />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-[55] bg-black/30 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Premium white drawer ── */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[540px] flex-col rounded-l-[2.5rem] bg-[#FBFAF8] shadow-[-12px_0_70px_rgba(0,0,0,0.16)] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Brand header */}
        <div className="shrink-0 border-b border-border/40 px-7 pb-6 pt-7">
          <div className="flex items-start justify-between">
            <div>
              <TidlNavLogo variant="light" size="sm" />
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89C82]">Health platform</p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-mr-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground/40 transition-colors hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Account / guest card */}
          {isAuthenticated ? (
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex items-center justify-between rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.07)]"
            >
              <div className="flex items-center gap-3.5">
                <Avatar user={user} />
                <div>
                  <p className="text-[15px] font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[12px] text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <NavArrow />
            </Link>
          ) : (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div>
                <p className="text-[15px] font-semibold text-foreground">Guest</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">Sign in to manage your health journey</p>
              </div>
              <button
                type="button"
                onClick={() => { openAuthModal({ mode: "login" }); setMenuOpen(false); }}
                className="ml-4 shrink-0 rounded-full border border-border/70 px-4 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-surface"
              >
                Log in
              </button>
            </div>
          )}
        </div>

        {/* Scrollable nav links */}
        <nav data-lenis-prevent className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-7 pb-10 pt-6">
          <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">Discover</p>
          <ul className="space-y-3">
            <li>
              <Link
                to={DISCOVER_ITEM.to}
                onClick={() => setMenuOpen(false)}
                className={`${CARD_BASE} border-[rgba(243,195,0,0.35)] bg-[linear-gradient(180deg,#fffdf5_0%,#ffffff_100%)] ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                style={{ transitionDelay: menuOpen ? "80ms" : "0ms" }}
              >
                <div className="flex items-start justify-between">
                  <div className="pr-2">
                    <p className="text-[15px] font-semibold leading-tight text-foreground">{DISCOVER_ITEM.title}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{DISCOVER_ITEM.description}</p>
                  </div>
                  <NavArrow />
                </div>
              </Link>
            </li>
          </ul>

          <p className="mb-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">Explore</p>
          <ul className="space-y-3">
            {EXPLORE_ITEMS.map((item, idx) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`${CARD_BASE} ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                  style={{ transitionDelay: menuOpen ? `${100 + idx * 55}ms` : "0ms" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="pr-2">
                      <p className="text-[15px] font-semibold leading-tight text-foreground">{item.title}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{item.description}</p>
                    </div>
                    <NavArrow />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">Popular Treatments</p>
          <ul className="space-y-3">
            {POPULAR_ITEMS.map((item, idx) => (
              <li key={item.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: item.slug }}
                  onClick={() => setMenuOpen(false)}
                  className={`${CARD_BASE} ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                  style={{ transitionDelay: menuOpen ? `${320 + idx * 55}ms` : "0ms" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="pr-2">
                      <p className="text-[15px] font-semibold leading-tight text-foreground">{item.title}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{item.description}</p>
                    </div>
                    <NavArrow />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">Resources</p>
          <ul className="space-y-3">
            {RESOURCE_ITEMS.map((item, idx) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${CARD_BASE} ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                  style={{ transitionDelay: menuOpen ? `${500 + idx * 55}ms` : "0ms" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="pr-2">
                      <p className="text-[15px] font-semibold leading-tight text-foreground">{item.title}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{item.description}</p>
                    </div>
                    <NavArrow />
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => { logout(); setMenuOpen(false); }}
              className="mt-7 flex items-center gap-2 rounded-xl px-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign out
            </button>
          )}
        </nav>

        {/* Sticky footer CTA */}
        <div className="shrink-0 rounded-bl-[2.5rem] border-t border-border/40 bg-white/80 px-7 pb-8 pt-5 backdrop-blur-sm">
          <p className="mb-3.5 text-center text-[14px] font-semibold tracking-tight text-foreground">
            Ready to start your journey?
          </p>
          <div className="space-y-2.5">
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => { openAuthModal({ mode: "login" }); setMenuOpen(false); }}
                className="flex w-full items-center justify-center rounded-[1.25rem] border border-border/70 bg-white py-3.5 text-[14px] font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] active:translate-y-0"
              >
                Log in
              </button>
            )}
            <button
              type="button"
              onClick={() => { openQuiz(); setMenuOpen(false); }}
              className="flex w-full items-center justify-center rounded-[1.25rem] bg-gradient-to-r from-[#C9A200] to-[#F3C300] py-4 text-[14px] font-semibold text-black shadow-[0_8px_22px_rgba(243,195,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(243,195,0,0.45)] active:translate-y-0"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
