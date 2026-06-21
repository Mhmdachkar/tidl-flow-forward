import { ChevronRight, User, LogOut, X, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useAuth } from "@/providers/auth-provider";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";

import tidlLogo from "@/assets/tidl_logo (2).png";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";

const NAV_LINKS = [
  { label: "Weight loss", to: "/weight-loss" as const },
  { label: "Longevity", to: "/longevity" as const },
  { label: "Hormonal", to: "/hormonal" as const },
  { label: "Performance", to: "/performance" as const },
];

function NavAvatar({
  user,
  scrolled,
  size = "sm",
}: {
  user: { firstName: string; lastName?: string; email?: string } | null;
  scrolled?: boolean;
  size?: "sm" | "md";
}) {
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";
  const dim = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-[11px]";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A200] to-[#F3C300] font-bold text-black shadow-[0_0_0_2px_rgba(243,195,0,0.35)] transition-shadow hover:shadow-[0_0_0_3px_rgba(243,195,0,0.5)] ${dim} ${
        scrolled === false ? "shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" : ""
      }`}
      aria-label={user ? `${user.firstName} ${user.lastName ?? ""}` : "Account"}
    >
      {initials}
    </span>
  );
}

export function NavSection() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { openModal } = useQuizModal();
  const { openModal: openAuthModal } = useAuthModal();

  useEffect(() => {
    gsap.from(ref.current, { y: -40, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.3 });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "bg-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.45)]" : "bg-transparent"
        }`}
      >
        {/* Gold announcement bar */}
        <div
          className={`overflow-hidden bg-[#F3C300] transition-[max-height,opacity,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? "max-h-0 opacity-0 py-0" : "max-h-12 opacity-100 py-1"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 text-[11px] leading-tight text-ink">
            <span>Personalised longevity care is here.</span>
            <a
              href="#treatments"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/15 px-2.5 py-0.5 text-[10px] font-medium transition-colors hover:bg-black/25"
            >
              Check it out →
            </a>
          </div>
        </div>

        <div
          className={`transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? "bg-transparent" : "bg-[#F3C300]"
          }`}
        >
          <nav
            className={`px-4 sm:px-6 lg:px-10 transition-[background-color,border-radius,box-shadow,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled
                ? "rounded-none bg-transparent py-1.5 shadow-none"
                : "rounded-t-[2rem] bg-white py-2 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            }`}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <Link to="/" className="flex items-center">
                <img
                  src={scrolled ? tidlLogoYellow : tidlLogo}
                  alt="TIDL"
                  className={`object-contain transition-[height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    scrolled ? "h-11" : "h-14"
                  }`}
                  draggable={false}
                />
              </Link>

              <div />

              <div className="flex items-center gap-1.5 sm:gap-2">
                {isAuthenticated ? (
                  <Link to="/account" aria-label="My account" className="hidden items-center gap-2 sm:flex">
                    <NavAvatar user={user} scrolled={scrolled} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal({ mode: "login" })}
                    className={`hidden rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block ${
                      scrolled
                        ? "border border-transparent bg-[#F3C300] px-2.5 py-0.5 text-[10px] text-black hover:bg-[#F9DC6B]"
                        : "border border-ink/15 bg-white px-3 py-1 text-[11px] text-ink hover:bg-ink/[0.03] sm:px-3.5"
                    }`}
                  >
                    Log in
                  </button>
                )}

                <button
                  type="button"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-65 ${
                    scrolled ? "h-6 w-6 text-white" : "h-7 w-7 text-ink sm:h-8 sm:w-8"
                  }`}
                >
                  {menuOpen ? (
                    <X width={scrolled ? 16 : 18} height={scrolled ? 16 : 18} />
                  ) : (
                    <Menu width={scrolled ? 16 : 18} height={scrolled ? 16 : 18} />
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[90vw] flex-col bg-[#111] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F3C300] to-transparent" />

        <div className="flex items-center justify-between px-6 py-5">
          {isAuthenticated ? (
            <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
              <NavAvatar user={user} size="md" />
              <div>
                <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-white/40">{user?.email}</p>
              </div>
            </Link>
          ) : (
            <span className="text-xs uppercase tracking-[0.18em] text-white/40">Menu</span>
          )}
          <button type="button" onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-white/10" />

        <nav className="flex-1 overflow-y-auto px-6 pt-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">Treatments</p>
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-5 h-px bg-white/10" />

          <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">Products</p>
          <ul className="space-y-1">
            {[
              { label: "Lirosiome — GLP-1", slug: "lirosome" as const },
              { label: "Tirosane — Longevity", slug: "tirosane" as const },
              { label: "TIDL Core", slug: "tidl-core" as const },
              { label: "TIDL Cycle", slug: "tidl-cycle" as const },
            ].map((p) => (
              <li key={p.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  {p.label}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-5 h-px bg-white/10" />

          {isAuthenticated ? (
            <>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
                {user?.firstName} {user?.lastName}
              </p>
              <ul className="space-y-1">
                {[
                  { label: "My account", to: "/account" as const },
                  { label: "My orders", to: "/account/orders" as const },
                  { label: "My treatment", to: "/account/treatment" as const },
                  { label: "Support", to: "/account/support" as const },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => { logout(); setMenuOpen(false); }}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/40 transition-colors hover:bg-white/8 hover:text-white/70"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { openAuthModal({ mode: "login" }); setMenuOpen(false); }}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Log in
                </span>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </button>
              <button
                type="button"
                onClick={() => { openAuthModal({ mode: "signup" }); setMenuOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F3C300] px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Create account
              </button>
            </div>
          )}
        </nav>

        <div className="px-6 pb-8 pt-4">
          <button
            type="button"
            onClick={() => { openModal(); setMenuOpen(false); }}
            className="btn-primary flex w-full justify-center py-3.5 text-sm"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </>
  );
}
