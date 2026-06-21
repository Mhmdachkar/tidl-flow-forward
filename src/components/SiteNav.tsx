import { ChevronRight, LogOut, Menu, User, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";

const NAV_LINKS = [
  { label: "Weight loss", to: "/weight-loss" as const },
  { label: "Longevity", to: "/longevity" as const },
  { label: "Hormonal", to: "/hormonal" as const },
  { label: "Performance", to: "/performance" as const },
];

const PRODUCT_LINKS = [
  { label: "Lirosiome — GLP-1", slug: "lirosome" as const },
  { label: "Tirosane — Longevity", slug: "tirosane" as const },
  { label: "TIDL Core", slug: "tidl-core" as const },
  { label: "TIDL Cycle", slug: "tidl-cycle" as const },
];

const ACCOUNT_LINKS = [
  { label: "My account", to: "/account" as const },
  { label: "My orders", to: "/account/orders" as const },
  { label: "My treatment", to: "/account/treatment" as const },
  { label: "Support", to: "/account/support" as const },
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[90vw] flex-col bg-[#111] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F3C300] to-transparent" />

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-white/40">{user?.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-xs uppercase tracking-[0.18em] text-white/40">Menu</span>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-white/10" />

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {/* Account links (if logged in) */}
          {isAuthenticated && (
            <>
              <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-white/30">Account</p>
              <ul className="space-y-0.5">
                {ACCOUNT_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                    >
                      {item.label}
                      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-4 h-px bg-white/10" />
            </>
          )}

          {/* Treatments */}
          <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-white/30">Treatments</p>
          <ul className="space-y-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 h-px bg-white/10" />

          {/* Products */}
          <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-white/30">Products</p>
          <ul className="space-y-0.5">
            {PRODUCT_LINKS.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  {p.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Sign out / Log in at bottom of list */}
          <div className="my-4 h-px bg-white/10" />
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => { logout(); setMenuOpen(false); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/8 hover:text-white/70"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Log in
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#F3C300] px-3 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Create account
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom CTA */}
        <div className="px-5 pb-8 pt-3">
          <Link
            to="/quiz"
            onClick={() => setMenuOpen(false)}
            className="btn-primary flex w-full justify-center py-3.5 text-sm"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    </>
  );
}
