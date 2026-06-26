import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getAiSearchSuggestions } from "@/lib/ai-search";
import { TIDL_BRAND } from "@/lib/tidl-brand";

const SCROLLER = document.documentElement;

function DiscoverLine({
  text,
  italic,
  accent,
}: {
  text: string;
  italic?: boolean;
  accent?: boolean;
}) {
  return (
    <span className={`ai-discover-line${italic ? " ai-discover-line--italic" : ""}`}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="ai-discover-word-wrap">
          <span
            className={`ai-discover-word${accent ? " ai-discover-word--accent" : ""}`}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

export function AiSearchSection() {
  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const suggestions = getAiSearchSuggestions();

  useEffect(() => {
    const root = rootRef.current;
    const shell = shellRef.current;
    const glow = glowRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const form = formRef.current;
    const inputWrap = inputWrapRef.current;
    const submit = submitRef.current;
    const chips = chipsRef.current;
    if (!root || !shell || !glow || !eyebrow || !headline || !form || !inputWrap || !submit || !chips) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const words = headline.querySelectorAll<HTMLElement>(".ai-discover-word");
    const chipEls = chips.querySelectorAll<HTMLElement>(".ai-discover-chip");
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.set(glow, { opacity: 0, scale: 0.85 });
      gsap.set(eyebrow, { opacity: 0, y: 20, filter: "blur(8px)", letterSpacing: "0.38em" });
      gsap.set(words, { yPercent: 120, opacity: 0, rotateX: 28, transformOrigin: "50% 100%" });
      gsap.set(form, { opacity: 0, y: 36, scale: 0.96, filter: "blur(10px)" });
      gsap.set(inputWrap, { scaleX: 0.88, transformOrigin: "center center" });
      gsap.set(submit, { scale: 0, opacity: 0, rotate: -90 });
      gsap.set(chipEls, { opacity: 0, y: 28, scale: 0.88, filter: "blur(6px)" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
        scrollTrigger: {
          trigger: root,
          scroller: SCROLLER,
          start: "top 88%",
          end: "top 28%",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      tl.to(glow, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0)
        .to(
          eyebrow,
          { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.22em", duration: 0.22 },
          0.04,
        )
        .to(
          words,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.28,
            stagger: 0.035,
            ease: "expo.out",
          },
          0.12,
        )
        .to(
          form,
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.32, ease: "power2.out" },
          0.38,
        )
        .to(
          inputWrap,
          { scaleX: 1, duration: 0.28, ease: "power2.inOut" },
          0.42,
        )
        .to(
          submit,
          { scale: 1, opacity: 1, rotate: 0, duration: 0.18, ease: "back.out(2.2)" },
          0.58,
        )
        .to(
          chipEls,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.2,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.62,
        );

      // Ambient glow drift
      const glowTween = gsap.to(glow, {
        x: 24,
        y: -18,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      cleanups.push(() => glowTween.kill());

      ScrollTrigger.create({
        trigger: root,
        scroller: SCROLLER,
        start: "top 90%",
        end: "bottom 10%",
        onEnter: () => glowTween.play(),
        onLeave: () => glowTween.pause(),
        onEnterBack: () => glowTween.play(),
        onLeaveBack: () => glowTween.pause(),
      });

      // Subtle parallax on shell while scrolling through section
      gsap.to(shell, {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          scroller: SCROLLER,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });

      // Chip hover micro-interactions
      chipEls.forEach((chip) => {
        const onEnter = () => {
          gsap.to(chip, {
            y: -3,
            scale: 1.04,
            boxShadow: "0 12px 28px -8px rgba(224, 123, 10,0.35)",
            borderColor: "rgba(224, 123, 10,0.55)",
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(chip, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(224, 123, 10,0)",
            borderColor: "rgba(35,31,32,0.12)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        chip.addEventListener("mouseenter", onEnter);
        chip.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          chip.removeEventListener("mouseenter", onEnter);
          chip.removeEventListener("mouseleave", onLeave);
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [suggestions.length]);

  const goToSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    void navigate({ to: "/search", search: { q: trimmed } });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    goToSearch(query);
  };

  return (
    <section
      id="discover"
      ref={rootRef}
      data-nav-zone="discover"
      aria-label="Find your treatment"
      className="ai-discover relative px-2 pb-0"
    >
      <style>{`
        .ai-discover-shell {
          position: relative;
          overflow: hidden;
          border-radius: 1.25rem;
          background: linear-gradient(165deg, #f8f7f3 0%, #eeede8 48%, #f5f4f0 100%);
          border: 1px solid rgba(35, 31, 32, 0.06);
        }

        .ai-discover-glow {
          position: absolute;
          top: 10%;
          left: 50%;
          width: min(520px, 90vw);
          height: min(320px, 55vw);
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(224, 123, 10, 0.16) 0%,
            rgba(224, 123, 10, 0.04) 45%,
            transparent 72%
          );
          pointer-events: none;
          filter: blur(2px);
        }

        .ai-discover-line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.04em;
        }

        .ai-discover-line--italic {
          font-style: italic;
        }

        .ai-discover-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-right: 0.22em;
          perspective: 600px;
        }

        .ai-discover-word {
          display: inline-block;
          will-change: transform, opacity;
        }

        .ai-discover-word--accent {
          color: ${TIDL_BRAND.accent};
        }

        .ai-discover-eyebrow {
          will-change: transform, opacity, filter, letter-spacing;
        }

        .ai-discover-form {
          will-change: transform, opacity, filter;
        }

        .ai-discover-input-wrap {
          will-change: transform;
        }

        .ai-discover-input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(35, 31, 32, 0.14);
          background: ${TIDL_BRAND.surface};
          color: ${TIDL_BRAND.ink};
          padding: 1rem 3.5rem 1rem 1.25rem;
          font-size: 15px;
          outline: none;
          transition:
            border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 640px) {
          .ai-discover-input {
            padding: 1.15rem 3.75rem 1.15rem 1.5rem;
          }
        }

        .ai-discover-input:focus {
          border-color: rgba(224, 123, 10, 0.65);
          box-shadow:
            0 0 0 4px rgba(224, 123, 10, 0.16),
            0 16px 40px -20px rgba(224, 123, 10, 0.35);
          transform: translateY(-1px);
        }

        .ai-discover-input::placeholder {
          color: rgba(107, 106, 107, 0.75);
          transition: opacity 0.3s ease;
        }

        .ai-discover-input:focus::placeholder {
          opacity: 0.55;
        }

        .ai-discover-submit-wrap {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
        }

        .ai-discover-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 999px;
          background: ${TIDL_BRAND.accent};
          color: ${TIDL_BRAND.ink};
          cursor: pointer;
          will-change: transform, opacity;
          transition: filter 0.3s ease;
        }

        @media (min-width: 640px) {
          .ai-discover-submit {
            width: 2.75rem;
            height: 2.75rem;
          }
        }

        .ai-discover-submit:not(:disabled):hover {
          filter: brightness(1.06);
        }

        .ai-discover-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ai-discover-chip {
          border-radius: 999px;
          border: 1px solid rgba(35, 31, 32, 0.12);
          background: rgba(255, 255, 255, 0.78);
          color: ${TIDL_BRAND.inkMuted};
          padding: 0.4rem 0.9rem;
          font-size: 12px;
          cursor: pointer;
          will-change: transform, opacity, filter;
          backdrop-filter: blur(6px);
          transition: color 0.25s ease;
        }

        @media (min-width: 640px) {
          .ai-discover-chip { font-size: 13px; }
        }

        .ai-discover-chip:hover {
          color: ${TIDL_BRAND.ink};
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-discover-glow { display: none; }
        }
      `}</style>

      <div
        ref={shellRef}
        className="ai-discover-shell relative px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20"
      >
        <div ref={glowRef} className="ai-discover-glow" aria-hidden />

        <div className="relative mx-auto max-w-3xl text-center">
          <p
            ref={eyebrowRef}
            className="ai-discover-eyebrow tidl-eyebrow mb-4"
            style={{ color: "rgba(35,31,32,0.45)" }}
          >
            Discover your path
          </p>

          <h2
            ref={headlineRef}
            className="tidl-display text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.025em]"
            style={{ color: TIDL_BRAND.ink }}
          >
            <DiscoverLine text="Describe your goal." />
            <DiscoverLine text="We'll guide you." italic accent />
          </h2>

          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="ai-discover-form relative mx-auto mt-8 max-w-2xl"
          >
            <label htmlFor="home-ai-search" className="sr-only">
              Describe your health goal
            </label>
            <div ref={inputWrapRef} className="ai-discover-input-wrap relative">
              <input
                id="home-ai-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I want GLP-1 weight loss with a pre-dosed pen"
                className="ai-discover-input"
                autoComplete="off"
              />
              <div className="ai-discover-submit-wrap">
                <button
                  ref={submitRef}
                  type="submit"
                  disabled={!query.trim()}
                  className="ai-discover-submit"
                  aria-label="Find treatments"
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>

          <div
            ref={chipsRef}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => goToSearch(suggestion)}
                className="ai-discover-chip"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
