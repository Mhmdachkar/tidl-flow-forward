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
const SHAPES = [
  ["M 40 72 L 160 72", "M 40 92 L 128 92", "M 40 112 L 148 112", "M 40 132 L 108 132"],
  ["M 100 48 L 100 152", "M 48 100 L 152 100"],
  ["M 100 48 L 155 145 L 45 145 Z"],
  ["M 100 44 L 153 72 L 153 128 L 100 156 L 47 128 L 47 72 Z"],
  ["M 100 38 L 114 80 L 158 80 L 124 104 L 137 146 L 100 122 L 63 146 L 76 104 L 42 80 L 86 80 Z"],
] as const;

const TOTAL = STEPS.length;
const CIRCUMFERENCE = 2 * Math.PI * 84;
const HOLD = 1.5;
const TRANS = 0.48;

export function HowItWorksSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const desktopRef     = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ringRef        = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const desk = desktopRef.current;
    if (!sec) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP: full pinned cinematic experience ──────────────────────
    mm.add("(min-width: 1024px)", () => {
      if (!desk) return;
      const ctx = gsap.context(() => {
        const slides     = Array.from(desk.querySelectorAll<HTMLElement>(".hiw-slide"));
        const shapeSvgs  = Array.from(desk.querySelectorAll<SVGSVGElement>(".hiw-shape-svg"));
        const centerNums = Array.from(desk.querySelectorAll<HTMLElement>(".hiw-center-num"));
        const counters   = Array.from(desk.querySelectorAll<HTMLElement>(".hiw-counter"));
        const dots       = Array.from(desk.querySelectorAll<HTMLElement>(".hiw-dot"));
        const ring       = ringRef.current;

        shapeSvgs.forEach((svg) => {
          svg.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path) => {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          });
        });

        gsap.set(slides,        { opacity: 0, y: 44 });
        gsap.set(slides[0],     { opacity: 1, y: 0 });
        gsap.set(shapeSvgs,     { opacity: 0, scale: 1.1 });
        gsap.set(shapeSvgs[0],  { opacity: 1, scale: 1 });
        gsap.set(centerNums,    { opacity: 0 });
        gsap.set(centerNums[0], { opacity: 1 });
        gsap.set(counters,      { opacity: 0 });
        gsap.set(counters[0],   { opacity: 1 });
        gsap.set(dots,          { scale: 1,   opacity: 0.22 });
        gsap.set(dots[0],       { scale: 1.6, opacity: 1 });
        if (ring) gsap.set(ring, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE });

        ScrollTrigger.create({ trigger: desk, start: "top top", end: "+=500%", pin: true, anticipatePin: 1 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: desk, start: "top top", end: "+=500%", scrub: 1.6 },
        });

        shapeSvgs[0].querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path, pi) => {
          tl.to(path, { strokeDashoffset: 0, duration: 0.28, ease: "power2.inOut" }, 0.08 + pi * 0.07);
        });

        for (let i = 0; i < TOTAL - 1; i++) {
          const exitAt  = i * (HOLD + TRANS) + HOLD;
          const enterAt = exitAt + 0.15;

          tl.to(slides[i],     { opacity: 0, y: -44, duration: TRANS - 0.15, ease: "power2.in"  }, exitAt);
          tl.to(shapeSvgs[i],  { opacity: 0, scale: 0.88, duration: TRANS - 0.15 }, exitAt);
          tl.to(centerNums[i], { opacity: 0, duration: TRANS - 0.15 }, exitAt);
          tl.to(counters[i],   { opacity: 0, duration: TRANS - 0.15 }, exitAt);
          tl.to(dots[i],       { scale: 1,   opacity: 0.22, duration: TRANS - 0.15 }, exitAt);

          tl.fromTo(slides[i + 1],     { opacity: 0, y: 44 },      { opacity: 1, y: 0,    duration: TRANS - 0.15, ease: "power2.out" }, enterAt);
          tl.fromTo(shapeSvgs[i + 1],  { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: TRANS - 0.15 }, enterAt);
          tl.fromTo(centerNums[i + 1], { opacity: 0 },              { opacity: 1,           duration: TRANS - 0.15 }, enterAt);
          tl.fromTo(counters[i + 1],   { opacity: 0 },              { opacity: 1,           duration: TRANS - 0.15 }, enterAt);
          tl.to(dots[i + 1], { scale: 1.6, opacity: 1, duration: TRANS - 0.15 }, enterAt);

          shapeSvgs[i + 1].querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path, pi) => {
            tl.to(path, { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" }, enterAt + 0.06 + pi * 0.07);
          });
        }

        if (ring) {
          gsap.fromTo(ring,
            { strokeDashoffset: CIRCUMFERENCE },
            { strokeDashoffset: 0, ease: "none",
              scrollTrigger: { trigger: desk, start: "top top", end: "+=500%", scrub: 1 } },
          );
        }

        gsap.fromTo(progressBarRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", transformOrigin: "left center",
            scrollTrigger: { trigger: desk, start: "top top", end: "+=500%", scrub: 1 } },
        );
      }, desk);

      return () => ctx.revert();
    });

    // ── MOBILE: simple scroll-triggered entrance per step card ─────────
    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        const cards = sec.querySelectorAll<HTMLElement>(".hiw-mobile-card");
        cards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 36,
            duration: 0.75,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
            delay: i % 2 === 0 ? 0 : 0.05,
          });
        });
        const svgIcons = sec.querySelectorAll<SVGSVGElement>(".hiw-mobile-svg");
        svgIcons.forEach((svg) => {
          svg.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path) => {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            ScrollTrigger.create({
              trigger: svg,
              start: "top 85%",
              onEnter: () => gsap.to(path, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }),
            });
          });
        });
      }, sec);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden bg-[#F3C300]"
    >
      {/* shared background elements */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,1) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 280px rgba(180,130,0,0.35)" }}
      />

      {/* ══════════════════════════════════════════════════════════════
          MOBILE VIEW  (< 1024px) — vertical step list
      ══════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden">

        {/* mobile header */}
        <div className="flex items-center justify-between px-6 pt-14 pb-8">
          <span className="pill-tag !border-black/15 !bg-black/[0.07] !text-black/65 text-[10px]">
            <span className="dot !bg-black" /> How it works
          </span>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-black/40 uppercase">
            {String(TOTAL).padStart(2, "0")} steps
          </span>
        </div>

        {/* step cards */}
        <div className="flex flex-col gap-0 px-5 pb-14">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="hiw-mobile-card relative flex gap-5 pb-10"
            >
              {/* vertical connector line */}
              {i < TOTAL - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-black/15" aria-hidden />
              )}

              {/* left: mini SVG icon */}
              <div className="relative flex-shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: "rgba(0,0,0,0.09)", border: "1px solid rgba(0,0,0,0.14)" }}
                >
                  <svg
                    className="hiw-mobile-svg h-5 w-5"
                    viewBox="0 0 200 200"
                    fill="none"
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {SHAPES[i].map((d, pi) => (
                      <path key={pi} d={d} className="hiw-draw" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* right: text */}
              <div className="pt-1">
                {/* label */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.28em] text-black/50 uppercase">
                    Step {s.num}
                  </span>
                  <div className="h-px w-5 bg-black/25" />
                  <span className="text-[10px] tracking-[0.12em] text-black/35 uppercase">{s.label}</span>
                </div>

                {/* title */}
                <h2
                  className="font-display leading-[0.94]"
                  style={{ fontSize: "clamp(28px, 7vw, 40px)", color: "#0c0b09", fontWeight: 400 }}
                >
                  {s.title.split("\n").map((line, li) => (
                    <span key={li} className="block">
                      {li === 1 ? (
                        <span className="italic" style={{ color: "rgba(12,11,9,0.55)" }}>{line}</span>
                      ) : line}
                    </span>
                  ))}
                </h2>

                {/* body */}
                <p
                  className="mt-3 leading-relaxed"
                  style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", maxWidth: "34ch" }}
                >
                  {s.body}
                </p>

                {/* CTA on last step */}
                {i === TOTAL - 1 && (
                  <Link
                    to="/quiz"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-[#F3C300] transition-transform active:scale-95"
                    style={{ fontSize: 14, minHeight: 48 }}
                  >
                    Start your assessment
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* mobile progress dots */}
        <div className="flex justify-center gap-2 pb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-[3px] rounded-full bg-black"
              style={{ width: i === 0 ? 20 : 6, opacity: i === 0 ? 0.7 : 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP VIEW  (≥ 1024px) — pinned cinematic experience
      ══════════════════════════════════════════════════════════════ */}
      <div ref={desktopRef} className="relative hidden h-[100svh] lg:block">

        {/* top bar */}
        <div className="absolute inset-x-16 top-10 z-20 flex items-center justify-between">
          <span className="pill-tag !border-black/15 !bg-black/[0.07] !text-black/65">
            <span className="dot !bg-black" /> How it works
          </span>
          <div className="relative h-4 w-14">
            {STEPS.map((s, i) => (
              <span
                key={s.num}
                className="hiw-counter absolute inset-0 text-right text-[0.65rem] font-semibold tracking-[0.22em] text-black/40 uppercase"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {s.num} / {String(TOTAL).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        {/* main content */}
        <div className="absolute inset-x-16 top-1/2 -translate-y-[48%] flex items-center gap-16">

          {/* left: step text */}
          <div className="relative flex-1">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="hiw-slide absolute inset-x-0 top-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[0.62rem] font-bold tracking-[0.3em] text-black uppercase">
                    Step {s.num}
                  </span>
                  <div className="h-px w-8 bg-black/35" />
                  <span className="text-[0.62rem] tracking-[0.15em] text-black/45 uppercase">{s.label}</span>
                </div>

                <h2 className="font-display text-[clamp(2.6rem,6.5vw,6rem)] font-normal leading-[0.92] text-[#0c0b09]">
                  {s.title.split("\n").map((line, li) => (
                    <span key={li} className="block">
                      {li === 1
                        ? <span className="italic text-[#0c0b09]/60">{line}</span>
                        : line}
                    </span>
                  ))}
                </h2>

                <div
                  className="mt-7 h-px w-16"
                  style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)" }}
                />

                <p className="mt-5 max-w-[36ch] text-[1rem] leading-relaxed text-black/55">{s.body}</p>

                {i === TOTAL - 1 && (
                  <Link
                    to="/quiz"
                    className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-black px-7 py-3 text-sm font-semibold text-[#F3C300] transition-transform hover:scale-[1.03]"
                  >
                    Start your assessment
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
            {/* invisible spacer to give the relative container height */}
            <div className="invisible pointer-events-none">
              <div className="mb-6 text-[0.62rem]">Step 01</div>
              <div className="font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.92]">
                Take the<br />Assessment
              </div>
              <div className="mt-7 h-px w-16" />
              <p className="mt-5 text-[1rem] leading-relaxed">placeholder</p>
            </div>
          </div>

          {/* right: animated SVG ring + shape */}
          <div className="relative mx-auto aspect-square w-[min(42vw,440px)] flex-none">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="84" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
            </svg>
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200" fill="none">
              <circle
                ref={ringRef}
                cx="100" cy="100" r="84"
                stroke="rgba(0,0,0,0.65)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            {SHAPES.map((paths, i) => (
              <svg
                key={i}
                className="hiw-shape-svg absolute inset-0 h-full w-full"
                viewBox="0 0 200 200"
                fill="none"
                stroke="rgba(0,0,0,0.55)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {paths.map((d, pi) => (
                  <path key={pi} d={d} className="hiw-draw" />
                ))}
              </svg>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              {STEPS.map((s, i) => (
                <span
                  key={s.num}
                  className="hiw-center-num absolute font-display text-[clamp(1.8rem,5vw,3.2rem)] font-light tracking-tight text-black/55"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {s.num}
                </span>
              ))}
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
              {STEPS.map((_, i) => {
                const angle = -90 + (i / TOTAL) * 360;
                const rad = (angle * Math.PI) / 180;
                const cx = 100 + 84 * Math.cos(rad);
                const cy = 100 + 84 * Math.sin(rad);
                return (
                  <circle
                    key={i}
                    cx={cx} cy={cy} r="3"
                    fill={i === 0 ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.18)"}
                    className={`hiw-dot`}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* bottom bar */}
        <div className="absolute inset-x-16 bottom-9 z-20 flex items-center justify-between">
          <div className="flex items-center gap-[7px]">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="hiw-dot h-[3px] w-[3px] rounded-full bg-black"
                style={{ opacity: i === 0 ? 1 : 0.22 }}
              />
            ))}
          </div>
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-black/30">
            Scroll to explore
          </p>
        </div>

        {/* progress bar */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0"
          style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.2))" }}
        />
      </div>
    </section>
  );
}
