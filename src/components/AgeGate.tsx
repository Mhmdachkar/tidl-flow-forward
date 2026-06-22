// src/components/AgeGate.tsx
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
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

  // null = not yet determined (SSR), true = show gate, false = hidden
  const [visible, setVisible] = useState<boolean | null>(null);
  const [exiting, setExiting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Determine visibility on client only (avoids SSR mismatch)
  useEffect(() => {
    if (EXEMPT_ROUTES.some((r) => currentPath.startsWith(r))) {
      setVisible(false);
      return;
    }
    setVisible(!isConfirmed());
  }, [currentPath]);

  // Entrance animation
  useEffect(() => {
    if (!visible || !overlayRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const children = contentRef.current!.querySelectorAll<HTMLElement>(
        ".ag-item"
      );

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        children,
        { y: 28, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.25,
        }
      );

      // Subtle ambient glow pulse
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

  // Scroll lock while gate is visible
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // Focus trap
  useEffect(() => {
    if (!visible || !overlayRef.current) return;
    const el = overlayRef.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      "button, a, [tabindex]:not([tabindex='-1'])"
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

  // Not yet determined (SSR) or dismissed
  if (visible === null || visible === false) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ag-heading"
      className="age-gate-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.13 0.008 60)",
        opacity: 0,
      }}
    >
      {/* Ambient radial glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, oklch(0.78 0.18 85 / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Noise grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>")`,
          opacity: 0.04,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Corner registration marks */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 18,
            height: 18,
            top: pos.startsWith("t") ? 24 : undefined,
            bottom: pos.startsWith("b") ? 24 : undefined,
            left: pos.endsWith("l") ? 24 : undefined,
            right: pos.endsWith("r") ? 24 : undefined,
            borderTop: pos.startsWith("t") ? "1px solid oklch(0.78 0.18 85 / 0.35)" : undefined,
            borderBottom: pos.startsWith("b") ? "1px solid oklch(0.78 0.18 85 / 0.35)" : undefined,
            borderLeft: pos.endsWith("l") ? "1px solid oklch(0.78 0.18 85 / 0.35)" : undefined,
            borderRight: pos.endsWith("r") ? "1px solid oklch(0.78 0.18 85 / 0.35)" : undefined,
          }}
        />
      ))}

      {/* Content */}
      <div
        ref={contentRef}
        style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        maxWidth: 440,
        width: "100%",
        padding: "0 24px",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        gap: 0,
        }}
      >
        {/* Logo */}
        <div className="ag-item" style={{ marginBottom: 36 }}>
          <img
            src={tidlLogo}
            alt="TIDL"
            style={{ height: 28, objectFit: "contain", opacity: 0.95 }}
          />
        </div>

        {/* Eyebrow */}
        <div
          className="ag-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              display: "block",
              width: 28,
              height: 1,
              background: "oklch(0.78 0.18 85 / 0.55)",
            }}
          />
          <span
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.78 0.18 85 / 0.75)",
              fontWeight: 500,
            }}
          >
            Adults Only · Prescription Medicine
          </span>
          <span
            style={{
              display: "block",
              width: 28,
              height: 1,
              background: "oklch(0.78 0.18 85 / 0.55)",
            }}
          />
        </div>

        {/* Heading */}
        <h1
          id="ag-heading"
          className="ag-item"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(30px, 6vw, 42px)",
            fontWeight: 300,
            lineHeight: 1.18,
            color: "oklch(0.97 0.01 85)",
            margin: 0,
            marginBottom: 18,
            letterSpacing: "-0.02em",
          }}
        >
          Are you 18 years
          <br />
          <em style={{ fontStyle: "italic", color: "oklch(0.88 0.14 85)" }}>
            or older?
          </em>
        </h1>

        {/* Body */}
        <p
          className="ag-item"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 13,
            lineHeight: 1.65,
            color: "oklch(0.62 0.008 60)",
            margin: 0,
            marginBottom: 40,
            maxWidth: 340,
          }}
        >
          This site contains prescription medication information and is
          intended for adults aged 18 and over. Our treatments are
          physician-reviewed and pharmacy-fulfilled.
        </p>

        {/* Buttons */}
        <div
          className="ag-item"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
          }}
        >
          {/* Confirm */}
          <button
            onClick={confirm}
            style={{
              width: "100%",
              minHeight: 52,
              background: "oklch(0.78 0.18 85)",
              color: "oklch(0.13 0.008 60)",
              border: "none",
              borderRadius: 6,
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "filter 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter =
                "brightness(1.08)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter = "";
              (e.currentTarget as HTMLButtonElement).style.transform = "";
            }}
          >
            Yes, I am 18 or older
          </button>

          {/* Deny */}
          <button
            onClick={deny}
            style={{
              width: "100%",
              minHeight: 52,
              background: "transparent",
              color: "oklch(0.55 0.008 60)",
              border: "1px solid oklch(0.28 0.008 60)",
              borderRadius: 6,
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.42 0.008 60)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.72 0.008 60)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.28 0.008 60)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.008 60)";
            }}
          >
            No, I am under 18
          </button>
        </div>

        {/* Legal footnote */}
        <p
          className="ag-item"
          style={{
            marginTop: 28,
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 11,
            lineHeight: 1.6,
            color: "oklch(0.38 0.008 60)",
            textAlign: "center",
          }}
        >
          By continuing you confirm you are of legal age and agree to our{" "}
          <a
            href="/terms"
            style={{
              color: "oklch(0.55 0.008 60)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
            tabIndex={0}
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            style={{
              color: "oklch(0.55 0.008 60)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
            tabIndex={0}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
