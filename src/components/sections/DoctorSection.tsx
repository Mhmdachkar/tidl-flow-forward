import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOCTORS = [
  {
    specialty: "METABOLIC HEALTH",
    name: "Dr. James Park",
    creds: "MD, ABOM",
    bio: "Expert in preventive medicine and metabolic syndrome management with over a decade of clinical practice.",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=320&q=80&fit=crop&crop=faces",
    avatarBg: "linear-gradient(160deg, #c7e0ff 0%, #edf4ff 100%)",
  },
  {
    specialty: "ENDOCRINOLOGY",
    name: "Dr. Sarah Mitchell",
    creds: "MD, FACE, ECNU",
    bio: "Specialises in hormone optimisation and metabolic health with 12+ years of clinical experience.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=320&q=80&fit=crop&crop=faces",
    avatarBg: "linear-gradient(160deg, #c7f0dc 0%, #edfff5 100%)",
  },
  {
    specialty: "LONGEVITY",
    name: "Dr. Michael Andrews",
    creds: "MD, FACP, FP",
    bio: "Focuses on longevity, weight management and whole-person care across all life stages.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=320&q=80&fit=crop&crop=faces",
    avatarBg: "linear-gradient(160deg, #ffe9c2 0%, #fffaef 100%)",
  },
] as const;

const STANDARDS = [
  { num: "01", title: "Evidence-Based Care", desc: "We follow the latest clinical guidelines and peer-reviewed research." },
  { num: "02", title: "Personalized Plans", desc: "Your plan is built around your biology, goals, and lifestyle." },
  { num: "03", title: "Ongoing Oversight", desc: "Continuous monitoring and support to ensure safe, effective outcomes." },
] as const;

