import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";

const CREDENTIAL_CARDS = [
  {
    label: "Licensure",
    title: "Licensed physicians across active states",
    body: "Every prescription decision is made by a licensed clinician in the patient's state of residence.",
  },
  {
    label: "Clinical review",
    title: "Board-certified telehealth providers",
    body: "Protocols are reviewed against intake, history and contraindication checks before any approval is issued.",
  },
  {
    label: "Medical safety",
    title: "Human escalation for every medical question",
    body: "No automated diagnosis. Any clinical concern routes directly to a physician-led workflow.",
  },
] as const;

const TRUST_METRICS = [
  { value: "24h", label: "Average physician review window" },
  { value: "100%", label: "Prescriptions reviewed by a human" },
  { value: "50+", label: "Clinical checks per intake" },
] as const;

export function DoctorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      const eyebrow = sec.querySelector<HTMLElement>(".dr-eyebrow");
      const heading  = sec.querySelector<HTMLElement>(".dr-heading");
      const body     = sec.querySelector<HTMLElement>(".dr-body");
      const cta      = sec.querySelector<HTMLElement>(".dr-cta");
      const cards    = Array.from(sec.querySelectorAll<HTMLElement>(".dr-card"));
      const metrics  = Array.from(sec.querySelectorAll<HTMLElement>(".dr-metric"));
      const grid     = sec.querySelector<HTMLElement>(".dr-grid");

      if (!eyebrow || !heading || !body || !cta || !grid) return;

      // initial hidden state
      gsap.set([eyebrow, heading, body, cta], { opacity: 0, y: 28 });
      gsap.set(cards,   { opacity: 0, y: 40, scale: 0.96, rotateX: -8, transformOrigin: "50% 0%" });
      gsap.set(metrics, { opacity: 0, y: 20 });

      // entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sec, start: "top 78%" },
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.40 }, 0);
      tl.to(heading, { opacity: 1, y: 0, duration: 0.55 }, 0.08);
      tl.to(body,    { opacity: 1, y: 0, duration: 0.50 }, 0.18);
      tl.to(cta,     { opacity: 1, y: 0, duration: 0.45 }, 0.26);
      tl.to(cards,   { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.65, stagger: 0.13 }, 0.28);
      tl.to(metrics, { opacity: 1, y: 0, duration: 0.50, stagger: 0.09 }, 0.64);

      // parallax glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: -14,
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.3 },
        });
      }

      // subtle grid parallax
      gsap.fromTo(
        grid,
        { yPercent: 4 },
        { yPercent: -4, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.1 } },
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f8f7f3] py-20 sm:py-24 lg:py-28"
    >
      {/* background grid + glow */}
      <div className="absolute inset-0 bg-grid opacity-35" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(243,195,0,0.28), rgba(243,195,0,0))" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">

        {/* ── intro copy ── */}
        <div className="max-w-3xl">
          <span className="dr-eyebrow pill-tag mb-5 inline-flex !border-ink/15 !bg-white/70 !text-ink/70">
            <span className="dot !bg-[#F3C300]" /> Doctor network
          </span>

          <h2 className="dr-heading font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.97] text-ink">
            Care decisions made by
            <br />
            <span className="italic text-gradient-clinical">real physicians.</span>
          </h2>

          <p className="dr-body mt-5 max-w-2xl text-ink-soft">
            TIDL pairs every eligible patient with a licensed telehealth physician.
            Prescriptions are reviewed clinically, written by humans and documented
            through regulated care workflows — never by an algorithm.
          </p>

          <div className="dr-cta mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Start your assessment
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-ink/40">
              No AI diagnosis · Human review required
            </span>
          </div>
        </div>

        {/* ── credential cards ── */}
        <div className="dr-grid mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
          {CREDENTIAL_CARDS.map((card) => (
            <article
              key={card.title}
              className="dr-card group relative overflow-hidden rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-[0_18px_42px_-28px_rgba(23,30,36,0.38)] backdrop-blur-md"
            >
              {/* hover shimmer */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "linear-gradient(145deg, rgba(243,195,0,0.14), transparent 55%)" }}
              />
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/40">
                {card.label}
              </p>
              <h3 className="relative mt-3 font-display text-[1.35rem] leading-tight text-ink">
                {card.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-soft">{card.body}</p>

              {/* bottom gold accent line */}
              <div className="relative mt-5 h-px w-12 bg-[#F3C300]/60" />
            </article>
          ))}
        </div>

        {/* ── trust metric strip ── */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TRUST_METRICS.map((m) => (
            <div
              key={m.label}
              className="dr-metric rounded-2xl border border-ink/10 bg-white/65 px-5 py-4 backdrop-blur-sm"
            >
              <p className="font-display text-[1.55rem] leading-none text-ink">{m.value}</p>
              <p className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-ink/50">{m.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
