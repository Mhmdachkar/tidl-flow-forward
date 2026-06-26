import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { canUseHoverParallax, createScrollGate, rafThrottle } from "@/lib/section-performance";
import { createTiltQuickTo } from "@/lib/gsap-tilt";

const DOCTORS = [
  {
    name: "Dr. Lena Marsh, MD",
    title: "Head of Metabolic & Weight Care",
    department: "Metabolic & Weight",
    credentials: "MD, ABOM",
    specialties: ["Metabolic Health", "GLP-1 Therapies", "Obesity Medicine"],
    bio: "Board-certified in obesity medicine with 14 years guiding patients through GLP-1 therapy, metabolic health, and sustainable weight outcomes.",
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. Omar Khalil, MD",
    title: "Head of Hormonal Health",
    department: "Hormonal Health",
    credentials: "MD, FACE",
    specialties: ["Men's Health", "Hormone Optimisation", "Performance"],
    bio: "Specialises in hormone optimisation and men's health, with a focus on evidence-based protocols for energy, recovery, and long-term vitality.",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. Sara Chen, MD",
    title: "Head of Longevity Medicine",
    department: "Longevity Medicine",
    credentials: "MD, ABAARM",
    specialties: ["Peptide Therapy", "Cellular Health", "Anti-Ageing"],
    bio: "Leads TIDL's longevity protocols with expertise in peptide therapy and preventive medicine for patients focused on healthspan and recovery.",
    photo:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. James Osei, MD",
    title: "Head of Medical Affairs",
    department: "Medical Affairs",
    credentials: "MD, FACP",
    specialties: ["Clinical Safety", "Pharmacology", "Prescribing Standards"],
    bio: "Oversees clinical safety and prescribing standards across TIDL's physician network, ensuring every treatment meets regulatory and ethical guidelines.",
    photo:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=420&h=560&q=85&fit=crop",
  },
] as const;

