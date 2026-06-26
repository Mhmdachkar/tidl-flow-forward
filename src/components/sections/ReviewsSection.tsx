import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { observeSectionVisibility } from "@/lib/section-performance";
import { TIDL_BRAND } from "@/lib/tidl-brand";

const REVIEWS = [
  {
    id: 0,
    name: "Sarah M.",
    age: 34,
    location: "Austin, TX",
    tag: "Weight Loss",
    outcome: "−18 lbs in 12 weeks",
    quote:
      "First time I felt a doctor was actually looking at my case, not just approving a form.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2024",
    avatar: "SM",
    hue: 42,
  },
  {
    id: 1,
    name: "James T.",
    age: 41,
    location: "Denver, CO",
    tag: "Hormone Health",
    outcome: "Normalized in 6 weeks",
    quote:
      "A doctor called me. Two days later my prescription arrived. That's telehealth done right.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2023",
    avatar: "JT",
    hue: 210,
  },
  {
    id: 2,
    name: "Rachel K.",
    age: 29,
    location: "Chicago, IL",
    tag: "Metabolic",
    outcome: "3-month transformation",
    quote:
      "They told me upfront I might not qualify. That honesty made all the difference.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2025",
    avatar: "RK",
    hue: 160,
  },
  {
    id: 3,
    name: "David L.",
    age: 52,
    location: "Miami, FL",
    tag: "Weight Loss",
    outcome: "Energy restored",
    quote:
      "I was skeptical. Now I'd never go back to waiting three weeks for a doctor.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2024",
    avatar: "DL",
    hue: 12,
  },
  {
    id: 4,
    name: "Maria C.",
    age: 38,
    location: "Portland, OR",
    tag: "Hormonal Balance",
    outcome: "Balance restored",
    quote:
      "My physician followed up after delivery to check my progress. I didn't expect that.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2023",
    avatar: "MC",
    hue: 280,
  },
  {
    id: 5,
    name: "Tom W.",
    age: 45,
    location: "Seattle, WA",
    tag: "GLP-1",
    outcome: "−22 lbs",
    quote:
      "The pen was so simple I used it correctly the first time. No mixing. Just done.",
    stars: 5,
    verified: true,
    tenure: "Patient since 2024",
    avatar: "TW",
    hue: 195,
  },
] as const;

const AGGREGATE = {
  rating: 4.9,
  total: "2,400+",
  recommend: "97%",
} as const;

function Stars({ count }: { count: number }) {
  return (
    <span className="rv-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" aria-hidden className={i < count ? "rv-star rv-star--on" : "rv-star"}>
          <path d="M8 1.2l1.76 3.57 3.94.57-2.85 2.78.67 3.92L8 10.67l-3.52 1.85.67-3.92L2.3 5.34l3.94-.57L8 1.2z" />
        </svg>
      ))}
    </span>
  );
}

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

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <article className="rv-card">
      <div className="rv-card__top">
        <div
          className="rv-card__avatar"
          style={{ background: `hsl(${review.hue} 42% 88%)`, color: `hsl(${review.hue} 38% 28%)` }}
          aria-hidden
        >
          {review.avatar}
        </div>
        <div className="rv-card__identity">
          <div className="rv-card__name-row">
            <span className="rv-card__name">{review.name}</span>
            {review.verified && (
              <span className="rv-card__verified">
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M6.2 10.6L3.8 8.2l-.9.9 3.3 3.3 6.7-6.7-.9-.9-5.8 5.8z" />
                </svg>
                Verified patient
              </span>
            )}
          </div>
          <p className="rv-card__meta">
            {review.location} · Age {review.age}
          </p>
        </div>
        <Stars count={review.stars} />
      </div>

      <p className="rv-card__quote">&ldquo;{review.quote}&rdquo;</p>

      <div className="rv-card__footer">
        <span className="rv-card__tag">{review.tag}</span>
        <span className="rv-card__outcome">{review.outcome}</span>
      </div>
      <p className="rv-card__tenure">{review.tenure}</p>
    </article>
  );
}

