import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOCTORS = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Endocrinology · Chief Physician",
    creds: "MD, FACE, ECNU",
    years: "12+",
    bio: "Pioneers personalized hormone optimization protocols. Published 40+ papers on metabolic resilience and clinical longevity.",
    short: "Personalized hormone & metabolic protocols.",
    focus: ["Hormone therapy", "Metabolic health", "Longevity"],
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&h=1100&q=85&fit=crop",
  },
  {
    name: "Dr. James Park",
    role: "Internal Medicine · Medical Director",
    creds: "MD, ABOM",
    years: "15+",
    bio: "Specialist in preventive cardiology and metabolic syndrome reversal. Former lead at Stanford Preventive Care.",
    short: "Preventive cardiology & metabolic reversal.",
    focus: ["Preventive care", "Cardiology", "Diagnostics"],
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&h=1100&q=85&fit=crop",
  },
  {
    name: "Dr. Michael Andrews",
    role: "Family Medicine · Clinical Lead",
    creds: "MD, FACFP",
    years: "18+",
    bio: "Whole-person practitioner focused on weight management, behavioural health, and continuous patient oversight.",
    short: "Whole-person care & continuous oversight.",
    focus: ["Whole-person care", "Weight management", "Continuity"],
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=900&h=1100&q=85&fit=crop",
  },
] as const;

type Doctor = (typeof DOCTORS)[number];

const CREDENTIALS = [
  "BOARD-CERTIFIED",
  "STATE-LICENSED",
  "HIPAA-COMPLIANT",
  "EVIDENCE-BASED",
  "PEER-REVIEWED",
  "PATIENT-FIRST",
];

const STATS = [
  { value: 60,  suffix: "+",  label: "Years combined experience" },
  { value: 100, suffix: "+",  label: "Physicians on staff" },
  { value: 50,  suffix: "",   label: "U.S. states licensed" },
  { value: 15,  suffix: "K+", label: "Patients under care" },
] as const;

// ─── Helper ───────────────────────────────────────────────────────────────────

