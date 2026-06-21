import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    label: "Online intake",
    title: "Take the\nAssessment",
    body: "Answer a short clinical intake in about 10 minutes. No clinic visit. No waiting room.",
  },
  {
    num: "02",
    label: "Licensed provider",
    title: "Doctor\nReview",
    body: "A licensed physician reads your intake and health history within 24 hours.",
  },
  {
    num: "03",
    label: "Real prescription",
    title: "Receive\nPrescription",
    body: "If clinically appropriate, a personalised prescription is written to your protocol.",
  },
  {
    num: "04",
    label: "Licensed facility",
    title: "Pharmacy\nFulfillment",
    body: "Your medication is compounded in a licensed, regulated pharmacy to your exact specification.",
  },
  {
    num: "05",
    label: "Cold-chain delivery",
    title: "Delivered\nto Your Door",
    body: "Cold-chain shipped directly to your home. Ongoing physician-supervised care included.",
  },
] as const;

// ─── SVG inner shapes — one per step, drawn with stroke-dashoffset ─────────
// Each shape lives inside a 200×200 viewBox alongside the progress ring
const SHAPES = [
  // 01 – Assessment: horizontal scan lines (data intake)
  [
    "M 40 72 L 160 72",
    "M 40 92 L 128 92",
    "M 40 112 L 148 112",
    "M 40 132 L 108 132",
  ],
  // 02 – Doctor Review: medical cross
  [
    "M 100 48 L 100 152",
    "M 48 100 L 152 100",
  ],
  // 03 – Prescription: equilateral triangle
  [
    "M 100 48 L 155 145 L 45 145 Z",
  ],
  // 04 – Pharmacy: hexagon (molecule)
  [
    "M 100 44 L 153 72 L 153 128 L 100 156 L 47 128 L 47 72 Z",
  ],
  // 05 – Delivered: five-pointed star (completion)
  [
    "M 100 38 L 114 80 L 158 80 L 124 104 L 137 146 L 100 122 L 63 146 L 76 104 L 42 80 L 86 80 Z",
  ],
] as const;

