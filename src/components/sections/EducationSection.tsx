import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

import penPoster from "@/assets/tidl-pen-hero.png";
// Placeholder education clip — swap for the real "how to use your pen" video.
import eduVideo from "@/assets/pen-how-to.mp4";

const STEPS = [
  {
    k: "01",
    title: "Pre-dosed",
    body: "Your dose is measured at the pharmacy. Nothing to mix, nothing to draw up.",
  },
  {
    k: "02",
    title: "Inject",
    body: "Press to your skin and click. A single guided step, done in seconds.",
  },
  {
    k: "03",
    title: "Store",
    body: "Keep refrigerated. Each pen ships cold-chain with simple storage guidance.",
  },
] as const;

const ACCENT = "#2d4a3e";

export function EducationSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll(".edu-head"), {
        opacity: 0,
        y: 26,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 78%" },
      });
      gsap.from(root.querySelector(".edu-video"), {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: root, start: "top 72%" },
      });
      gsap.from(root.querySelectorAll(".edu-step"), {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.querySelector(".edu-steps"), start: "top 85%" },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(true);
    v.play().catch(() => setPlaying(false));
  };

  return (
    <section
      ref={rootRef}
      id="education"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
      style={{ background: "#f6f3ec", color: "#161616" }}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="edu-head mb-4 flex items-center gap-4">
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.32em", color: ACCENT }}
              >
                §09 — Education
              </span>
              <span className="h-px w-16" style={{ background: "rgba(22,22,22,0.25)" }} />
            </div>
            <h2
              className="edu-head leading-[0.96]"
              style={{
                fontFamily: '"Instrument Serif", "Fraunces", Georgia, serif',
                fontSize: "clamp(30px, 4.4vw, 58px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
              }}
            >
              Your pen,{" "}
              <span className="italic" style={{ color: ACCENT }}>
                made simple.
              </span>
            </h2>
          </div>
          <p
            className="edu-head max-w-[320px] text-[14px] leading-[1.55]"
            style={{ color: "rgba(22,22,22,0.62)" }}
          >
            A short walkthrough on using your pen, dosing, and storage — sent to you when
            your order ships.
          </p>
        </div>

        {/* video card */}
        <div
          className="edu-video relative aspect-video w-full overflow-hidden rounded-[24px]"
          style={{
            border: "1px solid rgba(22,22,22,0.1)",
            boxShadow: "0 36px 70px -34px rgba(22,22,22,0.5)",
            background: "#10140f",
          }}
        >
          <video
            ref={videoRef}
            poster={penPoster}
            controls={playing}
            playsInline
            preload="none"
            className="h-full w-full object-cover"
          >
            <source src={eduVideo} type="video/mp4" />
          </video>

          {!playing && (
            <button
              type="button"
              onClick={play}
              aria-label="Play the pen walkthrough"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,16,13,0.15) 0%, rgba(11,16,13,0.45) 100%)",
              }}
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
                style={{ background: "rgba(246,243,236,0.95)" }}
              >
                <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill={ACCENT} aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/90">
                Watch · How to use your pen
              </span>
            </button>
          )}
        </div>

        {/* text steps — accessible fallback / always available */}
        <div className="edu-steps mt-10 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: "rgba(22,22,22,0.1)" }}>
          {STEPS.map((s) => (
            <div key={s.k} className="edu-step flex flex-col gap-2 p-6" style={{ background: "#f6f3ec" }}>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: ACCENT }}
              >
                {s.k} · {s.title}
              </span>
              <p className="text-[14px] leading-[1.55]" style={{ color: "rgba(22,22,22,0.7)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed" style={{ color: "rgba(22,22,22,0.45)" }}>
          For education only — not medical advice. Always follow the dosing and storage
          instructions provided by your physician and pharmacy.
        </p>
      </div>
    </section>
  );
}
