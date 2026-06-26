import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import trustPortrait from "@/assets/ChatGPT Image Jun 26, 2026, 02_26_17 AM.png";

const SCROLLER = document.documentElement;
const SCROLL_DEPTH_VH = 220;
const SCROLL_START = "top 68%";
const VISUALS_SCROLL_START = "top 38%";
const GPU = { force3D: true } as const;

const TRUST_LINES = [
  {
    segments: [
      { text: "Board-certified physicians", bold: true },
      { text: " review every case" },
    ],
  },
  {
    segments: [
      { text: "Prescriptions", bold: true },
      { text: " filled by " },
      { text: "licensed pharmacy partners", bold: true },
    ],
  },
  {
    segments: [
      { text: "HIPAA-aligned records", bold: true },
      { text: " · " },
      { text: "Secure checkout", bold: true },
    ],
  },
] as const;

type CharSegment = {
  text: string;
  bold?: boolean;
  accent?: boolean;
};

type CharVariant = "eyebrow" | "lead" | "lead-accent" | "line" | "cta" | "knockout" | "knockout-sub";

function segmentTone(segment: CharSegment, variant: CharVariant): string {
  const bold = Boolean(segment.bold);
  switch (variant) {
    case "knockout-sub":
      return "tb-segment tb-segment--knockout-sub";
    case "knockout":
      return bold
        ? "tb-segment tb-segment--knockout-bold"
        : "tb-segment tb-segment--knockout-regular";
    case "eyebrow":
      return bold
        ? "tb-segment tb-segment--bold tb-segment--eyebrow-bold"
        : "tb-segment tb-segment--regular tb-segment--eyebrow-regular";
    case "lead":
      return bold
        ? "tb-segment tb-segment--bold tb-segment--lead-bold"
        : "tb-segment tb-segment--regular tb-segment--lead-regular";
    case "lead-accent":
      return bold
        ? "tb-segment tb-segment--bold tb-segment--lead-accent-bold"
        : "tb-segment tb-segment--regular tb-segment--lead-accent-regular";
    case "line":
      return bold
        ? "tb-segment tb-segment--bold tb-segment--line-bold"
        : "tb-segment tb-segment--regular tb-segment--line-regular";
    case "cta":
      return bold
        ? "tb-segment tb-segment--bold tb-segment--cta-bold"
        : "tb-segment tb-segment--regular tb-segment--cta-regular";
    default:
      return "tb-segment";
  }
}

function SplitChars({
  segments,
  variant,
}: {
  segments: readonly CharSegment[];
  variant: CharVariant;
}) {
  return (
    <>
      {segments.map((segment, segmentIndex) => {
        const Wrapper = segment.bold ? "strong" : "span";
        return (
          <Wrapper
            key={`${variant}-${segmentIndex}`}
            className={segmentTone(segment, variant)}
          >
            {segment.text.split("").map((char, charIndex) => {
              const isSpace = char === " ";
              return (
                <span
                  key={`${segmentIndex}-${charIndex}`}
                  className={`tb-char-wrap inline-block overflow-hidden align-bottom${isSpace ? " w-[0.3em]" : ""}`}
                >
                  <span
                    className={`tb-char inline-block${isSpace ? " tb-char--space" : ""}${segment.bold ? " tb-char--bold" : ""}`}
                  >
                    {isSpace ? "\u00A0" : char}
                  </span>
                </span>
              );
            })}
          </Wrapper>
        );
      })}
    </>
  );
}

const EYEBROW_SEGMENTS = [
  { text: "Physician-guided", bold: true },
  { text: " care you " },
  { text: "can trust", bold: true },
] as const satisfies readonly CharSegment[];

const LEAD_MAIN_SEGMENTS = [
  { text: "Not ", bold: true },
  { text: "a " },
  { text: "supplement ", bold: true },
  { text: "order." },
] as const satisfies readonly CharSegment[];

