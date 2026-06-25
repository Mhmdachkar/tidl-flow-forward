import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";

import assessmentImg from "@/assets/assessment-hero.png";
import physicianImg from "@/assets/ChatGPT Image Jun 24, 2026, 11_45_01 AM.png";
import prescriptionImg from "@/assets/tidl-prepared.png";
import pharmacyImg from "@/assets/pharmacy-fulfillment.png";
import deliveryImg from "@/assets/pharmacy-coldchain.png";
import hillPharmacyImg from "@/assets/pharmacy .jpg";

const EASE = [0.16, 1, 0.3, 1] as const;
const GPU = { force3D: true } as const;

const STEPS = [
  {
    num: "01",
    title: "Complete your assessment",
    short: "Assessment",
    body: "Short clinical intake from home — about 10 minutes.",
    trust: "HIPAA-aligned",
    image: assessmentImg,
  },
  {
    num: "02",
    title: "Physician review",
    short: "Physician",
    body: "A licensed doctor reviews your case within 24 hours.",
    trust: "Board-certified",
    image: physicianImg,
  },
  {
    num: "03",
    title: "Prescription if appropriate",
    short: "Prescription",
    body: "Prescribed only when medically suitable — never guaranteed.",
    trust: "Physician-led",
    image: prescriptionImg,
  },
  {
    num: "04",
    title: "Pharmacy preparation",
    short: "Pharmacy",
    body: "Licensed partners prepare your exact protocol.",
    trust: "Licensed Rx",
    image: pharmacyImg,
  },
  {
    num: "05",
    title: "Delivered to your door",
    short: "Delivery",
    body: "Cold-chain shipping and discreet delivery to your home.",
    trust: "Tracked care",
    image: deliveryImg,
  },
] as const;

const ARC = [
  { x: 11, y: 48 },
  { x: 28, y: 34 },
  { x: 50, y: 24 },
  { x: 72, y: 34 },
  { x: 89, y: 48 },
] as const;

const ARC_PATH = `M ${ARC[0].x} ${ARC[0].y} Q 19.5 40 ${ARC[1].x} ${ARC[1].y} T ${ARC[2].x} ${ARC[2].y} T ${ARC[3].x} ${ARC[3].y} T ${ARC[4].x} ${ARC[4].y}`;

const HEADLINE_BEFORE = "Your path from";
const HEADLINE_AFTER = "physician to pharmacy to you";

function HeadlineWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className={`care-journey-headline-word inline-block ${className ?? ""}`}>{word}</span>
        </span>
      ))}
    </>
  );
}

