import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import assessmentHero from "@/assets/ChatGPT Image Jun 23, 2026, 08_42_57 PM.png";
import assessmentProduct from "@/assets/ChatGPT Image Jun 24, 2026, 01_22_06 AM.png";

const EASE = [0.16, 1, 0.3, 1] as const;
const LINE_PATH = "M 40 420 C 120 320, 200 280, 280 200 S 360 80, 340 40";
const LINE_WORDS = ["Simple.", "Secure.", "~10 min."] as const;

export function AssessmentHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px", amount: 0.2 });
  const reduced = useReducedMotion();
  const { openModal } = useQuizModal();

  const [linePhase, setLinePhase] = useState<"idle" | "draw" | "travel" | "word">("idle");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduced) {
      if (inView && reduced) setLinePhase("word");
      return;
    }

    setLinePhase("draw");
    const travelTimer = window.setTimeout(() => setLinePhase("travel"), 1900);
    const wordTimer = window.setTimeout(() => setLinePhase("word"), 3200);

    return () => {
      window.clearTimeout(travelTimer);
      window.clearTimeout(wordTimer);
    };
  }, [inView, reduced]);

  useEffect(() => {
    if (!inView || reduced || linePhase !== "word") return;

    const cycle = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % LINE_WORDS.length);
    }, 2800);

    return () => window.clearInterval(cycle);
  }, [inView, reduced, linePhase]);

  const showWord = linePhase === "word" || (reduced && inView);

  return (
    <section ref={sectionRef} className="px-2 pb-2" aria-label="Start your assessment">
      <div
        className="assessment-hero relative mx-auto w-full overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
        style={{ minHeight: "clamp(30rem, 72vw, 54rem)" }}
      >
        <img
          src={assessmentHero}
          alt="Mother and daughter sharing a warm moment"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
        />

        <img
          src={assessmentProduct}
          alt="Enclomiphene — to elevate your T"
          className="assessment-hero-product pointer-events-none absolute z-[3]"
          loading="lazy"
          decoding="async"
        />

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(35,31,32,0.42) 0%, rgba(35,31,32,0.08) 28%, rgba(35,31,32,0.04) 55%, rgba(35,31,32,0.38) 100%)",
          }}
        />

        {/* Animated accent line + word reveal beside the subjects */}
        <svg
          className={`assessment-hero-line pointer-events-none absolute z-[2]${inView && !reduced ? " assessment-hero-line--live" : ""}`}
          viewBox="0 0 400 500"
          fill="none"
          aria-hidden
          style={{
            right: "8%",
            top: "18%",
            width: "min(38vw, 280px)",
            height: "auto",
          }}
        >
          <defs>
            <linearGradient id="assessmentLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f3c300" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#f3c300" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff4b8" stopOpacity="1" />
            </linearGradient>
          </defs>

          <motion.path
            d={LINE_PATH}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.65 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 2, ease: EASE, delay: 0.2 }}
          />

          <motion.path
            className={linePhase === "word" && !reduced ? "assessment-line-flow" : undefined}
            d={LINE_PATH}
            stroke="url(#assessmentLineGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 1.85, ease: EASE, delay: 0.35 }}
          />

          {/* Traveling spark along the line */}
          {inView && !reduced && (
            <circle r="5" fill="#f3c300" className="assessment-line-spark" opacity={linePhase === "travel" || linePhase === "word" ? 1 : 0}>
              <animateMotion
                dur="1.35s"
                begin="1.9s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
                keyTimes="0;1"
                path={LINE_PATH}
              />
            </circle>
          )}

          <motion.circle
            cx="340"
            cy="40"
            r="6"
            fill="#f3c300"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              showWord
                ? { scale: [0, 1.35, 1], opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ duration: reduced ? 0.01 : 0.55, ease: EASE }}
            className={showWord && !reduced ? "assessment-line-node" : undefined}
          />

          {/* Word label at line endpoint */}
          <foreignObject x="248" y="8" width="148" height="56">
            <div className="flex h-full items-center justify-end">
              <AnimatePresence mode="wait">
                {showWord && (
                  <motion.span
                    key={LINE_WORDS[wordIndex]}
                    className="assessment-line-word"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {LINE_WORDS[wordIndex]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </foreignObject>
        </svg>

        <div className="relative z-10 flex h-full min-h-[inherit] flex-col items-center justify-between px-6 py-12 text-center md:px-12 md:py-16">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reduced ? 0.01 : 0.9, ease: EASE }}
          >
            <h2
              className="font-display leading-[1.08] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.65rem, 4.2vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Answer a short clinical intake in about 10 minutes — no clinic visit, no waiting room.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reduced ? 0.01 : 0.9, ease: EASE, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={openModal}
              className={`assessment-cta inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[0.95rem] font-semibold${reduced ? "" : " assessment-cta--live"}`}
              style={{
                color: "#231f20",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span className="assessment-cta__ring" aria-hidden />
              <span className="assessment-cta__shine" aria-hidden />
              <span className="relative z-[1]">Start the assessment</span>
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        /* Product card — top aligns with animated line start (path M 40 420 → 84% of SVG height) */
        .assessment-hero-product {
          right: clamp(0.75rem, 2vw, 2rem);
          bottom: clamp(0.75rem, 2vw, 2rem);
          top: calc(18% + min(38vw, 280px) * 1.05);
          width: auto;
          height: calc(100% - 18% - min(38vw, 280px) * 1.05 - clamp(0.75rem, 2vw, 2rem));
          max-width: min(62vw, 520px);
          object-fit: contain;
          object-position: bottom right;
          border-radius: 1rem;
          filter: drop-shadow(0 24px 48px rgba(35, 31, 32, 0.45));
        }

        /* ── CTA: always glowing / shining ── */
        .assessment-cta {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: linear-gradient(135deg, #e8b800 0%, #f3c300 42%, #ffe566 50%, #f3c300 58%, #d4ad00 100%);
          background-size: 200% 200%;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            0 0 0 1px rgba(243, 195, 0, 0.35),
            0 12px 32px rgba(35, 31, 32, 0.28),
            0 0 24px rgba(243, 195, 0, 0.35);
        }
        .assessment-cta--live {
          animation: assessmentCtaGlow 2.2s ease-in-out infinite, assessmentCtaBg 4s ease-in-out infinite;
        }
        .assessment-cta--live:hover {
          animation: assessmentCtaGlow 1.4s ease-in-out infinite, assessmentCtaBg 3s ease-in-out infinite;
          transform: scale(1.03);
        }
        .assessment-cta__ring {
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          border: 2px solid rgba(243, 195, 0, 0.55);
          opacity: 0;
          pointer-events: none;
        }
        .assessment-cta--live .assessment-cta__ring {
          animation: assessmentCtaRing 2.2s ease-out infinite;
        }
        .assessment-cta__shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }
        .assessment-cta__shine::before {
          content: "";
          position: absolute;
          top: -40%;
          left: -60%;
          width: 45%;
          height: 180%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 35%,
            rgba(255, 255, 255, 0.75) 50%,
            rgba(255, 255, 255, 0.15) 65%,
            transparent 100%
          );
          transform: skewX(-18deg);
        }
        .assessment-cta--live .assessment-cta__shine::before {
          animation: assessmentCtaShine 2.6s ease-in-out infinite;
        }

        @keyframes assessmentCtaGlow {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(243, 195, 0, 0.4),
              0 12px 32px rgba(35, 31, 32, 0.28),
              0 0 22px rgba(243, 195, 0, 0.38),
              0 0 48px rgba(243, 195, 0, 0.18);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(255, 232, 120, 0.65),
              0 16px 40px rgba(35, 31, 32, 0.32),
              0 0 36px rgba(243, 195, 0, 0.72),
              0 0 72px rgba(243, 195, 0, 0.38);
          }
        }
        @keyframes assessmentCtaBg {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes assessmentCtaShine {
          0%   { left: -65%; opacity: 0; }
          12%  { opacity: 1; }
          45%  { left: 130%; opacity: 1; }
          55%  { opacity: 0; }
          100% { left: 130%; opacity: 0; }
        }
        @keyframes assessmentCtaRing {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.18); opacity: 0; }
          100% { transform: scale(1.18); opacity: 0; }
        }

        /* ── Line: flow + word ── */
        .assessment-line-flow {
          stroke-dasharray: 6 14;
          animation: assessmentLineFlow 1.8s linear infinite;
        }
        @keyframes assessmentLineFlow {
          to { stroke-dashoffset: -40; }
        }
        .assessment-line-node {
          filter: drop-shadow(0 0 8px rgba(243, 195, 0, 0.85));
          animation: assessmentNodePulse 2.4s ease-in-out infinite;
        }
        @keyframes assessmentNodePulse {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
        .assessment-line-spark {
          filter: drop-shadow(0 0 8px rgba(243, 195, 0, 1));
        }
        .assessment-line-word {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: clamp(0.72rem, 2.2vw, 0.88rem);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #231f20;
          background: linear-gradient(135deg, #f3c300, #ffe566);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.5),
            0 8px 24px rgba(35, 31, 32, 0.35),
            0 0 20px rgba(243, 195, 0, 0.55);
          white-space: nowrap;
        }
        .assessment-hero-line--live .assessment-line-word {
          animation: assessmentWordGlow 2.8s ease-in-out infinite;
        }
        @keyframes assessmentWordGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.5), 0 8px 24px rgba(35,31,32,0.35), 0 0 16px rgba(243,195,0,0.45); }
          50%      { box-shadow: 0 0 0 1px rgba(255,255,255,0.7), 0 10px 28px rgba(35,31,32,0.4), 0 0 28px rgba(243,195,0,0.75); }
        }

        @media (max-width: 720px) {
          .assessment-hero-line {
            right: 4% !important;
            top: 22% !important;
            width: min(44vw, 200px) !important;
          }
          .assessment-hero-product {
            right: 0.75rem;
            bottom: 5.5rem;
            top: calc(22% + min(44vw, 200px) * 1.05);
            height: calc(100% - 22% - min(44vw, 200px) * 1.05 - 5.5rem);
            max-width: min(68vw, 280px);
            border-radius: 0.75rem;
          }
          .assessment-line-word {
            font-size: 0.65rem;
            padding: 0.28rem 0.55rem;
          }
        }
      `}</style>
    </section>
  );
}