const LEAD_ACCENT_SEGMENTS = [
  { text: "A ", accent: true },
  { text: "real", bold: true, accent: true },
  { text: " ", accent: true },
  { text: "medical pathway.", bold: true, accent: true },
] as const satisfies readonly CharSegment[];

const CTA_SEGMENTS = [
  { text: "Start ", bold: true },
  { text: "assessment" },
] as const satisfies readonly CharSegment[];

const CORNER_TL_SUB = [{ text: "LICENSED CARE", bold: true }] as const satisfies readonly CharSegment[];
const CORNER_TL_MAIN = [
  { text: "REAL", bold: true },
  { text: " MEDICINE", bold: true },
] as const satisfies readonly CharSegment[];

const CORNER_BR_SUB = [{ text: "PHYSICIAN LED", bold: true }] as const satisfies readonly CharSegment[];
const CORNER_BR_MAIN = [
  { text: "CLINICAL", bold: true },
  { text: " PATHWAY", bold: true },
] as const satisfies readonly CharSegment[];

const ZIGZAG_ROWS = 9;
const ZIGZAG_TEETH = 28;

function buildZigzagPath(y: number, teeth: number, amplitude: number, width = 1400) {
  const step = width / teeth;
  let d = `M -40 ${y}`;
  for (let i = 0; i < teeth; i++) {
    const midX = i * step + step * 0.5;
    const endX = (i + 1) * step;
    const peakY = i % 2 === 0 ? y - amplitude : y + amplitude;
    d += ` L ${midX} ${peakY} L ${endX} ${y}`;
  }
  return d;
}

