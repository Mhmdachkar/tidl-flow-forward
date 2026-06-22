import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────
// TODO: Replace with real patient reviews before launch

const REVIEWS = [
  {
    id: 0,
    name: "Sarah M.", age: 34,
    tag: "Weight Loss",
    outcome: "−18 lbs in 12 weeks",
    quote: "First time I felt a doctor was actually looking at my case — not just approving a form.",
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

const STATS = [
  { value: 4.9,  suffix: "/5",  label: "Avg. rating",     isDecimal: true  },
  { value: 2400, suffix: "+",   label: "Verified reviews", isDecimal: false },
  { value: 50,   suffix: "",    label: "States served",    isDecimal: false },
] as const;

const MARQUEE_ITEMS = [
  "4.9 Stars", "Physician Reviewed", "Real Outcomes", "50 States",
  "Board-Certified", "Discreet Delivery", "Real Patients", "HIPAA Compliant",
];

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
  const rootRef    = useRef<HTMLElement | null>(null);
  const cursorRef  = useRef<HTMLDivElement | null>(null);
  const headRef    = useRef<HTMLDivElement | null>(null);
  const statsRef    = useRef<HTMLDivElement | null>(null);
  const marqueeRef  = useRef<HTMLDivElement | null>(null);
  const reviewsRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        root.addEventListener("mousemove", onMove);
      }

      if (reduced) return;

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

      // ── eyebrow line grow ───────────────────────────────────────────────
      const eyebrowLine = root.querySelector<HTMLElement>(".eyebrow-line");
      if (eyebrowLine) {
        gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(eyebrowLine, {
          scaleX: 1, duration: 1.0, ease: "expo.out",
          scrollTrigger: { trigger: eyebrowLine, start: "top 90%" },
        });
      }

      // ── stats count-up ──────────────────────────────────────────────────
      const st = statsRef.current;
      if (st) {
        STATS.forEach((s, i) => {
          const el = st.querySelector<HTMLElement>(`[data-si="${i}"]`);
          if (!el) return;
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: s.value, duration: 1.8, ease: "power3.out",
            scrollTrigger: { trigger: st, start: "top 88%" },
            onUpdate: () => {
              el.textContent = s.isDecimal
                ? proxy.v.toFixed(1)
                : Math.round(proxy.v).toLocaleString();
            },
          });
        });
      }

      // ── reviews auto slider (text only) ─────────────────────────────────
      const rmq = reviewsRef.current;
      if (rmq) {
        const tween = gsap.to(rmq, { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
        rmq.addEventListener("mouseenter", () => tween.pause());
        rmq.addEventListener("mouseleave", () => tween.resume());
      }

      // ── marquee ─────────────────────────────────────────────────────────
      const mq = marqueeRef.current?.firstElementChild as HTMLElement | null;
      if (mq) {
        gsap.to(mq, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Patient outcomes"
      onMouseMove={(e) => {
        const cur = cursorRef.current;
        if (!cur) return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        gsap.to(cur, {
          x: e.clientX - r.left - 200,
          y: e.clientY - r.top  - 200,
          duration: 0, overwrite: "auto",
        });
      }}
      className="relative overflow-hidden"
      style={{ background: "#f0ede8", color: "#161616" }}
    >
      {/* cursor spotlight */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(45,74,62,0.07) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* subtle dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(22,22,22,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── header zone ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-16 lg:pt-24 lg:pb-10">

        {/* eyebrow */}
        <div className="mb-10 flex items-center gap-4">
          <span
            className="eyebrow-line h-px w-10 flex-shrink-0"
            style={{ background: "#2d4a3e" }}
          />
          <span
            className="text-[11px] font-medium uppercase"
            style={{ letterSpacing: "0.32em", color: "#2d4a3e" }}
          >
            §05 — Patient Outcomes
          </span>
        </div>

        {/* headline + stats grid */}
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1fr_auto]">

          {/* headline */}
          <div ref={headRef}>
            <h2
              className="leading-[0.9]"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: "clamp(44px, 6vw, 88px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
              }}
            >
              <RevLine text="What happens" />
              <RevLine text="when medicine" italic color="#2d4a3e" />
              <RevLine text="meets real people." />
            </h2>
          </div>

          {/* stat counters */}
          <div
            ref={statsRef}
            className="flex flex-col gap-4 pb-2 sm:flex-row sm:gap-8 lg:flex-col lg:gap-6"
          >
            {STATS.map((s, i) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontSize: "clamp(28px, 3vw, 44px)",
                    color: "#2d4a3e",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  <span data-si={i}>0</span>
                  {s.suffix}
                </p>
                <p
                  className="mt-1 text-[10px] uppercase"
                  style={{ letterSpacing: "0.22em", color: "rgba(22,22,22,0.5)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* thin rule */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-8 sm:px-10 lg:px-16">
        <div className="h-px" style={{ background: "rgba(22,22,22,0.1)" }} />
      </div>

      {/* ── reviews auto slider — text only, no container, no border ──────── */}
      <div className="relative z-10 overflow-hidden py-10 sm:py-14 lg:py-16">
        <div ref={reviewsRef} className="flex w-max items-start">
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[400px] lg:w-[480px] px-8 sm:px-12 lg:px-16"
            >
              <p
                style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: "clamp(20px, 1.8vw, 28px)",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                  color: "#161616",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>
              <p
                className="mt-5 text-[11px] font-medium uppercase"
                style={{ letterSpacing: "0.24em", color: "#2d4a3e" }}
              >
                {r.name}, {r.age}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── marquee ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 overflow-hidden py-10"
        style={{
          borderTop: "1px solid rgba(22,22,22,0.08)",
          borderBottom: "1px solid rgba(22,22,22,0.08)",
        }}
      >
        <div ref={marqueeRef} className="w-full overflow-hidden">
          <div className="flex w-max items-center gap-12 whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-12">
                <span
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontSize: "clamp(28px, 3.5vw, 52px)",
                    color: i % 2 === 0 ? "#161616" : "transparent",
                    WebkitTextStroke: i % 2 === 0 ? "0" : "1px #161616",
                    fontStyle: i % 2 === 0 ? "normal" : "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item}
                </span>
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 6, height: 6,
                    borderRadius: "50%",
                    background: "#2d4a3e",
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── footer rule ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pb-10 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
        <div className="mt-10 h-px" style={{ background: "rgba(22,22,22,0.1)" }} />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <span
            className="text-[10px] font-medium uppercase"
            style={{ letterSpacing: "0.28em", color: "rgba(22,22,22,0.4)" }}
          >
            TIDL · Patient Outcomes
          </span>
          <span
            className="text-[10px] font-medium uppercase"
            style={{ letterSpacing: "0.28em", color: "rgba(22,22,22,0.4)" }}
          >
            End of §05
          </span>
        </div>
      </div>
    </section>
  );
}
