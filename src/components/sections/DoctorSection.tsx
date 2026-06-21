import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ObserverPlugin from "gsap/Observer";

gsap.registerPlugin(ObserverPlugin);
const Observer = ObserverPlugin;

// ─── Data ─────────────────────────────────────────────────────────────────────
const DOCTORS = [
  { specialty: "METABOLIC HEALTH", name: "Dr. James Park", creds: "MD, ABOM",
    bio: "Expert in preventive medicine and metabolic syndrome management with over a decade of clinical practice.",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=420&h=560&q=85&fit=crop",
    accent: "#A8D5BA" },
  { specialty: "ENDOCRINOLOGY", name: "Dr. Sarah Mitchell", creds: "MD, FACE, ECNU",
    bio: "Specialises in hormone optimisation and metabolic health with 12+ years of clinical experience.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=420&h=560&q=85&fit=crop",
    accent: "#B8E0D2" },
  { specialty: "LONGEVITY", name: "Dr. Michael Andrews", creds: "MD, FACP, FP",
    bio: "Focuses on longevity, weight management and whole-person care across all life stages.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=420&h=560&q=85&fit=crop",
    accent: "#F4D4A1" },
] as const;

const STANDARDS = [
  { num: "01", title: "Evidence-Based Care", desc: "We follow the latest clinical guidelines and peer-reviewed research." },
  { num: "02", title: "Personalized Plans", desc: "Your plan is built around your biology, goals, and lifestyle." },
  { num: "03", title: "Ongoing Oversight", desc: "Continuous monitoring and support to ensure safe, effective outcomes." },
] as const;

