// src/components/AgeGate.tsx
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import { TIDL_BRAND } from "@/lib/tidl-brand";
import tidlLogo from "@/assets/TIDL_LOGO_YELLOW.png";

const STORAGE_KEY = "tidl_age_confirmed";
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const EXEMPT_ROUTES = ["/privacy", "/terms", "/medical-disclaimer"];

function isConfirmed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const age = Date.now() - new Date(raw).getTime();
    return age < EXPIRY_MS;
  } catch {
    return false;
  }
}

export function AgeGate() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [visible, setVisible] = useState<boolean | null>(null);
  const [exiting, setExiting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (EXEMPT_ROUTES.some((r) => currentPath.startsWith(r))) {
      setVisible(false);
      return;
    }
    setVisible(!isConfirmed());
  }, [currentPath]);

  useEffect(() => {
    if (!visible || !overlayRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const children = contentRef.current!.querySelectorAll<HTMLElement>(".ag-item");

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );

      gsap.fromTo(
        children,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.25,
        },
      );

      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.6,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !overlayRef.current) return;
    const el = overlayRef.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      "button, a, [tabindex]:not([tabindex='-1'])",
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  function confirm() {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore private mode errors
    }
    dismiss();
  }

  function deny() {
    window.location.href = "https://www.google.com";
  }

  function dismiss() {
    if (exiting || !overlayRef.current) return;
    setExiting(true);
    gsap.to(overlayRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.55,
      ease: "power3.in",
      onComplete: () => setVisible(false),
    });
  }

  if (visible === null || visible === false) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ag-heading"
      className="age-gate-overlay"
    >
      <div ref={glowRef} className="age-gate-glow" aria-hidden="true" />

      <div className="age-gate-grain" aria-hidden="true" />

      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div key={pos} className={`age-gate-corner age-gate-corner--${pos}`} aria-hidden="true" />
      ))}

      <div ref={contentRef} className="age-gate-content">
        <div className="ag-item age-gate-logo">
          <img src={tidlLogo} alt="TIDL" />
        </div>

        <div className="ag-item age-gate-eyebrow">
          <span className="age-gate-eyebrow-line" aria-hidden="true" />
          <span className="age-gate-eyebrow-text">Adults Only · Prescription Medicine</span>
          <span className="age-gate-eyebrow-line" aria-hidden="true" />
        </div>

        <h1 id="ag-heading" className="ag-item age-gate-heading">
          Are you 18 years
          <br />
          <span className="age-gate-heading-accent">or older?</span>
        </h1>

        <p className="ag-item age-gate-body">
          This site contains prescription medication information and is intended for adults aged 18
          and over. Our treatments are physician-reviewed and pharmacy-fulfilled.
        </p>

        <div className="ag-item age-gate-actions">
          <button type="button" className="age-gate-btn age-gate-btn--primary" onClick={confirm}>
            Yes, I am 18 or older
          </button>
          <button type="button" className="age-gate-btn age-gate-btn--secondary" onClick={deny}>
            No, I am under 18
          </button>
        </div>

        <p className="ag-item age-gate-legal">
          By continuing you confirm you are of legal age and agree to our{" "}
          <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      <style>{`
        .age-gate-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${TIDL_BRAND.ink};
          opacity: 0;
        }
        .age-gate-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 55% 45% at 50% 52%,
            rgba(243, 195, 0, 0.1) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .age-gate-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
          opacity: 0.04;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .age-gate-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: rgba(243, 195, 0, 0.35);
        }
        .age-gate-corner--tl { top: 24px; left: 24px; border-top: 1px solid; border-left: 1px solid; }
        .age-gate-corner--tr { top: 24px; right: 24px; border-top: 1px solid; border-right: 1px solid; }
        .age-gate-corner--bl { bottom: 24px; left: 24px; border-bottom: 1px solid; border-left: 1px solid; }
        .age-gate-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid; border-right: 1px solid; }
        .age-gate-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 440px;
          width: 100%;
          padding: 0 24px;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .age-gate-logo {
          margin-bottom: 36px;
        }
        .age-gate-logo img {
          height: 28px;
          object-fit: contain;
          opacity: 0.95;
        }
        .age-gate-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .age-gate-eyebrow-line {
          display: block;
          width: 28px;
          height: 1px;
          background: rgba(243, 195, 0, 0.55);
        }
        .age-gate-eyebrow-text {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(243, 195, 0, 0.82);
        }
        .age-gate-heading {
          font-family: 'Archivo Narrow', sans-serif;
          font-size: clamp(2rem, 6vw, 2.75rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: #ffffff;
          margin: 0 0 18px;
        }
        .age-gate-heading-accent {
          color: ${TIDL_BRAND.accent};
          font-style: italic;
        }
        .age-gate-body {
          font-family: 'Archivo', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.62);
          margin: 0 0 40px;
          max-width: 340px;
        }
        .age-gate-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .age-gate-btn {
          width: 100%;
          min-height: 52px;
          border-radius: 9999px;
          font-family: 'Archivo', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .age-gate-btn--primary {
          background: ${TIDL_BRAND.accent};
          color: ${TIDL_BRAND.ink};
          border: none;
          box-shadow: 0 8px 28px rgba(243, 195, 0, 0.28);
        }
        .age-gate-btn--primary:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .age-gate-btn--secondary {
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.22);
        }
        .age-gate-btn--secondary:hover {
          border-color: rgba(255, 255, 255, 0.38);
          color: rgba(255, 255, 255, 0.78);
        }
        .age-gate-legal {
          margin-top: 28px;
          font-family: 'Archivo', system-ui, sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.38);
          text-align: center;
        }
        .age-gate-legal a {
          color: rgba(255, 255, 255, 0.55);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .age-gate-legal a:hover {
          color: ${TIDL_BRAND.accent};
        }
      `}</style>
    </div>
  );
}
