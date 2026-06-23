import { useRef, type ReactNode, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import {
  canUseHoverParallax,
  rafThrottle,
  useSectionInView,
} from "@/lib/section-performance";

const EASE_LUX = [0.16, 1, 0.3, 1] as const;

/** Arrows placed around the stage, rotated to converge on the hero product (~50% / 42%). */
const CONVERGING_ARROWS = [
  { id: "tr-1", left: "84%", top: "7%", rotate: 142, delay: 0 },
  { id: "tr-2", left: "93%", top: "20%", rotate: 162, delay: 0.1 },
  { id: "tr-3", left: "91%", top: "34%", rotate: 182, delay: 0.2 },
  { id: "tr-4", left: "86%", top: "48%", rotate: 198, delay: 0.3 },
  { id: "tl-1", left: "9%", top: "9%", rotate: 38, delay: 0.05 },
  { id: "tl-2", left: "3%", top: "24%", rotate: 18, delay: 0.15 },
  { id: "tl-3", left: "6%", top: "40%", rotate: -2, delay: 0.25 },
  { id: "bl-1", left: "12%", top: "56%", rotate: -22, delay: 0.35 },
  { id: "br-1", left: "80%", top: "60%", rotate: 212, delay: 0.28 },
] as const;

function ShowcaseConvergingArrows({ visible, animate }: { visible: boolean; animate: boolean }) {
  return (
    <div className="showcase-arrows pointer-events-none absolute inset-0 z-[1] overflow-hidden showcase-arrows-gpu" aria-hidden>
      {CONVERGING_ARROWS.map((arrow) => (
        <div
          key={arrow.id}
          className={`showcase-arrow${visible ? " showcase-arrow--visible" : ""}${animate ? " showcase-arrow--live" : ""}`}
          style={
            {
              left: arrow.left,
              top: arrow.top,
              "--arrow-rot": `${arrow.rotate}deg`,
              "--arrow-delay": `${arrow.delay}s`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 100 22" className="showcase-arrow__svg" fill="none" aria-hidden>
            <path
              className="showcase-arrow__trail"
              d="M4 11 H78"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="showcase-arrow__shaft"
              d="M4 11 H78"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path className="showcase-arrow__head" d="M78 11 L64 4.5 V17.5 Z" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}

type ShowcaseCinematicBeamProps = { children: ReactNode };

export function ShowcaseCinematicBeam({ children }: ShowcaseCinematicBeamProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useSectionInView(stageRef);

  const arrowsVisible = inView;
  const arrowsAnimate = inView && !reduced;

  return (
    <div
      ref={stageRef}
      className="showcase-beam-stage relative isolate min-h-[70svh] max-h-[52rem] md:min-h-[58rem] md:max-h-none"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE_LUX }}
      >
        <ShowcaseConvergingArrows visible={arrowsVisible} animate={arrowsAnimate} />
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

type ShowcaseHeroProductProps = {
  src: string;
  alt: string;
  productRef?: RefObject<HTMLDivElement | null>;
};

export function ShowcaseHeroProduct({ src, alt, productRef }: ShowcaseHeroProductProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = productRef ?? localRef;
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(wrapRef, { once: true, amount: 0.3, margin: "-5% 0px" });
  const hoverParallax = canUseHoverParallax();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 42, damping: 30 });
  const springY = useSpring(pointerY, { stiffness: 42, damping: 30 });
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);
  const rotateX = useTransform(springY, [0, 1], [3, -3]);

  const onPointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const onPointerMove = rafThrottle((e: React.PointerEvent<HTMLDivElement>) => {
    if (!hoverParallax || reduced) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    pointerX.set((e.clientX - r.left) / r.width);
    pointerY.set((e.clientY - r.top) / r.height);
  });

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto mt-10 overflow-visible"
      style={{ maxWidth: 1140, height: "min(60svh, 70vh, 760px)" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        ref={ref}
        className="absolute z-[2]"
        style={{
          top: "8%",
          left: "50%",
          x: "-50%",
          width: "min(680px, 78%)",
          rotateY: hoverParallax && !reduced ? rotateY : 0,
          rotateX: hoverParallax && !reduced ? rotateX : 0,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 56 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
        transition={{ duration: 1.4, ease: EASE_LUX }}
      >
        <div className="showcase-product-float showcase-product-float--on showcase-product-gpu">
          <img
            src={src}
            alt={alt}
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="relative z-[2] block h-auto w-full"
            style={{
              filter: "drop-shadow(0 28px 48px rgba(243, 195, 0, 0.22)) drop-shadow(0 12px 32px rgba(35, 31, 32, 0.08))",
            }}
          />
        </div>
      </motion.div>

      {/* Soft gold pool under product — no black cast shadows */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[1]"
        style={{
          bottom: "6%",
          left: "32%",
          width: "56%",
          height: "14%",
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(243, 195, 0, 0.2) 0%, rgba(243, 195, 0, 0.06) 45%, transparent 100%)",
        }}
      />
    </div>
  );
}
