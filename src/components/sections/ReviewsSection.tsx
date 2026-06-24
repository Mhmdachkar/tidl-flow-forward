import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { observeSectionVisibility } from "@/lib/section-performance";
import { TIDL_BRAND } from "@/lib/tidl-brand";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Section implementation: done (home ReviewsSection is live).
// Content: awaiting real patient reviews, photos, and social feed from client.

const REVIEWS = [
  {
    id: 0,
    name: "Sarah M.", age: 34,
    tag: "Weight Loss",
    outcome: "−18 lbs in 12 weeks",
    quote: "First time I felt a doctor was actually looking at my case, not just approving a form.",
    stars: 5,
  },
  {
    id: 1,
    name: "James T.", age: 41,
    tag: "Hormone Health",
    outcome: "Normalized in 6 weeks",
    quote: "A doctor called me. Two days later my prescription arrived. That's telehealth done right.",
    stars: 5,
  },
  {
    id: 2,
    name: "Rachel K.", age: 29,
    tag: "Metabolic",
    outcome: "3-month transformation",
    quote: "They told me upfront I might not qualify. That honesty made all the difference.",
    stars: 5,
  },
  {
    id: 3,
    name: "David L.", age: 52,
    tag: "Weight Loss",
    outcome: "Energy restored",
    quote: "I was skeptical. Now I'd never go back to waiting three weeks for a doctor.",
    stars: 5,
  },
  {
    id: 4,
    name: "Maria C.", age: 38,
    tag: "Hormonal Balance",
    outcome: "Balance restored",
    quote: "My physician followed up after delivery to check my progress. I didn't expect that.",
    stars: 5,
  },
  {
    id: 5,
    name: "Tom W.", age: 45,
    tag: "GLP-1",
    outcome: "−22 lbs",
    quote: "The pen was so simple I used it correctly the first time. No mixing. Just done.",
    stars: 5,
  },
] as const;

// ─── Headline line with per-word mask reveal spans ────────────────────────────

function RevLine({
  text,
  italic,
  color,
}: {
  text: string;
  italic?: boolean;
  color?: string;
}) {
  return (
    <span
      className={`block overflow-hidden pb-[0.04em]${italic ? " italic" : ""}`}
      style={color ? { color } : undefined}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className="rv-w inline-block">{w}</span>
        </span>
      ))}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function ReviewsSection() {
  const reduced = useReducedMotion();
  const rootRef    = useRef<HTMLElement | null>(null);
  const cursorRef  = useRef<HTMLDivElement | null>(null);
  const headRef    = useRef<HTMLDivElement | null>(null);
  const reviewsRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loopTweens: gsap.core.Tween[] = [];
    const cleanups: Array<() => void> = [];

    const pauseLoops = () => loopTweens.forEach((tween) => tween.pause());
    const resumeLoops = () => {
      if (!reducedMotion) loopTweens.forEach((tween) => tween.resume());
    };
    cleanups.push(observeSectionVisibility(root, resumeLoops, pauseLoops));

    const ctx = gsap.context(() => {
      // ── cursor spotlight ────────────────────────────────────────────────
      const cur = cursorRef.current;
      const isTouch = window.matchMedia("(max-width: 1023px)").matches;
      if (cur && !isTouch) {
        const qx = gsap.quickTo(cur, "x", { duration: 0.85, ease: "power3.out" });
        const qy = gsap.quickTo(cur, "y", { duration: 0.85, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          qx(e.clientX - r.left - 200);
          qy(e.clientY - r.top  - 200);
        };
        root.addEventListener("mousemove", onMove, { passive: true });
        cleanups.push(() => root.removeEventListener("mousemove", onMove));
      }

      if (reducedMotion) return;

      // ── headline word reveal ────────────────────────────────────────────
      const words = headRef.current?.querySelectorAll<HTMLElement>(".rv-w");
      if (words?.length) {
        gsap.set(words, { yPercent: 115, opacity: 0 });
        gsap.to(words, {
          yPercent: 0, opacity: 1,
          duration: 1.0, ease: "expo.out",
          stagger: 0.055,
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        });
      }

      // ── reviews auto slider (text only) ─────────────────────────────────
      const rmq = reviewsRef.current;
      if (rmq) {
        const tween = gsap.to(rmq, { xPercent: -50, duration: 50, ease: "none", repeat: -1, paused: true });
        loopTweens.push(tween);
        const pauseSlider = () => tween.pause();
        const resumeSlider = () => {
          if (root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top < window.innerHeight) {
            tween.resume();
          }
        };
        rmq.addEventListener("mouseenter", pauseSlider);
        rmq.addEventListener("mouseleave", resumeSlider);
        rmq.addEventListener("touchstart", pauseSlider, { passive: true });
        rmq.addEventListener("touchend", resumeSlider, { passive: true });
        rmq.addEventListener("touchcancel", resumeSlider, { passive: true });
        cleanups.push(() => {
          rmq.removeEventListener("mouseenter", pauseSlider);
          rmq.removeEventListener("mouseleave", resumeSlider);
          rmq.removeEventListener("touchstart", pauseSlider);
          rmq.removeEventListener("touchend", resumeSlider);
          rmq.removeEventListener("touchcancel", resumeSlider);
        });
      }

    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Patient outcomes"
      className="tidl-brand-section relative overflow-hidden"
      style={{ background: TIDL_BRAND.bg, color: TIDL_BRAND.ink }}
    >
      {/* cursor spotlight */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(243,195,0,0.07) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* subtle dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(35,31,32,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── header zone ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-16 lg:pt-24 lg:pb-10">
        <div ref={headRef}>
          <h2 className="tidl-display text-[clamp(44px,6vw,88px)] tracking-[-0.025em]">
            <RevLine text="What happens" />
            <RevLine text="when medicine" italic color={TIDL_BRAND.accent} />
            <RevLine text="meets real people." />
          </h2>
        </div>
      </div>

      {/* thin rule */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-8 sm:px-10 lg:px-16">
        <div className="h-px" style={{ background: "rgba(35,31,32,0.1)" }} />
      </div>

      {/* ── reviews auto slider — text only, no container, no border ──────── */}
      {reduced ? (
        <div className="relative z-10 mx-auto max-w-[1360px] px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.slice(0, 3).map((r) => (
              <div key={r.id}>
                <p
                  className="tidl-body text-[clamp(20px,1.8vw,28px)] italic leading-[1.35] tracking-[-0.01em]"
                  style={{ color: TIDL_BRAND.ink }}
                >
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="tidl-eyebrow mt-5" style={{ color: TIDL_BRAND.accent }}>
                  {r.name}, {r.age}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden py-10 sm:py-14 lg:py-16">
          <div ref={reviewsRef} className="flex w-max items-start">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[400px] lg:w-[480px] px-8 sm:px-12 lg:px-16"
              >
                <p
                  className="tidl-body text-[clamp(20px,1.8vw,28px)] italic leading-[1.35] tracking-[-0.01em]"
                  style={{ color: TIDL_BRAND.ink }}
                >
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="tidl-eyebrow mt-5" style={{ color: TIDL_BRAND.accent }}>
                  {r.name}, {r.age}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
