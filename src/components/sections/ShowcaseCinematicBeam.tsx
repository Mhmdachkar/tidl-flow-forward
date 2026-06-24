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
} from "@/lib/section-performance";

const EASE_LUX = [0.16, 1, 0.3, 1] as const;

type ShowcaseCinematicBeamProps = { children: ReactNode };

export function ShowcaseCinematicBeam({ children }: ShowcaseCinematicBeamProps) {
  return (
    <div className="showcase-beam-stage relative isolate">
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