export function ReviewsSection() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

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
      const cur = cursorRef.current;
      const isTouch = window.matchMedia("(max-width: 1023px)").matches;
      if (cur && !isTouch) {
        const qx = gsap.quickTo(cur, "x", { duration: 0.85, ease: "power3.out" });
        const qy = gsap.quickTo(cur, "y", { duration: 0.85, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          qx(e.clientX - r.left - 200);
          qy(e.clientY - r.top - 200);
        };
        root.addEventListener("mousemove", onMove, { passive: true });
        cleanups.push(() => root.removeEventListener("mousemove", onMove));
      }

      if (reducedMotion) return;

      const words = headRef.current?.querySelectorAll<HTMLElement>(".rv-w");
      if (words?.length) {
        gsap.set(words, { yPercent: 115, opacity: 0 });
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          stagger: 0.055,
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        });
      }

      gsap.from(".rv-score", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".rv-score", start: "top 88%", once: true },
      });

      const rmq = reviewsRef.current;
      if (rmq) {
        const tween = gsap.to(rmq, { xPercent: -50, duration: 55, ease: "none", repeat: -1, paused: true });
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
      data-nav-zone="reviews"
      aria-label="Patient outcomes"
      className="tidl-brand-section rv-section relative overflow-hidden"
      style={{ background: TIDL_BRAND.bg, color: TIDL_BRAND.ink }}
    >
      <style>{`
        .rv-section {
          --rv-line: rgba(35, 31, 32, 0.1);
          --rv-card-bg: #ffffff;
          --rv-card-border: rgba(35, 31, 32, 0.08);
        }

        .rv-cursor {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(224, 123, 10,0.07) 0%, transparent 70%);
          filter: blur(6px);
        }

        .rv-dots {
          background-image: radial-gradient(circle, rgba(35,31,32,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .rv-header {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 900px) {
          .rv-header {
            grid-template-columns: 1fr auto;
            align-items: end;
            gap: 3rem;
          }
        }

        .rv-score {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1.25rem 1.35rem;
          border-radius: 1rem;
          background: var(--rv-card-bg);
          border: 1px solid var(--rv-card-border);
          box-shadow: 0 18px 48px -28px rgba(35, 31, 32, 0.18);
          min-width: min(100%, 16rem);
        }

        .rv-score__label {
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${TIDL_BRAND.inkMuted};
        }

        .rv-score__row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .rv-score__num {
          font-family: "Archivo Narrow", sans-serif;
          font-size: 2.75rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .rv-score__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: 0.8125rem;
          color: ${TIDL_BRAND.inkMuted};
        }

        .rv-score__stats strong {
          color: ${TIDL_BRAND.ink};
          font-weight: 600;
        }

        .rv-stars {
          display: inline-flex;
          gap: 0.12rem;
        }

        .rv-star {
          width: 0.875rem;
          height: 0.875rem;
          fill: rgba(35, 31, 32, 0.12);
        }

        .rv-star--on {
          fill: ${TIDL_BRAND.accent};
        }

        .rv-card {
          flex-shrink: 0;
          width: min(88vw, 22rem);
          padding: 1.35rem 1.4rem 1.2rem;
          border-radius: 1.125rem;
          background: var(--rv-card-bg);
          border: 1px solid var(--rv-card-border);
          box-shadow: 0 20px 50px -32px rgba(35, 31, 32, 0.22);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
        }

        @media (min-width: 640px) {
          .rv-card { width: 22rem; }
        }

        .rv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 56px -28px rgba(35, 31, 32, 0.26);
        }

        .rv-card__top {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.75rem;
          align-items: start;
        }

        .rv-card__avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .rv-card__identity { min-width: 0; }

        .rv-card__name-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem 0.5rem;
        }

        .rv-card__name {
          font-family: "Archivo Narrow", sans-serif;
          font-size: 0.9375rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .rv-card__verified {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
          background: rgba(224, 123, 10, 0.14);
          color: #8a7200;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .rv-card__verified svg {
          width: 0.625rem;
          height: 0.625rem;
          fill: currentColor;
        }

        .rv-card__meta {
          margin: 0.15rem 0 0;
          font-size: 0.75rem;
          color: ${TIDL_BRAND.inkMuted};
        }

        .rv-card__quote {
          margin: 1rem 0 0;
          font-family: "Archivo", system-ui, sans-serif;
          font-size: 0.9375rem;
          line-height: 1.55;
          color: ${TIDL_BRAND.ink};
        }

        .rv-card__footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--rv-line);
        }

        .rv-card__tag {
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          background: rgba(35, 31, 32, 0.05);
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${TIDL_BRAND.inkMuted};
        }

        .rv-card__outcome {
          font-family: "Archivo Narrow", sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          color: ${TIDL_BRAND.accent};
        }

        .rv-card__tenure {
          margin: 0.65rem 0 0;
          font-size: 0.6875rem;
          color: ${TIDL_BRAND.inkMuted};
        }

        .rv-track {
          display: flex;
          gap: 1rem;
          padding-inline: 1.25rem;
        }

        @media (min-width: 640px) {
          .rv-track { gap: 1.25rem; padding-inline: 2rem; }
        }

        .rv-fade-left,
        .rv-fade-right {
          pointer-events: none;
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(2rem, 8vw, 5rem);
          z-index: 2;
        }

        .rv-fade-left {
          left: 0;
          background: linear-gradient(90deg, ${TIDL_BRAND.bg} 0%, transparent 100%);
        }

        .rv-fade-right {
          right: 0;
          background: linear-gradient(270deg, ${TIDL_BRAND.bg} 0%, transparent 100%);
        }

        .rv-grid {
          display: grid;
          gap: 1rem;
          padding: 2.5rem 1.25rem 3rem;
        }

        @media (min-width: 640px) {
          .rv-grid {
            grid-template-columns: repeat(2, 1fr);
            padding-inline: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .rv-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div ref={cursorRef} aria-hidden className="rv-cursor pointer-events-none absolute left-0 top-0 z-0" />
      <div aria-hidden className="rv-dots pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-16 lg:pt-24 lg:pb-10">
        <div ref={headRef} className="rv-header">
          <div>
            <p className="tidl-eyebrow mb-4" style={{ color: TIDL_BRAND.accent }}>
              Patient stories
            </p>
            <h2 className="tidl-display text-[clamp(44px,6vw,88px)] tracking-[-0.025em]">
              <RevLine text="What happens" />
              <RevLine text="when medicine" italic color={TIDL_BRAND.accent} />
              <RevLine text="meets real people." />
            </h2>
          </div>

          <aside className="rv-score" aria-label="Aggregate patient rating">
            <span className="rv-score__label">Community rating</span>
            <div className="rv-score__row">
              <span className="rv-score__num">{AGGREGATE.rating}</span>
              <Stars count={5} />
            </div>
            <div className="rv-score__stats">
              <span><strong>{AGGREGATE.total}</strong> reviews</span>
              <span><strong>{AGGREGATE.recommend}</strong> would recommend</span>
            </div>
          </aside>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-8 sm:px-10 lg:px-16">
        <div className="h-px" style={{ background: "rgba(35,31,32,0.1)" }} />
      </div>

      {reduced ? (
        <div className="rv-grid">
          {REVIEWS.slice(0, 3).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden py-10 sm:py-14 lg:py-16">
          <div className="rv-fade-left" aria-hidden />
          <div className="rv-fade-right" aria-hidden />
          <div ref={reviewsRef} className="rv-track w-max">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
