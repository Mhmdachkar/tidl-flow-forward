import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getAiSearchSuggestions } from "@/lib/ai-search";
import { TIDL_BRAND } from "@/lib/tidl-brand";

export function AiSearchSection() {
  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const suggestions = getAiSearchSuggestions();

  useEffect(() => {
    const root = rootRef.current;
    const shell = shellRef.current;
    if (!root || !shell) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const items = root.querySelectorAll<HTMLElement>(".ai-discover-reveal");

      gsap.set(shell, { opacity: 0, y: 72, scale: 0.985 });
      gsap.set(items, { opacity: 0, y: 48 });

      const reveal = () => {
        gsap.to(shell, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          stagger: 0.09,
          ease: "expo.out",
          delay: 0.12,
          overwrite: "auto",
        });
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });

      if (root.getBoundingClientRect().top < window.innerHeight * 0.88) {
        reveal();
      }

      gsap.to(shell, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.2,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

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
      className="relative px-2 pb-0"
    >
      <div
        ref={shellRef}
        className="ai-discover-shell relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="relative mx-auto max-w-3xl text-center">
              <p
                className="ai-discover-reveal tidl-eyebrow mb-4"
                style={{ color: "rgba(35,31,32,0.45)" }}
              >
                Discover your path
              </p>
              <h2
                className="ai-discover-reveal tidl-display text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.025em]"
                style={{ color: TIDL_BRAND.ink }}
              >
                Describe your goal.{" "}
                <span className="italic" style={{ color: TIDL_BRAND.accent }}>
                  We&apos;ll guide you.
                </span>
              </h2>

              <form onSubmit={onSubmit} className="ai-discover-reveal relative mx-auto mt-8 max-w-2xl">
                <label htmlFor="home-ai-search" className="sr-only">
                  Describe your health goal
                </label>
                <input
                  id="home-ai-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. I want GLP-1 weight loss with a pre-dosed pen"
                  className="w-full rounded-full border px-5 py-4 pr-14 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 focus:shadow-[0_0_0_4px_rgba(243,195,0,0.18)] sm:px-6 sm:py-[1.15rem]"
                  style={{
                    borderColor: "rgba(35,31,32,0.14)",
                    background: TIDL_BRAND.surface,
                    color: TIDL_BRAND.ink,
                  }}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-40 sm:h-11 sm:w-11"
                  style={{ background: TIDL_BRAND.accent, color: TIDL_BRAND.ink }}
                  aria-label="Find treatments"
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </form>

              <div className="ai-discover-reveal mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => goToSearch(suggestion)}
                    className="rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-200 hover:border-[rgba(243,195,0,0.55)] sm:text-[13px]"
                    style={{
                      borderColor: "rgba(35,31,32,0.12)",
                      background: "rgba(255,255,255,0.72)",
                      color: TIDL_BRAND.inkMuted,
                    }}
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
