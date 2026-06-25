import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import assessmentHero from "@/assets/ChatGPT Image Jun 23, 2026, 08_42_57 PM.png";

const HEADLINE =
  "Answer a short clinical intake in about 10 minutes, no clinic visit, no waiting room.";

function HeadlineWords() {
  return (
    <>
      {HEADLINE.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className="assessment-headline-word inline-block">{word}</span>
        </span>
      ))}
    </>
  );
}

export function AssessmentHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { openModal } = useQuizModal();

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;
    if (!section || !headline || !cta) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = headline.querySelectorAll<HTMLElement>(".assessment-headline-word");

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([...words, cta], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.set(words, { yPercent: 115, opacity: 0 });
      gsap.set(cta, { opacity: 0, y: 36 });

      const reveal = () => {
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 1.35,
          ease: "expo.out",
          stagger: 0.045,
          overwrite: "auto",
        });
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          delay: 0.55,
          overwrite: "auto",
        });
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,
        onEnter: reveal,
      });

      if (section.getBoundingClientRect().top < window.innerHeight * 0.82) {
        reveal();
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-nav-zone="assessment" className="px-2 pb-2" aria-label="Start your assessment">
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

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(35,31,32,0.42) 0%, rgba(35,31,32,0.08) 28%, rgba(35,31,32,0.04) 55%, rgba(35,31,32,0.38) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full min-h-[inherit] flex-col items-center justify-between px-6 py-12 text-center md:px-12 md:py-16">
          <div className="max-w-2xl">
            <h2
              ref={headlineRef}
              className="font-display leading-[1.08] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.65rem, 4.2vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              <HeadlineWords />
            </h2>
          </div>

          <div ref={ctaRef}>
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
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
}