const TOTAL = STEPS.length;
const CIRCUMFERENCE = 2 * Math.PI * 84; // ≈ 527.8
const HOLD = 1.5;
const TRANS = 0.48;

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      const slides     = Array.from(sec.querySelectorAll<HTMLElement>(".hiw-slide"));
      const shapeSvgs  = Array.from(sec.querySelectorAll<SVGSVGElement>(".hiw-shape-svg"));
      const centerNums = Array.from(sec.querySelectorAll<HTMLElement>(".hiw-center-num"));
      const counters   = Array.from(sec.querySelectorAll<HTMLElement>(".hiw-counter"));
      const dots       = Array.from(sec.querySelectorAll<HTMLElement>(".hiw-dot"));
      const ring       = ringRef.current;

      // ── set initial draw state for all shape paths ───────────────────────
      shapeSvgs.forEach((svg) => {
        svg.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });
      });

      // ── initial visibility: only step 0 ──────────────────────────────────
      gsap.set(slides,         { opacity: 0, y: 44 });
      gsap.set(slides[0],      { opacity: 1, y: 0 });
      gsap.set(shapeSvgs,      { opacity: 0, scale: 1.1 });
      gsap.set(shapeSvgs[0],   { opacity: 1, scale: 1 });
      gsap.set(centerNums,     { opacity: 0 });
      gsap.set(centerNums[0],  { opacity: 1 });
      gsap.set(counters,       { opacity: 0 });
      gsap.set(counters[0],    { opacity: 1 });
      gsap.set(dots,           { scale: 1,   opacity: 0.22 });
      gsap.set(dots[0],        { scale: 1.6, opacity: 1 });

      if (ring) gsap.set(ring, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE });

      // ── pin ───────────────────────────────────────────────────────────────
      ScrollTrigger.create({ trigger: sec, start: "top top", end: "+=500%", pin: true, anticipatePin: 1 });

      // ── main scrubbed timeline ────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top top", end: "+=500%", scrub: 1.6 },
      });

      // draw step 0 shapes immediately
      shapeSvgs[0].querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path, pi) => {
        tl.to(path, { strokeDashoffset: 0, duration: 0.28, ease: "power2.inOut" }, 0.08 + pi * 0.07);
      });

      // step transitions
      for (let i = 0; i < TOTAL - 1; i++) {
        const exitAt  = i * (HOLD + TRANS) + HOLD;
        const enterAt = exitAt + 0.15;

        tl.to(slides[i],      { opacity: 0, y: -44, duration: TRANS - 0.15, ease: "power2.in" }, exitAt);
        tl.to(shapeSvgs[i],   { opacity: 0, scale: 0.88, duration: TRANS - 0.15 }, exitAt);
        tl.to(centerNums[i],  { opacity: 0, duration: TRANS - 0.15 }, exitAt);
        tl.to(counters[i],    { opacity: 0, duration: TRANS - 0.15 }, exitAt);
        tl.to(dots[i],        { scale: 1, opacity: 0.22, duration: TRANS - 0.15 }, exitAt);

        tl.fromTo(slides[i + 1],     { opacity: 0, y: 44 },      { opacity: 1, y: 0, duration: TRANS - 0.15, ease: "power2.out" }, enterAt);
        tl.fromTo(shapeSvgs[i + 1],  { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: TRANS - 0.15 }, enterAt);
        tl.fromTo(centerNums[i + 1], { opacity: 0 },              { opacity: 1, duration: TRANS - 0.15 }, enterAt);
        tl.fromTo(counters[i + 1],   { opacity: 0 },              { opacity: 1, duration: TRANS - 0.15 }, enterAt);
        tl.to(dots[i + 1], { scale: 1.6, opacity: 1, duration: TRANS - 0.15 }, enterAt);

        shapeSvgs[i + 1].querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path, pi) => {
          tl.to(path, { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" }, enterAt + 0.06 + pi * 0.07);
        });
      }

      // ── progress ring — fills 0→100% continuously ────────────────────────
      if (ring) {
        gsap.fromTo(ring,
          { strokeDashoffset: CIRCUMFERENCE },
          { strokeDashoffset: 0, ease: "none",
            scrollTrigger: { trigger: sec, start: "top top", end: "+=500%", scrub: 1 } },
        );
      }

      // ── bottom progress bar ───────────────────────────────────────────────
      gsap.fromTo(progressBarRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", transformOrigin: "left center",
          scrollTrigger: { trigger: sec, start: "top top", end: "+=500%", scrub: 1 } },
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative h-[100svh] overflow-hidden bg-black"
    >
      {/* ── subtle grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* ── top radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(243,195,0,0.055), transparent 70%)" }}
      />

      {/* ════════════════ TOP BAR ════════════════ */}
      <div className="absolute inset-x-6 top-10 z-20 flex items-center justify-between lg:inset-x-16">
        <span className="pill-tag !border-white/15 !bg-white/[0.07] !text-white/65">
          <span className="dot !bg-[#F3C300]" /> How it works
        </span>

        {/* step counter — one per step, cross-fades */}
        <div className="relative h-4 w-14">
          {STEPS.map((s, i) => (
            <span
              key={s.num}
              className="hiw-counter absolute inset-0 text-right text-[0.65rem] font-semibold tracking-[0.22em] text-white/30 uppercase"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {s.num} / {String(TOTAL).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-[48%] flex flex-col gap-0 lg:inset-x-16 lg:flex-row lg:items-center lg:gap-16">

        {/* ── left: step text (one per step, cross-fade) ── */}
        <div className="relative flex-1">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="hiw-slide absolute inset-x-0 top-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {/* label row */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[0.62rem] font-bold tracking-[0.3em] text-[#F3C300] uppercase">
                  Step {s.num}
                </span>
                <div className="h-px w-8 bg-[#F3C300]/50" />
                <span className="text-[0.62rem] tracking-[0.15em] text-white/30 uppercase">{s.label}</span>
              </div>

              {/* title — two lines */}
              <h2 className="font-display text-[clamp(2.6rem,6.5vw,6rem)] font-normal leading-[0.92] text-white">
                {s.title.split("\n").map((line, li) => (
                  <span key={li} className="block">
                    {li === 1
                      ? <span className="italic text-gradient-clinical">{line}</span>
                      : line}
                  </span>
                ))}
              </h2>

              {/* gold rule */}
              <div
                className="mt-7 h-px w-16"
                style={{ background: "linear-gradient(90deg, rgba(243,195,0,0.75), transparent)" }}
              />

              {/* body */}
              <p className="mt-5 max-w-[36ch] text-[0.96rem] leading-relaxed text-white/42">{s.body}</p>

              {/* quiz CTA — last step only */}
              {i === TOTAL - 1 && (
                <Link
                  to="/quiz"
                  className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-[#F3C300] px-7 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                >
                  Start your assessment
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
          {/* spacer to give the absolute slides height */}
          <div className="invisible pointer-events-none">
            <div className="mb-6 text-[0.62rem]">Step 01</div>
            <div className="font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.92]">
              Take the<br />Assessment
            </div>
            <div className="mt-7 h-px w-16" />
            <p className="mt-5 text-[0.96rem] leading-relaxed">body text placeholder</p>
          </div>
        </div>

        {/* ── right: animated SVG ring + inner shape ── */}
        <div className="relative mx-auto mt-10 aspect-square w-[min(80vw,300px)] flex-none lg:mt-0 lg:w-[min(42vw,440px)]">

          {/* outer track ring (static, very faint) */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="84" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </svg>

          {/* progress ring — continuously fills with scroll */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle
              ref={ringRef}
              cx="100"
              cy="100"
              r="84"
              stroke="#F3C300"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.65"
            />
          </svg>

          {/* inner shape SVGs — one per step, cross-fade + draw */}
          {SHAPES.map((paths, i) => (
            <svg
              key={i}
              data-step={i}
              className="hiw-shape-svg absolute inset-0 h-full w-full"
              viewBox="0 0 200 200"
              fill="none"
              stroke="#F3C300"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.75"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {paths.map((d, pi) => (
                <path key={pi} d={d} className="hiw-draw" />
              ))}
            </svg>
          ))}

          {/* center: step number cross-fades */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {STEPS.map((s, i) => (
              <span
                key={s.num}
                className="hiw-center-num absolute font-display text-[clamp(1.8rem,5vw,3.2rem)] font-light tracking-tight text-white/70"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {s.num}
              </span>
            ))}
          </div>

          {/* 5 dot markers evenly around ring */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
            {STEPS.map((_, i) => {
              const angle = -90 + (i / TOTAL) * 360;
              const rad = (angle * Math.PI) / 180;
              const cx = 100 + 84 * Math.cos(rad);
              const cy = 100 + 84 * Math.sin(rad);
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill={i === 0 ? "#F3C300" : "rgba(255,255,255,0.25)"}
                  className={`hiw-ring-dot hiw-ring-dot-${i}`}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* ════════════════ BOTTOM BAR ════════════════ */}
      <div className="absolute inset-x-6 bottom-9 z-20 flex items-center justify-between lg:inset-x-16">
        <div className="flex items-center gap-[7px]">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="hiw-dot h-[3px] w-[3px] rounded-full bg-white"
              style={{ opacity: i === 0 ? 1 : 0.22 }}
            />
          ))}
        </div>
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/22">
          Scroll to explore
        </p>
      </div>

      {/* ── bottom progress bar ── */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0"
        style={{ background: "linear-gradient(90deg, #F3C300, rgba(243,195,0,0.35))" }}
      />
    </section>
  );
}
