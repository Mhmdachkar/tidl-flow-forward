import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { gsap, ScrollTrigger, Draggable } from "@/lib/gsap";
// ─── step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    label: "Licensed provider",
    title: "Doctor\nReview",
    body: "A licensed physician reads your intake and health history within 24 hours.",
    detail:
      "A board-certified physician licensed in your state evaluates your responses, flags any contraindications, and decides whether treatment is clinically appropriate for you.",
    points: ["Board-certified physicians", "Reviewed within 24 hours", "Message your provider anytime"],
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1100&q=80&fit=crop",
  },
  {
    num: "02",
    label: "Real prescription",
    title: "Receive\nPrescription",
    body: "If clinically appropriate, a personalised prescription is written to your protocol.",
    detail:
      "Your protocol is tailored to your biology and goals. dosing, titration schedule and supporting guidance are written specifically for you, never one-size-fits-all.",
    points: ["Personalised dosing", "Clear titration schedule", "Adjusted as you progress"],
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=1100&q=80&fit=crop",
  },
  {
    num: "03",
    label: "Licensed facility",
    title: "Pharmacy\nFulfillment",
    body: "Your medication is compounded in a licensed, regulated pharmacy to your exact specification.",
    detail:
      "Medication is prepared in a US-licensed, regulated compounding pharmacy with batch testing and quality controls at every stage before it ships to you.",
    points: ["US-licensed pharmacies", "Batch-tested for purity", "Sealed, tamper-evident packaging"],
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&h=1100&q=80&fit=crop",
  },
  {
    num: "04",
    label: "Cold-chain delivery",
    title: "Delivered\nto Your Door",
    body: "Cold-chain shipped directly to your home. Ongoing physician-supervised care included.",
    detail:
      "Temperature-controlled shipping keeps every dose stable in transit. Your care doesn't stop at delivery. ongoing physician supervision and refills are built in.",
    points: ["Cold-chain, tracked shipping", "Discreet to your door", "Ongoing supervision & refills"],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=1100&q=80&fit=crop",
  },
] as const;

// ─── SVG line-art for each step (drawn with stroke-dashoffset) ──────────────
const SHAPES = [
  ["M 100 48 L 100 152", "M 48 100 L 152 100"],
  ["M 100 48 L 155 145 L 45 145 Z"],
  ["M 100 44 L 153 72 L 153 128 L 100 156 L 47 128 L 47 72 Z"],
  ["M 100 38 L 114 80 L 158 80 L 124 104 L 137 146 L 100 122 L 63 146 L 76 104 L 42 80 L 86 80 Z"],
] as const;

const TOTAL = STEPS.length;
const INK = "#161616";
const ACCENT = "#2d4a3e";
const AUTO_INTERVAL_MS = 4500;

