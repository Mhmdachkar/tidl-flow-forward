import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE_LUX = [0.16, 1, 0.3, 1] as const;

const FIGURE_BLOCKS = [
  { id: "testosterone", label: "Testosterone", value: "243 ng/dL", top: "14%", left: "4%",  delay: 0.55 },
  { id: "improvement",  label: "Improvement",  value: "↑ 18%",     top: "8%",  right: "6%", delay: 0.72 },
  { id: "heart",        label: "Resting HR",   value: "52 bpm",    bottom: "28%", left: "10%", delay: 0.88 },
] as const;

type ShowcaseFigureStageProps = { src: string; alt: string };

export function ShowcaseFigureStage({ src, alt }: ShowcaseFigureStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useInView(ref, { once: true, margin: "-10% 0px", amount: 0.25 });
  const reduced = useReducedMotion();
  const floatOn = entered && !reduced;

  return (
    <div
      ref={ref}
      className="showcase-figure-stage relative flex min-h-[28rem] items-end justify-center overflow-visible"
    >
      <motion.div
        aria-hidden
        className="showcase-figure-glow"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: EASE_LUX }}
      />

      {FIGURE_BLOCKS.map((block) => (
        <motion.span
          key={block.id}
          aria-label={`${block.label}: ${block.value}`}
          className="absolute z-[3] rounded-full px-3.5 py-2 text-xs font-bold"
          style={{
            top:    "top"    in block ? block.top    : undefined,
            left:   "left"   in block ? block.left   : undefined,
            right:  "right"  in block ? block.right  : undefined,
            bottom: "bottom" in block ? block.bottom : undefined,
            fontFamily: "var(--font-display)",
            color: "#231f20",
            background: "rgba(255, 255, 255, 0.88)",
            border: "1px solid rgba(243, 195, 0, 0.45)",
            boxShadow: "0 8px 24px rgba(35, 31, 32, 0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
          initial={{ opacity: 0, x: 48 }}
          animate={entered ? { opacity: 1, x: 0 } : { opacity: 0, x: 48 }}
          transition={{
            duration: reduced ? 0.01 : 1.1,
            delay: block.delay,
            ease: EASE_LUX,
          }}
        >
          {block.value}
        </motion.span>
      ))}

      <motion.div
        className={`relative z-[2] w-full showcase-figure-float${floatOn ? " showcase-figure-float--on" : ""}`}
        initial={{ opacity: 0, x: 96 }}
        animate={entered ? { opacity: 1, x: 0 } : { opacity: 0, x: 96 }}
        transition={{
          opacity: { duration: reduced ? 0.01 : 1.5, ease: EASE_LUX },
          x:       { duration: reduced ? 0.01 : 1.7, ease: EASE_LUX },
        }}
      >
        <img
          src={src}
          alt={alt}
          className="showcase-figure-3d mx-auto block"
          width={1200}
          height={1600}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    </div>
  );
}
