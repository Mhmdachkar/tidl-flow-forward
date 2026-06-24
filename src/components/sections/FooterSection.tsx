import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import { createAxisQuickTo, createTiltQuickTo } from "@/lib/gsap-tilt";
import { canUseHoverParallax } from "@/lib/section-performance";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import footerLogo from "@/assets/tidl_logo.png";

type FooterItem = { label: string; href: string };

function FooterLinkGroup({ title, items }: { title: string; items: readonly FooterItem[] }) {
  return (
    <div className="footer-col min-w-0">
      <p className="tidl-eyebrow mb-3" style={{ color: "#F3C300" }}>
        {title}
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item.label}>
            {item.href.startsWith("/") && !item.href.includes("#") ? (
              <Link to={item.href} className="footer-link text-sm leading-snug text-white/80">
                {item.label}
              </Link>
            ) : (
              <a href={item.href} className="footer-link text-sm leading-snug text-white/80">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TidlWordmark() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const moveEl = moveRef.current;
    const wordmark = wordmarkRef.current;
    if (!section || !moveEl || !wordmark) return;
    if (!canUseHoverParallax()) return;

    const tilt = createTiltQuickTo(wordmark, 1.1, "power3.out");
    const moveX = createAxisQuickTo(moveEl, "x", 1.1, "power3.out");
    const moveY = createAxisQuickTo(moveEl, "y", 1.1, "power3.out");

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      moveX(cx * 28);
      moveY(cy * 18);
      tilt.rotateY(cx * 8);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
      tilt.reset();
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
      className="relative flex min-h-[36vh] items-center justify-center overflow-hidden [perspective:1200px] sm:min-h-screen"
      style={{ background: "#111111" }}
    >
      <div ref={moveRef} className="will-change-transform">
        <div
          ref={wordmarkRef}
          className="wordmark max-w-[100vw] px-4 text-center font-display font-black select-none will-change-transform"
          style={{ color: "#F3C300", fontSize: "clamp(6rem, 38vw, 50rem)", letterSpacing: "-0.05em", lineHeight: 0.8 }}
        >
          {"tidl".split("").map((char, i) => (
            <span key={i} className="wordmark-letter">
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-4 sm:bottom-8 sm:right-8">
        <a href="#" aria-label="Instagram" className="tidl-touch-target social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          </svg>
        </a>
        <a href="#" aria-label="X / Twitter" className="tidl-touch-target social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.261 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
          </svg>
        </a>
        <a href="#" aria-label="TikTok" className="tidl-touch-target social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

const TREATMENT_LINKS: FooterItem[] = [
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Longevity", href: "/longevity" },
  { label: "Hormonal Health", href: "/hormonal" },
  { label: "Metabolic Care", href: "/metabolic" },
  { label: "Performance", href: "/performance" },
  { label: "Recovery", href: "/recovery" },
];

const COMPANY_LINKS: FooterItem[] = [
  { label: "How It Works", href: "/#lifestyle-reveal" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Find Your Treatment", href: "/search" },
  { label: "AI Discovery", href: "/#discover" },
];

const CAREERS_LINKS: FooterItem[] = [
  { label: "For Professionals", href: "/account" },
  { label: "For Providers", href: "/account" },
];

const CONNECT_LINKS: FooterItem[] = [
  { label: "Customer Help", href: "/account/support" },
  { label: "Your Account", href: "/account" },
  { label: "Start Assessment", href: "/quiz" },
];

const SOCIAL_ICONS = (
  <>
    <a href="#" aria-label="Facebook" className="tidl-touch-target social-icon" style={{ color: "#F3C300" }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />
      </svg>
    </a>
    <a href="#" aria-label="X / Twitter" className="tidl-touch-target social-icon" style={{ color: "#F3C300" }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.261 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    </a>
    <a href="#" aria-label="Instagram" className="tidl-touch-target social-icon" style={{ color: "#F3C300" }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    </a>
    <a href="#" aria-label="TikTok" className="tidl-touch-target social-icon" style={{ color: "#F3C300" }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z" />
      </svg>
    </a>
  </>
);

export function FooterSection() {
  const { openModal: openQuiz } = useQuizModal();

  return (
    <footer className="tidl-brand-section" style={{ background: "#ffffff" }}>
      <div
        className="px-5 pt-10 pb-8 text-white sm:px-6 sm:pt-14 sm:pb-10"
        style={{ background: "#111111", borderRadius: "2rem 2rem 0 0" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center gap-3 sm:mb-10 sm:gap-4">
            <img
              src={footerLogo}
              alt="TIDL"
              className="h-8 object-contain brightness-0 invert sm:h-10"
              draggable={false}
            />
            <div className="h-7 w-px bg-white/15 sm:h-8" />
            <p className="max-w-xs text-xs text-white/50 sm:text-sm">
              A clinical operating system for longevity.
            </p>
          </div>
          <div
            className="mb-8 h-px w-full sm:mb-10"
            style={{ background: "linear-gradient(90deg, #F3C300, rgba(243,195,0,0.15), transparent)" }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* CTA */}
          <div
            className="footer-card w-full shrink-0 p-5 sm:p-6 lg:max-w-[17.5rem]"
            style={{
              background: "rgba(243,195,0,0.07)",
              borderRadius: "1.25rem",
              border: "1px solid rgba(243,195,0,0.25)",
            }}
          >
            <p className="tidl-eyebrow mb-3" style={{ color: "#F3C300" }}>
              Get started today
            </p>
            <p className="tidl-display text-2xl leading-tight">
              Total care.
              <br />
              Totally different.
            </p>
            <button
              type="button"
              onClick={() => openQuiz()}
              className="btn-primary mt-4 inline-flex items-center gap-2 text-sm"
            >
              Start Assessment →
            </button>
            <div className="mt-5 flex items-center gap-4">{SOCIAL_ICONS}</div>
          </div>

          {/* Four equal link columns — same top level */}
          <div className="grid min-w-0 flex-1 grid-cols-2 items-start gap-x-8 gap-y-8 sm:grid-cols-4">
            <FooterLinkGroup title="Treatments" items={TREATMENT_LINKS} />
            <FooterLinkGroup title="Company" items={COMPANY_LINKS} />
            <FooterLinkGroup title="Careers" items={CAREERS_LINKS} />
            <FooterLinkGroup title="Connect" items={CONNECT_LINKS} />
          </div>
        </div>
      </div>

      <TidlWordmark />
    </footer>
  );
}
