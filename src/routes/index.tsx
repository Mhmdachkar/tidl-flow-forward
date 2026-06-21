import { ChevronRight, User, LogOut, X, Menu } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenisScroll } from "@/lib/use-lenis";
import { MagneticButton } from "@/components/MagneticButton";
import { PhoneApp } from "@/components/PhoneApp";
import { PixelButton } from "@/components/PixelButton";
import { getProductListItems } from "@/data/products";
import { useAuth } from "@/providers/auth-provider";

import hero from "@/assets/hero image 3d.png";
import heroBg from "@/assets/hero bg.jpeg";
import tidlLogo from "@/assets/tidl_logo (2).png";
import tidlLogoYellow from "@/assets/TIDL_LOGO_YELLOW.png";
import footerLogo from "@/assets/tidl_logo.png";
import phoneImg from "@/assets/phone 3d.png";
import voxel from "@/assets/kling_20260617_作品_REFERENCE__2212_0.mp4";
import men2 from "@/assets/men 2 3d.png";
import womenCut from "@/assets/women 3d.png";
import redman from "@/assets/men 3d.png";
import product1 from "@/assets/product 1 3d.png";
import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIDL — A clinical operating system for longevity" },
      { name: "description", content: "TIDL pairs clinical diagnostics with the next generation of metabolic, hormonal and longevity therapies — engineered for a longer, better life." },
      { property: "og:title", content: "TIDL — A clinical operating system for longevity" },
      { property: "og:description", content: "Personalised, physician-supervised longevity care." },
    ],
  }),
  component: Index,
});

/* ───────── helpers ───────── */

function SplitWords({
  text, className = "", wordClassName = "", delay = 0, trigger = "scroll", duration = 1.6,
}: {
  text: string; className?: string; wordClassName?: string; delay?: number;
  trigger?: "scroll" | "immediate"; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".w");
    const base = { yPercent: 110, opacity: 0 };
    const to = { yPercent: 0, opacity: 1, duration, ease: "expo.out", stagger: 0.09, delay };
    if (trigger === "immediate") {
      gsap.fromTo(words, base, to);
    } else {
      gsap.fromTo(words, base, {
        ...to,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }
  }, [delay, trigger, duration]);
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className={`w inline-block will-change-transform ${wordClassName}`}>{w}</span>
        </span>
      ))}
    </span>
  );
}

/* ───────── page ───────── */

function Index() {
  useLenisScroll();
  return (
    <div className="relative bg-[#e2e2e2] text-foreground overflow-x-clip">
      <div className="scroll-progress" />
      {/* Header and Hero stay unchanged */}
      <Nav />
      <Hero />

      {/* Every section below gets its own rounded card */}
      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="overflow-hidden bg-surface"><Marquee /></div>
        <div className="section-card-dark"><VoxelSection /></div>
        <div className="section-card">
          <HumanSection
            img={womenCut}
            align="left"
            tag="Longevity intelligence"
            title="A clinical view of you."
            body="Bloodwork, biomarkers and lifestyle telemetry — synthesised by your care team into a single, evolving plan."
            chips={[
              { label: "Bio age",      value: "−3.4 yrs",  pos: "top-[10%] left-[-4%]"  },
              { label: "VO₂ max",      value: "48.2",      pos: "top-[6%] left-[70%]"   },
              { label: "ApoB",         value: "62 mg/dL",  pos: "top-[34%] left-[80%]"  },
              { label: "HRV",          value: "74 ms",     pos: "top-[60%] left-[78%]"  },
              { label: "Sleep",        value: "92%",       pos: "top-[48%] left-[-6%]"  },
              { label: "hsCRP",        value: "0.4",       pos: "top-[78%] left-[8%]"   },
            ]}
          />
        </div>
        <div className="section-card"><ProductsSection /></div>
        <RedManSection />
        <div className="section-card"><PhoneSection /></div>
        <div className="section-card">
          <HumanSection
            img={men2}
            align="right"
            tag="Performance"
            title="Built for the long climb."
            body="Hormonal optimisation, metabolic care and recovery science — calibrated to where you're going, not just where you are."
            blendMode="multiply"
            chips={[
              { label: "Testosterone", value: "812 ng/dL", pos: "top-[12%] left-[-4%]"  },
              { label: "Recovery",     value: "Optimal",   pos: "top-[18%] left-[78%]"  },
              { label: "Zone 2",       value: "138 W",     pos: "top-[78%] left-[68%]"  },
              { label: "Grip",         value: "+18%",      pos: "top-[68%] left-[2%]"   },
              { label: "Resting HR",   value: "52 bpm",    pos: "top-[-2%] left-[40%]"  },
            ]}
          />
        </div>
      </div>

      <PenSection />

      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="section-card"><ProtocolTimelineSection /></div>
        <div className="section-card"><ScienceMetricsSection /></div>
        <div className="section-card-dark"><Cta /></div>
        <div className="section-card-dark"><Footer /></div>
      </div>
    </div>
  );
}

