import { useRef, useEffect, type ReactNode, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
      className="relative mx-auto mt-6 overflow-visible"
      style={{ maxWidth: 1140, height: "min(60svh, 70vh, 760px)" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        ref={ref}
        className="absolute z-[2]"
        style={{
          top: "2%",
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

// ─── ShowcaseHeroVideo ────────────────────────────────────────────────────────

const VIDEO_TOP_RADIUS = "clamp(2.75rem, 6vw, 4rem)";

type ShowcaseHeroVideoProps = {
  src: string;
  videoRef?: RefObject<HTMLDivElement | null>;
  overlay?: ReactNode;
};

export function ShowcaseHeroVideo({ src, videoRef: externalRef, overlay }: ShowcaseHeroVideoProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const innerRef = externalRef ?? localRef;
  const wrapRef  = useRef<HTMLDivElement>(null);
  const reduced  = useReducedMotion();

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(inner, { opacity: 1 });
        return;
      }

      gsap.set(inner, { opacity: 0 });

      const reveal = () =>
        gsap.to(inner, { opacity: 1, duration: 1.2, ease: "expo.out", overwrite: "auto" });

      ScrollTrigger.create({
        trigger: wrap,
        start: "top 90%",
        once: true,
        onEnter: reveal,
      });

      if (wrap.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal();
      }
    }, wrap);

    return () => ctx.revert();
  }, [reduced, innerRef]);

  return (
    <div
      ref={wrapRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
      style={{
        height: "100svh",
        minHeight: "100svh",
        borderTopLeftRadius: VIDEO_TOP_RADIUS,
        borderTopRightRadius: VIDEO_TOP_RADIUS,
      }}
    >
      <div
        ref={innerRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          borderTopLeftRadius: VIDEO_TOP_RADIUS,
          borderTopRightRadius: VIDEO_TOP_RADIUS,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>

      {overlay && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-center px-5 pt-10 text-center md:px-10 md:pt-14 lg:pt-16"
        >
          {overlay}
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
        style={{
          height: "42%",
          background: "linear-gradient(to bottom, rgba(250, 250, 247, 0.92) 0%, rgba(250, 250, 247, 0.45) 38%, transparent 100%)",
          borderTopLeftRadius: VIDEO_TOP_RADIUS,
          borderTopRightRadius: VIDEO_TOP_RADIUS,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
        style={{
          height: "28%",
          background: "linear-gradient(to top, rgb(251, 251, 248) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