function CharSplit({ text }: { text: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ─── Mobile: sticky stacked doctor cards (Framer Motion + GSAP) ─────────────────

function MobileDoctorCard({
  doc,
  i,
  total,
  scrollProgress,
  range,
  targetScale,
}: {
  doc: Doctor;
  i: number;
  total: number;
  scrollProgress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // image parallax as the card scrolls into view
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);

  // sticky stacking: earlier cards shrink as later ones cover them
  const scale = useTransform(scrollProgress, range, [1, targetScale]);

  return (
    <div
      ref={ref}
      className="cl-stack-pin sticky top-0 flex h-screen items-center justify-center px-4"
    >
      <motion.div
        style={{ scale, top: `calc(-4vh + ${i * 16}px)` }}
        className="cl-stack-card relative flex w-full max-w-[420px] flex-col overflow-hidden"
        // height tuned to leave a peek of the next card while pinned
        // (kept as inline so it overrides nothing important)
      >
        <div
          className="relative flex flex-col overflow-hidden rounded-[24px]"
          style={{
            height: "min(78vh, 580px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 70px -28px rgba(11,16,13,0.65)",
            background: "#10140f",
          }}
        >
          {/* photo with framer-motion parallax */}
          <div className="relative h-[56%] w-full overflow-hidden">
            <motion.div
              style={{
                scale: imageScale,
                y: imageY,
                backgroundImage: `url(${doc.photo})`,
              }}
              className="absolute inset-0 bg-cover bg-top"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,16,13,0.15) 0%, rgba(11,16,13,0) 35%, rgba(16,20,15,0.95) 100%)",
              }}
            />
            {/* top labels */}
            <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.25em] text-white/85">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="absolute right-4 top-4 text-[10px] uppercase tracking-[0.2em] text-white/65">
              {doc.creds}
            </span>
          </div>

          {/* info — each line is a GSAP reveal target */}
          <div className="cl-card-body relative flex flex-1 flex-col px-5 pb-5 -mt-10">
            <span
              className="cl-reveal mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#9ec5ad" }}
            >
              {doc.role}
            </span>
            <h3
              className="cl-reveal mb-2 leading-[1]"
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: "clamp(30px, 9vw, 42px)",
                color: "#f6f3ec",
                letterSpacing: "-0.02em",
              }}
            >
              {doc.name}
            </h3>
            <p
              className="cl-reveal mb-4 text-[14px] leading-[1.5]"
              style={{ color: "rgba(246,243,236,0.65)" }}
            >
              {doc.short}
            </p>

            <div className="cl-reveal mb-5 flex flex-wrap gap-2">
              {doc.focus.map((f) => (
                <span
                  key={f}
                  className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    background: "rgba(158,197,173,0.1)",
                    color: "#9ec5ad",
                    border: "1px solid rgba(158,197,173,0.2)",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            <div
              className="cl-reveal mt-auto flex items-baseline gap-2 pt-4"
              style={{ borderTop: "1px solid rgba(246,243,236,0.1)" }}
            >
              <span
                className="leading-none"
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 34,
                  color: "#f6f3ec",
                }}
              >
                {doc.years}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(246,243,236,0.5)" }}
              >
                years in practice
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MobileDoctorStack() {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div className="lg:hidden">
      {/* section eyebrow */}
      <div className="mb-2 flex items-center gap-3 px-5 pt-2">
        <span
          className="text-[10px] font-medium uppercase"
          style={{ letterSpacing: "0.3em", color: "#2d4a3e" }}
        >
          §02 — Meet the physicians
        </span>
        <span className="h-px flex-1" style={{ background: "rgba(22,22,22,0.18)" }} />
      </div>

      <div ref={container}>
        {DOCTORS.map((doc, i) => (
          <MobileDoctorCard
            key={doc.name}
            doc={doc}
            i={i}
            total={DOCTORS.length}
            scrollProgress={scrollYProgress}
            range={[i / DOCTORS.length, 1]}
            targetScale={1 - (DOCTORS.length - i) * 0.045}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ClinicalLeadershipSection() {
  const rootRef     = useRef<HTMLElement | null>(null);
  const sigPathRef  = useRef<SVGPathElement | null>(null);
  const pinWrapRef  = useRef<HTMLDivElement | null>(null);
  const metaRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef  = useRef<HTMLDivElement | null>(null);
  const statRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef   = useRef<HTMLDivElement | null>(null);

  const [activeDoc, setActiveDoc] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── HERO INTRO ──────────────────────────────────────────────
      const chars       = gsap.utils.toArray<HTMLElement>(".cl-headline .char");
      const eyebrow     = root.querySelector(".cl-eyebrow");
      const eyebrowLine = root.querySelector(".cl-eyebrow-line");
      const body        = root.querySelectorAll(".cl-body");
      const sigBlock    = root.querySelector(".cl-sig");
      const metaRow     = root.querySelector(".cl-meta-row");

      if (!reduced) {
        gsap.set(eyebrow,     { opacity: 0, y: 18 });
        gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(chars,       { yPercent: 110, opacity: 0, rotateZ: 6 });
        gsap.set(body,        { opacity: 0, y: 24 });
        gsap.set(sigBlock,    { opacity: 0, y: 16 });
        gsap.set(metaRow,     { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 75%" },
        });

        tl.to(eyebrow,     { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
          .to(eyebrowLine, { scaleX: 1, duration: 0.7, ease: "expo.out" }, 0.1)
          .to(chars, {
            yPercent: 0, opacity: 1, rotateZ: 0,
            duration: 0.9, ease: "expo.out",
            stagger: { each: 0.012, from: "start" },
          }, 0.15)
          .to(body,     { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" }, 0.55)
          .to(sigBlock, { opacity: 1, y: 0, duration: 0.6,  ease: "power3.out" }, 0.7)
          .to(metaRow,  { opacity: 1, y: 0, duration: 0.6,  ease: "power3.out" }, 0.78);

        if (sigPathRef.current) {
          const len = sigPathRef.current.getTotalLength();
          gsap.set(sigPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(sigPathRef.current, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.85);
        }
      }

      // ── MARQUEE infinite scroll (all breakpoints) ──────────────
      if (marqueeRef.current) {
        const inner = marqueeRef.current.firstElementChild as HTMLElement | null;
        if (inner) {
          gsap.to(inner, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
        }
        gsap.to(marqueeRef.current, {
          xPercent: -5, ease: "none",
          scrollTrigger: { trigger: marqueeRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }

      // ── STATS counters (all breakpoints) ───────────────────────
      const statsEl = root.querySelector(".cl-stats");
      if (statsEl && !reduced) {
        gsap.from(statsEl.querySelectorAll(".cl-stat"), {
          opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: statsEl, start: "top 85%" },
        });
        STATS.forEach((s, i) => {
          const span = statRefs.current[i];
          if (!span) return;
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: s.value, duration: 2, ease: "power3.out",
            scrollTrigger: { trigger: statsEl, start: "top 85%" },
            onUpdate: () => { span.textContent = `${Math.round(proxy.v)}${s.suffix}`; },
          });
        });
      }

      // ── Cursor spotlight — desktop only ─────────────────────────
      const cursor = cursorRef.current;
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (cursor && !isMobile) {
        const qx = gsap.quickTo(cursor, "x", { duration: 0.8, ease: "power3.out" });
        const qy = gsap.quickTo(cursor, "y", { duration: 0.8, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          qx(e.clientX - r.left - 250);
          qy(e.clientY - r.top - 250);
        };
        root.addEventListener("mousemove", onMove);
        return () => root.removeEventListener("mousemove", onMove);
      }
    }, root);

    // ── Mobile: GSAP content reveal for each sticky-stacked card ─
    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pins = rootRef.current?.querySelectorAll<HTMLElement>(".cl-stack-pin");
      pins?.forEach((pin) => {
        const lines = pin.querySelectorAll<HTMLElement>(".cl-reveal");
        if (!lines.length) return;
        if (reduced) {
          gsap.set(lines, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          lines,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: pin, start: "top 65%" },
          },
        );
      });
    });

    // ── Desktop: pinned scrollytelling ──────────────────────────
    mm.add("(min-width: 1024px)", () => {
      const pin   = pinWrapRef.current;
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      const metas = metaRefs.current.filter((m): m is HTMLDivElement => !!m);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (pin && cards.length && !reduced) {
        cards.forEach((c, i) => {
          gsap.set(c, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 80, scale: i === 0 ? 1 : 0.94 });
        });
        metas.forEach((m, i) => {
          gsap.set(m, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30, position: "absolute", inset: 0 });
        });

        ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: () => `+=${pin.offsetHeight * (DOCTORS.length - 1) * 0.9}`,
          pin: true,
          scrub: 0.6,
          snap: {
            snapTo: (v) => Math.round(v * (DOCTORS.length - 1)) / (DOCTORS.length - 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (DOCTORS.length - 1));
            setActiveDoc(idx);
            cards.forEach((c, i) => {
              const active = i === idx;
              gsap.to(c, {
                opacity: active ? 1 : 0,
                y: active ? 0 : i < idx ? -80 : 80,
                scale: active ? 1 : 0.94,
                duration: 0.6,
                ease: "expo.out",
                overwrite: "auto",
              });
            });
            metas.forEach((m, i) => {
              const active = i === idx;
              gsap.to(m, {
                opacity: active ? 1 : 0,
                y: active ? 0 : 30,
                duration: 0.5,
                ease: "expo.out",
                overwrite: "auto",
              });
            });
          },
        });
      }
    });

    return () => {
      ctx.revert();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip"
      style={{ background: "#f6f3ec", color: "#161616" }}
    >
      {/* cursor spotlight */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(45,74,62,0.08) 0%, rgba(45,74,62,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* ── HERO INTRO ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pb-12 pt-14 sm:px-8 lg:pb-24 lg:pt-32">
        <div className="cl-eyebrow mb-8 flex items-center gap-4 lg:mb-12">
          <span
            className="text-[11px] font-medium uppercase"
            style={{ letterSpacing: "0.32em", color: "#2d4a3e" }}
          >
            §01 — Clinical Leadership
          </span>
          <span
            className="cl-eyebrow-line h-px w-32"
            style={{ background: "rgba(22,22,22,0.3)" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <h2
              className="cl-headline leading-[0.92]"
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: "clamp(38px, 7.2vw, 132px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
              }}
            >
              <span className="block overflow-hidden pb-[0.05em]">
                <CharSplit text="The council" />
              </span>
              <span
                className="block overflow-hidden pb-[0.05em] italic"
                style={{ paddingLeft: "1.2em", color: "#2d4a3e" }}
              >
                <CharSplit text="behind every" />
              </span>
              <span className="block overflow-hidden pb-[0.05em]">
                <CharSplit text="protocol." />
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end pb-2">
            {/* mobile — short */}
            <p
              className="cl-body mb-8 text-[15px] leading-[1.5] lg:hidden"
              style={{ color: "rgba(22,22,22,0.65)" }}
            >
              Every plan is signed off by a board-certified physician — never an algorithm.
            </p>
            {/* desktop — full */}
            <p
              className="cl-body mb-12 hidden text-[17px] leading-[1.55] lg:block"
              style={{ color: "rgba(22,22,22,0.65)", maxWidth: 420 }}
            >
              Every treatment plan is reviewed and signed off by a board-certified physician.
              Deep expertise in metabolic health, endocrinology, and preventive medicine —
              no algorithm replaces clinical judgment.
            </p>

            <div className="cl-sig mb-10 flex items-start gap-5">
              <svg width="82" height="46" viewBox="0 0 82 46" fill="none" aria-hidden>
                <path
                  ref={sigPathRef}
                  d="M4 32 C 12 8, 22 38, 32 18 S 50 36, 58 14 S 74 30, 78 22"
                  stroke="#161616"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div>
                <p
                  className="text-[17px]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  Dr. Michael Andrews
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(22,22,22,0.5)" }}
                >
                  Chief Medical Officer
                </p>
              </div>
            </div>

            <div
              className="cl-meta-row flex items-center gap-8 pt-6"
              style={{ borderTop: "1px solid rgba(22,22,22,0.12)" }}
            >
              <div>
                <p
                  className="text-[28px]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif', color: "#2d4a3e" }}
                >
                  100%
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(22,22,22,0.55)" }}
                >
                  Physician oversight
                </p>
              </div>
              <div className="h-10 w-px" style={{ background: "rgba(22,22,22,0.12)" }} />
              <div>
                <p
                  className="text-[28px]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif', color: "#2d4a3e" }}
                >
                  24/7
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(22,22,22,0.55)" }}
                >
                  Care available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE: sticky stacked doctor cards (< 1024px) ════════ */}
      <MobileDoctorStack />

      {/* ══ DESKTOP: pinned scrollytelling (≥ 1024px) ═════════════ */}
      <div ref={pinWrapRef} className="relative z-10 hidden min-h-screen lg:block">
        <div className="mx-auto grid h-screen max-w-[1360px] grid-cols-1 items-center gap-10 px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">

          {/* Left: overlapping meta blocks */}
          <div className="relative h-[420px]">
            <div className="absolute left-0 top-0 flex items-center gap-3">
              <span
                className="text-[11px] font-medium uppercase"
                style={{ letterSpacing: "0.3em", color: "#2d4a3e" }}
              >
                §02 — Meet the physicians
              </span>
            </div>

            {DOCTORS.map((doc, i) => (
              <div
                key={doc.name}
                ref={(el) => { metaRefs.current[i] = el; }}
                className="flex flex-col justify-center"
                style={{ top: 60 }}
              >
                <p
                  className="mb-4 mt-12 text-[12px] uppercase tracking-[0.25em]"
                  style={{ color: "rgba(22,22,22,0.5)" }}
                >
                  {String(i + 1).padStart(2, "0")} / {String(DOCTORS.length).padStart(2, "0")} · {doc.creds}
                </p>

                <h3
                  className="mb-3 leading-[0.95]"
                  style={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontSize: "clamp(40px, 4.4vw, 72px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {doc.name}
                </h3>

                <p
                  className="mb-8 text-[14px] uppercase tracking-[0.18em]"
                  style={{ color: "#2d4a3e" }}
                >
                  {doc.role}
                </p>

                <p
                  className="mb-10 max-w-[440px] text-[16px] leading-[1.6]"
                  style={{ color: "rgba(22,22,22,0.7)" }}
                >
                  {doc.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {doc.focus.map((f) => (
                    <span
                      key={f}
                      className="rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.15em]"
                      style={{
                        background: "rgba(45,74,62,0.08)",
                        color: "#2d4a3e",
                        border: "1px solid rgba(45,74,62,0.18)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-12 flex items-baseline gap-3">
                  <span
                    className="text-[44px] leading-none"
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      color: "#161616",
                    }}
                  >
                    {doc.years}
                  </span>
                  <span
                    className="text-[12px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(22,22,22,0.55)" }}
                  >
                    years in practice
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: portrait stack */}
          <div className="relative h-[560px]">
            {DOCTORS.map((doc, i) => (
              <div
                key={doc.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 40px 80px -30px rgba(22,22,22,0.4), 0 12px 30px -10px rgba(22,22,22,0.2)",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${doc.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />

                {/* corner registration marks */}
                <div aria-hidden className="absolute left-4 top-4 h-3 w-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.7)", borderLeft: "1px solid rgba(255,255,255,0.7)" }} />
                <div aria-hidden className="absolute right-4 top-4 h-3 w-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.7)", borderRight: "1px solid rgba(255,255,255,0.7)" }} />
                <div aria-hidden className="absolute bottom-4 left-4 h-3 w-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.7)", borderLeft: "1px solid rgba(255,255,255,0.7)" }} />
                <div aria-hidden className="absolute bottom-4 right-4 h-3 w-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.7)", borderRight: "1px solid rgba(255,255,255,0.7)" }} />

                {/* ID label */}
                <div
                  className="absolute left-4 top-4 rounded px-3 py-1.5"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}
                >
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white">
                    ID — {String(i + 1).padStart(4, "0")}
                  </span>
                </div>

                {/* bottom overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6"
                  style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)" }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                      Specialty
                    </p>
                    <p
                      className="text-[22px] leading-tight text-white"
                      style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                    >
                      {doc.role.split("·")[0].trim()}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                    {doc.creds}
                  </span>
                </div>
              </div>
            ))}

            {/* progress rail */}
            <div
              className="absolute -right-6 top-0 h-full w-px"
              style={{ background: "rgba(22,22,22,0.1)" }}
            >
              <div
                className="absolute left-0 top-0 w-px transition-all duration-500"
                style={{
                  background: "#2d4a3e",
                  height: `${((activeDoc + 1) / DOCTORS.length) * 100}%`,
                }}
              />
              {DOCTORS.map((_, i) => (
                <span
                  key={i}
                  className="absolute -left-[3px] h-1.5 w-1.5 rounded-full"
                  style={{
                    top: `${(i / (DOCTORS.length - 1)) * 100}%`,
                    background: i <= activeDoc ? "#2d4a3e" : "rgba(22,22,22,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div
        className="relative z-10 overflow-hidden py-12"
        style={{
          borderTop: "1px solid rgba(22,22,22,0.1)",
          borderBottom: "1px solid rgba(22,22,22,0.1)",
        }}
      >
        <div ref={marqueeRef} className="relative w-full overflow-hidden">
          <div className="flex w-max items-center gap-12 whitespace-nowrap">
            {[...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS].map((c, i) => (
              <span key={i} className="flex items-center gap-12">
                <span
                  style={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontSize: "clamp(40px, 5vw, 72px)",
                    color: i % 2 === 0 ? "#161616" : "transparent",
                    WebkitTextStroke: i % 2 === 0 ? "0" : "1px #161616",
                    fontStyle: i % 2 === 0 ? "normal" : "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c}
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#2d4a3e" }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <div className="cl-stats relative z-10 mx-auto max-w-[1360px] px-6 py-12 sm:px-8 lg:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p
              className="mb-3 text-[11px] uppercase"
              style={{ letterSpacing: "0.3em", color: "#2d4a3e" }}
            >
              §03 — By the numbers
            </p>
            <h3
              className="leading-[1]"
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: "clamp(36px, 3.6vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              You first.{" "}
              <span className="italic" style={{ color: "#2d4a3e" }}>
                Always.
              </span>
            </h3>
          </div>
          <p
            className="hidden text-[12px] uppercase tracking-[0.22em] md:block"
            style={{ color: "rgba(22,22,22,0.5)" }}
          >
            Updated quarterly
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-px lg:grid-cols-4"
          style={{ background: "rgba(22,22,22,0.1)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="cl-stat flex flex-col gap-3 p-8"
              style={{ background: "#f6f3ec" }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(22,22,22,0.5)" }}
              >
                {String(i + 1).padStart(2, "0")} / 04
              </p>
              <span
                ref={(el) => { statRefs.current[i] = el; }}
                className="block leading-none"
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: "clamp(56px, 6vw, 96px)",
                  color: "#161616",
                  fontWeight: 400,
                }}
              >
                0{s.suffix}
              </span>
              <p className="text-[16px]" style={{ color: "rgba(22,22,22,0.65)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ClinicalLeadershipSection as DoctorSection };