/* ───────── nav ───────── */

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
        scrolled === false
          ? "shadow-[0_0_0_2px_rgba(0,0,0,0.15)]"
          : ""
      }`}
      aria-label={user ? `${user.firstName} ${user.lastName ?? ""}` : "Account"}
    >
      {initials}
    </span>
  );
}

const NAV_LINKS = [
  { label: "Weight loss", to: "/weight-loss" as const },
  { label: "Longevity", to: "/longevity" as const },
  { label: "Hormonal", to: "/hormonal" as const },
  { label: "Performance", to: "/performance" as const },
];

function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    gsap.from(ref.current, { y: -40, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.3 });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / escape
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

              {/* Desktop nav links removed — hamburger only */}
              <div />

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Auth button — avatar circle when logged in */}
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    aria-label="My account"
                    className="hidden items-center gap-2 sm:flex"
                  >
                    <NavAvatar user={user} scrolled={scrolled} />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`hidden rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block ${
                      scrolled
                        ? "border border-transparent bg-[#F3C300] px-2.5 py-0.5 text-[10px] text-black hover:bg-[#F9DC6B]"
                        : "border border-ink/15 bg-white px-3 py-1 text-[11px] text-ink hover:bg-ink/[0.03] sm:px-3.5"
                    }`}
                  >
                    Log in
                  </Link>
                )}

                {/* Hamburger */}
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

      {/* Mobile / full menu drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-72 max-w-[90vw] flex-col bg-[#111] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Gold stripe */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F3C300] to-transparent" />

        <div className="flex items-center justify-between px-6 py-5">
          {isAuthenticated ? (
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <NavAvatar user={user} size="md" />
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-white/40">{user?.email}</p>
              </div>
            </Link>
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

        <nav className="flex-1 overflow-y-auto px-6 pt-4">
          {/* Category links */}
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

          {/* Products */}
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

          {/* Account section */}
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
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Log in
                </span>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#F3C300] px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Create account
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom CTA */}
        <div className="px-6 pb-8 pt-4">
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

/* ───────── hero ───────── */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const discImgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    tl.fromTo(
      discRef.current,
      { opacity: 0, scale: 0.7, rotateY: -18, rotateX: 12, y: 60 },
      { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, y: 0, duration: 2.4, ease: "power4.out" },
      0.9
    );
    tl.fromTo(paraRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 2.4);
    tl.fromTo(ctaRef.current?.children || [], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 2.8);

    if (ringRef.current) {
      gsap.to(ringRef.current, { rotate: 360, duration: 60, ease: "none", repeat: -1, delay: 0.9 });
    }

    gsap.to(discImgRef.current, {
      y: -14, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.6,
    });

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      gsap.to(discImgRef.current, {
        rotateY: cx * 10, rotateX: -cy * 8, x: cx * 12, duration: 1.4, ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    gsap.to(discRef.current, {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero relative overflow-hidden bg-background pt-[calc(5.5rem+0.5cm)] pb-8 lg:pb-10">
      <div className="relative overflow-visible">
        <div ref={bgRef} className="absolute inset-0 opacity-0">
          <img
            src={heroBg}
            alt=""
            className="h-full w-full object-cover object-[center_calc(50%-2cm)]"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
            <div className="text-left">
              <h1 className="font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.08] tracking-tight text-ink">
                <span className="block"><SplitWords text="Live better." trigger="immediate" delay={0.7} duration={1.6} /></span>
                <span className="block"><SplitWords text="Longer." wordClassName="text-gradient-clinical" trigger="immediate" delay={0.95} duration={1.6} /></span>
                <span className="block"><SplitWords text="Feel like you." trigger="immediate" delay={1.2} duration={1.6} /></span>
              </h1>

              <p ref={paraRef} className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft opacity-0 sm:text-base">
                A clinical operating system pairing diagnostic-grade biomarkers with metabolic, hormonal and longevity therapies delivered to your door.
              </p>

              <div ref={ctaRef} className="mt-7 flex flex-wrap items-center justify-start gap-3">
                <MagneticButton as="a" href="/quiz" className="btn-primary">
                  Start your assessment →
                </MagneticButton>
                <MagneticButton className="btn-ghost">Watch the film</MagneticButton>
              </div>
            </div>

            <div ref={discRef} className="relative mx-auto h-[min(68vw,380px)] w-full max-w-[560px] [perspective:1400px] sm:h-[440px] lg:mx-0 lg:ml-auto lg:h-[480px] lg:max-w-none">
              <div
                className="absolute inset-x-10 bottom-6 h-12 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.22), transparent 70%)" }}
              />
              <div
                ref={ringRef}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[min(92vw,380px)] w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[520px] sm:w-[520px] lg:h-[560px] lg:w-[560px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(216,199,154,0.55) 60deg, transparent 130deg, rgba(216,199,154,0.35) 220deg, transparent 320deg)",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
                  maskImage:
                    "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
                  opacity: 0.85,
                }}
              />
              <img
                ref={discImgRef}
                src={hero}
                alt="TIDL longevity product"
                className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
                style={{
                  filter: "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))",
                  background: "transparent",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── marquee ───────── */

function Marquee() {
  const items = ["Metabolic care", "Hormonal optimisation", "Longevity diagnostics", "GLP-1 protocols", "Recovery science", "Clinical concierge"];
  const track = [...items, ...items, ...items];
  return (
    <section className="relative py-3 overflow-hidden bg-surface rounded-none" style={{ marginTop: "0.2cm" }}>
      {/* left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-surface to-transparent" />
      {/* right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-surface to-transparent" />

      <div className="flex gap-2 whitespace-nowrap animate-[marquee_18s_linear_infinite] will-change-transform">
        {track.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-background px-4 py-1.5 text-xs font-medium text-ink/70 shrink-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F3C300]" />
            {t}
          </span>
        ))}
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </section>
  );
}

/* ───────── voxel section ───────── */

function VoxelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const pin = ScrollTrigger.create({
      trigger: section, start: "top top", end: "+=180%", pin: true,
      onEnter: () => video.play().catch(() => {}),
      onEnterBack: () => video.play().catch(() => {}),
    });

    gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, ease: "expo.out",
      scrollTrigger: { trigger: section, start: "+=110% top", end: "+=70%", scrub: 1 },
    });

    return () => { pin.kill(); };
  }, []);

  return (
    <section id="science" ref={sectionRef} className="relative h-[100svh] overflow-hidden bg-[#0d1117]">
      <video ref={videoRef} src={voxel} muted playsInline loop preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/0" />

      <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-20 px-6 pb-16">
        <div className="mx-auto max-w-5xl text-center text-white">
          <span className="pill-tag mb-6 !bg-white/10 !border-white/20 !text-white/85"><span className="dot !bg-[#F9DC6B]" /> Voxel-level diagnostics</span>
          <h2 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[1.02]">
            We rebuild you, <span className="italic text-gradient-clinical">one voxel at a time.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            High-resolution imaging, continuous biomarkers and lifestyle data are fused into a living model of your physiology — the substrate for every TIDL decision.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <MagneticButton className="btn-primary">Explore the science</MagneticButton>
            <MagneticButton className="btn-ghost !bg-white/8 !text-white !border-white/25">Read the methodology</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── human storytelling ───────── */

type Chip = { label: string; value: string; pos: string };

function HumanSection({
  img, align, tag, title, body, chips, blendMode,
}: { img: string; align: "left" | "right"; tag: string; title: string; body: string; chips: Chip[]; blendMode?: "normal" | "multiply" | "darken" }) {
  const ref = useRef<HTMLElement>(null);
  const personRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const person = personRef.current;
    const chipEls = Array.from(sec.querySelectorAll<HTMLElement>(".chip-data"));
    const headline = sec.querySelector<HTMLElement>(".copy-headline");
    const para = sec.querySelector<HTMLElement>(".copy-para");
    const cta = sec.querySelector<HTMLElement>(".copy-cta");
    const pill = sec.querySelector<HTMLElement>(".copy-pill");
    const floatWrap = sec.querySelector<HTMLElement>(".person-float");
    const stageWrap = sec.querySelector<HTMLElement>(".person-stage");

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
        (mctx) => {
          const { isMobile } = mctx.conditions as { isMobile: boolean };
          const travel = isMobile ? 36 : 56;
          const copyDrop = isMobile ? -22 : -32;

          gsap.set([pill, headline, para, cta], { opacity: 0, y: copyDrop });
          if (person) gsap.set(person, { opacity: 0, y: travel, scale: 0.96 });
          gsap.set(chipEls, { opacity: 0, y: 20, scale: 0.92, filter: "blur(4px)" });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });

          // Copy — top → down
          tl.to(pill, { opacity: 1, y: 0, duration: 0.35 }, 0);
          tl.to(headline, { opacity: 1, y: 0, duration: 0.38 }, 0.05);
          tl.to(para, { opacity: 1, y: 0, duration: 0.35 }, 0.1);
          tl.to(cta, { opacity: 1, y: 0, duration: 0.35 }, 0.15);

          // Person — bottom → up
          if (person) {
            tl.to(person, { opacity: 1, y: 0, scale: 1, duration: isMobile ? 0.85 : 1 }, 0.08);
          }

          chipEls.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4 },
              0.22 + i * 0.05
            );
          });

          ScrollTrigger.create({
            trigger: sec,
            start: isMobile ? "top 90%" : "top 85%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse",
            animation: tl,
          });
        }
      );

      if (floatWrap) {
        gsap.to(floatWrap, {
          y: -8,
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (stageWrap) {
        gsap.fromTo(
          stageWrap,
          { yPercent: 4 },
          {
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.2 },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, [align, chips]);

  // Feathered radial mask removes residual rectangular PNG background bleed.
  // Stronger feather + multiply blending for assets with visible rectangular fills (e.g. men2).
  const featherMask = blendMode === "multiply"
    ? "radial-gradient(ellipse 60% 76% at 50% 52%, #000 48%, rgba(0,0,0,0.7) 66%, rgba(0,0,0,0) 92%)"
    : "radial-gradient(ellipse 70% 82% at 50% 52%, #000 58%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0) 94%)";

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 sm:gap-12 px-5 sm:px-6 lg:grid-cols-12">
        <div className={`relative lg:col-span-7 ${align === "right" ? "lg:order-2" : ""}`}>
          <div className="person-stage relative aspect-[4/5] w-full max-w-[640px] mx-auto will-change-transform">
            <div className="person-float absolute inset-0">
            <img
              ref={personRef}
              src={img}
              alt=""
              className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
              style={{
                filter: "drop-shadow(0 40px 60px rgba(40,60,100,0.22))",
                background: "transparent",
                mixBlendMode: blendMode ?? "normal",
                WebkitMaskImage: featherMask,
                maskImage: featherMask,
              }}
            />
            {chips.map((c, i) => (
              <div key={i} className={`chip-data absolute ${c.pos} will-change-transform z-10`}>
                <div className="chip-glow relative rounded-2xl bg-white/75 backdrop-blur-md ring-1 ring-black/5 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_10px_30px_-10px_rgba(40,60,100,0.22)]">
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-ink/50">{c.label}</div>
                  <div className="font-display text-[13px] sm:text-base text-ink leading-tight">{c.value}</div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className={`copy lg:col-span-5 ${align === "right" ? "lg:order-1" : ""}`}>
          <span className="copy-pill pill-tag mb-5 inline-flex"><span className="dot" /> {tag}</span>
          <h2 className="copy-headline font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02] text-ink">{title}</h2>
          <p className="copy-para mt-5 text-ink-soft max-w-md">{body}</p>
          <div className="copy-cta mt-7"><MagneticButton className="btn-ghost">See the protocol →</MagneticButton></div>
        </div>
      </div>
    </section>
  );
}

/* ───────── whole-system care (Hims-style bento grid) ───────── */

const CARE_HERO = [
  {
    badge: "New",
    title: "Start your metabolic protocol today",
    link: "Find your Rx match",
    img: product1,
    tone: "dark" as const,
  },
  {
    badge: null,
    title: "Track your longevity score over time",
    link: "View your dashboard",
    img: redman,
    tone: "gold" as const,
  },
] as const;

const CARE_CATEGORIES = [
  { label: "Hormonal balance", highlight: "Hormonal", img: product3, to: "/hormonal" as const },
  { label: "Metabolic care", highlight: "Metabolic", img: product1, to: "/metabolic" as const },
  { label: "Recovery science", highlight: "Recovery", img: product2, to: "/recovery" as const },
  { label: "Longevity stack", highlight: "Longevity", img: product4, to: "/longevity" as const },
] as const;

function CareHeroCard({
  badge,
  title,
  link,
  img,
  tone,
}: (typeof CARE_HERO)[number]) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const card = cardRef.current;
    const image = imgRef.current;
    const copy = copyRef.current;
    const linkEl = linkRef.current;
    const chevron = chevronRef.current;
    const shine = shineRef.current;
    if (!card || !image || !copy || !linkEl || !chevron || !shine) return;

    gsap.set(image, { scale: 1, x: 0, y: 0, rotate: 0 });
    gsap.set(shine, { xPercent: -120, opacity: 0 });

    let hoverTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      hoverTl
        .to(card, { y: -10, scale: 1.02, duration: 0.45 }, 0)
        .to(image, { scale: 1.18, x: 14, y: -18, rotate: dark ? 8 : -6, duration: 0.55, ease: "back.out(1.8)" }, 0)
        .to(copy, { x: 6, y: -4, duration: 0.4 }, 0)
        .to(linkEl, { x: 8, opacity: 1, duration: 0.35 }, 0.05)
        .to(chevron, { x: 6, scale: 1.15, duration: 0.35, ease: "back.out(2)" }, 0.05)
        .to(shine, { xPercent: 120, opacity: dark ? 0.22 : 0.35, duration: 0.7, ease: "power2.inOut" }, 0);
    };

    const onLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      hoverTl
        .to(card, { y: 0, scale: 1, duration: 0.5 }, 0)
        .to(image, { scale: 1, x: 0, y: 0, rotate: 0, duration: 0.55 }, 0)
        .to(copy, { x: 0, y: 0, duration: 0.45 }, 0)
        .to(linkEl, { x: 0, duration: 0.4 }, 0)
        .to(chevron, { x: 0, scale: 1, duration: 0.4 }, 0)
        .to(shine, { xPercent: -120, opacity: 0, duration: 0.45 }, 0);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      hoverTl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [dark]);

  return (
    <a
      ref={cardRef}
      href="#treatments"
      className={`care-hero group relative flex min-h-[240px] overflow-hidden rounded-[1.75rem] will-change-transform sm:min-h-[300px] lg:min-h-[320px] ${
        dark ? "bg-black text-white" : "bg-[#F3C300] text-black"
      }`}
    >
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
      />

      <div ref={copyRef} className="care-hero-copy relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-9 will-change-transform">
        <div>
          {badge ? (
            <span
              className={`care-hero-badge mb-4 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${
                dark ? "bg-white/15 text-white" : "bg-black/10 text-black/80"
              }`}
            >
              {badge}
            </span>
          ) : null}
          <h3 className="max-w-[14ch] text-[clamp(1.35rem,2.8vw,2rem)] font-normal leading-[1.12] tracking-[-0.02em]">
            {title}
          </h3>
        </div>
        <span ref={linkRef} className={`text-sm will-change-transform ${dark ? "text-white/70" : "text-black/65"}`}>
          {link}
        </span>
      </div>

      <img
        ref={imgRef}
        src={img}
        alt=""
        className="care-hero-img pointer-events-none absolute bottom-0 right-0 z-[1] h-[72%] w-auto max-w-[58%] origin-bottom-right object-contain object-bottom will-change-transform sm:h-[78%] sm:max-w-[52%]"
        draggable={false}
      />

      <ChevronRight
        ref={chevronRef}
        className={`care-hero-chevron absolute bottom-6 right-6 z-10 h-5 w-5 will-change-transform ${dark ? "text-white/80" : "text-black/70"}`}
        strokeWidth={1.75}
      />
    </a>
  );
}

function CareCategoryCard({
  label,
  highlight,
  img,
  to,
}: (typeof CARE_CATEGORIES)[number]) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [before, after] = label.split(highlight);

  useEffect(() => {
    const card = cardRef.current;
    const labelEl = labelRef.current;
    const image = imgRef.current;
    const wrap = imgWrapRef.current;
    const chevron = chevronRef.current;
    const glow = glowRef.current;
    if (!card || !labelEl || !image || !wrap || !chevron || !glow) return;

    gsap.set(image, { opacity: 0, scale: 0.55, rotate: -14, y: 18 });
    gsap.set(wrap, { scale: 0.85 });
    gsap.set(glow, { opacity: 0, scale: 0.8 });

    let hoverTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      hoverTl
        .to(card, {
          y: -8,
          scale: 1.03,
          backgroundColor: "#ffffff",
          duration: 0.42,
          ease: "back.out(1.6)",
        }, 0)
        .to(labelEl, { x: -4, duration: 0.35 }, 0)
        .to(wrap, { scale: 1.15, duration: 0.45, ease: "back.out(2)" }, 0)
        .to(image, {
          opacity: 1,
          scale: 1.12,
          rotate: 0,
          y: 0,
          duration: 0.5,
          ease: "back.out(2.2)",
        }, 0.02)
        .to(glow, { opacity: 1, scale: 1, duration: 0.4 }, 0.05)
        .to(chevron, { x: 5, scale: 1.2, duration: 0.35, ease: "back.out(2)" }, 0.05);
    };

    const onLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      hoverTl
        .to(card, {
          y: 0,
          scale: 1,
          backgroundColor: "#ffffff",
          duration: 0.48,
        }, 0)
        .to(labelEl, { x: 0, duration: 0.4 }, 0)
        .to(wrap, { scale: 0.85, duration: 0.45 }, 0)
        .to(image, { opacity: 0, scale: 0.55, rotate: -14, y: 18, duration: 0.4 }, 0)
        .to(glow, { opacity: 0, scale: 0.8, duration: 0.35 }, 0)
        .to(chevron, { x: 0, scale: 1, duration: 0.35 }, 0);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      hoverTl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      to={to}
      className="care-cat group relative flex items-center gap-3 overflow-hidden rounded-[1.25rem] bg-white px-4 py-5 will-change-transform sm:gap-4 sm:px-5 sm:py-6"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(243,195,0,0.22),transparent_65%)] opacity-0"
      />

      <p ref={labelRef} className="care-cat-label relative z-10 min-w-0 flex-1 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-snug text-ink will-change-transform">
        {before}
        <span className="text-[#C9A200]">{highlight}</span>
        {after}
      </p>

      <div ref={imgWrapRef} className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center will-change-transform sm:h-16 sm:w-16">
        <img
          ref={imgRef}
          src={img}
          alt=""
          className="care-cat-img h-full w-full object-contain will-change-transform"
          draggable={false}
        />
      </div>

      <ChevronRight ref={chevronRef} className="care-cat-chevron relative z-10 h-4 w-4 shrink-0 text-ink/35 will-change-transform" strokeWidth={1.75} />
    </Link>
  );
}

function RedManSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      const headItems = sec.querySelectorAll<HTMLElement>(".care-head-item");
      const heroGrid = sec.querySelector<HTMLElement>(".care-hero-grid");
      const catGrid = sec.querySelector<HTMLElement>(".care-cat-grid");
      const heroes = sec.querySelectorAll<HTMLElement>(".care-hero");
      const cats = sec.querySelectorAll<HTMLElement>(".care-cat");

      gsap.set(headItems, { opacity: 0, y: 56, filter: "blur(12px)" });
      gsap.set(heroes, { opacity: 0, y: 90, scale: 0.88, rotateX: 14, transformPerspective: 1000 });
      gsap.set(cats, { opacity: 0, y: 48, scale: 0.92 });

      gsap.to(headItems, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.14,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      if (heroGrid) {
        gsap.fromTo(
          heroGrid,
          { y: 48 },
          {
            y: -36,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          }
        );
      }

      if (catGrid) {
        gsap.fromTo(
          catGrid,
          { y: 32 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top 70%",
              end: "bottom top",
              scrub: 1.8,
            },
          }
        );
      }

      heroes.forEach((card, i) => {
        const image = card.querySelector<HTMLElement>(".care-hero-img");
        const copy = card.querySelector<HTMLElement>(".care-hero-copy");
        const chevron = card.querySelector<HTMLElement>(".care-hero-chevron");

        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.15,
          ease: "back.out(1.45)",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        if (image) {
          gsap.fromTo(
            image,
            { opacity: 0, x: 70, y: 36, scale: 0.68, rotate: i === 0 ? 14 : -10 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 1.25,
              ease: "back.out(1.75)",
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                toggleActions: "play none none reverse",
              },
            }
          );

          gsap.fromTo(
            image,
            { y: 24 },
            {
              y: -32,
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.6 + i * 0.25,
              },
            }
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { opacity: 0, x: -36, y: 12 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (chevron) {
          gsap.fromTo(
            chevron,
            { opacity: 0, x: -12 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      cats.forEach((card, i) => {
        const label = card.querySelector<HTMLElement>(".care-cat-label");
        const chevron = card.querySelector<HTMLElement>(".care-cat-chevron");

        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -56 : 56 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: "back.out(1.55)",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (label) {
          gsap.fromTo(
            label,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (chevron) {
          gsap.fromTo(
            chevron,
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="care-head mb-8 max-w-3xl sm:mb-10">
          <span className="care-head-item pill-tag mb-4 inline-flex">
            <span className="dot" /> Whole-system care
          </span>
          <h2 className="care-head-item text-[clamp(1.75rem,4.2vw,3.25rem)] font-normal leading-[1.06] tracking-[-0.03em] text-ink">
            The care you&apos;ve always deserved.
          </h2>
        </div>

        <div className="care-hero-grid grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {CARE_HERO.map((card) => (
            <CareHeroCard key={card.title} {...card} />
          ))}
        </div>

        <div className="care-cat-grid mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4 lg:gap-4">
          {CARE_CATEGORIES.map((card) => (
            <CareCategoryCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── products ───────── */

type Card = {
  slug: string;
  img: string;
  tag: string;
  name: string;
  sub: string;
  price: number;
  lightProduct?: boolean;
};
const CARDS: Card[] = getProductListItems().map((item) => ({
  slug: item.slug,
  img: item.image,
  tag: item.tag,
  name: item.displayName,
  sub: item.tagline,
  price: item.startingPrice,
  lightProduct: item.lightProduct,
}));

function ProductsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const cards = sec.querySelectorAll<HTMLElement>(".pcard");

    cards.forEach((card, idx) => {
      const img = card.querySelector<HTMLImageElement>(".pc-img");
      const meta = card.querySelectorAll<HTMLElement>(".pc-meta");
      const imageFilter = card.dataset.lightProduct === "true"
        ? "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))"
        : "drop-shadow(0 22px 28px rgba(20,30,60,0.22))";

      // entrance — image floats up first, then meta
      gsap.fromTo(img, { opacity: 0, y: 60, scale: 0.92, filter: `blur(10px) ${imageFilter}` }, {
        opacity: 1, y: 0, scale: 1, filter: `blur(0px) ${imageFilter}`, duration: 1.4, ease: "power4.out", delay: idx * 0.12,
        scrollTrigger: { trigger: card, start: "top 88%" },
      });
      gsap.fromTo(meta, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.4 + idx * 0.12,
        scrollTrigger: { trigger: card, start: "top 88%" },
      });

      if (!img) return;

      // ambient float loop
      const ambient = gsap.to(img, {
        y: -8, duration: 4.0, ease: "sine.inOut", yoyo: true, repeat: -1, delay: idx * 0.4,
      });

      let hoverTl: gsap.core.Timeline | null = null;
      const onEnter = () => {
        ambient.pause();
        gsap.killTweensOf(img);
        hoverTl = gsap.timeline();
        hoverTl.to(img, {
          y: -28,
          scale: 1.14,
          rotate: 6,
          duration: 0.55,
          ease: "back.out(1.6)",
        });
        hoverTl.to(img, {
          rotate: -6,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      };
      const onLeave = () => {
        hoverTl?.kill();
        gsap.killTweensOf(img);
        gsap.to(img, {
          y: -8,
          scale: 1,
          rotate: 0,
          duration: 0.65,
          ease: "power3.out",
          onComplete: () => {
            ambient.restart();
          },
        });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
    });
  }, []);

  return (
    <section id="treatments" ref={ref} className="relative py-24 lg:py-36 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <span className="pill-tag mb-5"><span className="dot" /> Treatments</span>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.02] text-ink">
            Physician-guided <span className="italic text-gradient-clinical">treatments.</span>
          </h2>
          <p className="mt-4 text-ink-soft max-w-xl">
            Every TIDL therapy is reviewed by a licensed physician, matched to your goals, and delivered through licensed pharmacy partners.
          </p>
        </div>

        {/* Mobile: horizontal snap carousel. Tablet+: grid. */}
        <div
          className="
            -mx-5 sm:mx-0
            flex sm:grid sm:grid-cols-2 lg:grid-cols-4
            gap-x-4 sm:gap-x-6 gap-y-16
            overflow-x-auto sm:overflow-visible
            snap-x snap-mandatory sm:snap-none
            px-5 sm:px-0
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            [-webkit-overflow-scrolling:touch]
          "
        >
          {CARDS.map((c) => (
            <Link
              key={c.slug}
              to="/products/$slug"
              params={{ slug: c.slug }}
              data-light-product={c.lightProduct ? "true" : undefined}
              className="
                pcard group relative cursor-pointer shrink-0 sm:shrink
                w-[62%] xs:w-[58%] sm:w-auto snap-center
              "
            >
              <div className="relative h-44 sm:h-72 mb-4 sm:mb-6 flex items-end justify-center overflow-visible [perspective:900px]">
                <div className="absolute inset-x-8 bottom-4 h-5 rounded-full blur-2xl opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125"
                     style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.35), transparent 70%)" }} />
                <img
                  src={c.img}
                  alt={c.name}
                  className="pc-img relative z-10 max-h-full w-auto max-w-full origin-bottom object-contain will-change-transform transition-[filter] duration-500 group-hover:drop-shadow-[0_28px_36px_rgba(243,195,0,0.25)]"
                  style={{
                    background: "transparent",
                    filter: c.lightProduct
                      ? "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))"
                      : "drop-shadow(0 22px 28px rgba(20,30,60,0.22))",
                  }}
                />
              </div>
              <div className="pc-meta text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#A88A00]">{c.tag}</div>
              <div className="pc-meta mt-1 font-display text-lg sm:text-2xl text-ink">{c.name}</div>
              <div className="pc-meta text-xs sm:text-sm text-ink-soft">{c.sub}</div>
              <div className="pc-meta mt-3 sm:mt-4 flex items-center justify-between">
                <div className="font-display text-base sm:text-xl text-ink">${c.price}<span className="text-[10px] sm:text-xs text-ink/50"> / mo</span></div>
                <span className="text-[11px] sm:text-xs font-medium text-[#A88A00] group-hover:translate-x-1 transition-transform">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── phone section ───────── */

const APP_FEATURES = [
  {
    title: "Daily protocol guidance",
    body: "Dose-by-dose reminders for injections, oral compounds, and lifestyle checkpoints — synced to your physician-approved stack.",
    meta: "4 of 4 completed today",
  },
  {
    title: "Continuous biomarker tracking",
    body: "VO₂ max, ApoB, HRV, glucose and sleep debt plotted against your personal baseline with weekly trend alerts.",
    meta: "62 markers monitored",
  },
  {
    title: "24/7 clinical messaging",
    body: "Direct, encrypted threads with your care team — dose questions, side effects, and recalibration requests answered fast.",
    meta: "Avg. reply under 12 min",
  },
  {
    title: "Cold-chain delivery, monitored",
    body: "Temperature-logged shipments with live tracking, delivery windows, and automatic reorder before you run out.",
    meta: "99.2% on-time delivery",
  },
] as const;

const APP_STATS = [
  { value: "4.9★", label: "App Store rating" },
  { value: "24/7", label: "Clinical access" },
  { value: "62", label: "Biomarkers tracked" },
  { value: "12 min", label: "Avg. response" },
] as const;

function AppFeatureCard({
  title,
  body,
  meta,
}: (typeof APP_FEATURES)[number]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const dot = card.querySelector<HTMLElement>(".app-feat-dot");
    const metaEl = card.querySelector<HTMLElement>(".app-feat-meta");
    let hoverTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      hoverTl
        .to(card, { x: 10, scale: 1.02, duration: 0.4, ease: "back.out(1.5)" }, 0)
        .to(dot, { scale: 1.6, duration: 0.35, ease: "back.out(2)" }, 0)
        .to(metaEl, { opacity: 1, y: 0, duration: 0.35 }, 0.05);
    };
    const onLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      hoverTl
        .to(card, { x: 0, scale: 1, duration: 0.45 }, 0)
        .to(dot, { scale: 1, duration: 0.35 }, 0)
        .to(metaEl, { opacity: 0.55, y: 4, duration: 0.3 }, 0);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      hoverTl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="app-feat group relative cursor-default overflow-hidden rounded-2xl border border-ink/[0.06] bg-white/80 px-4 py-4 will-change-transform sm:px-5 sm:py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(243,195,0,0.12),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <span className="app-feat-dot mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F3C300] will-change-transform" />
        <div>
          <h3 className="app-feat-title text-sm font-medium text-ink sm:text-[15px]">{title}</h3>
          <p className="app-feat-body mt-1.5 text-xs leading-relaxed text-ink/55 sm:text-sm">{body}</p>
          <p className="app-feat-meta mt-2 text-[10px] uppercase tracking-[0.16em] text-[#A88A00] opacity-55 will-change-transform">{meta}</p>
        </div>
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-ink/20 transition-colors duration-300 group-hover:text-[#F3C300]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function PhoneSection() {
  const ref = useRef<HTMLElement>(null);
  const phoneWrapRef = useRef<HTMLDivElement>(null);
  const phoneInnerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const phoneWrap = phoneWrapRef.current;
    const phoneInner = phoneInnerRef.current;
    const copy = copyRef.current;
    if (!sec || !phoneWrap || !phoneInner || !copy) return;

    const onMove = (e: MouseEvent) => {
      const rect = phoneWrap.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(phoneInner, {
        rotateY: cx * 14,
        rotateX: -cy * 8,
        x: cx * 10,
        duration: 0.9,
        ease: "power3.out",
      });
    };

    const onLeavePhone = () => {
      gsap.to(phoneInner, { rotateY: 0, rotateX: 0, x: 0, duration: 0.8, ease: "power3.out" });
    };

    phoneWrap.addEventListener("mousemove", onMove);
    phoneWrap.addEventListener("mouseleave", onLeavePhone);

    const ctx = gsap.context(() => {
      const headItems = copy.querySelectorAll<HTMLElement>(".pcopy-item");
      const features = copy.querySelectorAll<HTMLElement>(".app-feat");
      const stats = copy.querySelectorAll<HTMLElement>(".app-stat");
      const cta = copy.querySelector<HTMLElement>(".pcopy-cta");
      const line = copy.querySelector<HTMLElement>(".pcopy-line");
      const statsWrap = copy.querySelector<HTMLElement>(".app-stats");

      gsap.set(headItems, { opacity: 0, y: 48, filter: "blur(10px)" });
      gsap.set(features, { opacity: 0, x: -40, scale: 0.96 });
      gsap.set(stats, { opacity: 0, y: 24, scale: 0.92 });
      gsap.set(cta, { opacity: 0, y: 20 });
      gsap.set(phoneInner, { opacity: 0, y: 100, rotateY: -18, rotateX: 10, scale: 0.82, transformPerspective: 1200 });
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      gsap.to(headItems, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: sec, start: "top 78%", toggleActions: "play none none reverse" },
      });

      if (line) {
        gsap.to(line, {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" },
        });
      }

      features.forEach((feat, i) => {
        gsap.to(feat, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.95,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: feat,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.04,
        });
      });

      if (statsWrap) {
        gsap.to(stats, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: statsWrap, start: "top 90%", toggleActions: "play none none reverse" },
        });
      }

      if (cta) {
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: cta, start: "top 92%", toggleActions: "play none none reverse" },
        });
      }

      gsap.to(phoneInner, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.4,
        ease: "back.out(1.35)",
        scrollTrigger: { trigger: sec, start: "top 72%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(
        copy,
        { y: 36 },
        {
          y: -24,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.6 },
        }
      );

      gsap.fromTo(
        phoneWrap,
        { y: 60 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.2 },
        }
      );

      gsap.to(phoneInner, {
        y: -12,
        duration: 4.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });
    }, sec);

    return () => {
      phoneWrap.removeEventListener("mousemove", onMove);
      phoneWrap.removeEventListener("mouseleave", onLeavePhone);
      ctx.revert();
    };
  }, []);

  return (
    <section id="app" ref={ref} className="relative overflow-hidden py-24 lg:py-36">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-light" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-16">
        <div ref={copyRef} className="lg:col-span-5">
          <span className="pcopy-item pill-tag mb-5 inline-flex">
            <span className="dot" /> The TIDL app
          </span>
          <h2 className="pcopy-item pcopy-headline font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1.02] text-ink">
            Your care plan, <span className="italic text-gradient-clinical">in your pocket.</span>
          </h2>
          <div className="pcopy-line hairline mt-6 max-w-md" />
          <p className="pcopy-item pcopy-para mt-6 text-ink-soft max-w-md">
            Dosing reminders, weekly check-ins, weight and lab trends, and direct messages with your clinical care team — all in one calm interface designed for long-term adherence.
          </p>

          <div className="mt-8 space-y-3">
            {APP_FEATURES.map((f) => (
              <AppFeatureCard key={f.title} {...f} />
            ))}
          </div>

          <div className="app-stats mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {APP_STATS.map((s) => (
              <div key={s.label} className="app-stat rounded-xl border border-ink/[0.05] bg-white/70 px-3 py-3 text-center">
                <div className="font-display text-lg text-ink sm:text-xl">{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/45">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="pcopy-cta mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton className="btn-primary">Download for iOS</MagneticButton>
            <MagneticButton className="btn-ghost text-sm">Android waitlist</MagneticButton>
          </div>
          <p className="pcopy-item mt-4 text-[11px] text-ink/40">
            Free for members · HIPAA-compliant · Syncs with Apple Health &amp; Oura
          </p>
        </div>

        <div
          ref={phoneWrapRef}
          className="relative lg:col-span-7 flex justify-center [perspective:1400px]"
        >
          <div
            className="pointer-events-none absolute inset-x-8 bottom-4 h-20 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.28), transparent 70%)" }}
          />
          <div ref={phoneInnerRef} className="relative will-change-transform [transform-style:preserve-3d]">
            <PhoneApp />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── pen section ───────── */

function PenSection() {
  const ref = useRef<HTMLElement>(null);
  const penRef = useRef<HTMLImageElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const lines = [
    { ref: line1Ref, text: "› Pre-filled, pre-dosed — calibrated for your protocol." },
    { ref: line2Ref, text: "› Single-step injection — click, hold, release." },
    { ref: line3Ref, text: "› Cold-chain delivered — pharmacy to your door." },
  ] as const;

  useEffect(() => {
    const sec = ref.current;
    const pen = penRef.current;
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!sec || !pen || !header || !progress) return;

    lines.forEach(({ ref: r }) => {
      if (r.current) r.current.textContent = "";
    });
    if (descRef.current) descRef.current.textContent = "";

    const typewriter = (
      tl: gsap.core.Timeline,
      el: HTMLElement,
      text: string,
      position: number | string,
      duration = 0.18
    ) => {
      const proxy = { p: 0 };
      el.textContent = "";
      tl.to(
        proxy,
        {
          p: 1,
          duration,
          ease: "none",
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(proxy.p * text.length));
          },
        },
        position
      );
    };

    const pin = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "+=280%",
      pin: true,
      anticipatePin: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "+=280%",
        scrub: 1,
      },
    });

    tl.fromTo(header, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08 }, 0);

    tl.fromTo(
      pen,
      { opacity: 0, y: 120, scale: 0.65, rotate: -20 },
      { opacity: 1, y: -20, scale: 1.05, rotate: 380, duration: 0.55, ease: "power2.inOut" },
      0
    );

    tl.to(pen, { y: 0, scale: 1, rotate: 720, duration: 0.35, ease: "sine.inOut" }, 0.55);

    if (line1Ref.current) typewriter(tl, line1Ref.current, lines[0].text, 0.18);
    if (line2Ref.current) typewriter(tl, line2Ref.current, lines[1].text, 0.38);
    if (line3Ref.current) typewriter(tl, line3Ref.current, lines[2].text, 0.58);

    if (descRef.current) {
      typewriter(
        tl,
        descRef.current,
        "Pharmaceutical-grade precision — engineered for consistency, comfort, and clinical confidence.",
        0.76,
        0.16
      );
    }

    tl.to(progress, { scaleX: 1, duration: 1, ease: "none", transformOrigin: "left center" }, 0);

    return () => {
      pin.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="clinical" ref={ref} className="relative h-[100svh] bg-black">
      <div className="relative flex h-[100svh] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 40% 45%, rgba(243,195,0,0.08), transparent 70%)" }}
        />

        <div ref={headerRef} className="relative z-20 px-6 pt-16 lg:px-10 lg:pt-20">
          <span className="pill-tag mb-4 inline-flex !border-[#F3C300]/25 !bg-[#F3C300]/10 !text-white/85">
            <span className="dot !bg-[#F3C300]" /> The injector
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-snug text-white">
            Pharmaceutical-grade, designed.
          </h2>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10">
          <div className="relative flex h-[42vh] w-full items-center justify-center [perspective:1200px] lg:h-auto lg:flex-1">
            <div
              className="pointer-events-none absolute inset-x-10 bottom-6 h-10 rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.25), transparent 70%)" }}
            />
            <img
              ref={penRef}
              src={product1}
              alt="TIDL auto-injector"
              className="relative z-10 max-h-full max-w-[min(72vw,420px)] object-contain will-change-transform"
              style={{
                filter: "drop-shadow(0 40px 50px rgba(243,195,0,0.15)) drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
                opacity: 0,
              }}
            />
          </div>

          <div className="w-full max-w-md space-y-4 pb-10 lg:flex-1 lg:pb-0">
            {lines.map(({ ref: r }, i) => (
              <p
                key={i}
                ref={r}
                className="min-h-[1.6em] text-sm leading-relaxed text-white/75 sm:text-base"
              />
            ))}
            <p
              ref={descRef}
              className="min-h-[3.2em] border-t border-white/10 pt-4 text-sm leading-relaxed text-white/55"
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-20 px-6 lg:px-10">
          <div className="h-px w-full origin-left scale-x-0 bg-[#F3C300]/60" ref={progressRef} />
          <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/35">Scroll to explore the injector</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── cta ───────── */

function Cta() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const pill = sec.querySelector<HTMLElement>(".cta-pill");
    const headline = sec.querySelector<HTMLElement>(".cta-headline");
    const para = sec.querySelector<HTMLElement>(".cta-para");
    const buttons = sec.querySelector<HTMLElement>(".cta-buttons");

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: sec, start: "top 75%" },
    });
    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 0);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6 }, 0.3);
    tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 1.0);
    tl.fromTo(buttons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 1.7);
  }, []);
  return (
    <section ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="cta-pill mx-auto mb-10 inline-flex items-center gap-2 pill-tag" style={{ opacity: 0 }}>
          <span className="dot" /> Begin
        </div>
        <h2 className="cta-headline font-display text-[clamp(2.2rem,6vw,5rem)] leading-[1] text-ink" style={{ opacity: 0 }}>
          The next decade <span className="italic text-gradient-clinical">starts now.</span>
        </h2>
        <p className="cta-para mx-auto mt-6 max-w-lg text-ink-soft" style={{ opacity: 0 }}>
          A 10-minute clinical intake. A complete lab panel. A protocol designed around the life you intend to live.
        </p>
        <div className="cta-buttons mt-10 flex flex-wrap justify-center gap-4" style={{ opacity: 0 }}>
          <PixelButton label="Start your assessment" variant="primary" />
          <PixelButton label="Speak with a clinician" variant="ghost" />
        </div>
      </div>
    </section>
  );
}

/* ───────── protocol timeline (horizontal pinned) ───────── */

const PROTOCOL_PHASES = [
  {
    day: "Day 0",
    title: "Clinical intake",
    body: "Full medical history, lifestyle telemetry and a 60-marker blood panel. Your baseline, in high resolution.",
    stats: [["Markers", "62"], ["Visit", "Virtual"]] as const,
    img: womenCut,
  },
  {
    day: "Day 14",
    title: "Protocol designed",
    body: "Your physician composes a personalised metabolic, hormonal and longevity protocol — reviewed, signed, shipped.",
    stats: [["Compounds", "4"], ["Cadence", "Weekly"]] as const,
    img: product1,
  },
  {
    day: "Day 45",
    title: "First recalibration",
    body: "We re-measure. Dose, cadence and stack are tuned to how your body actually responded — not how it should have.",
    stats: [["ApoB", "−21%"], ["HRV", "+18%"]] as const,
    img: men2,
  },
  {
    day: "Day 90",
    title: "Compounded gains",
    body: "Bio-age, metabolic health and recovery converge. The plan keeps evolving — quarterly, for life.",
    stats: [["Bio age", "−3.4 yrs"], ["VO₂ max", "+11%"]] as const,
    img: phoneImg,
  },
] as const;

function ProtocolPhaseCard({
  phase,
  index,
}: {
  phase: (typeof PROTOCOL_PHASES)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const line = lineRef.current;
    if (!card || !image || !content || !line) return;

    gsap.set(image, { opacity: 0, scale: 1.12, y: 20 });
    gsap.set(content, { y: 0 });

    const onEnter = () => {
      gsap.to(card, { y: -14, scale: 1.02, borderColor: "rgba(243,195,0,0.45)", duration: 0.5, ease: "power3.out" });
      gsap.to(image, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" });
      gsap.to(content, { y: -6, duration: 0.5, ease: "power3.out" });
      gsap.to(line, { scaleX: 1, duration: 0.45, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(card, { y: 0, scale: 1, borderColor: "rgba(0,0,0,0.08)", duration: 0.55, ease: "power3.out" });
      gsap.to(image, { opacity: 0, scale: 1.12, y: 20, duration: 0.55, ease: "power3.out" });
      gsap.to(content, { y: 0, duration: 0.55, ease: "power3.out" });
      gsap.to(line, { scaleX: 0.35, duration: 0.45, ease: "power3.out" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="phase-card group relative shrink-0 w-[82vw] sm:w-[460px] h-[480px] overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white shadow-[0_16px_48px_-24px_rgba(0,0,0,0.18)] will-change-transform [transform-style:preserve-3d]"
    >
      <div
        ref={lineRef}
        className="absolute inset-x-0 top-0 z-20 h-[2px] origin-left scale-x-[0.35] bg-gradient-to-r from-[#F3C300] via-[#F9DC6B] to-transparent"
      />

      <div ref={imageRef} className="pointer-events-none absolute inset-0 z-0">
        <img src={phase.img} alt="" className="h-full w-full object-cover object-center" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_0%,rgba(243,195,0,0.14),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div ref={contentRef} className="relative z-10 flex h-full flex-col justify-between p-8 transition-colors duration-500 group-hover:text-white">
        <div>
          <div className="phase-day inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ink/55 transition-colors duration-500 group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F3C300]" />
            {String(index + 1).padStart(2, "0")} · {phase.day}
          </div>
          <h3 className="phase-title mt-6 text-[clamp(1.6rem,3vw,2rem)] font-normal leading-tight text-ink transition-colors duration-500 group-hover:text-white">
            {phase.title}
          </h3>
          <p className="phase-body mt-3 max-w-[36ch] text-sm leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-white/70">{phase.body}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-6 transition-colors duration-500 group-hover:border-white/15">
          {phase.stats.map(([k, v]) => (
            <div key={k} className="phase-stat rounded-xl border border-ink/8 bg-ink/[0.02] px-3 py-2.5 transition-colors duration-500 group-hover:border-white/10 group-hover:bg-black/25">
              <div className="text-[10px] uppercase tracking-[0.22em] text-ink/40 transition-colors duration-500 group-hover:text-white/45">{k}</div>
              <div className="mt-1 text-lg text-[#F3C300]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 right-5 z-20 text-[10px] uppercase tracking-[0.18em] text-ink/30 transition-colors duration-500 group-hover:text-[#F3C300]/90">
        Hover to preview
      </div>
    </div>
  );
}

function ProtocolTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const track = trackRef.current;
    const header = headerRef.current;
    if (!sec || !track || !header) return;

    const ctx = gsap.context(() => {
      const cards = track.querySelectorAll<HTMLElement>(".phase-card");
      const distance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.fromTo(
        header.querySelectorAll(".proto-head"),
        { opacity: 0, y: 36, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 80%" },
        }
      );

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 80, rotateY: 18, scale: 0.92, transformPerspective: 1000 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 85%",
            },
          }
        );

        const num = card.querySelector<HTMLElement>(".phase-day");
        const title = card.querySelector<HTMLElement>(".phase-title");
        const body = card.querySelector<HTMLElement>(".phase-body");
        const stats = card.querySelectorAll<HTMLElement>(".phase-stat");

        gsap.fromTo(
          [num, title, body, ...stats],
          { opacity: 0, y: 32, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.07,
            ease: "expo.out",
            delay: 0.08 + i * 0.04,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 72%",
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 45% at 50% 20%, rgba(243,195,0,0.06), transparent 70%)" }}
      />

      <div className="relative flex h-screen flex-col">
        <div ref={headerRef} className="px-6 pt-24 lg:px-12">
          <span className="proto-head pill-tag inline-flex">
            <span className="dot" /> The protocol
          </span>
          <h2 className="proto-head mt-5 max-w-3xl text-[clamp(1.75rem,5vw,3.5rem)] font-normal leading-snug text-ink">
            Ninety days, <span className="text-[#F3C300]">measured.</span>
          </h2>
        </div>

        <div className="flex flex-1 items-center">
          <div ref={trackRef} className="flex gap-6 px-6 will-change-transform lg:gap-8 lg:px-12">
            {PROTOCOL_PHASES.map((p, i) => (
              <ProtocolPhaseCard key={p.day} phase={p} index={i} />
            ))}
            <div className="shrink-0 w-[30vw]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── science metrics ───────── */

const METRICS = [
  { v: 82, s: "%", l: "ApoB in range" },
  { v: 3.4, s: " yrs", l: "Bio-age reduction", d: 1 },
  { v: 18, s: "%", l: "VO₂ max gain" },
  { v: 11, s: " hrs", l: "Sleep debt cleared" },
  { v: 92, s: "%", l: "Member retention" },
  { v: 24, s: "/7", l: "Clinical support" },
] as const;

function Counter({ to, suffix = "", decimals = 0, active = true }: { to: number; suffix?: string; decimals?: number; active?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    const tw = gsap.to(obj, {
      v: to,
      duration: 2.2,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals) + suffix;
      },
    });
    return () => { tw.kill(); };
  }, [to, suffix, decimals, active]);
  return <span ref={ref}>0{suffix}</span>;
}

function VerticalMetricTicker({ direction = "down" }: { direction?: "up" | "down" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...METRICS, ...METRICS, ...METRICS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const segment = track.scrollHeight / 3;
    gsap.set(track, { y: direction === "down" ? 0 : -segment });
    const tween = gsap.to(track, {
      y: direction === "down" ? -segment : 0,
      duration: 18,
      ease: "none",
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [direction]);

  return (
    <div className="relative h-full overflow-hidden opacity-40">
      <div ref={trackRef} className="flex flex-col gap-3 will-change-transform">
        {items.map((m, i) => (
          <div
            key={`${m.l}-${i}`}
            className="rounded-xl border border-ink/10 bg-white/80 px-4 py-3 backdrop-blur-sm"
          >
            <div className="font-display text-2xl text-ink">
              {m.v}{m.s}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/45">{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ metric, index }: { metric: (typeof METRICS)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const beam = beamRef.current;
    if (!card || !beam) return;

    const beamTween = gsap.fromTo(
      beam,
      { y: "-120%" },
      { y: "120%", duration: 2.8 + index * 0.15, ease: "none", repeat: -1, delay: index * 0.2 }
    );

    const revealTween = gsap.fromTo(
      card,
      { opacity: 0, y: index % 2 === 0 ? 56 : -56, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 88%" },
        onComplete: () => setInView(true),
      }
    );

    return () => {
      revealTween.scrollTrigger?.kill();
      revealTween.kill();
      beamTween.kill();
    };
  }, [index]);

  useEffect(() => {
    const card = cardRef.current;
    const value = valueRef.current;
    if (!card || !value) return;

    const onEnter = () => {
      setHovered(true);
      gsap.to(card, { y: -10, scale: 1.04, duration: 0.45, ease: "back.out(1.6)" });
      gsap.to(value, { scale: 1.08, duration: 0.45, ease: "back.out(1.6)" });
    };
    const onLeave = () => {
      setHovered(false);
      gsap.to(card, { y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
      gsap.to(value, { scale: 1, duration: 0.5, ease: "power3.out" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="sm-metric group relative overflow-hidden rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.18)] backdrop-blur-sm will-change-transform"
    >
      <div
        ref={beamRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F3C300]/35 via-[#F3C300]/10 to-transparent opacity-70"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#F3C300]/50 to-transparent" />

      <div ref={valueRef} className="relative font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-ink will-change-transform">
        <Counter to={metric.v} suffix={metric.s} decimals={"d" in metric ? metric.d : 0} active={inView || hovered} />
      </div>
      <div className="relative mt-3 text-xs uppercase tracking-[0.22em] text-ink/45 transition-colors duration-300 group-hover:text-[#A88A00]">
        {metric.l}
      </div>
      <div className="relative mt-4 h-px w-full overflow-hidden bg-ink/8">
        <div className="h-full w-1/3 bg-[#F3C300] animate-[metricSweep_2.4s_ease-in-out_infinite]" style={{ animationDelay: `${index * 0.25}s` }} />
      </div>
    </div>
  );
}

function ScienceMetricsSection() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const headline = headlineRef.current;
    if (!sec || !headline) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline.querySelectorAll(".sm-head"),
        { opacity: 0, y: 48, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.3,
          stagger: 0.14,
          ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 72%" },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-28 lg:py-36">
      <style>{`
        @keyframes metricSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(420%); }
        }
        @keyframes flowPulse {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-radial-light" />
      {[12, 32, 54, 76, 88].map((left, i) => (
        <div
          key={left}
          className="sm-flow-line pointer-events-none absolute top-0 w-px bg-gradient-to-b from-transparent via-[#F3C300]/25 to-transparent"
          style={{ left: `${left}%`, height: "100%", animation: `flowPulse ${5 + i}s linear infinite`, animationDelay: `${i * 0.7}s` }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div ref={headlineRef} className="lg:col-span-4">
            <span className="sm-head pill-tag inline-flex"><span className="dot" /> Outcomes</span>
            <h2 className="sm-head mt-5 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-ink">
              The numbers that <span className="italic text-gradient-clinical">change.</span>
            </h2>
            <p className="sm-head mt-5 text-ink-soft max-w-md">
              Aggregated across TIDL members on a longevity protocol for at least ninety days. Every measurement is clinician-reviewed.
            </p>
            <div className="sm-head mt-10 flex flex-wrap gap-4">
              <PixelButton label="See the data" variant="primary" />
              <PixelButton label="Read the science" variant="ghost" />
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1 h-[520px]">
            <VerticalMetricTicker direction="down" />
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {METRICS.map((m, i) => (
              <MetricCard key={m.l} metric={m} index={i} />
            ))}
          </div>

          <div className="hidden lg:block lg:col-span-2 h-[520px]">
            <VerticalMetricTicker direction="up" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── footer ───────── */

function TidlWordmark() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    if (!section || !wordmark) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(wordmark, {
        x: cx * 28,
        y: cy * 18,
        rotateX: -cy * 6,
        rotateY: cx * 8,
        duration: 1.1,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(wordmark, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.4,
        ease: "power3.out",
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden [perspective:1200px]"
      style={{ background: "#111111" }}
    >
      <div
        ref={wordmarkRef}
        className="wordmark max-w-[100vw] px-4 font-sans text-center font-black select-none will-change-transform"
        style={{ color: "#F3C300", fontSize: "clamp(12rem, 38vw, 50rem)", letterSpacing: "-0.05em", lineHeight: 0.8 }}
      >
        {"tidl".split("").map((char, i) => (
          <span key={i} className="wordmark-letter">{char}</span>
        ))}
      </div>
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        <a href="#" aria-label="Instagram" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="#" aria-label="Facebook" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/></svg>
        </a>
        <a href="#" aria-label="YouTube" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Zm-14 9.4V8.4l6.2 3.6-6.2 3.6Z"/></svg>
        </a>
        <a href="#" aria-label="TikTok" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z"/></svg>
        </a>
      </div>
    </div>
  );
}

function Footer() {
  const learnLinks = [
    "Labs", "Weight Loss", "Sexual Health", "Testosterone",
    "Hair Regrowth", "Mental Health", "Drug Comparisons",
    "Drugs & Medications", "About the Company",
  ];
  const toolLinks = [
    "BMI Calculator", "Low Testosterone Calculator", "TDEE Calculator",
    "Calorie Deficit Calculator", "Protein Calculator", "Water Intake Calculator",
  ];
  const popularLinks = [
    { label: "GLP-1 Injections" },
    { label: "Sildenafil" },
    { label: "Cialis®" },
    { label: "Tadalafil", sub: "Generic for Cialis®" },
    { label: "Minaxidil Solution" },
    { label: "Finasteride Pills" },
    { label: "Topical Finasteride" },
    { label: "Sertraline for PE" },
    { label: "Sertraline", sub: "Generic for Zoloft®" },
    { label: "Escitalopram", sub: "Generic for Lexapro®" },
  ];
  const tidlLinks = [
    { label: "About Us" },
    { label: "Good Health", sub: "(It's our blog)" },
    { label: "How It Works" },
    { label: "Clinical Excellence" },
    { label: "Innovation" },
    { label: "Quality & Safety" },
    { label: "TIDL Benefits" },
    { label: "Editorial Standards" },
    { label: "FAQs" },
    { label: "Investors" },
  ];
  const careersLinks = [{ label: "Professionals" }, { label: "Providers" }];
  const connectLinks = [{ label: "Customer Help Center" }, { label: "Press Center" }];

  return (
    <footer style={{ background: "#ffffff" }}>
      {/* ── link grid – curved top, cards with gap ── */}
      <div
        className="text-white px-6 pt-14 pb-10"
        style={{ background: "#111111", borderRadius: "2.5rem 2.5rem 0 0" }}
      >
        <div className="max-w-7xl mx-auto">

          {/* ── logo + tagline row ── */}
          <div className="flex items-center gap-4 mb-10">
            <img src={footerLogo} alt="TIDL" className="h-10 object-contain brightness-0 invert" draggable={false} />
            <div className="h-8 w-px bg-white/15" />
            <p className="text-sm text-white/50 max-w-xs">A clinical operating system for longevity.</p>
          </div>

          {/* ── yellow hairline ── */}
          <div className="mb-10 h-px w-full" style={{ background: "linear-gradient(90deg, #F3C300, rgba(243,195,0,0.15), transparent)" }} />

        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* col 1 – app promo + socials */}
          <div className="footer-card flex flex-col gap-8 p-6" style={{ background: "rgba(243,195,0,0.07)", borderRadius: "1.25rem", border: "1px solid rgba(243,195,0,0.25)" }}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: "#F3C300" }}>Download the free TIDL app</p>
              <p className="font-display text-2xl font-black leading-tight">Total care.<br />Totally different.</p>
              <div className="mt-4 inline-flex items-center gap-3 border border-white/20 rounded-lg px-4 py-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/60"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.31.07 2.22.74 2.98.8 1.13-.23 2.2-.93 3.4-.84 1.44.12 2.53.68 3.24 1.74-2.97 1.74-2.27 5.65.11 6.73-.5 1.31-1.17 2.6-1.73 3.45ZM12.03 7.35c-.17-2.44 1.88-4.47 4.18-4.67.31 2.77-2.52 4.84-4.18 4.67Z"/></svg>
                <span className="text-sm text-white/70">Download<br />the app</span>
              </div>
              <p className="mt-2 text-xs text-white/30">For iOS and Android</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/></svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.261 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
              </a>
              <a href="#" aria-label="TikTok" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z"/></svg>
              </a>
            </div>
          </div>

          {/* col 2 – Learn + Tools */}
          <div className="p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Learn</p>
            <ul className="space-y-2.5 mb-8">
              {learnLinks.map((l) => (
                <li key={l}><a href="#" className="footer-link text-sm text-white/80">{l}</a></li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Tools</p>
            <ul className="space-y-2.5">
              {toolLinks.map((l) => (
                <li key={l}><a href="#" className="footer-link text-sm text-white/80">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* col 3 – Popular */}
          <div className="p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Popular</p>
            <ul className="space-y-2.5">
              {popularLinks.map((l) => (
                <li key={l.label}>
                  <a href="#" className="footer-link text-sm text-white/80 leading-tight">{l.label}</a>
                  {l.sub && <p className="text-xs text-white/35 mt-0.5">{l.sub}</p>}
                </li>
              ))}
            </ul>
          </div>

          {/* col 4 – TIDL + Careers + Connect */}
          <div className="p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>TIDL</p>
            <ul className="space-y-2.5 mb-8">
              {tidlLinks.map((l) => (
                <li key={l.label}>
                  <a href="#" className="footer-link text-sm text-white/80 leading-tight">{l.label}</a>
                  {l.sub && <p className="text-xs text-white/35 mt-0.5">{l.sub}</p>}
                </li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Careers</p>
            <ul className="space-y-2.5 mb-8">
              {careersLinks.map((l) => (
                <li key={l.label}><a href="#" className="footer-link text-sm text-white/80">{l.label}</a></li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Connect</p>
            <ul className="space-y-2.5">
              {connectLinks.map((l) => (
                <li key={l.label}><a href="#" className="footer-link text-sm text-white/80">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

       
      </div>

      {/* ── big tidl wordmark ── */}
      <TidlWordmark />
    </footer>
  );
}
