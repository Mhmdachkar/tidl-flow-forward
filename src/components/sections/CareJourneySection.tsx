import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

import assessmentImg from "@/assets/ChatGPT Image Jun 23, 2026, 08_42_57 PM.png";
import physicianImg from "@/assets/ChatGPT Image Jun 24, 2026, 11_45_01 AM.png";
import prescriptionImg from "@/assets/tidl-prepared.png";
import pharmacyImg from "@/assets/pharmacy-fulfillment.png";
import deliveryImg from "@/assets/pharmacy-coldchain.png";
import hillPharmacyImg from "@/assets/pharmacy .jpg";

const GPU = { force3D: true } as const;
const SCROLLER = document.documentElement;

const TRUST_STRIP = [
  "Licensed physicians",
  "Rx required",
  "Licensed pharmacies",
  "Cold-chain delivery",
] as const;

const STEPS = [
  {
    num: "01",
    title: "Complete your assessment",
    short: "Assessment",
    body: "Short clinical intake from home, about 10 minutes.",
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
    body: "Prescribed only when medically suitable, never guaranteed.",
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

function DetailKnockoutChars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={`${char}-${i}`} className="cj-detail-char-wrap inline-block overflow-hidden align-bottom">
          <span className="cj-detail-char inline-block">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </>
  );
}

function DetailBodyWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pr-[0.2em]">
          <span className="cj-detail-word inline-block">{word}</span>
        </span>
      ))}
    </>
  );
}