export function TrustBridgeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const zigzagRef = useRef<SVGSVGElement>(null);
  const zigzagWrapRef = useRef<HTMLDivElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const knockoutTLRef = useRef<HTMLParagraphElement>(null);
  const knockoutBRRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const copyPanelRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitRingRef = useRef<SVGSVGElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const portraitShineRef = useRef<HTMLDivElement>(null);
  const portraitBadgeRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leadMainRef = useRef<HTMLSpanElement>(null);
  const leadAccentRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lineMarkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { openModal } = useQuizModal();
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const zigzag = zigzagRef.current;
    const zigzagWrap = zigzagWrapRef.current;
    const cornerTL = cornerTLRef.current;
    const cornerBR = cornerBRRef.current;
    const knockoutTL = knockoutTLRef.current;
    const knockoutBR = knockoutBRRef.current;
    const glow = glowRef.current;
    const grid = gridRef.current;
    const copyPanel = copyPanelRef.current;
    const portrait = portraitRef.current;
    const portraitRing = portraitRingRef.current;
    const portraitImg = portraitImgRef.current;
    const portraitShine = portraitShineRef.current;
    const portraitBadge = portraitBadgeRef.current;
    const eyebrow = eyebrowRef.current;
    const leadMain = leadMainRef.current;
    const leadAccent = leadAccentRef.current;
    const cta = ctaRef.current;
    const progressBar = progressBarRef.current;
    if (
      !section ||
      !zigzag ||
      !zigzagWrap ||
      !cornerTL ||
      !cornerBR ||
      !knockoutTL ||
      !knockoutBR ||
      !glow ||
      !grid ||
      !copyPanel ||
      !portrait ||
      !portraitRing ||
      !portraitImg ||
      !portraitShine ||
      !portraitBadge ||
      !eyebrow ||
      !leadMain ||
      !leadAccent ||
      !cta ||
      !progressBar
    ) {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = lineRefs.current.filter(Boolean) as HTMLLIElement[];
    const lineMarks = lineMarkRefs.current.filter(Boolean) as HTMLSpanElement[];
    const eyebrowChars = eyebrow.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const mainChars = leadMain.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const accentChars = leadAccent.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const lineCharGroups = lines.map(
      (line) => line.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)"),
    );
    const allChars = [
      ...eyebrowChars,
      ...mainChars,
      ...accentChars,
      ...lineCharGroups.flat(),
    ];
    const boldChars = section.querySelectorAll<HTMLElement>(".tb-char--bold:not(.tb-char--space)");
    const ctaChars = cta.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const tlSubChars = cornerTL.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const tlMainChars = knockoutTL.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const brSubChars = cornerBR.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const brMainChars = knockoutBR.querySelectorAll<HTMLElement>(".tb-char:not(.tb-char--space)");
    const zigzagLines = zigzag.querySelectorAll<SVGPathElement>(".tb-zigzag-line");
    const ringCircle = portraitRing.querySelector("circle");

    const charHidden = {
      yPercent: 118,
      opacity: 0,
      rotateX: -62,
      filter: "blur(5px)",
      transformOrigin: "50% 100%",
    };
    const charVisible = {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      ease: "expo.out" as const,
      ...GPU,
    };

    const revealAll = () => {
      gsap.set(
        [
          glow,
          grid,
          copyPanel,
          portrait,
          portraitBadge,
          eyebrow,
          cta,
          cornerTL,
          cornerBR,
          zigzagWrap,
          ...lines,
          ...lineMarks,
          ...allChars,
          ...ctaChars,
          ...tlSubChars,
          ...tlMainChars,
          ...brSubChars,
          ...brMainChars,
        ],
        { clearProps: "all", opacity: 1, x: 0, y: 0, scale: 1, filter: "none", rotate: 0, rotateX: 0, yPercent: 0 },
      );
      gsap.set(portraitImg, { scale: 1, x: "0%" });
      gsap.set(portraitShine, { opacity: 0 });
      gsap.set(progressBar, { scaleX: 1 });
      zigzagLines.forEach((line) => gsap.set(line, { strokeDashoffset: 0 }));
    };

    if (prefersReduced || reduced) {
      revealAll();
      if (ringCircle) gsap.set(ringCircle, { strokeDashoffset: 0 });
      zigzagLines.forEach((line) => gsap.set(line, { strokeDashoffset: 0 }));
      return;
    }

    zigzagLines.forEach((line) => {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.set(glow, { opacity: 0, scale: 0.7 });
    gsap.set(grid, { opacity: 0 });
    gsap.set(zigzagWrap, { opacity: 0, x: -30 });
    gsap.set(cornerTL, { opacity: 1, x: -48, y: -32, ...GPU });
    gsap.set(cornerBR, { opacity: 1, x: 48, y: 32, ...GPU });
    gsap.set([...tlSubChars, ...tlMainChars, ...brSubChars, ...brMainChars], {
      ...charHidden,
      rotateX: -72,
      scale: 0.82,
    });
    const ringLen = ringCircle ? ringCircle.getTotalLength() : 0;

    gsap.set(copyPanel, { opacity: 0, x: -40, filter: "blur(10px)", ...GPU });
    gsap.set(eyebrow, { opacity: 1 });
    gsap.set(allChars, charHidden);
    gsap.set(boldChars, { ...charHidden, scale: 0.86, yPercent: 128 });
    gsap.set(ctaChars, charHidden);
    gsap.set(cta, { scale: 0.88, filter: "blur(6px)", transformOrigin: "50% 100%" });
    gsap.set(lines, { opacity: 1 });
    gsap.set(lineMarks, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(portrait, { x: "48vw", opacity: 0, scale: 0.84, rotate: 8, ...GPU });
    gsap.set(portraitImg, { scale: 1.32, x: "10%" });
    gsap.set(portraitShine, { xPercent: -140, opacity: 0 });
    gsap.set(portraitBadge, { opacity: 0, scale: 0.8, y: 12 });
    if (ringCircle) {
      gsap.set(ringCircle, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
    }
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: SCROLL_START,
          end: "bottom bottom",
          scrub: 0.72,
          invalidateOnRefresh: true,
        },
      });

      tl.to(progressBar, { scaleX: 1, ease: "none", duration: 1 }, 0)
        .to(glow, { opacity: 1, scale: 1, duration: 0.22, ease: "power2.out" }, 0)
        .to(grid, { opacity: 0.5, duration: 0.28 }, 0.04)
        .to(cornerTL, { x: 0, y: 0, duration: 0.38, ease: "expo.out", ...GPU }, 0.1)
        .to(
          tlSubChars,
          { ...charVisible, duration: 0.24, stagger: { each: 0.02, from: "start" } },
          0.14,
        )
        .to(
          tlMainChars,
          {
            ...charVisible,
            duration: 0.32,
            stagger: { each: 0.028, from: "start" },
            ease: "back.out(1.35)",
          },
          0.2,
        )
        .to(cornerBR, { x: 0, y: 0, duration: 0.38, ease: "expo.out", ...GPU }, 0.24)
        .to(
          brSubChars,
          { ...charVisible, duration: 0.24, stagger: { each: 0.02, from: "end" } },
          0.28,
        )
        .to(
          brMainChars,
          {
            ...charVisible,
            duration: 0.32,
            stagger: { each: 0.028, from: "end" },
            ease: "back.out(1.35)",
          },

          0.34,
        )
        .to(
          copyPanel,
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.28, ease: "expo.out", ...GPU },
          0.52,
        )
        .to(
          eyebrowChars,
          { ...charVisible, duration: 0.22, stagger: { each: 0.006, from: "start" } },
          0.56,
        )
        .to(
          mainChars,
          { ...charVisible, duration: 0.28, stagger: { each: 0.009, from: "start" } },
          0.64,
        )
        .to(
          accentChars,
          {
            ...charVisible,
            duration: 0.26,
            stagger: { each: 0.01, from: "start" },
            ease: "back.out(1.4)",
          },
          0.76,
        );

      lineCharGroups.forEach((chars, i) => {
        const t = 0.86 + i * 0.06;
        tl.to(lineMarks[i], { scaleX: 1, duration: 0.1, ease: "power2.out" }, t).to(
          chars,
          { ...charVisible, duration: 0.2, stagger: { each: 0.005, from: "start" } },
          t + 0.02,
        );
      });

      tl.fromTo(
        cta,
        { scale: 0.88, filter: "blur(6px)" },
        { scale: 1, filter: "blur(0px)", duration: 0.14, ease: "power2.out" },
        1.02,
      ).to(
        ctaChars,
        {
          ...charVisible,
          duration: 0.2,
          stagger: { each: 0.014, from: "start" },
          ease: "back.out(1.6)",
        },
        1.02,
      );

      const visualsTl = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: VISUALS_SCROLL_START,
          end: "bottom bottom",
          scrub: 0.72,
          invalidateOnRefresh: true,
        },
      });

      visualsTl
        .to(zigzagWrap, { opacity: 1, x: 0, duration: 0.32, ease: "power2.out" }, 0)
        .to(
          zigzagLines,
          { strokeDashoffset: 0, duration: 0.48, stagger: 0.025, ease: "power2.inOut" },
          0.04,
        )
        .fromTo(
          portrait,
          { x: "48vw", opacity: 0, scale: 0.84, rotate: 8 },
          { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.52, ease: "power2.out", ...GPU },
          0.08,
        )
        .fromTo(
          portraitImg,
          { scale: 1.32, x: "10%" },
          { scale: 1, x: "0%", duration: 0.52, ease: "power2.out" },
          0.08,
        );

      if (ringCircle) {
        visualsTl.to(ringCircle, { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" }, 0.2);
      }

      visualsTl
        .fromTo(
          portraitShine,
          { xPercent: -140, opacity: 0 },
          { xPercent: 140, opacity: 0.9, duration: 0.32, ease: "power2.inOut" },
          0.36,
        )
        .to(portraitShine, { opacity: 0, duration: 0.1 }, 0.64)
        .to(
          portraitBadge,
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "back.out(2.4)" },
          0.5,
        );

      gsap.to(zigzagWrap, {
        x: 72,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: VISUALS_SCROLL_START,
          end: "bottom top",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(zigzagLines, {
        y: (i) => (i % 2 === 0 ? -6 : 6),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: VISUALS_SCROLL_START,
          end: "bottom bottom",
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(glow, {
        y: -50,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: SCROLL_START,
          end: "bottom top",
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(portrait, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: VISUALS_SCROLL_START,
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-nav-zone="bridge"
      className="trust-bridge relative text-[#1a1718]"
      style={{ minHeight: `calc(100svh + ${SCROLL_DEPTH_VH}vh)` }}
      aria-label="Why patients trust TIDL"
    >
      <div className="trust-bridge__stage sticky top-0 flex h-svh flex-col overflow-hidden px-5 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16">
        <div
          ref={zigzagWrapRef}
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-0"
          aria-hidden
        >
          <svg
            ref={zigzagRef}
            className="tb-zigzag-svg absolute left-[-8%] top-[-6%] h-[112%] w-[116%]"
            viewBox="0 0 1400 900"
            preserveAspectRatio="none"
          >
            {Array.from({ length: ZIGZAG_ROWS }, (_, i) => {
              const y = 70 + i * 88;
              const amp = 14 + (i % 3) * 4;
              const isGold = i % 2 === 0;
              return (
                <path
                  key={i}
                  className="tb-zigzag-line"
                  d={buildZigzagPath(y, ZIGZAG_TEETH, amp)}
                  fill="none"
                  stroke={isGold ? "rgba(224, 123, 10, 0.22)" : "rgba(26, 23, 24, 0.09)"}
                  strokeWidth={isGold ? 2.2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>
        </div>

        <div
          ref={cornerTLRef}
          className="pointer-events-none absolute left-4 top-10 z-[2] max-w-[min(42vw,16rem)] sm:left-6 sm:top-12 md:left-10 md:max-w-[18rem]"
          aria-hidden
        >
          <p className="tb-knockout-sub m-0 flex items-center gap-2">
            <span className="tb-knockout-dash block h-[3px] w-5 shrink-0 bg-[#1a1718]" />
            <SplitChars segments={CORNER_TL_SUB} variant="knockout-sub" />
          </p>
          <p ref={knockoutTLRef} className="tb-knockout-display m-0 mt-1 leading-[0.88]">
            <SplitChars segments={CORNER_TL_MAIN} variant="knockout" />
          </p>
        </div>

        <div
          ref={cornerBRRef}
          className="pointer-events-none absolute bottom-14 right-4 z-[2] max-w-[min(44vw,17rem)] text-right sm:right-6 sm:bottom-16 md:right-10 md:max-w-[19rem]"
          aria-hidden
        >
          <p className="tb-knockout-sub m-0 flex items-center justify-end gap-2">
            <SplitChars segments={CORNER_BR_SUB} variant="knockout-sub" />
            <span className="tb-knockout-dash block h-[3px] w-5 shrink-0 bg-[#1a1718]" />
          </p>
          <p ref={knockoutBRRef} className="tb-knockout-display m-0 mt-1 leading-[0.88]">
            <SplitChars segments={CORNER_BR_MAIN} variant="knockout" />
          </p>
        </div>

        <div
          ref={glowRef}
          className="pointer-events-none absolute -right-[10%] top-[12%] z-0 h-[min(32rem,70vw)] w-[min(32rem,70vw)] rounded-full bg-[radial-gradient(circle,rgba(224,123,10,0.2)_0%,rgba(224,123,10,0.05)_45%,transparent_70%)] blur-3xl"
          aria-hidden
        />
        <div
          ref={gridRef}
          className="trust-bridge__grid pointer-events-none absolute inset-0 z-0 opacity-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ec] to-[#f0ece3]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(246,243,236,0.35)_0%,rgba(246,243,236,0.92)_52%,#f6f3ec_68%,#f6f3ec_100%)]"
          aria-hidden
        />

        <div className="relative z-[3] mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div
            ref={copyPanelRef}
            className="trust-bridge__panel max-w-xl rounded-[1.75rem] border border-[rgba(26,23,24,0.07)] bg-white/55 p-6 shadow-[0_24px_60px_-32px_rgba(26,23,24,0.22)] backdrop-blur-md md:p-8"
          >
            <p
              ref={eyebrowRef}
              className="trust-bridge__eyebrow m-0 font-[family-name:var(--font-sans)] text-[0.6875rem] uppercase tracking-[0.22em]"
            >
              <SplitChars segments={EYEBROW_SEGMENTS} variant="eyebrow" />
            </p>

            <h2 className="trust-bridge__lead m-0 mt-3.5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.2vw,3.35rem)] leading-[1.02] tracking-[-0.035em] text-balance">
              <span ref={leadMainRef} className="block">
                <SplitChars segments={LEAD_MAIN_SEGMENTS} variant="lead" />
              </span>
              <span ref={leadAccentRef} className="mt-[0.12em] block">
                <SplitChars segments={LEAD_ACCENT_SEGMENTS} variant="lead-accent" />
              </span>
            </h2>

            <ul className="m-0 mt-5 flex list-none flex-col gap-3 border-t border-[rgba(26,23,24,0.1)] pt-5">
              {TRUST_LINES.map((line, i) => (
                <motion.li
                  key={i}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="trust-bridge__line flex items-start gap-3 text-[clamp(0.875rem,1.5vw,0.9375rem)] leading-relaxed"
                  whileHover={reduced ? undefined : { x: 4 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <span
                    ref={(el) => {
                      lineMarkRefs.current[i] = el;
                    }}
                    className="trust-bridge__line-mark mt-[0.55em] block h-[2px] w-6 shrink-0 origin-left bg-gradient-to-r from-[#e07b0a] to-[rgba(224,123,10,0.12)]"
                    aria-hidden
                  />
                  <span
                    ref={(el) => {
                      lineTextRefs.current[i] = el;
                    }}
                  >
                    <SplitChars segments={line.segments} variant="line" />
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.button
              ref={ctaRef}
              type="button"
              className="trust-bridge__cta mt-6 inline-flex items-center gap-2 rounded-full border-0 bg-gradient-to-br from-[#b85c00] to-[#e07b0a] px-7 py-3.5 font-[family-name:var(--font-sans)] text-[0.6875rem] uppercase tracking-[0.18em] text-[#1a1718] shadow-[0_14px_32px_-12px_rgba(224,123,10,0.52)]"
              onClick={openModal}
              whileHover={reduced ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 480, damping: 24 }}
            >
              <span className="inline-flex items-center">
                <SplitChars segments={CTA_SEGMENTS} variant="cta" />
              </span>
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
            </motion.button>
          </div>

          <div className="flex min-h-[16rem] items-center justify-center md:min-h-0 lg:justify-end">
            <div ref={portraitRef} className="relative w-[min(84vw,26rem)] will-change-transform lg:w-[min(46vw,30rem)]">
              <svg
                ref={portraitRingRef}
                className="pointer-events-none absolute -inset-[6%] z-0 h-[112%] w-[112%] -translate-x-[6%] -translate-y-[6%] rotate-[-90deg]"
                viewBox="0 0 100 100"
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="url(#tb-ring-gradient)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="tb-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b85c00" />
                    <stop offset="50%" stopColor="#e07b0a" />
                    <stop offset="100%" stopColor="rgba(224,123,10,0.2)" />
                  </linearGradient>
                </defs>
              </svg>

              <div
                ref={portraitBadgeRef}
                className="absolute -left-2 top-4 z-20 flex items-center gap-1.5 rounded-full border border-[rgba(26,23,24,0.08)] bg-white/95 px-3 py-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-[#1a1718] shadow-[0_8px_24px_-8px_rgba(26,23,24,0.2)] backdrop-blur-sm"
              >
                <ShieldCheck size={12} className="text-[#e07b0a]" aria-hidden />
                Verified care
              </div>

              <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#f6f3ec] shadow-[0_0_0_4px_rgba(255,255,255,0.9),0_24px_56px_-20px_rgba(26,23,24,0.28)]">
                <img
                  ref={portraitImgRef}
                  className="block h-full w-full object-cover will-change-transform"
                  src={trustPortrait}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div
                  ref={portraitShineRef}
                  className="pointer-events-none absolute -inset-[20%_-40%] mix-blend-soft-light opacity-0 will-change-transform"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 50%, rgba(224,123,10,0.35) 54%, transparent 66%)",
                  }}
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-[2] mt-auto h-0.5 overflow-hidden rounded-full bg-[rgba(26,23,24,0.09)]"
          aria-hidden
        >
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#b85c00] to-[#e07b0a]"
          />
        </div>
      </div>

      <style>{`
        .trust-bridge__grid {
          background-image:
            linear-gradient(rgba(26, 23, 24, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 23, 24, 0.035) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 75% at 55% 40%, #000 15%, transparent 72%);
        }

        .tb-zigzag-svg {
          will-change: transform;
        }

        .tb-zigzag-line {
          vector-effect: non-scaling-stroke;
          will-change: stroke-dashoffset, transform;
        }

        .tb-knockout-sub {
          font-family: "Archivo Narrow", sans-serif;
          font-size: clamp(0.5625rem, 1.2vw, 0.6875rem);
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1a1718;
        }

        .tb-knockout-display {
          font-family: "Archivo Narrow", sans-serif;
          font-size: clamp(1.85rem, 5.5vw, 3.75rem);
          font-weight: 700;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          color: #1a1718;
        }

        .tb-segment--knockout-sub {
          font-weight: 700 !important;
          color: #1a1718 !important;
        }

        .tb-segment--knockout-bold {
          font-weight: 700 !important;
          color: #1a1718 !important;
        }

        .tb-segment--knockout-regular {
          font-weight: 400 !important;
          color: rgba(26, 23, 24, 0.55) !important;
        }

        .tb-knockout-display .tb-char--bold {
          font-weight: 700 !important;
        }

        .tb-segment {
          font-style: normal;
          font-weight: inherit;
        }

        .tb-segment strong {
          font-weight: inherit;
        }

        .tb-char {
          will-change: transform, opacity, filter;
        }

        /* Eyebrow: regular vs bold */
        .trust-bridge__eyebrow .tb-segment--eyebrow-regular {
          font-weight: 500 !important;
          color: rgba(184, 92, 0, 0.72) !important;
        }
        .trust-bridge__eyebrow .tb-segment--eyebrow-bold {
          font-weight: 700 !important;
          color: #b85c00 !important;
          letter-spacing: 0.24em;
        }

        /* Headline line 1 */
        .trust-bridge__lead .tb-segment--lead-regular {
          font-weight: 400 !important;
          color: rgba(26, 23, 24, 0.35) !important;
        }
        .trust-bridge__lead .tb-segment--lead-bold {
          font-weight: 700 !important;
          color: #1a1718 !important;
          font-size: 1.04em;
          letter-spacing: -0.02em;
        }

        /* Headline line 2 (accent) */
        .trust-bridge__lead .tb-segment--lead-accent-regular {
          font-weight: 400 !important;
          color: rgba(224, 123, 10, 0.45) !important;
        }
        .trust-bridge__lead .tb-segment--lead-accent-bold {
          font-weight: 700 !important;
          color: #9a4e00 !important;
          font-size: 1.04em;
          letter-spacing: -0.02em;
        }

        /* Trust bullets */
        .trust-bridge__line .tb-segment--line-regular {
          font-weight: 400 !important;
          color: rgba(26, 23, 24, 0.45) !important;
        }
        .trust-bridge__line .tb-segment--line-bold {
          font-weight: 700 !important;
          color: #1a1718 !important;
          font-size: 1.03em;
        }

        /* CTA */
        .trust-bridge__cta .tb-segment--cta-regular {
          font-weight: 500 !important;
          color: rgba(26, 23, 24, 0.72) !important;
        }
        .trust-bridge__cta .tb-segment--cta-bold {
          font-weight: 700 !important;
          color: #1a1718 !important;
        }

        .trust-bridge__panel {
          transform-style: preserve-3d;
        }
        .trust-bridge__line-mark {
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-bridge__panel,
          .trust-bridge__line {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
