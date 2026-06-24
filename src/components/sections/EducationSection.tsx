import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { TIDL_BRAND } from "@/lib/tidl-brand";

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

export function EducationSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userEngaged, setUserEngaged] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const ambientPreview = playing && !userEngaged;

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tryPlay = () => {
      video.muted = true;
      video.play()
        .then(() => {
          setPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => setAutoplayBlocked(true));
    };

    const pauseVideo = () => {
      video.pause();
      setPlaying(false);
      setUserEngaged(false);
    };

    const ctx = gsap.context(() => {
      if (!reduced) {
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
      }

      ScrollTrigger.create({
        trigger: root.querySelector(".edu-video"),
        start: "top 85%",
        end: "bottom 15%",
        onEnter: tryPlay,
        onEnterBack: tryPlay,
        onLeave: pauseVideo,
        onLeaveBack: pauseVideo,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const engage = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setUserEngaged(true);
    v.play()
      .then(() => {
        setPlaying(true);
        setAutoplayBlocked(false);
      })
      .catch(() => setAutoplayBlocked(true));
  };

  return (
    <section
      ref={rootRef}
      id="education"
      className="tidl-brand-section relative overflow-hidden py-16 sm:py-20 lg:py-28"
      style={{ color: TIDL_BRAND.ink }}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* header */}
        <div className="mb-10 text-center">
          <h2 className="edu-head tidl-display text-[clamp(30px,4.4vw,58px)] tracking-[-0.025em]">
            Your pen,{" "}
            <span className="italic" style={{ color: TIDL_BRAND.accent }}>
              made simple.
            </span>
          </h2>
        </div>

        {/* video card */}
        <div
          className="edu-video relative aspect-video w-full overflow-hidden rounded-[24px]"
          style={{
            border: "1px solid rgba(35,31,32,0.1)",
            boxShadow: "0 36px 70px -34px rgba(35,31,32,0.5)",
            background: "#10140f",
            maxHeight: "60vh",
          }}
        >
          <div
            className={`edu-video-frame absolute inset-0 overflow-hidden${ambientPreview ? " edu-video-frame--ambient" : ""}`}
          >
            <video
              ref={videoRef}
              poster={penPoster}
              controls={userEngaged}
              playsInline
              muted={!userEngaged}
              preload="auto"
              className="edu-video-el block h-full w-full object-cover"
            >
              <source src={eduVideo} type="video/mp4" />
            </video>
          </div>

          {!userEngaged && (
            <button
              type="button"
              onClick={engage}
              aria-label="Play the pen walkthrough with sound"
              className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
              style={{
                background: playing
                  ? "linear-gradient(180deg, transparent 0%, rgba(11,16,13,0.35) 100%)"
                  : "linear-gradient(180deg, rgba(11,16,13,0.15) 0%, rgba(11,16,13,0.45) 100%)",
              }}
            >
              {!playing && (
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
                  style={{ background: "rgba(246,243,236,0.95)" }}
                >
                  <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill={TIDL_BRAND.accent} aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
              <span className="tidl-eyebrow text-white/90">
                {autoplayBlocked || !playing
                  ? "Tap to play · How to use your pen"
                  : "Tap for sound and controls"}
              </span>
            </button>
          )}
        </div>

        <style>{`
          .edu-video-frame {
            transform: scale(1);
            transform-origin: center center;
          }
          .edu-video-frame--ambient .edu-video-el {
            animation: eduVideoZoom 14s ease-out forwards;
            will-change: transform;
          }
          @keyframes eduVideoZoom {
            from { transform: scale(1); }
            to { transform: scale(1.14); }
          }
          .edu-video-el {
            transform: scale(1);
            transform-origin: center center;
          }
          .edu-video-frame:not(.edu-video-frame--ambient) .edu-video-el {
            animation: none;
            transform: scale(1);
          }
          @media (prefers-reduced-motion: reduce) {
            .edu-video-frame--ambient .edu-video-el {
              animation: none;
              transform: scale(1);
            }
          }
        `}</style>

        {/* text steps — accessible fallback / always available */}
        <div className="edu-steps mt-10 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: "rgba(35,31,32,0.1)" }}>
          {STEPS.map((s) => (
            <div key={s.k} className="edu-step flex flex-col gap-2 p-6">
              <span className="tidl-eyebrow" style={{ color: TIDL_BRAND.accent }}>
                {s.k} · {s.title}
              </span>
              <p className="tidl-body text-base leading-[1.55]" style={{ color: "rgba(35,31,32,0.7)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
