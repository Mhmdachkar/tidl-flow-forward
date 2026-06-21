import {
  BookOpenText,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Gauge,
  HeartPulse,
  LifeBuoy,
  LogOut,
  Menu,
  Scale,
  Sparkles,
  User,
  Workflow,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";

const EXPLORE_ITEMS = [
  {
    title: "Weight Loss",
    description: "Personalized plans and treatment options",
    to: "/weight-loss" as const,
    icon: Scale,
  },
  {
    title: "Longevity",
    description: "Support healthy aging and wellness",
    to: "/longevity" as const,
    icon: Sparkles,
  },
  {
    title: "Hormonal Health",
    description: "Balance and optimization programs",
    to: "/hormonal" as const,
    icon: HeartPulse,
  },
  {
    title: "Performance",
    description: "Improve energy and lifestyle",
    to: "/performance" as const,
    icon: Gauge,
  },
];

const POPULAR_ITEMS = [
  {
    title: "GLP-1 Programs",
    description: "Physician-guided metabolic care",
    slug: "lirosome" as const,
    icon: FlaskConical,
  },
  {
    title: "Personalized Treatments",
    description: "Tailored protocols by your goals",
    slug: "tirosane" as const,
    icon: Workflow,
  },
  {
    title: "Wellness Plans",
    description: "Foundational plans for long-term health",
    slug: "tidl-core" as const,
    icon: Sparkles,
  },
];

const RESOURCE_ITEMS = [
  {
    title: "How it works",
    description: "Understand our physician-led process",
    href: "/#how-it-works",
    icon: Workflow,
  },
  {
    title: "Health articles",
    description: "Evidence-based education and insights",
    href: "/#science",
    icon: BookOpenText,
  },
  {
    title: "FAQs",
    description: "Answers to common care questions",
    href: "/#faqs",
    icon: CircleHelp,
  },
  {
    title: "Contact support",
    description: "Talk to our care team when needed",
    href: "/account/support",
    icon: LifeBuoy,
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

interface SiteNavProps {
  /** If true the header blends with a dark page background (no white, always dark). Default: true */
  dark?: boolean;
}

export function SiteNav({ dark = true }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { openModal } = useQuizModal();

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
              <Link
                to="/login"
                className={`hidden rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:block ${
                  dark
                    ? "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                Log in
              </Link>
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
        className={`fixed right-0 top-0 z-[60] flex h-full w-[400px] sm:w-[450px] lg:w-[500px] flex-col rounded-l-[2.35rem] bg-[#FCFCFB] shadow-[-10px_0_60px_rgba(0,0,0,0.14)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border/60 bg-gradient-to-b from-[#FFFDF5] to-[#FCFCFB] px-6 pb-5 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={tidlLogoYellow} alt="TIDL" className="h-7 w-auto" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9B927C]">Dashboard</p>
                <p className="text-sm font-semibold text-foreground">Navigation</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white text-foreground/60 transition-colors hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isAuthenticated && (
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center justify-between rounded-2xl border border-border/50 bg-white/90 px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-3">
                <Avatar user={user} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/35" />
            </Link>
          )}

          {!isAuthenticated && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/50 bg-white/90 px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF6D8] text-[#8A6D00]">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Guest</p>
                  <p className="text-[11px] text-muted-foreground">Log in to access account tools</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-6 pb-36 pt-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B927C]">
            Explore
          </p>
          <ul className="space-y-2.5">
            {EXPLORE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3.5 shadow-[0_6px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#F3C300]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.07)] ${
                      menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${80 + idx * 45}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E7] text-[#B28B00]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/35 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mb-3 mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B927C]">
            Popular Treatments
          </p>
          <ul className="space-y-2.5">
            {POPULAR_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={item.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: item.slug }}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3.5 shadow-[0_6px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#F3C300]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.07)] ${
                      menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${280 + idx * 45}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E7] text-[#B28B00]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/35 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mb-3 mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B927C]">
            Resources
          </p>
          <ul className="space-y-2.5">
            {RESOURCE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3.5 shadow-[0_6px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#F3C300]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.07)] ${
                      menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${470 + idx * 45}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E7] text-[#B28B00]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/35 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => { logout(); setMenuOpen(false); }}
                className="mt-6 flex items-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </nav>

        {/* Sticky bottom CTA */}
        <div className="shrink-0 rounded-bl-[2rem] border-t border-border/60 bg-gradient-to-t from-white to-[#FCFCFB] px-6 pb-8 pt-5">
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mb-3 flex items-center justify-center rounded-[1.1rem] border border-border/70 bg-white py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-surface"
            >
              Log in
            </Link>
          )}
          <button
            type="button"
            onClick={() => { openModal(); setMenuOpen(false); }}
            className="flex w-full items-center justify-center rounded-[1.1rem] bg-gradient-to-r from-[#C9A200] to-[#F3C300] py-4 text-sm font-semibold text-black shadow-[0_8px_20px_rgba(243,195,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(243,195,0,0.4)]"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </>
  );
}