export function CareJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const arcGlowRef = useRef<SVGPathElement>(null);
  const detailWrapRef = useRef<HTMLDivElement>(null);
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
  const detailCardRef = useRef<HTMLDivElement>(null);
  const detailBeamRef = useRef<HTMLDivElement>(null);
  const detailProgressRef = useRef<HTMLDivElement>(null);
  const detailWatermarkRef = useRef<HTMLSpanElement>(null);
  const detailEyebrowRef = useRef<HTMLParagraphElement>(null);
  const detailNumDisplayRef = useRef<HTMLParagraphElement>(null);
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const detailBodyRef = useRef<HTMLParagraphElement>(null);
  const detailTrustRef = useRef<HTMLSpanElement>(null);
  const detailEnterRef = useRef(true);
  const stepPickedRef = useRef(false);
  const floatTweens = useRef<gsap.core.Tween[]>([]);
  const arcTravelTween = useRef<gsap.core.Tween | null>(null);

  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const glow = glowRef.current;
    const grid = gridRef.current;
    const eyebrow = eyebrowRef.current;
    const sub = subRef.current;
    const stageWrap = stageWrapRef.current;
    const hill = hillRef.current;
    const hillIcon = hillIconRef.current;
    const arc = arcRef.current;
    const arcGlow = arcGlowRef.current;
    const arcDot = arcDotRef.current;
    const head = headRef.current;
    const strip = stripRef.current;
    const detailWrap = detailWrapRef.current;
    const detailCard = detailCardRef.current;
    const detailVisual = detailVisualRef.current;
    const detailImg = detailImgRef.current;
    const detailFloat = detailFloatRef.current;
    if (
      !section ||
      !panel ||
      !glow ||
      !grid ||
      !eyebrow ||
      !sub ||
      !stageWrap ||
      !hill ||
      !hillIcon ||
      !arc ||
      !arcGlow ||
      !arcDot ||
      !head ||
      !strip ||
      !detailWrap ||
      !detailCard ||
      !detailVisual ||
      !detailImg ||
      !detailFloat
    ) {
      return;
    }

    const nodeInners = nodeInnerRefs.current.filter(Boolean) as HTMLDivElement[];
    const nodeImgs = nodeImgRefs.current.filter(Boolean) as HTMLDivElement[];
    const headlineWords = head.querySelectorAll<HTMLElement>(".care-journey-headline-word");
    const stripPills = strip.querySelectorAll<HTMLElement>(".care-journey-strip-pill");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startArcTravel = () => {
      if (stepPickedRef.current || arcTravelTween.current) return;
      const arcLen = arc.getTotalLength();
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
    };

    if (prefersReduced || reduced) {
      gsap.set(
        [glow, grid, eyebrow, sub, head, hill, hillIcon, stageWrap, detailWrap, detailCard, ...nodeInners, ...nodeImgs, strip, arc, arcGlow, detailVisual, detailImg, detailFloat],
        { clearProps: "all", opacity: 1, y: 0, scale: 1, filter: "none", clipPath: "inset(0% 0% 0% 0%)" },
      );
      gsap.set(arc, { strokeDashoffset: 0 });
      gsap.set(arcGlow, { strokeDashoffset: 0, opacity: 0.35 });
      gsap.set(arcDot, { opacity: 1 });
      gsap.set(headlineWords, { yPercent: 0, opacity: 1, rotateX: 0 });
      gsap.set(stripPills, { opacity: 1, y: 0, scale: 1 });
      startArcTravel();
      return;
    }

    const arcLen = arc.getTotalLength();
    gsap.set(glow, { opacity: 0, scale: 0.75 });
    gsap.set(grid, { opacity: 0 });
    gsap.set(eyebrow, { opacity: 0, y: 18, filter: "blur(8px)", letterSpacing: "0.32em" });
    gsap.set(headlineWords, { yPercent: 115, opacity: 0, rotateX: -48, transformOrigin: "50% 100%" });
    gsap.set(sub, { opacity: 0, y: 22, filter: "blur(8px)" });
    gsap.set(stageWrap, { opacity: 0, y: 48, scale: 0.94, rotateX: 8, transformPerspective: 1200, transformOrigin: "50% 80%", ...GPU });
    gsap.set(arc, { strokeDasharray: arcLen, strokeDashoffset: arcLen });
    gsap.set(arcGlow, { strokeDasharray: arcLen, strokeDashoffset: arcLen, opacity: 0 });
    gsap.set(arcDot, { opacity: 0 });
    gsap.set(hill, { opacity: 0, scale: 0.78, y: 56, ...GPU });
    gsap.set(hillIcon, { scale: 0, rotation: -36, ...GPU });
    gsap.set(nodeInners, { opacity: 0, scale: 0.42, y: 36, ...GPU });
    gsap.set(nodeImgs, { scale: 1.4, clipPath: "circle(0% at 50% 50%)", ...GPU });
    gsap.set(detailWrap, { opacity: 0, y: 32, ...GPU });
    gsap.set(detailVisual, { opacity: 0, x: 48, scale: 0.9, rotateY: -12, ...GPU });
    gsap.set(detailImg, { scale: 1.18, ...GPU });
    gsap.set(strip, { opacity: 0, y: 24 });
    gsap.set(stripPills, { opacity: 0, y: 16, scale: 0.9 });

    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: "top 88%",
          end: "top 22%",
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.92) startArcTravel();
          },
          onLeave: startArcTravel,
          onEnterBack: () => {
            if (!stepPickedRef.current) {
              arcTravelTween.current?.kill();
              arcTravelTween.current = null;
            }
          },
        },
      });

      entrance
        .to(glow, { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" }, 0)
        .to(grid, { opacity: 0.55, duration: 0.35 }, 0.04)
        .to(
          eyebrow,
          { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.18em", duration: 0.22 },
          0.06,
        )
        .to(
          headlineWords,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.32,
            stagger: 0.04,
            ease: "expo.out",
            ...GPU,
          },
          0.12,
        )
        .to(sub, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.24 }, 0.28)
        .to(
          stageWrap,
          { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.42, ease: "expo.out", ...GPU },
          0.22,
        )
        .to(arc, { strokeDashoffset: 0, duration: 0.48, ease: "power2.inOut" }, 0.3)
        .to(arcGlow, { strokeDashoffset: 0, opacity: 0.42, duration: 0.5, ease: "power2.inOut" }, 0.3)
        .to(arcDot, { opacity: 1, duration: 0.18, ease: "back.out(3)" }, 0.52)
        .to(hill, { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "power3.out", ...GPU }, 0.34)
        .to(
          hillIcon,
          { scale: 1, rotation: 0, duration: 0.28, ease: "back.out(2.4)", ...GPU },
          0.44,
        )
        .to(
          nodeInners,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.06,
            ease: "back.out(1.8)",
            ...GPU,
          },
          0.46,
        )
        .to(
          nodeImgs,
          {
            clipPath: "circle(50% at 50% 50%)",
            scale: 1,
            duration: 0.34,
            stagger: 0.06,
            ease: "expo.out",
            ...GPU,
          },
          0.5,
        )
        .to(detailWrap, { opacity: 1, y: 0, duration: 0.3, ...GPU }, 0.62)
        .to(strip, { opacity: 1, y: 0, duration: 0.22 }, 0.72)
        .to(
          stripPills,
          { opacity: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.04, ease: "back.out(2)" },
          0.74,
        );

      gsap.to(stageWrap, {
        y: -24,
        scale: 0.985,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(glow, {
        y: -40,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
          invalidateOnRefresh: true,
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
    const card = detailCardRef.current;
    const beam = detailBeamRef.current;
    const progress = detailProgressRef.current;
    const watermark = detailWatermarkRef.current;
    const eyebrow = detailEyebrowRef.current;
    const numDisplay = detailNumDisplayRef.current;
    const title = detailTitleRef.current;
    const body = detailBodyRef.current;
    const trust = detailTrustRef.current;
    const visual = detailVisualRef.current;
    const img = detailImgRef.current;
    const nodeInner = nodeInnerRefs.current[active];
    const arc = arcRef.current;
    const arcDot = arcDotRef.current;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      prefersReduced ||
      reduced ||
      !card ||
      !beam ||
      !progress ||
      !watermark ||
      !eyebrow ||
      !numDisplay ||
      !title ||
      !body ||
      !trust ||
      !visual ||
      !img
    ) {
      if (prefersReduced || reduced) setDisplayed(active);
      return;
    }

    const numChars = numDisplay.querySelectorAll<HTMLElement>(".cj-detail-char");
    const titleChars = title.querySelectorAll<HTMLElement>(".cj-detail-char");
    const bodyWords = body.querySelectorAll<HTMLElement>(".cj-detail-word");
    const progressPct = (active + 1) / STEPS.length;
    const isFirst = detailEnterRef.current;

    if (nodeInner) {
      gsap.fromTo(
        nodeInner,
        { scale: 1 },
        { scale: 1.1, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1, ...GPU },
      );
    }

    if (stepPickedRef.current && arc && arcDot) {
      arcTravelTween.current?.pause();
      const arcLen = arc.getTotalLength();
      const point = arc.getPointAtLength((active / (STEPS.length - 1)) * arcLen);
      gsap.to(arcDot, {
        attr: { cx: point.x, cy: point.y },
        duration: 0.75,
        ease: "power3.inOut",
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", overwrite: "auto" },
    });

    if (!isFirst) {
      tl.to(card, {
        opacity: 0,
        y: -18,
        scale: 0.97,
        filter: "blur(4px)",
        duration: 0.22,
        ease: "power2.in",
      });
      tl.call(() => setDisplayed(active));
    } else {
      setDisplayed(active);
    }
    detailEnterRef.current = false;

    tl.fromTo(
      card,
      {
        opacity: 0,
        y: 28,
        scale: 0.97,
        filter: "blur(8px)",
        transformOrigin: "50% 100%",
        ...GPU,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "expo.out",
        ...GPU,
      },
      isFirst ? 0 : 0.02,
    )
      .fromTo(
        beam,
        { xPercent: -130, opacity: 0 },
        { xPercent: 130, opacity: 1, duration: 0.55, ease: "power2.inOut" },
        "-=0.48",
      )
      .fromTo(
        watermark,
        { scale: 1.35, opacity: 0, rotate: -6 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(
        progress,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: progressPct, duration: 0.65, ease: "power2.inOut" },
        "-=0.55",
      )
      .fromTo(
        eyebrow,
        { opacity: 0, x: -16, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
        "-=0.42",
      )
      .fromTo(
        numChars,
        {
          yPercent: 115,
          opacity: 0,
          rotateX: -68,
          scale: 0.82,
          transformOrigin: "50% 100%",
          ...GPU,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.42,
          stagger: 0.055,
          ease: "back.out(1.6)",
          ...GPU,
        },
        "-=0.28",
      )
      .fromTo(
        titleChars,
        {
          yPercent: 110,
          opacity: 0,
          rotateX: -52,
          transformOrigin: "50% 100%",
          ...GPU,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.32,
          stagger: 0.018,
          ease: "expo.out",
          ...GPU,
        },
        "-=0.22",
      )
      .fromTo(
        bodyWords,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.28, stagger: 0.022, ease: "power2.out" },
        "-=0.18",
      )
      .fromTo(
        trust,
        { opacity: 0, scale: 0.86, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "back.out(2.2)" },
        "-=0.12",
      )
      .fromTo(
        visual,
        {
          opacity: 0,
          x: 40,
          scale: 0.92,
          clipPath: "inset(8% 100% 8% 0 round 0.95rem)",
          ...GPU,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0 round 0.95rem)",
          duration: 0.62,
          ease: "expo.out",
          ...GPU,
        },
        "-=0.55",
      )
      .fromTo(
        img,
        { scale: 1.14 },
        { scale: 1, duration: 0.75, ease: "power2.out" },
        "-=0.58",
      );

    return () => {
      tl.kill();
    };
  }, [active, reduced]);

  const activeStep = STEPS[displayed];

  return (
    <section
      ref={sectionRef}
      id="care-journey"
      data-nav-zone="care-journey"
      className="care-journey relative px-2 py-2 md:px-3 md:py-3"
      aria-label="How TIDL works: your care journey"
    >
      <div
        ref={panelRef}
        className="care-journey-panel relative isolate overflow-hidden rounded-[2.5rem] border border-[rgba(35,31,32,0.06)] bg-white shadow-[0_20px_56px_rgba(35,31,32,0.07)] md:rounded-[3rem]"
      >
        <div
          ref={glowRef}
          className="care-journey-glow pointer-events-none absolute -left-[20%] top-[8%] z-0 h-[min(28rem,55vw)] w-[min(28rem,55vw)] rounded-full bg-[radial-gradient(circle,rgba(224,123,10,0.22)_0%,rgba(224,123,10,0.06)_42%,transparent_68%)] blur-2xl"
          aria-hidden
        />
        <div
          ref={gridRef}
          className="care-journey-grid pointer-events-none absolute inset-0 z-0 opacity-0"
          aria-hidden
        />

        <style>{`
          .care-journey-grid {
            background-image:
              linear-gradient(rgba(35, 31, 32, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(35, 31, 32, 0.04) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(ellipse 85% 70% at 50% 38%, #000 20%, transparent 72%);
          }
          .care-journey-panel::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              165deg,
              rgba(224, 123, 10, 0.06) 0%,
              transparent 38%,
              rgba(255, 255, 255, 0.9) 100%
            );
            pointer-events: none;
            z-index: 0;
          }
          .care-journey-inner {
            position: relative;
            z-index: 1;
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
          .care-journey-stage-wrap {
            margin-top: clamp(2rem, 5vw, 3rem);
            transform-style: preserve-3d;
            will-change: transform, opacity;
          }
          .care-journey-stage {
            position: relative;
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
          .care-journey-arc-glow-path {
            filter: blur(0.35px);
            opacity: 0.5;
          }
          .care-journey-arc-glow {
            filter: drop-shadow(0 0 8px rgba(224, 123, 10, 0.9));
          }
          .care-journey-hill {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: min(72%, 520px);
            height: min(38%, 200px);
            transform: translateX(-50%);
            border-radius: 520px 520px 0 0;
            background: linear-gradient(180deg, #fff 0%, rgba(224, 123, 10, 0.07) 100%);
            box-shadow: 0 -8px 40px rgba(224, 123, 10, 0.12), inset 0 2px 0 rgba(255, 255, 255, 0.95);
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
            border: 2px solid rgba(224, 123, 10, 0.35);
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
            border: 2.5px solid rgba(224, 123, 10, 0.55);
            box-shadow: 0 0 0 4px rgba(224, 123, 10, 0.12), 0 10px 28px rgba(35, 31, 32, 0.08);
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
            border-color: #e07b0a;
            box-shadow: 0 0 0 8px rgba(224, 123, 10, 0.22), 0 16px 36px rgba(35, 31, 32, 0.12);
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
            background: #e07b0a;
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
            background: linear-gradient(180deg, rgba(224, 123, 10, 0.7), rgba(35, 31, 32, 0.12));
            border-radius: 999px;
          }
          .care-journey-node.is-active .care-journey-node-connector {
            height: clamp(1rem, 2.5vw, 1.35rem);
            background: linear-gradient(180deg, #e07b0a, rgba(35, 31, 32, 0.15));
          }
          .care-journey-node-label {
            margin: 0.4rem 0 0;
            font-family: var(--font-display);
            font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
            font-weight: 700;
            line-height: 1.2;
            color: #231f20;
            transition: color 0.35s ease;
          }
          .care-journey-node.is-active .care-journey-node-label {
            color: #e07b0a;
          }
          .care-journey-node-pulse {
            position: absolute;
            inset: -6px;
            border-radius: 999px;
            border: 2px solid rgba(224, 123, 10, 0.45);
            pointer-events: none;
          }
          .care-journey-detail {
            margin-top: clamp(1.25rem, 3vw, 1.75rem);
            min-height: 10rem;
            perspective: 1200px;
          }
          .care-journey-detail-card {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            border-radius: 1.35rem;
            border: 1px solid rgba(35, 31, 32, 0.08);
            background:
              linear-gradient(135deg, rgba(224, 123, 10, 0.11) 0%, #fff 42%, #fff 100%);
            padding: 1.15rem 1.25rem;
            box-shadow:
              0 1px 0 rgba(255, 255, 255, 0.9) inset,
              0 20px 48px rgba(35, 31, 32, 0.09);
            overflow: hidden;
            transform-style: preserve-3d;
            will-change: transform, opacity, filter;
          }
          .care-journey-detail-beam {
            position: absolute;
            inset: -20% -40%;
            pointer-events: none;
            background: linear-gradient(
              105deg,
              transparent 38%,
              rgba(255, 255, 255, 0.65) 49%,
              rgba(224, 123, 10, 0.45) 52%,
              transparent 64%
            );
            mix-blend-mode: soft-light;
            opacity: 0;
            z-index: 3;
          }
          .care-journey-detail-progress {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(35, 31, 32, 0.06);
            transform: scaleX(0);
            transform-origin: left center;
            z-index: 2;
          }
          .care-journey-detail-progress::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, #b85c00, #e07b0a, #f09012);
            box-shadow: 0 0 12px rgba(224, 123, 10, 0.55);
          }
          .care-journey-detail-watermark {
            position: absolute;
            right: 0.5rem;
            bottom: -0.5rem;
            font-family: "Archivo Narrow", sans-serif;
            font-size: clamp(4.5rem, 14vw, 6.5rem);
            font-weight: 700;
            line-height: 0.88;
            letter-spacing: -0.045em;
            text-transform: uppercase;
            color: rgba(224, 123, 10, 0.07);
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }
          @media (min-width: 640px) {
            .care-journey-detail-card {
              flex-direction: row;
              align-items: center;
              gap: 1.25rem;
            }
          }
          .care-journey-detail-copy {
            position: relative;
            z-index: 1;
            flex: 1;
            min-width: 0;
          }
          .care-journey-detail-step-block {
            margin-bottom: 0.35rem;
          }
          .care-journey-detail-eyebrow {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 0 0.15rem;
            font-family: "Archivo Narrow", sans-serif;
            font-size: clamp(0.5625rem, 1.2vw, 0.6875rem);
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: rgba(35, 31, 32, 0.72);
            will-change: transform, opacity, filter;
          }
          .care-journey-detail-dash {
            display: block;
            width: 1.25rem;
            height: 3px;
            flex-shrink: 0;
            background: #231f20;
          }
          .care-journey-detail-num-display {
            margin: 0;
            font-family: "Archivo Narrow", sans-serif;
            font-size: clamp(3.25rem, 11vw, 5.25rem);
            font-weight: 700;
            line-height: 0.88;
            letter-spacing: -0.045em;
            text-transform: uppercase;
            color: #231f20;
            will-change: transform, opacity;
          }
          .cj-detail-char-wrap,
          .cj-detail-word {
            will-change: transform, opacity;
          }
          .care-journey-detail-trust {
            display: inline-flex;
            align-items: center;
            margin-top: 0.65rem;
            padding: 0.28rem 0.65rem;
            border-radius: 999px;
            background: rgba(224, 123, 10, 0.12);
            border: 1px solid rgba(224, 123, 10, 0.22);
            font-family: var(--font-sans);
            font-size: 0.5625rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #9a4e00;
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
              rgba(224, 123, 10, 0.18) 0%,
              transparent 45%,
              rgba(35, 31, 32, 0.08) 100%
            );
            pointer-events: none;
          }
          .care-journey-detail-num {
            display: none;
          }
          .care-journey-detail-title {
            margin: 0;
            font-family: "Archivo Narrow", sans-serif;
            font-size: clamp(1.35rem, 3.2vw, 1.85rem);
            font-weight: 700;
            line-height: 0.92;
            letter-spacing: -0.035em;
            text-transform: uppercase;
            color: #231f20;
            will-change: transform, opacity;
          }
          .care-journey-detail-body {
            margin: 0.35rem 0 0;
            font-family: var(--font-sans);
            font-size: 0.8125rem;
            line-height: 1.55;
            color: rgba(35, 31, 32, 0.72);
            will-change: transform, opacity, filter;
          }
          .care-journey-strip {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.55rem 0.75rem;
            margin-top: clamp(1.25rem, 3vw, 1.75rem);
            padding-top: clamp(1rem, 2.5vw, 1.5rem);
            border-top: 1px solid rgba(35, 31, 32, 0.07);
          }
          .care-journey-strip-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-family: var(--font-sans);
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: rgba(35, 31, 32, 0.72);
            background: linear-gradient(180deg, #fff 0%, #f5f4f0 100%);
            border: 1px solid rgba(35, 31, 32, 0.08);
            border-radius: 999px;
            padding: 0.45rem 0.85rem;
            box-shadow: 0 4px 14px rgba(35, 31, 32, 0.06);
            will-change: transform, opacity;
          }
          .care-journey-strip-pill svg {
            flex-shrink: 0;
            color: #e07b0a;
          }
          @media (max-width: 640px) {
            .care-journey-node {
              width: min(32vw, 6.5rem);
            }
          }
        `}</style>

        <div className="care-journey-inner">
          <header ref={headRef} className="care-journey-head">
            <p
              ref={eyebrowRef}
              className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(35,31,32,0.5)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              How TIDL works
            </p>
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
                  color: "#e07b0a",
                }}
              >
                <HeadlineWords text={HEADLINE_AFTER} />
              </span>
            </h2>
            <p
              ref={subRef}
              className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-[rgba(35,31,32,0.72)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Tap a step on the arc. Each one is a verified layer of real medical care.
            </p>
          </header>

          <div ref={stageWrapRef} className="care-journey-stage-wrap">
            <div className="care-journey-stage">
            <svg
              className="care-journey-arc-svg"
              viewBox="0 0 100 55"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                ref={arcGlowRef}
                className="care-journey-arc-glow-path"
                d={ARC_PATH}
                fill="none"
                stroke="rgba(224, 123, 10, 0.28)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                ref={arcRef}
                d={ARC_PATH}
                fill="none"
                stroke="rgba(224, 123, 10,0.55)"
                strokeWidth="0.65"
                strokeLinecap="round"
              />
              <circle
                ref={arcDotRef}
                className="care-journey-arc-glow"
                r="1.1"
                fill="#e07b0a"
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
                  onClick={() => {
                    stepPickedRef.current = true;
                    setActive(i);
                  }}
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
                      className="care-journey-node-ring relative"
                      whileHover={reduced ? undefined : { scale: 1.06 }}
                      whileTap={reduced ? undefined : { scale: 0.96 }}
                      animate={
                        isActive && !reduced
                          ? {
                              boxShadow: [
                                "0 0 0 8px rgba(224, 123, 10,0.22), 0 16px 36px rgba(35,31,32,0.12)",
                                "0 0 0 12px rgba(224, 123, 10,0.14), 0 16px 36px rgba(35,31,32,0.12)",
                                "0 0 0 8px rgba(224, 123, 10,0.22), 0 16px 36px rgba(35,31,32,0.12)",
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {isActive && !reduced ? (
                        <motion.span
                          className="care-journey-node-pulse"
                          aria-hidden
                          initial={{ scale: 0.85, opacity: 0.7 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                      ) : null}
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
                    <motion.span
                      className="care-journey-node-label"
                      animate={
                        isActive && !reduced
                          ? { y: [0, -2, 0], transition: { duration: 2.4, repeat: Infinity } }
                          : { y: 0 }
                      }
                    >
                      {step.short}
                    </motion.span>
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
                Not a supplement order. A real medical pathway
              </p>
            </div>
          </div>
          </div>

          <div ref={detailWrapRef} className="care-journey-detail">
            <div ref={detailCardRef} className="care-journey-detail-card">
              <div ref={detailBeamRef} className="care-journey-detail-beam" aria-hidden />
              <div ref={detailProgressRef} className="care-journey-detail-progress" aria-hidden />
              <span ref={detailWatermarkRef} className="care-journey-detail-watermark" aria-hidden>
                {activeStep.num}
              </span>

              <div className="care-journey-detail-copy">
                <div className="care-journey-detail-step-block">
                  <p ref={detailEyebrowRef} className="care-journey-detail-eyebrow">
                    <span className="care-journey-detail-dash" aria-hidden />
                    <span>Step {activeStep.num} · {activeStep.trust}</span>
                  </p>
                  <p
                    ref={detailNumDisplayRef}
                    className="care-journey-detail-num-display"
                    aria-hidden
                  >
                    <DetailKnockoutChars text={activeStep.num} />
                  </p>
                </div>
                <h3 ref={detailTitleRef} className="care-journey-detail-title">
                  <DetailKnockoutChars text={activeStep.title} />
                </h3>
                <p ref={detailBodyRef} className="care-journey-detail-body">
                  <DetailBodyWords text={activeStep.body} />
                </p>
                <span ref={detailTrustRef} className="care-journey-detail-trust">
                  {activeStep.trust} pathway
                </span>
              </div>

              <div ref={detailVisualRef} className="care-journey-detail-visual">
                <div ref={detailFloatRef} className="care-journey-detail-visual-float">
                  <img
                    ref={detailImgRef}
                    src={activeStep.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>

          <div ref={stripRef} className="care-journey-strip">
            {TRUST_STRIP.map((label) => (
              <motion.span
                key={label}
                className="care-journey-strip-pill"
                whileHover={reduced ? undefined : { y: -3, scale: 1.04 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                <Check size={12} strokeWidth={2.5} aria-hidden />
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
