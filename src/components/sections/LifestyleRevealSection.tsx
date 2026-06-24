import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { observeSectionVisibility } from "@/lib/section-performance";
import { TIDL_BRAND } from "@/lib/tidl-brand";

import lifestylePhoto from "@/assets/ChatGPT Image Jun 24, 2026, 11_45_01 AM.png";
import menFigure from "@/assets/men 3d.png";

const TRUST_POINTS = [
  "Licensed physicians review every assessment",
  "Prescriptions filled by licensed pharmacy partners",
  "Secure checkout and HIPAA-aligned records",
  "Cold-chain delivery nationwide to your door",
] as const;

const SCROLL_TRACK_EXTRA_VH = 200;

const T = {
  BG_HALF: 0.4,
  FIGURE_START: 0.4,
  FIGURE_END: 0.58,
  COPY_START: 0.58,
  COPY_END: 0.72,
  HOLD_START: 0.72,
} as const;

const GPU = { force3D: true } as const;

export function LifestyleRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const visualImgRef = useRef<HTMLImageElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const panel = panelRef.current;
    const visual = visualRef.current;
    const visualImg = visualImgRef.current;
    const figure = figureRef.current;
    const copy = copyRef.current;
    if (!section || !track || !panel || !visual || !visualImg || !figure || !copy) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(visual, { scaleY: 1, opacity: 1 });
        gsap.set(visualImg, { yPercent: 0, scale: 1 });
        gsap.set(figure, { opacity: 1, y: 0 });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(visual, {
        scaleY: 0,
        opacity: 1,
        transformOrigin: "top center",
        ...GPU,
      });
      gsap.set(visualImg, { yPercent: -8, scale: 1.06, transformOrigin: "center top", ...GPU });
      gsap.set(figure, { opacity: 0, y: 56, ...GPU });
      gsap.set(copy, { opacity: 0, y: 32, ...GPU });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top bottom+=48%",
          end: "bottom top",
          scrub: 2,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onEnter: () => panel.classList.add("lifestyle-reveal-panel--live"),
          onLeave: () => panel.classList.remove("lifestyle-reveal-panel--live"),
          onEnterBack: () => panel.classList.add("lifestyle-reveal-panel--live"),
          onLeaveBack: () => panel.classList.remove("lifestyle-reveal-panel--live"),
        },
      });

      tl.to(
        visual,
        { scaleY: 0.5, ease: "none", duration: T.BG_HALF, ...GPU },
        0,
      );
      tl.to(
        visualImg,
        { yPercent: -4, scale: 1.03, ease: "none", duration: T.BG_HALF, ...GPU },
        0,
      );

      const figureDur = T.FIGURE_END - T.FIGURE_START;
      tl.to(
        visual,
        { scaleY: 1, ease: "none", duration: figureDur, ...GPU },
        T.FIGURE_START,
      );
      tl.to(
        visualImg,
        { yPercent: 0, scale: 1, ease: "none", duration: figureDur, ...GPU },
        T.FIGURE_START,
      );
      tl.to(figure, { opacity: 1, y: 0, ease: "none", duration: figureDur, ...GPU }, T.FIGURE_START);

      const copyDur = T.COPY_END - T.COPY_START;
      tl.to(copy, { opacity: 1, y: 0, ease: "none", duration: copyDur, ...GPU }, T.COPY_START);

      tl.to({}, { duration: 1 - T.HOLD_START }, T.HOLD_START);
    }, track);

    const visObserver = observeSectionVisibility(
      section,
      () => section.classList.add("lifestyle-reveal--active"),
      () => section.classList.remove("lifestyle-reveal--active"),
    );

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      visObserver();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lifestyle-reveal"
      aria-label="Physician-guided care you can trust"
      className="lifestyle-reveal relative mt-4 w-full px-2"
    >
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `calc(100svh + ${SCROLL_TRACK_EXTRA_VH}svh)` }}
      >
        <div
          ref={panelRef}
          className="lifestyle-reveal-panel sticky top-0 h-[100svh] w-full overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div
              ref={visualRef}
              className="lifestyle-reveal-visual absolute inset-0 origin-top"
              style={{ transform: "scaleY(0) translateZ(0)" }}
            >
              <img
                ref={visualImgRef}
                src={lifestylePhoto}
                alt=""
                aria-hidden
                className="lifestyle-reveal-img absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1920}
                height={1080}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(35,31,32,0.75) 0%, rgba(35,31,32,0.32) 42%, rgba(35,31,32,0.08) 62%, rgba(35,31,32,0.24) 100%)",
                }}
              />
            </div>
          </div>

          <div
            ref={figureRef}
            className="lifestyle-reveal-figure-wrap pointer-events-none absolute inset-0 z-10 flex items-end justify-center pb-8 md:items-center md:justify-end md:pr-[6%] md:pb-0 lg:pr-[8%]"
            style={{ opacity: 0, transform: "translate3d(0, 56px, 0)" }}
          >
            <img
              src={menFigure}
              alt=""
              aria-hidden
              className="lifestyle-reveal-figure"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1200}
              height={1600}
            />
          </div>

          <div
            ref={copyRef}
            className="lifestyle-reveal-copy absolute inset-0 z-20 flex flex-col justify-end px-6 pb-10 sm:px-10 sm:pb-12 md:max-w-[min(44vw,520px)] md:justify-center md:pb-0 md:pl-12 lg:pl-16"
            style={{ opacity: 0, transform: "translate3d(0, 32px, 0)" }}
          >
            <p
              className="mb-3 font-[Josefin_Sans,sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[12px]"
              style={{ color: "rgba(255,255,255,0.52)" }}
            >
              Why patients trust TIDL
            </p>
            <h2
              className="font-[Archivo_Narrow,sans-serif] text-[clamp(1.65rem,4.5vw,2.75rem)] font-bold leading-[1.06] tracking-[-0.025em]"
              style={{ color: "#ffffff" }}
            >
              Real physicians.{" "}
              <span style={{ color: TIDL_BRAND.accent }}>Real care.</span>
            </h2>
            <p
              className="mt-3 max-w-md text-[14px] leading-relaxed sm:text-[15px]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Every path starts with a licensed clinician, a legitimate
              prescription, and pharmacy partners you can verify.
            </p>
            <ul className="mt-6 space-y-3 sm:mt-7" aria-label="Trust highlights">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[13px] leading-snug sm:text-[14px]"
                  style={{ color: "rgba(255,255,255,0.90)" }}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: TIDL_BRAND.accent, color: TIDL_BRAND.ink }}
                  >
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .lifestyle-reveal-panel {
          contain: layout style;
          isolation: isolate;
          box-shadow: 0 16px 56px rgba(35, 31, 32, 0.12);
        }
        .lifestyle-reveal-panel--live .lifestyle-reveal-visual {
          will-change: transform;
        }
        .lifestyle-reveal-panel--live .lifestyle-reveal-img {
          will-change: transform;
        }
        .lifestyle-reveal-panel--live .lifestyle-reveal-figure-wrap,
        .lifestyle-reveal-panel--live .lifestyle-reveal-copy {
          will-change: transform, opacity;
        }
        .lifestyle-reveal-visual {
          backface-visibility: hidden;
        }
        .lifestyle-reveal-img {
          backface-visibility: hidden;
        }
        .lifestyle-reveal-figure {
          width: min(72vw, 380px);
          height: auto;
          object-fit: contain;
          object-position: center bottom;
          filter: drop-shadow(-20px 40px 48px rgba(35, 31, 32, 0.28));
        }
        @media (min-width: 768px) {
          .lifestyle-reveal-figure {
            width: min(38vw, 440px);
            object-position: center;
          }
        }
        html.tidl-scrolling .lifestyle-reveal-panel {
          box-shadow: none;
        }
      `}</style>
    </section>
  );
}