const METRICS = [
  { target: 60,  suffix: "+",  unit: "Years",     label: "Combined experience" },
  { target: 100, suffix: "+",  unit: "Physicians", label: "Across the U.S." },
  { target: 50,  suffix: "",   unit: "States",     label: "Licensed to practice" },
  { target: 15,  suffix: "K+", unit: "Patients",   label: "Helped and counting" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Splits a string into individually-animatable <span.char> elements. */
function CharSplit({ text }: { text: string }) {
  return (
    <span aria-label={text} style={{ display: "block" }}>
      {text.split(" ").map((word, wi) => (
        <span
          key={wi}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.25em" }}
        >
          {word.split("").map((ch, ci) => (
            <span key={`${wi}-${ci}`} className="char" style={{ display: "inline-block" }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoctorSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const imgPanelRef   = useRef<HTMLDivElement>(null);
  const imgInnerRef   = useRef<HTMLImageElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const sigPathRef    = useRef<SVGPathElement>(null);
  const carouselRef   = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const prevBtnRef    = useRef<HTMLButtonElement>(null);
  const nextBtnRef    = useRef<HTMLButtonElement>(null);
  const atomSvgRef    = useRef<SVGSVGElement>(null);
  const hairline0Ref  = useRef<HTMLSpanElement>(null);
  const hairline1Ref  = useRef<HTMLSpanElement>(null);

  const [activeIdx, setActiveIdx] = useState(1);
  const activeIdxRef        = useRef(1);
  const firstCarouselRender = useRef(true);

  // Keep ref and state in sync so stable callbacks read the latest value
  const setActive = (idx: number) => {
    activeIdxRef.current = idx;
    setActiveIdx(idx);
  };

  // ── 1. Carousel positions ─────────────────────────────────────────────────
  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (!cards.length) return;

    const isFirst = firstCarouselRender.current;
    firstCarouselRender.current = false;

    cards.forEach((card, i) => {
      const offset   = i - activeIdx;
      const isCenter = offset === 0;
      const isEdge   = Math.abs(offset) === 1;
      const pos = {
        x:       offset * 300,
        rotateY: offset * -22,
        scale:   isCenter ? 1 : isEdge ? 0.82 : 0.65,
        opacity: isCenter ? 1 : isEdge ? 0.72 : 0,
        zIndex:  isCenter ? 10 : isEdge ? 5 : 1,
      };
      if (isFirst) gsap.set(card, pos);
      else         gsap.to(card, { ...pos, duration: 0.75, ease: "power3.inOut" });
    });
  }, [activeIdx]);

  // ── 2. Magnetic arrow buttons ─────────────────────────────────────────────
  useEffect(() => {
    const attach = (btn: HTMLButtonElement | null) => {
      if (!btn) return () => {};
      const qx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const qy = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      const onMove  = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        qx((e.clientX - r.left - r.width  / 2) * 0.5);
        qy((e.clientY - r.top  - r.height / 2) * 0.5);
      };
      const onLeave = () => { qx(0); qy(0); };
      btn.addEventListener("mousemove",  onMove);
      btn.addEventListener("mouseleave", onLeave);
      return () => {
        btn.removeEventListener("mousemove",  onMove);
        btn.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(btn);
      };
    };
    const c1 = attach(prevBtnRef.current);
    const c2 = attach(nextBtnRef.current);
    return () => { c1(); c2(); };
  }, []);

  // ── 3. Entrance animations ────────────────────────────────────────────────
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const chars   = Array.from(sec.querySelectorAll<HTMLElement>(".dr2-headline .char"));
      const eyebrow = sec.querySelector<HTMLElement>(".dr2-eyebrow");
      const bodyEl  = sec.querySelector<HTMLElement>(".dr2-body");
      const sigEl   = sec.querySelector<HTMLElement>(".dr2-sig");
      const stdItems = Array.from(sec.querySelectorAll<HTMLElement>(".dr2-std"));
      const statsEl  = sec.querySelector<HTMLElement>(".dr2-stats");

      if (reduced) {
        const all = [eyebrow, bodyEl, sigEl, imgPanelRef.current,
          badgeRef.current, carouselRef.current, ...stdItems, statsEl,
        ].filter((el): el is HTMLElement => el !== null);
        gsap.from(all, {
          opacity: 0, duration: 0.5, stagger: 0.04,
          scrollTrigger: { trigger: sec, start: "top 82%" },
        });
        return;
      }

      // ── initial hidden states ──
      gsap.set(chars,               { yPercent: 110, rotateX: -40, opacity: 0 });
      gsap.set([eyebrow, bodyEl, sigEl], { opacity: 0, y: 20 });
      gsap.set(imgPanelRef.current, { clipPath: "inset(0 0 100% 0 round 28px)" });
      gsap.set(imgInnerRef.current, { scale: 1.14 });
      gsap.set(badgeRef.current,    { opacity: 0, y: 38 });
      gsap.set(stdItems,            { opacity: 0, x: -14 });
      gsap.set(hairline0Ref.current,{ scaleX: 0, transformOrigin: "left" });
      gsap.set(hairline1Ref.current,{ scaleX: 0, transformOrigin: "left" });
      gsap.set(statsEl,             { opacity: 0, y: 24 });

      // ── master entrance timeline ──
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sec, start: "top 78%" },
      });

      tl.to(eyebrow,  { opacity: 1, y: 0, duration: 0.45 }, 0);
      tl.to(chars,    { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.05, stagger: 0.011, ease: "expo.out" }, 0.1);
      tl.to(bodyEl,   { opacity: 1, y: 0, duration: 0.5 }, 0.52);
      tl.to(hairline0Ref.current, { scaleX: 1, duration: 0.5 }, 0.62);
      tl.to(sigEl,    { opacity: 1, y: 0, duration: 0.45 }, 0.68);

      // image reveal (clip-path mask + inner parallax scale)
      tl.to(imgPanelRef.current, { clipPath: "inset(0 0 0% 0 round 28px)", duration: 1.35, ease: "expo.out" }, 0.08);
      tl.to(imgInnerRef.current, { scale: 1, duration: 1.4, ease: "expo.out" }, 0.08);
      tl.to(badgeRef.current,    { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, 1.1);

      // standards list
      tl.to(hairline1Ref.current, { scaleX: 1, duration: 0.45 }, 0.55);
      tl.to(stdItems,  { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 }, 0.58);

      // carousel
      tl.to(carouselRef.current, { opacity: 1, duration: 0.5 }, 0.76);

      // stats bar
      tl.to(statsEl, { opacity: 1, y: 0, duration: 0.5 }, 1.15);

      // signature SVG draw-on
      const sigPath = sigPathRef.current;
      if (sigPath) {
        const len = sigPath.getTotalLength();
        gsap.set(sigPath, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(sigPath, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.78);
      }

      // atom continuous rotation
      if (atomSvgRef.current) {
        gsap.to(atomSvgRef.current, { rotation: 360, duration: 28, ease: "none", repeat: -1 });
      }

      // stats count-up
      METRICS.forEach(({ target, suffix }, i) => {
        const span = metricRefs.current[i];
        if (!span) return;
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: statsEl, start: "top 86%" },
          onUpdate: () => { span.textContent = `${Math.round(proxy.v)}${suffix}`; },
        });
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
      style={{ background: "#F4F6F9" }}
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(1200px 600px at 70% 0%, rgba(59,130,246,0.06), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">

        {/* ─── Zone 1: Hero two-column ───────────────────────────────────── */}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">

          {/* Left copy */}
          <div className="lg:col-span-5">

            {/* Eyebrow */}
            <div className="dr2-eyebrow mb-6 flex items-center gap-2.5">
              <span className="relative inline-flex h-2 w-2 shrink-0" aria-hidden="true">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ backgroundColor: "#3B6FA0" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "#3B6FA0" }} />
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#3B6FA0" }}
              >
                Clinical Leadership
              </span>
            </div>

            {/* Headline */}
            <h2
              className="dr2-headline font-display leading-[0.95]"
              style={{ color: "#0B1B2B", fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.02em" }}
            >
              <CharSplit text="Real doctors." />
              <CharSplit text="Real oversight." />
            </h2>

            {/* Body */}
            <p
              className="dr2-body mt-6 max-w-[420px] leading-relaxed"
              style={{ color: "#41566B", fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}
            >
              Every treatment plan is reviewed by board-certified physicians with
              deep expertise in metabolic health, endocrinology, and preventive care.
            </p>

            {/* Hairline 0 */}
            <span
              ref={hairline0Ref}
              className="my-7 block h-px"
              style={{ background: "rgba(11,27,43,0.12)" }}
              aria-hidden="true"
            />

            {/* Signature */}
            <div className="dr2-sig flex items-center gap-4">
              <svg viewBox="0 0 180 56" className="h-11 w-auto shrink-0" fill="none" aria-hidden="true">
                <path
                  ref={sigPathRef}
                  d="M6 40 C16 22, 34 10, 54 28 S82 46, 108 24 C124 14, 148 18, 172 36 M130 34 C142 42, 156 44, 170 38 M56 48 L66 44"
                  stroke="#0B1B2B"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0B1B2B" }}>Dr. Michael Andrews</p>
                <p className="text-xs"                style={{ color: "#41566B" }}>Chief Medical Officer</p>
              </div>
            </div>
          </div>

          {/* Right image panel */}
          <div className="relative lg:col-span-7">
            <div
              ref={imgPanelRef}
              className="relative overflow-hidden"
              style={{ borderRadius: "28px", aspectRatio: "16/10" }}
            >
              <img
                ref={imgInnerRef}
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&fit=crop"
                alt="TIDL physician team — board-certified doctors in a clinical setting"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1200}
                height={750}
              />
            </div>

            {/* Glass badge */}
            <div
              ref={badgeRef}
              className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full px-5 py-3"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 8px 24px -12px rgba(11,27,43,0.18)",
              }}
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2L3 5v5c0 4.2 2.8 7.5 7 8.5C17 17.5 20 14.2 20 10V5l-7-3z"
                  stroke="#3B6FA0" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" stroke="#3B6FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#0B1B2B" }}>
                Board-Certified · Licensed · Patient-Focused
              </span>
            </div>
          </div>
        </div>

        {/* ─── Zone 2: Standards + 3D Carousel ───────────────────────────── */}
        <div className="mt-24 grid items-start gap-8 lg:grid-cols-12 lg:mt-28">

          {/* Standards list */}
          <div className="lg:col-span-3">
            <div className="mb-5 flex items-center gap-3">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#3B6FA0" }}>
                Our Standard
              </span>
              <span
                ref={hairline1Ref}
                className="block h-px flex-1"
                style={{ background: "rgba(11,27,43,0.12)" }}
                aria-hidden="true"
              />
            </div>

            {STANDARDS.map((s, i) => (
              <button
                key={s.num}
                className="dr2-std w-full border-l-2 py-4 pl-4 text-left"
                style={{
                  borderLeftColor: i === activeIdx ? "#3B6FA0" : "rgba(11,27,43,0.1)",
                  transition: "border-color 0.3s ease",
                }}
                onClick={() => setActive(i)}
                aria-pressed={activeIdx === i}
              >
                <p
                  className="text-[9.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: i === activeIdx ? "#3B6FA0" : "#41566B", transition: "color 0.3s" }}
                >
                  {s.num}
                </p>
                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: i === activeIdx ? "#0B1B2B" : "#41566B", transition: "color 0.3s" }}
                >
                  {s.title}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "#41566B", opacity: i === activeIdx ? 1 : 0.6, transition: "opacity 0.3s" }}
                >
                  {s.desc}
                </p>
              </button>
            ))}
          </div>

          {/* 3D carousel */}
          <div className="relative flex flex-col items-center lg:col-span-9">

            {/* Track */}
            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Physician profiles"
              className="relative flex w-full items-center justify-center"
              style={{ perspective: "1200px", height: "300px", opacity: 0 }}
            >
              {DOCTORS.map((doc, i) => (
                <div
                  key={doc.name}
                  ref={el => { cardRefs.current[i] = el; }}
                  className="absolute"
                  style={{ width: "clamp(300px, 42vw, 520px)" }}
                  aria-hidden={i !== activeIdx}
                >
                  {/* Dark glass card */}
                  <div
                    className="relative flex h-[280px] overflow-hidden rounded-3xl"
                    style={{
                      background: "linear-gradient(145deg, #0f2236 0%, #0B1B2B 100%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "0 40px 80px -40px rgba(11,27,43,0.5), 0 1px 0 rgba(255,255,255,0.07) inset",
                    }}
                  >
                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
                      <div>
                        <p
                          className="text-[9px] font-semibold uppercase tracking-[0.26em]"
                          style={{ color: "#3B6FA0" }}
                        >
                          {doc.specialty}
                        </p>
                        <h3
                          className="mt-2 font-display text-[1.45rem] leading-tight text-white"
                        >
                          {doc.name}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>
                          {doc.creds}
                        </p>
                        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {doc.bio}
                        </p>
                      </div>
                      <Link
                        to="/quiz"
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                        style={{ color: "#3B6FA0" }}
                      >
                        View Profile
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>

                    {/* Avatar panel */}
                    <div
                      className="relative w-[42%] shrink-0 overflow-hidden"
                      style={{ background: doc.avatarBg }}
                    >
                      {/* Decorative wave */}
                      <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 200 280"
                        fill="none"
                        aria-hidden="true"
                        preserveAspectRatio="none"
                      >
                        <path d="M0 120 C50 100, 110 140, 200 120 L200 280 L0 280 Z" fill="rgba(11,27,43,0.06)" />
                        <path d="M0 160 C60 142, 130 178, 200 160" stroke="rgba(59,111,160,0.22)" strokeWidth="1.5" />
                      </svg>
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="absolute bottom-0 left-1/2 h-[88%] w-full -translate-x-1/2 object-cover object-top"
                        loading="lazy"
                        width={200}
                        height={248}
                      />
                    </div>
                  </div>

                  {/* Floor shadow */}
                  <div
                    aria-hidden="true"
                    className="mx-6 h-3 rounded-b-3xl"
                    style={{ background: "linear-gradient(to bottom, rgba(11,27,43,0.1), transparent)", filter: "blur(4px)" }}
                  />
                </div>
              ))}
            </div>

            {/* Arrow + dot controls */}
            <div className="mt-6 flex items-center gap-4">
              <button
                ref={prevBtnRef}
                onClick={() => setActive(Math.max(0, activeIdx - 1))}
                disabled={activeIdx === 0}
                aria-label="Previous physician"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(11,27,43,0.1)",
                  boxShadow: "0 4px 14px -6px rgba(11,27,43,0.16)",
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 4L6 8l4 4" stroke="#0B1B2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex items-center gap-1.5" role="tablist" aria-label="Select physician">
                {DOCTORS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeIdx}
                    onClick={() => setActive(i)}
                    aria-label={DOCTORS[i].name}
                    className="h-1.5 rounded-full"
                    style={{
                      width: i === activeIdx ? "22px" : "6px",
                      background: i === activeIdx ? "#3B6FA0" : "rgba(11,27,43,0.2)",
                      transition: "width 0.35s ease, background 0.35s ease",
                    }}
                  />
                ))}
              </div>

              <button
                ref={nextBtnRef}
                onClick={() => setActive(Math.min(DOCTORS.length - 1, activeIdx + 1))}
                disabled={activeIdx === DOCTORS.length - 1}
                aria-label="Next physician"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(11,27,43,0.1)",
                  boxShadow: "0 4px 14px -6px rgba(11,27,43,0.16)",
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="#0B1B2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Zone 3: Stats bar ────────────────────────────────────────── */}
        <div className="dr2-stats mt-12 lg:mt-16">
          <div
            className="flex flex-wrap items-center gap-y-6 rounded-3xl px-6 py-6 sm:px-8 lg:flex-nowrap"
            style={{
              background: "rgba(255,255,255,0.68)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.85)",
              boxShadow: "0 20px 60px -40px rgba(11,27,43,0.16)",
            }}
          >
            {/* Atom SVG mark */}
            <div className="shrink-0 pr-6">
              <svg
                ref={atomSvgRef}
                viewBox="0 0 64 64"
                fill="none"
                className="h-10 w-10"
                aria-hidden="true"
              >
                <ellipse cx="32" cy="32" rx="29" ry="11" stroke="#3B6FA0" strokeWidth="1.3" />
                <ellipse cx="32" cy="32" rx="29" ry="11" stroke="#3B6FA0" strokeWidth="1.3" transform="rotate(60 32 32)" />
                <ellipse cx="32" cy="32" rx="29" ry="11" stroke="#3B6FA0" strokeWidth="1.3" transform="rotate(120 32 32)" />
                <circle cx="32" cy="32" r="3.5" fill="#3B6FA0" />
                <circle cx="61" cy="32" r="2"   fill="#3B6FA0" />
                <circle cx="17.5" cy="6.5" r="2" fill="#3B6FA0" />
                <circle cx="17.5" cy="57.5" r="2" fill="#3B6FA0" />
              </svg>
            </div>

            {/* Metrics */}
            {METRICS.map((m, i) => (
              <Fragment key={m.label}>
                <span
                  className="hidden h-8 w-px shrink-0 lg:block"
                  style={{ background: "rgba(11,27,43,0.11)", margin: "0 1.5rem" }}
                  aria-hidden="true"
                />
                <div className="min-w-0 py-1">
                  <p
                    className="font-display leading-none"
                    style={{ color: "#0B1B2B", fontSize: "clamp(1.45rem, 2vw, 2rem)" }}
                  >
                    <span ref={el => { metricRefs.current[i] = el; }}>0{m.suffix}</span>
                    {" "}
                    <span className="font-sans text-sm font-medium" style={{ color: "#41566B" }}>
                      {m.unit}
                    </span>
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em]" style={{ color: "#3B6FA0" }}>
                    {m.label}
                  </p>
                </div>
              </Fragment>
            ))}

            {/* Care philosophy */}
            <Fragment>
              <span
                className="hidden h-8 w-px shrink-0 lg:block"
                style={{ background: "rgba(11,27,43,0.11)", margin: "0 1.5rem" }}
                aria-hidden="true"
              />
              <div className="min-w-0 py-1">
                <p
                  className="font-display leading-tight"
                  style={{ color: "#0B1B2B", fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)" }}
                >
                  You first.<br />Always.
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.2em]" style={{ color: "#3B6FA0" }}>
                  Care Philosophy
                </p>
              </div>
            </Fragment>
          </div>
        </div>

      </div>
    </section>
  );
}
