import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import trustPortrait from "@/assets/ChatGPT Image Jun 26, 2026, 02_26_17 AM.png";

const TRUST_LINES = [
  "Board-certified physicians review every case",
  "Prescriptions filled by licensed pharmacy partners",
  "HIPAA-aligned records · Secure checkout",
] as const;

const SCROLLER = document.documentElement;
// Extra scroll depth while the stage stays sticky (replaces GSAP pin spacer)
const SCROLL_DEPTH_VH = 200;

export function TrustBridgeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const portraitShineRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leadMainRef = useRef<HTMLSpanElement>(null);
  const leadAccentRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const { openModal } = useQuizModal();

  useEffect(() => {
    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const portraitImg = portraitImgRef.current;
    const portraitShine = portraitShineRef.current;
    const eyebrow = eyebrowRef.current;
    const leadMain = leadMainRef.current;
    const leadAccent = leadAccentRef.current;
    const cta = ctaRef.current;
    const progressBar = progressBarRef.current;
    if (
      !section || !portrait || !portraitImg || !portraitShine ||
      !eyebrow || !leadMain || !leadAccent || !cta || !progressBar
    ) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = lineRefs.current.filter(Boolean) as HTMLLIElement[];
    const copyTargets = [eyebrow, leadMain, leadAccent, ...lines, cta];

    const ctx = gsap.context(() => {
      if (reduced) return;

      const copyFrom = { opacity: 0, y: 22, filter: "blur(6px)" };
      const copyTo = { opacity: 1, y: 0, filter: "blur(0px)", ease: "power3.out" as const };

      gsap.set(copyTargets, copyFrom);
      gsap.set(portrait, { x: "42vw", opacity: 0, scale: 0.88, rotate: 5 });
      gsap.set(portraitImg, { scale: 1.26, x: "8%" });
      gsap.set(portraitShine, { xPercent: -130, opacity: 0 });
      gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

      // CSS sticky holds the stage — no GSAP pin (avoids snap / redirect / cut-off)
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      tl.to(progressBar, { scaleX: 1, ease: "none", duration: 1 }, 0);

      // Portrait: long scroll window so the slide-in from the right is easy to follow
      tl.fromTo(
        portrait,
        { x: "42vw", opacity: 0, scale: 0.88, rotate: 5 },
        { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.58, ease: "power1.out" },
        0.02,
      );
      tl.fromTo(
        portraitImg,
        { scale: 1.26, x: "8%" },
        { scale: 1, x: "0%", duration: 0.58, ease: "power1.out" },
        0.02,
      );
      tl.fromTo(
        portraitShine,
        { xPercent: -130, opacity: 0 },
        { xPercent: 130, opacity: 0.85, duration: 0.3, ease: "power1.inOut" },
        0.32,
      );
      tl.to(portraitShine, { opacity: 0, duration: 0.08 }, 0.58);

      // Copy reveals only after the portrait has fully arrived
      tl.fromTo(eyebrow, copyFrom, { ...copyTo, duration: 0.08 }, 0.60)
        .fromTo(leadMain, copyFrom, { ...copyTo, duration: 0.08 }, 0.66)
        .fromTo(leadAccent, copyFrom, { ...copyTo, duration: 0.08 }, 0.72)
        .fromTo(lines[0], copyFrom, { ...copyTo, duration: 0.07 }, 0.78)
        .fromTo(lines[1], copyFrom, { ...copyTo, duration: 0.07 }, 0.84)
        .fromTo(lines[2], copyFrom, { ...copyTo, duration: 0.07 }, 0.89)
        .fromTo(cta, copyFrom, { ...copyTo, duration: 0.08 }, 0.94);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-zone="bridge"
      className="trust-bridge"
      aria-label="Why patients trust TIDL"
    >
      <style>{`
        .trust-bridge {
          --tb-ink: #1a1718;
          --tb-ink-soft: rgba(26, 23, 24, 0.62);
          --tb-cream: #f6f3ec;
          --tb-gold: #f3c300;
          --tb-gold-deep: #c9a200;
          --tb-line: rgba(26, 23, 24, 0.12);
          --tb-scroll-depth: ${SCROLL_DEPTH_VH}vh;
          position: relative;
          min-height: calc(100svh + var(--tb-scroll-depth));
          color: var(--tb-ink);
          font-family: "Archivo", system-ui, sans-serif;
        }

        .trust-bridge__stage {
          position: sticky;
          top: 0;
          display: flex;
          height: 100svh;
          flex-direction: column;
          padding: clamp(3rem, 7vw, 4.5rem) clamp(1.25rem, 4vw, 3rem) 3.5rem;
          overflow: hidden;
        }

        .trust-bridge__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(180deg, #faf8f3 0%, var(--tb-cream) 42%, #f0ece3 100%);
        }

        .trust-bridge__bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(246, 243, 236, 0.4) 0%,
            rgba(246, 243, 236, 0.92) 55%,
            var(--tb-cream) 72%,
            var(--tb-cream) 100%
          );
          pointer-events: none;
        }

        .trust-bridge__inner {
          position: relative;
          z-index: 1;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 2rem;
          max-width: 72rem;
          width: 100%;
          margin-inline: auto;
        }

        @media (min-width: 900px) {
          .trust-bridge__inner {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            gap: clamp(1.5rem, 4vw, 3rem);
          }
        }

        .trust-bridge__copy { max-width: 36rem; }

        .trust-bridge__eyebrow {
          margin: 0;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--tb-gold-deep);
          will-change: transform, opacity, filter;
        }

        .trust-bridge__lead {
          margin: 0.85rem 0 0;
          font-family: "Archivo Narrow", sans-serif;
          font-size: clamp(2.15rem, 5.2vw, 3.35rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: var(--tb-ink);
          text-wrap: balance;
        }

        .trust-bridge__lead-main,
        .trust-bridge__lead-accent {
          display: block;
          will-change: transform, opacity, filter;
        }

        .trust-bridge__lead-main { font-weight: 900; }

        .trust-bridge__lead-accent {
          margin-top: 0.12em;
          font-style: normal;
          font-weight: 900;
          color: var(--tb-gold-deep);
        }

        .trust-bridge__lines {
          margin: 1.35rem 0 0;
          padding: 1.1rem 0 0;
          border-top: 1px solid var(--tb-line);
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .trust-bridge__line {
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
          font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
          line-height: 1.55;
          color: var(--tb-ink-soft);
          will-change: transform, opacity, filter;
        }

        .trust-bridge__line::before {
          content: "";
          flex-shrink: 0;
          width: 1.5rem;
          height: 2px;
          background: linear-gradient(90deg, var(--tb-gold), rgba(243,195,0,0.12));
          transform: translateY(-0.08em);
        }

        .trust-bridge__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--tb-gold-deep) 0%, var(--tb-gold) 100%);
          color: var(--tb-ink);
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 14px 32px -12px rgba(243,195,0,0.52);
          will-change: transform, opacity, filter;
          transition: filter 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }

        .trust-bridge__cta:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .trust-bridge__cta:active { transform: translateY(0); }

        .trust-bridge__cta svg {
          width: 0.875rem;
          height: 0.875rem;
          transition: transform 0.35s ease;
        }
        .trust-bridge__cta:hover svg { transform: translateX(3px); }

        .trust-bridge__visual {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: clamp(16rem, 38vw, 22rem);
        }

        @media (min-width: 900px) {
          .trust-bridge__visual { justify-content: flex-end; min-height: auto; }
        }

        .trust-bridge__portrait {
          position: relative;
          width: min(84vw, 26rem);
          aspect-ratio: 1;
          will-change: transform, opacity;
        }

        @media (min-width: 900px) {
          .trust-bridge__portrait { width: min(46vw, 30rem); }
        }

        .trust-bridge__portrait-frame {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: var(--tb-cream);
          box-shadow:
            0 0 0 4px rgba(255, 255, 255, 0.9),
            0 24px 56px -20px rgba(26, 23, 24, 0.28);
        }

        .trust-bridge__portrait-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .trust-bridge__portrait-shine {
          position: absolute;
          inset: -20% -40%;
          pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 38%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(243, 195, 0, 0.35) 54%,
            transparent 66%
          );
          mix-blend-mode: soft-light;
          opacity: 0;
          will-change: transform, opacity;
        }

        .trust-bridge__progress {
          position: relative;
          z-index: 2;
          height: 2px;
          margin-top: auto;
          background: rgba(26,23,24,0.09);
          border-radius: 999px;
          overflow: hidden;
        }

        .trust-bridge__progress-bar {
          height: 100%;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          background: linear-gradient(90deg, var(--tb-gold-deep), var(--tb-gold));
          border-radius: inherit;
        }

        @media (prefers-reduced-motion: reduce) {
          .trust-bridge__portrait-frame {
            box-shadow: 0 20px 48px -18px rgba(26, 23, 24, 0.24);
          }
        }
      `}</style>

      <div className="trust-bridge__stage">
        <div className="trust-bridge__bg" aria-hidden />

        <div className="trust-bridge__inner">
          <div className="trust-bridge__copy">
            <p ref={eyebrowRef} className="trust-bridge__eyebrow">
              Physician-guided care you can trust
            </p>
            <h2 className="trust-bridge__lead">
              <span ref={leadMainRef} className="trust-bridge__lead-main">
                Not a supplement order.
              </span>
              <span ref={leadAccentRef} className="trust-bridge__lead-accent">
                A real medical pathway.
              </span>
            </h2>
            <ul className="trust-bridge__lines">
              {TRUST_LINES.map((line, i) => (
                <li
                  key={line}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  className="trust-bridge__line"
                >
                  {line}
                </li>
              ))}
            </ul>
            <button
              ref={ctaRef}
              type="button"
              className="trust-bridge__cta"
              onClick={openModal}
            >
              Start assessment
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="trust-bridge__visual">
            <div ref={portraitRef} className="trust-bridge__portrait">
              <div className="trust-bridge__portrait-frame">
                <img
                  ref={portraitImgRef}
                  className="trust-bridge__portrait-img"
                  src={trustPortrait}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div ref={portraitShineRef} className="trust-bridge__portrait-shine" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        <div className="trust-bridge__progress" aria-hidden>
          <div ref={progressBarRef} className="trust-bridge__progress-bar" />
        </div>
      </div>
    </section>
  );
}