export function CareJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hillRef = useRef<HTMLDivElement>(null);
  const hillIconRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const arcDotRef = useRef<SVGCircleElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const detailVisualRef = useRef<HTMLDivElement>(null);
  const detailImgRef = useRef<HTMLImageElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nodeInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailFloatRef = useRef<HTMLDivElement>(null);
  const floatTweens = useRef<gsap.core.Tween[]>([]);
  const arcTravelTween = useRef<gsap.core.Tween | null>(null);

  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const hill = hillRef.current;
    const hillIcon = hillIconRef.current;
    const arc = arcRef.current;
    const arcDot = arcDotRef.current;
    const head = headRef.current;
    const strip = stripRef.current;
    const detailVisual = detailVisualRef.current;
    const detailImg = detailImgRef.current;
    const detailFloat = detailFloatRef.current;
    if (
      !section ||
      !panel ||
      !hill ||
      !hillIcon ||
      !arc ||
      !arcDot ||
      !head ||
      !strip ||
      !detailVisual ||
      !detailImg ||
      !detailFloat
    ) {
      return;
    }

    const nodeInners = nodeInnerRefs.current.filter(Boolean) as HTMLDivElement[];
    const nodeImgs = nodeImgRefs.current.filter(Boolean) as HTMLDivElement[];
    const headlineWords = head.querySelectorAll<HTMLElement>(".care-journey-headline-word");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || reduced) {
      gsap.set([head, hill, hillIcon, ...nodeInners, ...nodeImgs, strip, arc, detailVisual, detailImg, detailFloat], {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
      });
      gsap.set(arc, { strokeDashoffset: 0 });
      gsap.set(arcDot, { opacity: 1 });
      gsap.set(headlineWords, { yPercent: 0, opacity: 1, rotateX: 0 });
      return;
    }

    const arcLen = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: arcLen, strokeDashoffset: arcLen });
    gsap.set(arcDot, { opacity: 0 });
    gsap.set(headlineWords, { yPercent: 110, opacity: 0, rotateX: -52, transformOrigin: "0% 100%" });
    gsap.set(head, { opacity: 1, y: 0 });
    gsap.set(hill, { opacity: 0, scale: 0.82, y: 40, ...GPU });
    gsap.set(hillIcon, { scale: 0, rotation: -30, ...GPU });
    gsap.set(nodeInners, { opacity: 0, scale: 0.5, y: 30, ...GPU });
    gsap.set(nodeImgs, { scale: 1.35, clipPath: "circle(0% at 50% 50%)", ...GPU });
    gsap.set(strip, { opacity: 0, y: 20 });
    gsap.set(detailVisual, { opacity: 0, x: 40, scale: 0.92, ...GPU });
    gsap.set(detailImg, { scale: 1.12, ...GPU });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 82%",
          once: true,
        },
      });

      tl.to(
        headlineWords,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.045,
          ease: "power4.out",
          ...GPU,
        },
        0,
      );
      tl.to(hill, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out", ...GPU }, 0.15);
      tl.to(
        hillIcon,
        { scale: 1, rotation: 0, duration: 0.75, ease: "back.out(2.2)", ...GPU },
        0.38,
      );
      tl.to(arc, { strokeDashoffset: 0, duration: 1.35, ease: "power2.inOut" }, 0.28);
      tl.to(arcDot, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.55);
      tl.to(
        nodeInners,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.11,
          ease: "back.out(2)",
          ...GPU,
        },
        0.48,
      );
      tl.to(
        nodeImgs,
        {
          clipPath: "circle(50% at 50% 50%)",
          scale: 1,
          duration: 0.85,
          stagger: 0.11,
          ease: "expo.out",
          ...GPU,
        },
        0.52,
      );
      tl.to(
        detailVisual,
        { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "expo.out", ...GPU },
        0.72,
      );
      tl.to(detailImg, { scale: 1, duration: 1.2, ease: "power2.out", ...GPU }, 0.78);
      tl.to(strip, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.95);

      const travel = { progress: 0 };
      arcTravelTween.current = gsap.to(travel, {
        progress: 1,
        duration: 5.5,
        repeat: -1,
        ease: "none",
        onUpdate: () => {
          const point = arc.getPointAtLength(travel.progress * arcLen);
          arcDot.setAttribute("cx", String(point.x));
          arcDot.setAttribute("cy", String(point.y));
        },
      });

      nodeInners.forEach((inner, i) => {
        const tween = gsap.to(inner, {
          y: "+=7",
          duration: 2.4 + i * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });
        floatTweens.current.push(tween);
      });

      gsap.to(hillIcon, {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(detailFloat, {
        y: -5,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    }, section);

    return () => {
      arcTravelTween.current?.kill();
      arcTravelTween.current = null;
      floatTweens.current.forEach((t) => t.kill());
      floatTweens.current = [];
      ctx.revert();
    };
  }, [reduced]);

  useEffect(() => {
    const detailVisual = detailVisualRef.current;
    const detailImg = detailImgRef.current;
    const nodeInner = nodeInnerRefs.current[active];
    if (!detailVisual || !detailImg || !nodeInner) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || reduced) return;

    gsap.fromTo(
      detailVisual,
      { opacity: 0.4, x: 28, rotateY: -12, scale: 0.94, transformOrigin: "center center", ...GPU },
      { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.65, ease: "expo.out", ...GPU },
    );
    gsap.fromTo(
      detailImg,
      { scale: 1.18, filter: "blur(6px)" },
      { scale: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
    );
    gsap.fromTo(
      nodeInner,
      { scale: 1 },
      { scale: 1.08, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1, ...GPU },
    );
  }, [active, reduced]);

  const activeStep = STEPS[active];

  return (
    <section
      ref={sectionRef}
      id="care-journey"
      data-nav-zone="care-journey"
      className="care-journey relative px-2 py-2 md:px-3 md:py-3"
      aria-label="How TIDL works — your care journey"
    >
      <div
        ref={panelRef}
        className="care-journey-panel overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
      >
        <style>{`
          .care-journey-panel {
            background: #ffffff;
            color: #231f20;
            box-shadow: 0 20px 56px rgba(35, 31, 32, 0.07);
          }
          .care-journey-inner {
            padding: clamp(2rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)
              clamp(2rem, 5vw, 3rem);
          }
          .care-journey-head {
            text-align: center;
            max-width: 36rem;
            margin-inline: auto;
          }
          .care-journey-headline-word {
            will-change: transform, opacity;
          }
          .care-journey-stage {
            position: relative;
            margin-top: clamp(2rem, 5vw, 3rem);
            min-height: clamp(22rem, 52vw, 28rem);
          }
          .care-journey-arc-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: visible;
          }
          .care-journey-arc-glow {
            filter: drop-shadow(0 0 6px rgba(243, 195, 0, 0.85));
          }
          .care-journey-hill {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: min(72%, 520px);
            height: min(38%, 200px);
            transform: translateX(-50%);
            border-radius: 520px 520px 0 0;
            background: linear-gradient(180deg, #fff 0%, rgba(243, 195, 0, 0.07) 100%);
            box-shadow: 0 -8px 40px rgba(243, 195, 0, 0.12), inset 0 2px 0 rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(35, 31, 32, 0.06);
            border-bottom: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: clamp(1.5rem, 4vw, 2.25rem);
            will-change: transform, opacity;
          }
          .care-journey-hill-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: clamp(3.5rem, 9vw, 4.75rem);
            height: clamp(3.5rem, 9vw, 4.75rem);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid rgba(243, 195, 0, 0.35);
            overflow: hidden;
            will-change: transform;
          }
          .care-journey-hill-icon img {
            width: 72%;
            height: 72%;
            object-fit: contain;
          }
          .care-journey-hill-title {
            margin: 0.65rem 0 0;
            font-family: var(--font-display);
            font-size: clamp(1.15rem, 2.8vw, 1.5rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            color: rgba(35, 31, 32, 0.82);
          }
          .care-journey-hill-sub {
            margin: 0.25rem 0 0;
            font-family: var(--font-sans);
            font-size: clamp(0.75rem, 1.6vw, 0.8125rem);
            color: rgba(35, 31, 32, 0.5);
          }
          .care-journey-node {
            position: absolute;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            width: min(28vw, 9.5rem);
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            text-align: center;
          }
          .care-journey-node-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            will-change: transform, opacity;
          }
          .care-journey-node-ring {
            position: relative;
            width: clamp(3.5rem, 9vw, 4.85rem);
            height: clamp(3.5rem, 9vw, 4.85rem);
            border-radius: 999px;
            background: #fff;
            border: 2.5px solid rgba(243, 195, 0, 0.55);
            box-shadow: 0 0 0 4px rgba(243, 195, 0, 0.12), 0 10px 28px rgba(35, 31, 32, 0.08);
            overflow: hidden;
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .care-journey-node:hover .care-journey-node-ring {
            transform: scale(1.08);
          }
          .care-journey-node:active .care-journey-node-ring {
            transform: scale(0.96);
          }
          .care-journey-node.is-active .care-journey-node-ring {
            border-color: #f3c300;
            box-shadow: 0 0 0 8px rgba(243, 195, 0, 0.22), 0 16px 36px rgba(35, 31, 32, 0.12);
          }
          .care-journey-node-photo {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: inherit;
          }
          .care-journey-node-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .care-journey-node-num {
            position: absolute;
            top: -0.15rem;
            right: -0.15rem;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 999px;
            background: #f3c300;
            color: #231f20;
            font-family: var(--font-sans);
            font-size: 0.5625rem;
            font-weight: 800;
            box-shadow: 0 4px 10px rgba(35, 31, 32, 0.15);
          }
          .care-journey-node-connector {
            width: 2px;
            height: clamp(0.75rem, 2vw, 1.1rem);
            margin-top: 0.35rem;
            background: linear-gradient(180deg, rgba(243, 195, 0, 0.7), rgba(35, 31, 32, 0.12));
            border-radius: 999px;
          }
          .care-journey-node.is-active .care-journey-node-connector {
            height: clamp(1rem, 2.5vw, 1.35rem);
            background: linear-gradient(180deg, #f3c300, rgba(35, 31, 32, 0.15));
          }
          .care-journey-node-label {
            margin: 0.4rem 0 0;
            font-family: var(--font-display);
            font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
            font-weight: 700;
            line-height: 1.2;
            color: #231f20;
          }
          .care-journey-detail {
            margin-top: clamp(1.25rem, 3vw, 1.75rem);
            min-height: 8rem;
          }
          .care-journey-detail-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            border-radius: 1.15rem;
            border: 1px solid rgba(35, 31, 32, 0.07);
            background: linear-gradient(135deg, rgba(243, 195, 0, 0.08) 0%, #fff 55%);
            padding: 1rem 1.15rem;
            box-shadow: 0 12px 36px rgba(35, 31, 32, 0.06);
            overflow: hidden;
          }
          @media (min-width: 640px) {
            .care-journey-detail-card {
              flex-direction: row;
              align-items: center;
              gap: 1.25rem;
            }
          }
          .care-journey-detail-copy {
            flex: 1;
            min-width: 0;
          }
          .care-journey-detail-visual {
            position: relative;
            flex-shrink: 0;
            width: 100%;
            height: clamp(9rem, 28vw, 11.5rem);
            border-radius: 0.95rem;
            overflow: hidden;
            box-shadow: 0 14px 32px rgba(35, 31, 32, 0.12);
            will-change: transform, opacity;
          }
          @media (min-width: 640px) {
            .care-journey-detail-visual {
              width: clamp(9.5rem, 22vw, 12.5rem);
              height: clamp(9.5rem, 22vw, 12.5rem);
            }
          }
          .care-journey-detail-visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            will-change: transform, filter;
          }
          .care-journey-detail-visual-float {
            width: 100%;
            height: 100%;
            will-change: transform;
          }
          .care-journey-detail-visual::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              145deg,
              rgba(243, 195, 0, 0.18) 0%,
              transparent 45%,
              rgba(35, 31, 32, 0.08) 100%
            );
            pointer-events: none;
          }
          .care-journey-detail-num {
            margin: 0 0 0.15rem;
            font-family: var(--font-sans);
            font-size: 0.625rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #f3c300;
          }
          .care-journey-detail-title {
            margin: 0;
            font-family: var(--font-display);
            font-size: 1.05rem;
            font-weight: 700;
            color: #231f20;
          }
          .care-journey-detail-body {
            margin: 0.35rem 0 0;
            font-family: var(--font-sans);
            font-size: 0.8125rem;
            line-height: 1.5;
            color: rgba(35, 31, 32, 0.72);
          }
          .care-journey-strip {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.45rem 0.65rem;
            margin-top: clamp(1.25rem, 3vw, 1.75rem);
            padding-top: clamp(1rem, 2.5vw, 1.5rem);
            border-top: 1px solid rgba(35, 31, 32, 0.07);
          }
          .care-journey-strip span {
            font-family: var(--font-sans);
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: rgba(35, 31, 32, 0.55);
            background: rgba(226, 226, 226, 0.5);
            border-radius: 999px;
            padding: 0.35rem 0.75rem;
          }
          @media (max-width: 640px) {
            .care-journey-node {
              width: min(32vw, 6.5rem);
            }
          }
        `}</style>

        <div className="care-journey-inner">
          <header ref={headRef} className="care-journey-head">
            <motion.p
              className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "rgba(35,31,32,0.5)", fontFamily: "var(--font-sans)" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              How TIDL works
            </motion.p>
            <h2
              className="leading-[1.08] tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.35rem)" }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#231f20" }}>
                <HeadlineWords text={HEADLINE_BEFORE} />
              </span>{" "}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#f3c300",
                }}
              >
                <HeadlineWords text={HEADLINE_AFTER} />
              </span>
            </h2>
            <p
              className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed"
              style={{ color: "rgba(35,31,32,0.72)", fontFamily: "var(--font-sans)" }}
            >
              Tap a step on the arc — each one is a verified layer of real medical care.
            </p>
          </header>

          <div className="care-journey-stage">
            <svg
              className="care-journey-arc-svg"
              viewBox="0 0 100 55"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                ref={arcRef}
                d={ARC_PATH}
                fill="none"
                stroke="rgba(243,195,0,0.45)"
                strokeWidth="0.6"
                strokeLinecap="round"
              />
              <circle
                ref={arcDotRef}
                className="care-journey-arc-glow"
                r="1.1"
                fill="#f3c300"
                opacity="0"
              />
            </svg>

            {STEPS.map((step, i) => {
              const pos = ARC[i];
              const isActive = active === i;
              return (
                <button
                  key={step.num}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  type="button"
                  className={`care-journey-node${isActive ? " is-active" : ""}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`${step.title}. ${step.body}`}
                >
                  <div
                    ref={(el) => {
                      nodeInnerRefs.current[i] = el;
                    }}
                    className="care-journey-node-inner"
                  >
                    <motion.div
                      className="care-journey-node-ring"
                      animate={
                        isActive && !reduced
                          ? {
                              boxShadow: [
                                "0 0 0 8px rgba(243,195,0,0.22), 0 16px 36px rgba(35,31,32,0.12)",
                                "0 0 0 12px rgba(243,195,0,0.14), 0 16px 36px rgba(35,31,32,0.12)",
                                "0 0 0 8px rgba(243,195,0,0.22), 0 16px 36px rgba(35,31,32,0.12)",
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="care-journey-node-num" aria-hidden>
                        {step.num}
                      </span>
                      <div
                        ref={(el) => {
                          nodeImgRefs.current[i] = el;
                        }}
                        className="care-journey-node-photo"
                      >
                        <img src={step.image} alt="" loading="lazy" decoding="async" />
                      </div>
                    </motion.div>
                    <div className="care-journey-node-connector" aria-hidden />
                    <span className="care-journey-node-label">{step.short}</span>
                  </div>
                </button>
              );
            })}

            <div ref={hillRef} className="care-journey-hill">
              <div ref={hillIconRef} className="care-journey-hill-icon" aria-hidden>
                <img src={hillPharmacyImg} alt="" />
              </div>
              <p className="care-journey-hill-title">Physician-guided care</p>
              <p className="care-journey-hill-sub">
                Not a supplement order — a real medical pathway
              </p>
            </div>
          </div>

          <div className="care-journey-detail">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.num}
                className="care-journey-detail-card"
                initial={reduced ? false : { opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="care-journey-detail-copy">
                  <p className="care-journey-detail-num">
                    Step {activeStep.num} · {activeStep.trust}
                  </p>
                  <h3 className="care-journey-detail-title">{activeStep.title}</h3>
                  <p className="care-journey-detail-body">{activeStep.body}</p>
                </div>
                <div ref={detailVisualRef} className="care-journey-detail-visual">
                  <div ref={detailFloatRef} className="care-journey-detail-visual-float">
                    <img
                      ref={detailImgRef}
                      key={activeStep.image}
                      src={activeStep.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div ref={stripRef} className="care-journey-strip">
            {["Licensed physicians", "Rx required", "Licensed pharmacies", "Cold-chain delivery"].map(
              (label, i) => (
                <motion.span
                  key={label}
                  whileHover={reduced ? undefined : { scale: 1.06 }}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4 + i * 0.06,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  {label}
                </motion.span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