export function DoctorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverFine = canUseHoverParallax();
    const scrollGate = createScrollGate();
    const cleanups: Array<() => void> = [scrollGate.dispose];

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll<HTMLElement>(".doctor-card");

      if (!reduced) {
        cards.forEach((card, index) => {
          const cta = card.querySelector<HTMLElement>(".doctor-card__cta");
          const fromLeft = index % 2 === 0;
          const fromCenter = index === 2;

          gsap.set(card, {
            opacity: 0,
            x: fromCenter ? 0 : fromLeft ? -64 : 64,
            y: fromCenter ? 36 : 24,
            scale: fromCenter ? 0.88 : 1,
            filter: fromCenter ? "blur(8px)" : "blur(4px)",
          });
          if (cta) {
            gsap.set(cta, { opacity: 0, scale: 0.72, y: 10 });
          }

          gsap.to(card, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: fromCenter ? 1.05 : 0.95,
            ease: fromCenter ? "back.out(1.35)" : "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });

          if (cta) {
            gsap.to(cta, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.55,
              ease: "back.out(2.4)",
              delay: fromCenter ? 0.22 : 0.14,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            });
          }
        });
      }

      if (!hoverFine || reduced) return;

      cards.forEach((card) => {
        const tilt = card.querySelector<HTMLElement>(".doctor-card__tilt");
        const shell = card.querySelector<HTMLElement>(".doctor-card__shell");
        const photo = card.querySelector<HTMLElement>(".doctor-card__photo");
        const front = card.querySelector<HTMLElement>(".doctor-card__front");
        const reveal = card.querySelector<HTMLElement>(".doctor-card__reveal");
        const revealLines = card.querySelectorAll<HTMLElement>(".doctor-card__reveal-line");
        const specItems = card.querySelectorAll<HTMLElement>(".doctor-card__spec-item");
        const scrim = card.querySelector<HTMLElement>(".doctor-card__scrim");

        const revealInner = card.querySelector<HTMLElement>(".doctor-card__reveal-inner");

        if (!tilt || !shell || !photo || !front || !reveal || !revealInner) return;

        const cardTilt = createTiltQuickTo(tilt, 0.7, "power3.out");
        const photoPanX = gsap.quickTo(photo, "x", { duration: 1, ease: "power3.out" });

        gsap.set(reveal, { height: 0, opacity: 0 });
        gsap.set(revealLines, { y: 14, opacity: 0 });
        gsap.set(specItems, { x: -10, opacity: 0 });
        gsap.set(photo, { scale: 1, x: 0, filter: "saturate(0.88) contrast(1.02)" });

        let openHeight = revealInner.offsetHeight;

        const measureReveal = () => {
          gsap.set(reveal, { height: "auto", opacity: 1 });
          openHeight = reveal.offsetHeight;
          gsap.set(reveal, { height: 0, opacity: 0 });
        };

        measureReveal();
        window.addEventListener("resize", measureReveal);
        cleanups.push(() => window.removeEventListener("resize", measureReveal));

        const onEnter = () => {
          if (scrollGate.isScrolling()) return;
          measureReveal();
          card.classList.add("doctor-card--active");

          gsap
            .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
            .to(shell, {
              y: -8,
              boxShadow:
                "0 1px 0 rgba(255,255,255,1) inset, 0 32px 64px -28px rgba(35,31,32,0.28), 0 0 0 1px rgba(35,31,32,0.06)",
              duration: 0.75,
            })
            .to(photo, { scale: 1.05, filter: "saturate(1) contrast(1)", duration: 0.95 }, 0)
            .to(scrim, { opacity: 0.35, duration: 0.65 }, 0)
            .to(front, { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, duration: 0.4, ease: "power2.inOut" }, 0)
            .to(reveal, { height: openHeight, opacity: 1, duration: 0.72, ease: "power3.inOut" }, 0.08)
            .to(revealLines, { y: 0, opacity: 1, stagger: 0.06, duration: 0.55 }, 0.16)
            .to(specItems, { x: 0, opacity: 1, stagger: 0.05, duration: 0.5 }, 0.24);
        };

        const onLeave = () => {
          card.classList.remove("doctor-card--active");
          cardTilt.reset();
          photoPanX(0);

          gsap
            .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
            .to(specItems, { x: -10, opacity: 0, stagger: 0.03, duration: 0.3 }, 0)
            .to(revealLines, { y: 14, opacity: 0, stagger: 0.03, duration: 0.3 }, 0)
            .to(reveal, { height: 0, opacity: 0, duration: 0.55, ease: "power3.inOut" }, 0.04)
            .to(front, { opacity: 1, y: 0, height: "auto", paddingTop: "1rem", paddingBottom: "1.125rem", marginTop: 0, duration: 0.45 }, 0.12)
            .to(scrim, { opacity: 0, duration: 0.45 }, 0.12)
            .to(photo, { scale: 1, filter: "saturate(0.88) contrast(1.02)", duration: 0.65 }, 0.12)
            .to(
              shell,
              {
                y: 0,
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.95) inset, 0 16px 40px -28px rgba(35,31,32,0.22)",
                duration: 0.65,
              },
              0.12,
            );
        };

        const onMove = rafThrottle((event: PointerEvent) => {
          if (!card.classList.contains("doctor-card--active") || scrollGate.isScrolling()) return;
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          cardTilt.rotateY(px * 6);
          photoPanX(px * -6);
        });

        shell.addEventListener("mouseenter", onEnter);
        shell.addEventListener("mouseleave", onLeave);
        shell.addEventListener("pointermove", onMove, { passive: true });

        cleanups.push(() => {
          shell.removeEventListener("mouseenter", onEnter);
          shell.removeEventListener("mouseleave", onLeave);
          shell.removeEventListener("pointermove", onMove);
        });
      });
    }, section);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-zone="doctor"
      className="doctor-section"
      aria-label="Our physician team"
    >
      <style>{`
        .doctor-section {
          --doctor-gold: #e07b0a;
          --doctor-ink: #231f20;
          --doctor-ink-muted: rgba(35, 31, 32, 0.58);
          --doctor-line: rgba(35, 31, 32, 0.1);
          --doctor-panel: #fafaf7;
          --doctor-ease: cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          padding: clamp(3.5rem, 8vw, 5rem) clamp(1.25rem, 4vw, 3.5rem);
          background: linear-gradient(180deg, #ececec 0%, #e2e2e2 100%);
          color: var(--doctor-ink);
        }

        .doctor-section__inner {
          max-width: 72rem;
          margin-inline: auto;
        }

        .doctor-section__header {
          margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
          text-align: center;
        }

        .doctor-section__eyebrow {
          margin: 0 0 0.875rem;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--doctor-ink-muted);
        }

        .doctor-section__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.8vw, 3.25rem);
          line-height: 1.04;
          letter-spacing: -0.025em;
        }

        .doctor-section__title em {
          font-style: italic;
          font-weight: 400;
          color: var(--doctor-gold);
        }

        .doctor-section__title strong {
          font-weight: 700;
        }

        .doctor-section__lede {
          max-width: 32rem;
          margin: 1rem auto 0;
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--doctor-ink-muted);
        }

        .doctor-track {
          display: flex;
          gap: 1.125rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding-bottom: 0.5rem;
        }

        .doctor-track::-webkit-scrollbar { display: none; }

        @media (min-width: 1024px) {
          .doctor-track {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            overflow: visible;
            gap: 1.125rem;
          }
        }

        .doctor-card {
          flex: 0 0 min(76vw, 16.75rem);
          scroll-snap-align: start;
          perspective: 1200px;
        }

        @media (min-width: 640px) {
          .doctor-card { flex-basis: 16.75rem; }
        }

        @media (min-width: 1024px) {
          .doctor-card { flex: unset; min-width: 0; }
        }

        .doctor-card__tilt {
          transform-style: preserve-3d;
        }

        .doctor-card__shell {
          position: relative;
          display: flex;
          flex-direction: column;
          height: auto;
          border-radius: 1.25rem;
          overflow: hidden;
          background: var(--doctor-panel);
          border: 1px solid var(--doctor-line);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.95) inset,
            0 16px 40px -28px rgba(35, 31, 32, 0.22);
          outline: none;
          transition: box-shadow 0.75s var(--doctor-ease), transform 0.75s var(--doctor-ease);
        }

        .doctor-card__shell::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 3px;
          background: linear-gradient(180deg, var(--doctor-gold) 0%, rgba(224, 123, 10, 0.35) 100%);
          z-index: 8;
        }

        .doctor-card__shell:focus-visible {
          box-shadow:
            0 0 0 2px rgba(224, 123, 10, 0.5),
            0 16px 40px -28px rgba(35, 31, 32, 0.22);
        }

        .doctor-card__media {
          position: relative;
          flex: 0 0 auto;
          aspect-ratio: 4 / 4.35;
          width: 100%;
          overflow: hidden;
          background: #d4d4d4;
        }

        .doctor-card__photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          will-change: transform, filter;
        }

        .doctor-card__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(35, 31, 32, 0.18) 0%, transparent 45%);
          opacity: 0;
          transition: opacity 0.65s var(--doctor-ease);
          pointer-events: none;
        }

        .doctor-card__meta-bar {
          position: absolute;
          top: 0.875rem;
          left: 0.875rem;
          right: 0.875rem;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .doctor-card__index {
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 1px 8px rgba(35, 31, 32, 0.35);
        }

        .doctor-card__credential {
          display: inline-flex;
          align-items: center;
          padding: 0.28rem 0.55rem;
          border-radius: 0.375rem;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(35, 31, 32, 0.08);
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--doctor-ink);
          box-shadow: 0 4px 14px -6px rgba(35, 31, 32, 0.25);
        }

        .doctor-card__body {
          position: relative;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          background: var(--doctor-panel);
          overflow: hidden;
        }

        .doctor-card__hairline {
          height: 1px;
          margin: 0 1rem;
          background: linear-gradient(90deg, var(--doctor-gold), rgba(224, 123, 10, 0.15), transparent);
        }

        .doctor-card__front {
          padding: 1rem 1rem 1.125rem;
          will-change: transform, opacity, height;
          overflow: hidden;
        }

        .doctor-card__department {
          margin: 0 0 0.45rem;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--doctor-ink-muted);
        }

        .doctor-card__name {
          margin: 0 0 0.3rem;
          font-family: var(--font-display);
          font-size: 1.0625rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--doctor-ink);
        }

        .doctor-card__role {
          margin: 0;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--doctor-ink-muted);
        }

        .doctor-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.75rem;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(35, 31, 32, 0.42);
          transition: color 0.4s var(--doctor-ease);
          will-change: transform, opacity;
        }

        .doctor-card__cta svg {
          width: 0.7rem;
          height: 0.7rem;
          transition: transform 0.4s var(--doctor-ease);
        }

        .doctor-card--active .doctor-card__cta,
        .doctor-card__shell:hover .doctor-card__cta,
        .doctor-card__shell:focus-within .doctor-card__cta {
          color: var(--doctor-ink);
        }

        .doctor-card--active .doctor-card__cta svg,
        .doctor-card__shell:hover .doctor-card__cta svg,
        .doctor-card__shell:focus-within .doctor-card__cta svg {
          transform: translateX(2px);
        }

        .doctor-card__reveal {
          overflow: hidden;
          height: 0;
          opacity: 0;
          flex: 0 0 auto;
          border-top: 0 solid transparent;
          background: #fff;
        }

        .doctor-card--active .doctor-card__reveal {
          border-top-width: 1px;
          border-top-color: var(--doctor-line);
        }

        .doctor-card__reveal-inner {
          padding: 1rem 1rem 1.125rem;
        }

        .doctor-card__reveal-line {
          will-change: transform, opacity;
        }

        .doctor-card__bio {
          margin: 0;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.62;
          color: var(--doctor-ink-muted);
        }

        .doctor-card__spec-list {
          margin: 0.75rem 0 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--doctor-line);
          padding-top: 0.65rem;
        }

        .doctor-card__spec-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          padding: 0.28rem 0;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--doctor-ink);
          will-change: transform, opacity;
        }

        .doctor-card__spec-item::before {
          content: "";
          flex-shrink: 0;
          width: 0.35rem;
          height: 1px;
          background: var(--doctor-gold);
          transform: translateY(-0.05em);
        }

        @media (hover: none) {
          .doctor-card__reveal {
            height: auto !important;
            opacity: 1 !important;
          }

          .doctor-card__reveal-line,
          .doctor-card__spec-item {
            opacity: 1 !important;
            transform: none !important;
          }

          .doctor-card__bio {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .doctor-card__cta { display: none; }
        }

        @media (hover: hover) and (pointer: fine) {
          .doctor-card--active .doctor-card__front,
          .doctor-card__shell:focus-within .doctor-card__front {
            pointer-events: none;
          }
        }
      `}</style>

      <div className="doctor-section__inner">
        <header className="doctor-section__header">
          <p className="doctor-section__eyebrow">Clinical leadership</p>
          <h2 className="doctor-section__title">
            <em>The best care</em>
            <br />
            <strong>by the best in medicine</strong>
          </h2>
          <p className="doctor-section__lede">
            Board-certified physicians across metabolic, hormonal, and longevity medicine.
          </p>
        </header>

        <div className="doctor-track">
          {DOCTORS.map((doc, index) => (
            <article key={doc.name} className="doctor-card">
              <div className="doctor-card__tilt">
                <div className="doctor-card__shell" tabIndex={0}>
                  <div className="doctor-card__media">
                    <img
                      className="doctor-card__photo"
                      src={doc.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="doctor-card__scrim" aria-hidden />
                    <div className="doctor-card__meta-bar">
                      <span className="doctor-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="doctor-card__credential">{doc.credentials}</span>
                    </div>
                  </div>

                  <div className="doctor-card__body">
                    <div className="doctor-card__hairline" aria-hidden />

                    <div className="doctor-card__front">
                      <p className="doctor-card__department">{doc.department}</p>
                      <h3 className="doctor-card__name">{doc.name}</h3>
                      <p className="doctor-card__role">{doc.title}</p>
                      <span className="doctor-card__cta">
                        View credentials
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="doctor-card__reveal">
                      <div className="doctor-card__reveal-inner">
                        <div className="doctor-card__reveal-line">
                          <p className="doctor-card__bio">{doc.bio}</p>
                        </div>
                        <ul className="doctor-card__spec-list">
                          {doc.specialties.map((specialty) => (
                            <li key={specialty} className="doctor-card__spec-item">
                              {specialty}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
