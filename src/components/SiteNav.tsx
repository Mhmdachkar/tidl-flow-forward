import { LogOut, Menu, User, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";

const EXPLORE_ITEMS = [
  {
    title: "Weight Loss",
    description: "Personalized treatment plans and physician-guided options",
    to: "/weight-loss" as const,
  },
  {
    title: "Longevity",
    description: "Support long-term wellness and healthy aging",
    to: "/longevity" as const,
  },
  {
    title: "Hormonal Health",
    description: "Personalized balance and optimization programs",
    to: "/hormonal" as const,
  },
  {
    title: "Performance",
    description: "Improve energy, lifestyle, and daily performance",
    to: "/performance" as const,
  },
];

const POPULAR_ITEMS = [
  {
    title: "GLP-1 Programs",
    description: "Physician-guided metabolic and weight care",
    slug: "lirosome" as const,
  },
  {
    title: "Personalized Treatments",
    description: "Tailored protocols built around your goals",
    slug: "tirosane" as const,
  },
  {
    title: "Wellness Plans",
    description: "Foundational programs for long-term health",
    slug: "tidl-core" as const,
  },
];

const RESOURCE_ITEMS = [
  {
    title: "How it works",
    description: "Understand our physician-led care process",
    href: "/#how-it-works",
  },
  {
    title: "Treatment overview",
    description: "Explore the full range of available care",
    href: "/#treatments",
  },
  {
    title: "FAQs",
    description: "Answers to common care questions",
    href: "/#faqs",
  },
  {
    title: "Contact support",
    description: "Reach our care team whenever you need",
    href: "/account/support",
  },
];

function Avatar({ user }: { user: { firstName: string; lastName?: string } | null }) {
  if (!user) return <User className="h-4 w-4" />;
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

interface SiteNavProps {
  /** If true the header blends with a dark page background (no white, always dark). Default: true */
  dark?: boolean;
}

export function SiteNav({ dark = true }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { openModal } = useQuizModal();
  const { openModal: openAuthModal } = useAuthModal();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll (and pause Lenis where present) when menu is open
  useEffect(() => {
    if (menuOpen) {
      lockPageScroll();
      return () => unlockPageScroll();
    }
  }, [menuOpen]);

  const bg = dark
    ? "bg-black/90 border-b border-white/10 backdrop-blur-md"
    : "bg-white/90 border-b border-border/60 backdrop-blur-md";
  const textColor = dark ? "text-white" : "text-foreground";
  const mutedColor = dark ? "text-white/50" : "text-muted-foreground";
  const linkHover = dark
    ? "text-white/60 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  return (
    <>
      <header className={`sticky top-0 z-40 ${bg}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={tidlLogoYellow}
              alt="TIDL"
              className="h-10 object-contain"
              draggable={false}
            />
          </Link>

          {/* Desktop links intentionally empty — links live in the hamburger drawer only */}
          <div />

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/account"
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    dark
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-surface hover:bg-surface-2 text-foreground"
                  }`}
                >
                  <Avatar user={user} />
                  <span>{user?.firstName}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${
                    dark ? "text-white/40 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal({ mode: "login" })}
                className={`hidden rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:block ${
                  dark
                    ? "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                Log in
              </button>
            )}

            {/* Start Assessment — desktop */}
            <Link
              to="/quiz"
              className="hidden rounded-full bg-[#F3C300] px-3.5 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90 sm:block"
            >
              Start Assessment
            </Link>

            {/* Avatar bubble in header (mobile, logged in) */}
            {isAuthenticated && (
              <Link
                to="/account"
                className="flex sm:hidden"
                aria-label="Account"
              >
                <Avatar user={user} />
              </Link>
            )}

            {/* Hamburger */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                dark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-foreground/70 hover:bg-surface hover:text-foreground"
              }`}
            >
              {menuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-black/30 transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[540px] flex-col rounded-l-[2.5rem] bg-[#FBFAF8] shadow-[-12px_0_70px_rgba(0,0,0,0.16)] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Brand header */}
        <div className="shrink-0 border-b border-border/40 px-7 pb-6 pt-7">
          <div className="flex items-start justify-between">
            <div>
              <img src={tidlLogoYellow} alt="TIDL" className="h-7 w-auto" />
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89C82]">
                Health platform
              </p>
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

          {/* Account card */}
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
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                  Sign in to manage your health journey
                </p>
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

        {/* Scrollable nav */}
        <nav data-lenis-prevent className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-7 pb-10 pt-6">
          {/* Explore */}
          <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">
            Explore
          </p>
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

          {/* Popular Treatments */}
          <p className="mb-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">
            Popular Treatments
          </p>
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

          {/* Resources */}
          <p className="mb-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89C82]">
            Resources
          </p>
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

        {/* Sticky premium footer */}
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
              onClick={() => { openModal(); setMenuOpen(false); }}
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