const METRICS = [
  { target: 60,  suffix: "+",  unit: "Years",      label: "Combined experience" },
  { target: 100, suffix: "+",  unit: "Physicians", label: "Across the U.S." },
  { target: 50,  suffix: "",   unit: "States",     label: "Licensed to practice" },
  { target: 15,  suffix: "K+", unit: "Patients",   label: "Helped and counting" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function CharSplit({ text }: { text: string }) {
  return (
    <span className="inline-block">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" style={{ perspective: 800 }}>
          {word.split("").map((ch, ci) => (
            <span key={ci} className="char inline-block will-change-transform" style={{ transformStyle: "preserve-3d" }}>
              {ch}
            </span>
          ))}
          {wi < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ClinicalLeadershipSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imgPanelRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLImageElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const sigPathRef  = useRef<SVGPathElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const prevBtnRef  = useRef<HTMLButtonElement>(null);
  const nextBtnRef  = useRef<HTMLButtonElement>(null);
  const atomSvgRef  = useRef<SVGSVGElement>(null);
  const hairline0   = useRef<HTMLSpanElement>(null);
  const hairline1   = useRef<HTMLSpanElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(1);
  const activeIdxRef = useRef(1);
  const firstRender  = useRef(true);

  const setActive = useCallback((idx: number) => {
    const clamped = (idx + DOCTORS.length) % DOCTORS.length;
    activeIdxRef.current = clamped;
    setActiveIdx(clamped);
  }, []);

  // ── 1. Coverflow carousel layout ──────────────────────────────────────────
  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
    if (!cards.length) return;
    const first = firstRender.current;
    firstRender.current = false;

    cards.forEach((card, i) => {
      let offset = i - activeIdx;
      if (offset > DOCTORS.length / 2) offset -= DOCTORS.length;
      if (offset < -DOCTORS.length / 2) offset += DOCTORS.length;
      const center = offset === 0;
      const edge   = Math.abs(offset) === 1;
      const pos = {
        x: offset * 340,
        rotateY: offset * -32,
        scale: center ? 1 : edge ? 0.78 : 0.52,
        opacity: center ? 1 : edge ? 0.62 : 0,
        zIndex: center ? 10 : edge ? 5 : 1,
      };
      if (first) gsap.set(card, pos);
      else gsap.to(card, { ...pos, duration: 0.85, ease: "expo.out" });
    });
  }, [activeIdx]);

  // ── 2. Magnetic buttons ────────────────────────────────────────────────────
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const magnet = (btn: HTMLElement | null, strength = 0.45) => {
      if (!btn) return;
      const qx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const qy = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * strength);
        qy((e.clientY - r.top - r.height / 2) * strength);
      };
      const onLeave = () => { qx(0); qy(0); };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(btn);
      });
    };
    magnet(prevBtnRef.current);
    magnet(nextBtnRef.current);
    return () => cleanups.forEach(c => c());
  }, []);

  // ── 3. Hero image 3D tilt + parallax glow follow ──────────────────────────
  useEffect(() => {
    const panel = imgPanelRef.current;
    const inner = imgInnerRef.current;
    const glow  = glowRef.current;
    if (!panel || !inner) return;

    const rxQ = gsap.quickTo(panel, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ryQ = gsap.quickTo(panel, "rotationY", { duration: 0.8, ease: "power3.out" });
    const ixQ = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" });
    const iyQ = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" });

    gsap.set(panel, { transformPerspective: 1200, transformStyle: "preserve-3d" });

    const onMove = (e: MouseEvent) => {
      const r = panel.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ryQ(px * 10);
      rxQ(-py * 8);
      ixQ(px * -24);
      iyQ(py * -24);
    };
    const onLeave = () => { rxQ(0); ryQ(0); ixQ(0); iyQ(0); };
    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);

    // ← FIX: declare cleanups before the glow block that pushes into it
    const cleanups: Array<() => void> = [];
    const sec = sectionRef.current;
    if (sec && glow) {
      const glowQX = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
      const glowQY = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });
      const onSecMove = (e: MouseEvent) => {
        const r = sec.getBoundingClientRect();
        glowQX(e.clientX - r.left - r.width / 2);
        glowQY(e.clientY - r.top - r.height / 2);
      };
      sec.addEventListener("mousemove", onSecMove);
      cleanups.push(() => {
        sec.removeEventListener("mousemove", onSecMove);
        gsap.killTweensOf(glow);
      });
    }

    return () => {
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(panel);
      gsap.killTweensOf(inner);
      cleanups.forEach(c => c());
    };
  }, []);

  // ── 4. Auto-rotate + drag/wheel for carousel ──────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const obs = Observer.create({
      target: track,
      type: "wheel,touch,pointer",
      preventDefault: false,
      tolerance: 50,
      onLeft: () => setActive(activeIdxRef.current + 1),
      onRight: () => setActive(activeIdxRef.current - 1),
    });
    const autoplay = window.setInterval(() => setActive(activeIdxRef.current + 1), 5500);
    return () => { obs.kill(); clearInterval(autoplay); };
  }, [setActive]);

  // ── 5. Master scroll choreography ─────────────────────────────────────────
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const chars   = gsap.utils.toArray<HTMLElement>(".dr2-headline .char");
      const eyebrow = sec.querySelector(".dr2-eyebrow");
      const bodyEl  = sec.querySelector(".dr2-body");
      const sigEl   = sec.querySelector(".dr2-sig");
      const stdItems= gsap.utils.toArray<HTMLElement>(".dr2-std");
      const statsEl = sec.querySelector(".dr2-stats");

      if (reduced) {
        gsap.from([eyebrow, bodyEl, sigEl, imgPanelRef.current, badgeRef.current,
          trackRef.current, ...stdItems, statsEl].filter(Boolean) as Element[], {
          opacity: 0, duration: 0.5, stagger: 0.04,
          scrollTrigger: { trigger: sec, start: "top 82%" },
        });
        return;
      }

      // ── ZONE 1 initial states ───────────────────────────────────────────────
      // Left col: eyebrow slides in from LEFT
      gsap.set(eyebrow, { opacity: 0, x: -60, skewX: -6 });
      // Headline chars: burst up through the floor with 3-D rotation
      gsap.set(chars, { yPercent: 120, rotateX: -70, opacity: 0, transformOrigin: "50% 100%" });
      // Body: drifts up from below
      gsap.set(bodyEl, { opacity: 0, y: 44 });
      // Hairline 0: grows from left
      gsap.set(hairline0.current, { scaleX: 0, transformOrigin: "left center" });
      // Signature: hidden (drawn by strokeDashoffset below)
      gsap.set(sigEl, { opacity: 0, x: -30 });
      // Right image: slides in from RIGHT with clip-path curtain
      gsap.set(imgPanelRef.current, {
        clipPath: "inset(0 100% 0 0 round 28px)",
        x: 60,
      });
      gsap.set(imgInnerRef.current, { scale: 1.22 });
      // Badge: pops up from below the image
      gsap.set(badgeRef.current, { opacity: 0, y: 50, scale: 0.88 });

      // ── ZONE 2 initial states ───────────────────────────────────────────────
      // Standards list: stagger in from the left with a slight tilt
      gsap.set(stdItems, { opacity: 0, x: -50, skewY: 2 });
      gsap.set(hairline1.current, { scaleX: 0, transformOrigin: "left center" });
      // Carousel track: slides in from the RIGHT + depth
      gsap.set(trackRef.current, { opacity: 0, x: 80, rotateY: -8 });

      // ── ZONE 3 initial states ───────────────────────────────────────────────
      // Stats bar: rises from below as one slab
      gsap.set(statsEl, { opacity: 0, y: 60, rotateX: 6, transformOrigin: "50% 100%", transformPerspective: 1200 });

      // ── MASTER ZONE 1 TIMELINE ─────────────────────────────────────────────
      const tl1 = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: sec, start: "top 72%" },
      });

      // eyebrow slides in from left + deskew
      tl1.to(eyebrow, { opacity: 1, x: 0, skewX: 0, duration: 0.65 }, 0)

        // image curtain wipes LEFT-TO-RIGHT (clipPath right edge closes)
        .to(imgPanelRef.current, {
          clipPath: "inset(0 0% 0 0 round 28px)",
          x: 0, duration: 1.3, ease: "expo.inOut",
        }, 0.06)
        .to(imgInnerRef.current, { scale: 1, duration: 1.4, ease: "expo.out" }, 0.06)

        // headline chars burst upward with stagger
        .to(chars, {
          yPercent: 0, rotateX: 0, opacity: 1,
          duration: 1.05, ease: "expo.out",
          stagger: { each: 0.013, from: "start" },
        }, 0.2)

        // body drifts up
        .to(bodyEl, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.62)

        // hairline grows left→right
        .to(hairline0.current, { scaleX: 1, duration: 0.8, ease: "expo.out" }, 0.72)

        // signature slides in from left, then SVG draws
        .to(sigEl, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }, 0.82)

        // badge pops from below with bounce
        .to(badgeRef.current, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75, ease: "back.out(2)",
        }, 1.05);

      // signature SVG draw-on
      if (sigPathRef.current) {
        const len = sigPathRef.current.getTotalLength();
        gsap.set(sigPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        tl1.to(sigPathRef.current, {
          strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut",
        }, 0.9);
      }

      // ── ZONE 2 TIMELINE (separate trigger, slightly later) ─────────────────
      const tl2 = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: sec.querySelector(".dr2-zone2") ?? sec, start: "top 78%" },
      });

      // hairline draws out
      tl2.to(hairline1.current, { scaleX: 1, duration: 0.6 }, 0)

        // standards items: each slides from LEFT with stagger + deskew
        .to(stdItems, {
          opacity: 1, x: 0, skewY: 0,
          duration: 0.65, stagger: 0.1, ease: "power3.out",
        }, 0.05)

        // carousel slides in from RIGHT + un-rotates
        .to(trackRef.current, {
          opacity: 1, x: 0, rotateY: 0,
          duration: 1.0, ease: "expo.out",
        }, 0.18);

      // ── ZONE 3 TIMELINE ───────────────────────────────────────────────────
      const tl3 = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: sec.querySelector(".dr2-stats") ?? sec, start: "top 84%" },
      });

      // stats bar rises from below + un-rotates
      tl3.to(statsEl, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.85, ease: "power3.out",
      }, 0);

      // ── ONGOING PARALLAX + LOOPS ──────────────────────────────────────────
      // image inner rises subtly as page scrolls past
      gsap.to(imgInnerRef.current, {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      // badge drifts up faster (creates depth separation)
      gsap.to(badgeRef.current, {
        yPercent: -30, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

      // ambient float on badge after entrance
      gsap.to(badgeRef.current, {
        y: "+=8", duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2,
      });

      // atom rotates continuously
      if (atomSvgRef.current) {
        gsap.to(atomSvgRef.current, {
          rotation: 360, duration: 32, ease: "none", repeat: -1, transformOrigin: "50% 50%",
        });
      }

      // Headline char hover wave
      chars.forEach((c) => {
        c.addEventListener("mouseenter", () => {
          gsap.fromTo(c, { y: 0 }, { y: -8, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 });
        });
      });

      // Stats counters + progress bars
      METRICS.forEach(({ target, suffix }, i) => {
        const span = metricRefs.current[i];
        const bar  = barRefs.current[i];
        if (!span) return;
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target, duration: 2.2, ease: "power3.out",
          scrollTrigger: { trigger: statsEl, start: "top 85%" },
          onUpdate: () => { span.textContent = `${Math.round(proxy.v)}${suffix}`; },
        });
        if (bar) {
          gsap.fromTo(bar, { scaleX: 0 }, {
            scaleX: 1, duration: 1.6, ease: "expo.out", transformOrigin: "left center",
            scrollTrigger: { trigger: statsEl, start: "top 85%" },
          });
        }
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "#F4F6F9", color: "#0B1B2B" }}>
      {/* Cursor-follow radial glow */}
      <div ref={glowRef} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(59,111,160,0.18) 0%, rgba(59,111,160,0) 60%)", filter: "blur(40px)" }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* ─── Zone 1 ───────────────────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <div className="dr2-eyebrow mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#3B6FA0" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#3B6FA0" }} />
              Clinical Leadership
            </div>

            <h2 className="dr2-headline font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: '"Instrument Serif", "Fraunces", Georgia, serif' }}>
              <span className="block overflow-hidden"><CharSplit text="Real doctors." /></span>
              <span className="block overflow-hidden"><CharSplit text="Real oversight." /></span>
            </h2>

            <p className="dr2-body mt-8 max-w-md text-base leading-relaxed" style={{ color: "rgba(11,27,43,0.7)" }}>
              Every treatment plan is reviewed by board-certified physicians with deep expertise in metabolic health, endocrinology, and preventive care.
            </p>

            <span ref={hairline0} className="my-10 block h-px w-40" style={{ background: "rgba(11,27,43,0.18)" }} />

            <div className="dr2-sig flex items-center gap-4">
              <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
                <path ref={sigPathRef} d="M2 22 C 10 4, 22 30, 32 14 S 54 26, 62 10" stroke="#0B1B2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <div>
                <div className="text-sm font-semibold">Dr. Michael Andrews</div>
                <div className="text-xs" style={{ color: "rgba(11,27,43,0.55)" }}>Chief Medical Officer</div>
              </div>
            </div>
          </div>

          {/* Right image panel */}
          <div className="relative">
            <div ref={imgPanelRef} className="relative aspect-[4/3] overflow-hidden rounded-[28px]"
              style={{ boxShadow: "0 30px 80px -30px rgba(11,27,43,0.35)" }}>
              <img ref={imgInnerRef} src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80"
                alt="Clinical oversight" className="h-full w-full object-cover will-change-transform" loading="lazy" />
            </div>

            <div ref={badgeRef} className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(11,27,43,0.08)", boxShadow: "0 18px 50px -18px rgba(11,27,43,0.3)", color: "#0B1B2B" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B6FA0" strokeWidth="2">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Board-Certified · Licensed · Patient-Focused
            </div>
          </div>
        </div>

        {/* ─── Zone 2 ───────────────────────────────────────────────── */}
        <div className="dr2-zone2 mt-32 grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#3B6FA0" }}>Our Standard</span>
              <span ref={hairline1} className="block h-px w-16" style={{ background: "rgba(59,111,160,0.4)" }} />
            </div>

            {STANDARDS.map((s, i) => (
              <button key={s.num} onClick={() => setActive(i)} aria-pressed={activeIdx === i}
                className="dr2-std group block w-full border-l-2 py-5 pl-6 text-left transition-all duration-500"
                style={{ borderColor: activeIdx === i ? "#3B6FA0" : "rgba(11,27,43,0.1)" }}>
                <div className="text-xs font-mono" style={{ color: activeIdx === i ? "#3B6FA0" : "rgba(11,27,43,0.4)" }}>{s.num}</div>
                <div className="mt-1 text-lg font-semibold">{s.title}</div>
                <div className="mt-1 text-sm" style={{ color: "rgba(11,27,43,0.6)" }}>{s.desc}</div>
              </button>
            ))}
          </div>

          {/* 3D carousel */}
          <div className="relative select-none">

            {/* Left arrow — floats at the left edge of the track */}
            <button
              ref={prevBtnRef}
              onClick={() => setActive(activeIdx - 1)}
              aria-label="Previous physician"
              className="absolute left-0 top-[50%] z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(11,27,43,0.1)",
                boxShadow: "0 8px 32px -10px rgba(11,27,43,0.28)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B1B2B" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Perspective track */}
            <div
              ref={trackRef}
              className="relative overflow-visible"
              style={{ height: "330px", perspective: "1600px", perspectiveOrigin: "50% 50%", opacity: 0 }}
            >
              {DOCTORS.map((doc, i) => (
                <div
                  key={doc.name}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="absolute left-1/2 top-1/2 cursor-pointer"
                  style={{
                    width: "clamp(300px, 42vw, 520px)",
                    transform: "translate(-50%, -50%)",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                  aria-hidden={i !== activeIdx}
                  onClick={() => i !== activeIdx && setActive(i)}
                >
                  {/* ── Card shell ── */}
                  <div
                    className="relative overflow-hidden rounded-[22px]"
                    style={{
                      height: "310px",
                      background: "#0c1b2d",
                      boxShadow: i === activeIdx
                        ? "0 80px 120px -40px rgba(11,27,43,0.75), 0 0 0 1px rgba(255,255,255,0.07) inset"
                        : "0 24px 60px -30px rgba(11,27,43,0.45)",
                      transition: "box-shadow 0.55s ease",
                    }}
                  >
                    {/* Accent top-edge glow */}
                    <div
                      className="pointer-events-none absolute left-0 top-0 h-px w-full"
                      style={{ background: `linear-gradient(90deg, ${doc.accent}70, ${doc.accent}20, transparent)` }}
                    />

                    <div className="flex h-full">
                      {/* LEFT: content */}
                      <div
                        className="relative flex flex-col justify-between overflow-hidden px-6 py-6"
                        style={{
                          width: "57%",
                          background: "linear-gradient(168deg, #112236 0%, #0b1a2c 100%)",
                        }}
                      >
                        {/* Subtle corner glow */}
                        <div
                          className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full"
                          style={{ background: `radial-gradient(circle, ${doc.accent}18, transparent 70%)`, filter: "blur(12px)" }}
                        />

                        <div className="relative">
                          <span
                            className="text-[8.5px] font-semibold uppercase tracking-[0.3em]"
                            style={{ color: doc.accent }}
                          >
                            {doc.specialty}
                          </span>

                          <h3
                            className="mt-2 leading-[1.1] text-white"
                            style={{
                              fontFamily: '"Instrument Serif", "Fraunces", Georgia, serif',
                              fontSize: "clamp(1.35rem, 2vw, 1.7rem)",
                            }}
                          >
                            {doc.name}
                          </h3>

                          <p
                            className="mt-1 text-[10.5px] font-medium"
                            style={{ color: "rgba(255,255,255,0.38)" }}
                          >
                            {doc.creds}
                          </p>

                          <p
                            className="mt-4 text-[11.5px] leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.58)" }}
                          >
                            {doc.bio}
                          </p>
                        </div>

                        <div className="relative">
                          {/* Bottom accent hairline */}
                          <div
                            className="mb-3 h-px"
                            style={{
                              width: "36px",
                              background: `linear-gradient(90deg, ${doc.accent}80, transparent)`,
                            }}
                          />
                          <Link
                            to="/quiz"
                            className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] transition-opacity hover:opacity-70"
                            style={{ color: doc.accent }}
                          >
                            View Profile
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                      </div>

                      {/* RIGHT: photo panel */}
                      <div
                        className="relative flex-1 overflow-hidden"
                        style={{ background: doc.accent }}
                      >
                        {/* Left-edge blend so photo merges into dark panel */}
                        <div
                          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
                          style={{ background: "linear-gradient(90deg, #0c1b2d, transparent)" }}
                        />
                        {/* Bottom fade so photo feels cut-in */}
                        <div
                          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20"
                          style={{ background: `linear-gradient(to top, ${doc.accent}, transparent)` }}
                        />

                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ objectPosition: "top center" }}
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floor shadow / reflection */}
                  <div
                    aria-hidden="true"
                    className="mx-8 h-8 rounded-b-3xl"
                    style={{
                      background: "linear-gradient(to bottom, rgba(11,27,43,0.18), transparent)",
                      filter: "blur(6px)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Right arrow — floats at the right edge of the track */}
            <button
              ref={nextBtnRef}
              onClick={() => setActive(activeIdx + 1)}
              aria-label="Next physician"
              className="absolute right-0 top-[50%] z-30 flex h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(11,27,43,0.1)",
                boxShadow: "0 8px 32px -10px rgba(11,27,43,0.28)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B1B2B" strokeWidth="2.2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {DOCTORS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Physician ${i + 1}`}
                  className="h-1.5 rounded-full"
                  style={{
                    width: i === activeIdx ? "22px" : "6px",
                    background: i === activeIdx ? "#3B6FA0" : "rgba(11,27,43,0.18)",
                    transition: "width 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Zone 3: Stats ───────────────────────────────────────── */}
        <div className="dr2-stats mt-28 grid gap-10 rounded-[28px] p-10 md:grid-cols-[auto_1fr_auto] md:items-center"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(11,27,43,0.06)", boxShadow: "0 30px 80px -40px rgba(11,27,43,0.25)" }}>
          <svg ref={atomSvgRef} width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="6" fill="#3B6FA0" />
            <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#3B6FA0" strokeWidth="1.2" />
            <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#3B6FA0" strokeWidth="1.2" transform="rotate(60 32 32)" />
            <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#3B6FA0" strokeWidth="1.2" transform="rotate(120 32 32)" />
          </svg>

          <div className="grid gap-8 md:grid-cols-4">
            {METRICS.map((m, i) => (
              <div key={m.label}>
                <div className="flex items-baseline gap-1">
                  <span ref={(el) => { metricRefs.current[i] = el; }} className="font-serif text-4xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>0{m.suffix}</span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(11,27,43,0.55)" }}>{m.unit}</span>
                </div>
                <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full" style={{ background: "rgba(11,27,43,0.08)" }}>
                  <span ref={(el) => { barRefs.current[i] = el; }} className="block h-full w-full" style={{ background: "#3B6FA0" }} />
                </div>
                <div className="mt-2 text-xs" style={{ color: "rgba(11,27,43,0.6)" }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="border-l pl-6" style={{ borderColor: "rgba(11,27,43,0.08)" }}>
            <div className="font-serif text-xl leading-tight" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>You first.<br/>Always.</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#3B6FA0" }}>Care Philosophy</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// alias so existing import in index.tsx keeps working
export { ClinicalLeadershipSection as DoctorSection };