function cardWidthForStage(w: number) {
  if (w >= 1280) return Math.min(w * 0.32, 360);
  if (w >= 1024) return Math.min(w * 0.36, 320);
  return Math.min(w * 0.56, 250);
}
export function HowItWorksSection() {
  const { openModal: openQuiz } = useQuizModal();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);

  // continuous carousel progress + nearest active index (kept in refs so the
  // GSAP render loop always reads fresh values without re-binding closures)
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const gapRef = useRef(220);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const autoPausedRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [active, setActive] = useState(0);
  // ── place every card in 3D space relative to the live progress value ──
  const renderCards = useCallback(() => {
    const gap = gapRef.current;
    const prog = progressRef.current;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = i - prog;
      const ad = Math.abs(d);

      const x = d * gap;
      const rotateY = gsap.utils.clamp(-58, 58, -d * 42);
      const z = -ad * 220;
      const scale = gsap.utils.clamp(0.58, 1, 1 - ad * 0.07);      const opacity = ad > 3.1 ? 0 : gsap.utils.clamp(0, 1, 1.25 - ad * 0.34);

      gsap.set(card, {
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex: 100 - Math.round(ad * 10),
        filter: `brightness(${gsap.utils.clamp(0.55, 1, 1 - ad * 0.16)})`,
      });
    });

    const nearest = gsap.utils.clamp(0, TOTAL - 1, Math.round(prog));
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const gap = gapRef.current;
      const target = gsap.utils.clamp(0, TOTAL - 1, index);
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(proxyRef.current, {
        x: -target * gap,
        duration: 0.85,
        ease: "expo.out",
        onUpdate: () => {
          progressRef.current = -gsap.getProperty(proxyRef.current, "x") / gapRef.current;
          renderCards();
        },
      });
    },
    [renderCards],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const proxy = proxyRef.current;
    if (!section || !stage || !proxy) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const w = stage.clientWidth;
      const cardW = cardWidthForStage(w);
      gapRef.current = Math.max(140, cardW * 0.72);
    };
    const ctx = gsap.context(() => {
      measure();
      gsap.set(proxy, { x: 0 });
      progressRef.current = 0;
      renderCards();

      // draw the line-art inside every card
      cardRefs.current.forEach((card) => {
        card?.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });
      });

      const drawActive = (index: number) => {
        const card = cardRefs.current[index];
        card?.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path, pi) => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
            delay: pi * 0.06,
          });
        });
      };

      // ── entrance: header + carousel rise in on scroll ──────────────
      const head = section.querySelectorAll<HTMLElement>(".hiw-head");
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!reduced) {
        gsap.set(head, { opacity: 0, y: 26 });
        gsap.set(cards, { transformOrigin: "50% 60%" });

        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 72%" } })
          .to(head, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" })
          .from(
            cards,
            {
              yPercent: 18,
              opacity: 0,
              duration: 0.8,
              stagger: 0.05,
              ease: "expo.out",
              onComplete: () => drawActive(activeRef.current),
            },
            0.15,
          );
      } else {
        drawActive(0);
      }

      // ── draggable coverflow ────────────────────────────────────────
      const dragUnit = () => gapRef.current;
      const [drag] = Draggable.create(proxy, {
        type: "x",
        trigger: stage,
        inertia: !reduced,
        edgeResistance: 0.82,
        dragResistance: 0.06,
        bounds: { minX: -(TOTAL - 1) * gapRef.current, maxX: 0 },
        snap: (value: number) => Math.round(value / dragUnit()) * dragUnit(),
        onPress() {
          tweenRef.current?.kill();
          autoPausedRef.current = true;
        },        onDrag() {
          progressRef.current = -this.x / gapRef.current;
          renderCards();
        },
        onThrowUpdate() {
          progressRef.current = -this.x / gapRef.current;
          renderCards();
        },
        onThrowComplete() {
          drawActive(activeRef.current);
          window.setTimeout(() => { autoPausedRef.current = false; }, 2000);
        },
        onDragEnd() {
          if (!this.tween) {
            drawActive(activeRef.current);
            window.setTimeout(() => { autoPausedRef.current = false; }, 2000);
          }
        },      });

      // recompute spacing + positions on resize
      const onResize = () => {
        const prevIndex = activeRef.current;
        measure();
        gsap.set(proxy, { x: -prevIndex * gapRef.current });
        progressRef.current = prevIndex;
        drag.applyBounds({ minX: -(TOTAL - 1) * gapRef.current, maxX: 0 });
        renderCards();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, section);

    return () => ctx.revert();
  }, [renderCards]);

  // auto-advance carousel
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    autoTimerRef.current = window.setInterval(() => {
      if (autoPausedRef.current) return;
      const next = (activeRef.current + 1) % TOTAL;
      goTo(next);
    }, AUTO_INTERVAL_MS);

    return () => {
      if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
    };
  }, [goTo]);

  // redraw line-art + reset inactive cards when step changes
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.querySelectorAll<SVGPathElement>(".hiw-draw").forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        if (i === active) {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
            delay: Array.from(card.querySelectorAll(".hiw-draw")).indexOf(path) * 0.06,
          });
        }
      });
    });
  }, [active]);
  const step = STEPS[active];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ background: "#f6f3ec", color: INK }}
    >
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 pt-12 sm:px-8 lg:pt-16">
        {/* ── header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="hiw-head mb-4 flex items-center gap-4">
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.32em", color: ACCENT }}
              >
                §04. How it works
              </span>
              <span className="h-px w-16" style={{ background: "rgba(22,22,22,0.25)" }} />
            </div>
            <h2
              className="hiw-head leading-[0.95]"
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: "clamp(30px, 4.4vw, 58px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
              }}
            >
              Four steps,{" "}
              <span className="italic" style={{ color: ACCENT }}>
                fully guided.
              </span>
            </h2>
          </div>

          <p
            className="hiw-head max-w-[300px] text-[14px] leading-[1.55]"
            style={{ color: "rgba(22,22,22,0.62)" }}
          >
            From physician review to cold-chain delivery, the journey runs on its own.
            Hover any card for the detail.
          </p>        </div>
      </div>

      {/* ── coverflow carousel ───────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative z-10 mx-auto mt-8 flex h-[330px] w-full max-w-[1240px] cursor-grab touch-pan-y items-center justify-center active:cursor-grabbing sm:h-[370px] lg:mt-10 lg:h-[500px] lg:cursor-default xl:h-[540px]"
        style={{ perspective: "1500px" }}
        onMouseEnter={() => { autoPausedRef.current = true; }}
        onMouseLeave={() => { autoPausedRef.current = false; }}
      >        {/* hidden drag proxy — single source of truth for the carousel position */}
        <div ref={proxyRef} className="pointer-events-none absolute h-0 w-0 opacity-0" aria-hidden />

        {STEPS.map((s, i) => (
          <div
            key={s.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="hiw-card absolute flex w-[min(56vw,250px)] flex-col items-center lg:w-[min(36vw,320px)] xl:w-[min(32vw,360px)]"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}            onClick={() => {
              if (i !== activeRef.current) goTo(i);
            }}
          >
            <div
              className="group relative aspect-[3/4] w-full select-none overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(155deg, #2a3c33 0%, #161616 100%)",
                border: "1px solid rgba(22,22,22,0.1)",
                boxShadow:
                  "0 36px 70px -34px rgba(22,22,22,0.5), 0 10px 24px -14px rgba(22,22,22,0.3)",
              }}
            >
              {/* photo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              {/* base legibility gradient */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(11,16,13,0.55) 0%, rgba(11,16,13,0.05) 32%, rgba(11,16,13,0.78) 100%)",
                }}
              />

              {/* corner registration marks */}
              {(
                [
                  "left-3.5 top-3.5 border-l border-t",
                  "right-3.5 top-3.5 border-r border-t",
                  "bottom-3.5 left-3.5 border-b border-l",
                  "bottom-3.5 right-3.5 border-b border-r",
                ] as const
              ).map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={`absolute h-2.5 w-2.5 ${pos}`}
                  style={{ borderColor: "rgba(255,255,255,0.45)" }}
                />
              ))}

              {/* step index */}
              <span
                className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
              >
                Step {s.num}
              </span>
              <span
                className="absolute right-4 top-4 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {s.num} / {String(TOTAL).padStart(2, "0")}
              </span>

              {/* line-art icon */}
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                <svg
                  className="h-20 w-20 sm:h-24 sm:w-24"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="rgba(255,255,255,0.92)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
                >
                  {SHAPES[i].map((d, pi) => (
                    <path key={pi} d={d} className="hiw-draw" />
                  ))}
                </svg>
              </div>

              {/* label (hidden on hover, replaced by detail) */}
              <span
                className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] transition-opacity duration-300 group-hover:opacity-0"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {s.label}
              </span>

              {/* hover detail overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(11,16,13,0.25) 0%, rgba(11,16,13,0.82) 55%, rgba(11,16,13,0.95) 100%)",
                  backdropFilter: "blur(1px)",
                }}
              >
                <span
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#9ec5ad" }}
                >
                  {s.label}
                </span>
                <p className="mb-3 text-[12.5px] leading-[1.5] text-white/90 sm:text-[13px]">
                  {s.detail}
                </p>
                <ul className="space-y-1.5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[11px] text-white/75">
                      <svg className="mt-[3px] h-3 w-3 flex-none" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6.2l2.2 2.2L9.5 3.6" stroke="#9ec5ad" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── synced detail + progress ───────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[680px] px-5 pb-12 pt-5 text-center sm:px-8 lg:pb-16">
        <div ref={detailRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: ACCENT }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.35 }}
              >
                Step {step.num} · {step.label}
              </motion.p>

              <motion.h3
                className="mt-3 font-display leading-[1.05] tracking-[-0.02em]"
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: "clamp(22px, 3vw, 32px)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
              >
                {step.title.split("\n").map((line, li) => (
                  <span key={li} className="block">
                    {li === 1 ? (
                      <span className="italic" style={{ color: ACCENT }}>{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </motion.h3>

              <motion.p
                className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.55] sm:text-[15px]"
                style={{ color: "rgba(22,22,22,0.7)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.4 }}
              >
                {step.body}
              </motion.p>

              {active === TOTAL - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                >
                  <button
                    type="button"
                    onClick={() => openQuiz()}
                    className="mt-5 inline-flex items-center gap-2.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                    style={{ background: ACCENT }}
                  >
                    Start your assessment
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* progress dots — visual only, auto-advances */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {STEPS.map((s, i) => (
            <motion.span
              key={s.num}
              aria-hidden={i !== active}
              aria-label={i === active ? `Step ${s.num} of ${TOTAL}` : undefined}
              className="block h-[6px] rounded-full"
              animate={{
                width: i === active ? 32 : 6,
                background: i === active ? ACCENT : "rgba(22,22,22,0.2)",
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          ))}
        </div>

      </div>    </section>
  );
}
