import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { canUseHoverParallax, createScrollGate, prefersReducedMotion, rafThrottle } from "@/lib/section-performance";
import { createTiltQuickTo } from "@/lib/gsap-tilt";

const SCROLLER = document.documentElement;
const GPU = { force3D: true } as const;

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

    const reduced = prefersReducedMotion();
    const hoverFine = canUseHoverParallax();
    const scrollGate = createScrollGate();
    const cleanups: Array<() => void> = [scrollGate.dispose];
    let refreshRaf = 0;
    let disposed = false;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll<HTMLElement>(".doctor-card");
      const header = section.querySelector<HTMLElement>(".doctor-section__header");
      const mm = gsap.matchMedia();

      const markEntered = () => {
        cards.forEach((card) => {
          card.dataset.entered = "1";
        });
      };

      const runEntrance = (
        targets: HTMLElement[],
        options: { mobile?: boolean } = {},
      ) => {
        targets.forEach((tilt, index) => {
          const card = tilt.closest<HTMLElement>(".doctor-card");
          const cta = card?.querySelector<HTMLElement>(".doctor-card__cta");
          if (options.mobile) {
            gsap.set(tilt, { opacity: 0, y: 24, ...GPU });
          } else {
            gsap.set(tilt, { opacity: 0, y: 44, scale: 0.94, ...GPU });
          }
          if (cta) gsap.set(cta, { opacity: 0, y: 8 });
          if (card) card.dataset.entered = "0";
        });

        if (header) gsap.set(header, { opacity: 0, y: options.mobile ? 16 : 28 });

        const entrance = gsap.timeline({
          defaults: { ease: "power3.out", immediateRender: false },
          scrollTrigger: {
            trigger: section,
            scroller: SCROLLER,
            start: options.mobile ? "top 90%" : "top 82%",
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            targets.forEach((tilt) => {
              gsap.set(tilt, { clearProps: "willChange" });
            });
          },
        });

        if (header) {
          entrance.to(header, { opacity: 1, y: 0, duration: options.mobile ? 0.42 : 0.55 }, 0);
        }

        targets.forEach((tilt, index) => {
          const card = tilt.closest<HTMLElement>(".doctor-card");
          const cta = card?.querySelector<HTMLElement>(".doctor-card__cta");
          const t = options.mobile ? 0.04 + index * 0.06 : 0.08 + index * 0.09;

          entrance.to(
            tilt,
            options.mobile
              ? { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", ...GPU }
              : { opacity: 1, y: 0, scale: 1, duration: 0.62, ease: "power3.out", ...GPU },
            t,
          );

          if (cta) {
            entrance.to(
              cta,
              { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
              t + (options.mobile ? 0.12 : 0.18),
            );
          }

          entrance.call(
            () => {
              if (card) card.dataset.entered = "1";
            },
            [],
            t + (options.mobile ? 0.48 : 0.62),
          );
        });
      };

      if (reduced) {
        markEntered();
      } else {
        mm.add("(max-width: 1023px)", () => {
          const targets = Array.from(cards)
            .map((card) => card.querySelector<HTMLElement>(".doctor-card__tilt"))
            .filter(Boolean) as HTMLElement[];
          runEntrance(targets, { mobile: true });

          cards.forEach((card) => {
            const btn = card.querySelector<HTMLButtonElement>(".doctor-card__toggle");
            if (!btn) return;

            const onToggle = () => {
              if (scrollGate.isScrolling() || card.dataset.entered !== "1") return;
              const next = !card.classList.contains("doctor-card--expanded");
              // Collapse others
              cards.forEach((other) => {
                if (other === card) return;
                other.classList.remove("doctor-card--expanded");
                const otherBtn = other.querySelector<HTMLButtonElement>(".doctor-card__toggle");
                if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
              });
              card.classList.toggle("doctor-card--expanded", next);
              btn.setAttribute("aria-expanded", String(next));
            };

            btn.addEventListener("click", onToggle);
            cleanups.push(() => btn.removeEventListener("click", onToggle));
          });
        });

        mm.add("(min-width: 1024px)", () => {
          const targets = Array.from(cards)
            .map((card) => card.querySelector<HTMLElement>(".doctor-card__tilt"))
            .filter(Boolean) as HTMLElement[];
          runEntrance(targets);

          if (!hoverFine) return;

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
          if (scrollGate.isScrolling() || card.dataset.entered !== "1") return;
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
          if (
            card.dataset.entered !== "1" ||
            !card.classList.contains("doctor-card--active") ||
            scrollGate.isScrolling()
          ) {
            return;
          }
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
        });
      }

      refreshRaf = requestAnimationFrame(() => {
        if (disposed || !section.isConnected) return;
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      disposed = true;
      cancelAnimationFrame(refreshRaf);
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
        /* ── Base tokens ── */
        .doctor-section {
          --doctor-gold: #e07b0a;
          --doctor-ink: #231f20;
          --doctor-ink-muted: rgba(35, 31, 32, 0.58);
          --doctor-line: rgba(35, 31, 32, 0.1);
          --doctor-panel: #fafaf7;
          --doctor-ease: cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          padding: 2.25rem 1rem 2.75rem;
          background: linear-gradient(180deg, #ececec 0%, #e2e2e2 100%);
          color: var(--doctor-ink);
          overflow-x: clip;
        }

        @media (min-width: 640px) {
          .doctor-section { padding: 3rem 1.5rem; }
        }

        @media (min-width: 1024px) {
          .doctor-section { padding: clamp(3.5rem, 8vw, 5rem) clamp(1.5rem, 4vw, 3.5rem); }
        }

        /* ── Inner wrap ── */
        .doctor-section__inner {
          max-width: 72rem;
          margin-inline: auto;
        }

        /* ── Header ── */
        .doctor-section__header {
          margin-bottom: 1.75rem;
          text-align: center;
        }

        @media (min-width: 640px) {
          .doctor-section__header { margin-bottom: 2.25rem; }
        }

        @media (min-width: 1024px) {
          .doctor-section__header { margin-bottom: clamp(2.5rem, 5vw, 3.5rem); }
        }

        .doctor-section__eyebrow {
          margin: 0 0 0.625rem;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--doctor-ink-muted);
        }

        @media (min-width: 640px) {
          .doctor-section__eyebrow {
            font-size: 0.6875rem;
            margin-bottom: 0.875rem;
          }
        }

        .doctor-section__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 7vw, 3.25rem);
          line-height: 1.06;
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
          margin: 0.75rem auto 0;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--doctor-ink-muted);
        }

        @media (min-width: 640px) {
          .doctor-section__lede { font-size: 0.9375rem; }
        }

        /* ── Grid track ── */
        .doctor-track {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
        }

        @media (min-width: 480px) {
          .doctor-track { gap: 0.875rem; }
        }

        @media (min-width: 1024px) {
          .doctor-track {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1.125rem;
          }
        }

        /* ── Card ── */
        .doctor-card {
          min-width: 0;
        }

        @media (min-width: 1024px) {
          .doctor-card {
            perspective: 1200px;
          }
        }

        .doctor-card__tilt {
          height: 100%;
        }

        @media (min-width: 1024px) {
          .doctor-card__tilt {
            transform-style: preserve-3d;
          }
        }

        .doctor-card__shell {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          background: var(--doctor-panel);
          border: 1px solid var(--doctor-line);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.95) inset,
            0 8px 24px -16px rgba(35, 31, 32, 0.18);
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        @media (min-width: 640px) {
          .doctor-card__shell { border-radius: 1.25rem; }
        }

        @media (min-width: 1024px) {
          .doctor-card__shell {
            box-shadow:
              0 1px 0 rgba(255, 255, 255, 0.95) inset,
              0 16px 40px -28px rgba(35, 31, 32, 0.22);
          }
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
          box-shadow: 0 0 0 2px rgba(224, 123, 10, 0.5);
        }

        /* ── Photo ── */
        .doctor-card__media {
          position: relative;
          flex: 0 0 auto;
          aspect-ratio: 3 / 2.6;
          width: 100%;
          overflow: hidden;
          background: #d4d4d4;
        }

        @media (min-width: 480px) {
          .doctor-card__media { aspect-ratio: 3 / 3; }
        }

        @media (min-width: 640px) {
          .doctor-card__media { aspect-ratio: 4 / 3.8; }
        }

        @media (min-width: 1024px) {
          .doctor-card__media { aspect-ratio: 4 / 4.35; }
        }

        .doctor-card__photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          display: block;
        }

        @media (min-width: 1024px) {
          .doctor-card__photo { will-change: transform, filter; }
        }

        .doctor-card__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(35, 31, 32, 0.12) 0%, transparent 55%);
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .doctor-card__scrim {
            background: linear-gradient(0deg, rgba(35, 31, 32, 0.18) 0%, transparent 45%);
            opacity: 0;
          }
        }

        /* ── Meta bar (credential badge + index) ── */
        .doctor-card__meta-bar {
          position: absolute;
          top: 0.625rem;
          left: 0.625rem;
          right: 0.625rem;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
        }

        @media (min-width: 640px) {
          .doctor-card__meta-bar { top: 0.875rem; left: 0.875rem; right: 0.875rem; }
        }

        .doctor-card__index {
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5625rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 6px rgba(35, 31, 32, 0.4);
        }

        @media (min-width: 640px) {
          .doctor-card__index { font-size: 0.625rem; }
        }

        .doctor-card__credential {
          display: inline-flex;
          align-items: center;
          padding: 0.22rem 0.45rem;
          border-radius: 0.3rem;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(35, 31, 32, 0.08);
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--doctor-ink);
          box-shadow: 0 2px 8px -4px rgba(35, 31, 32, 0.2);
        }

        @media (min-width: 640px) {
          .doctor-card__credential { font-size: 0.5625rem; padding: 0.28rem 0.55rem; }
        }

        /* ── Body wrapper — always visible ── */
        .doctor-card__body {
          position: relative;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          background: var(--doctor-panel);
        }

        .doctor-card__hairline {
          height: 1px;
          flex-shrink: 0;
          margin: 0 0.875rem;
          background: linear-gradient(90deg, var(--doctor-gold), rgba(224, 123, 10, 0.15), transparent);
        }

        /* ── Front info — always visible on every breakpoint ── */
        .doctor-card__front {
          padding: 0.625rem 0.75rem 0.5rem;
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .doctor-card__front { padding: 0.75rem 0.875rem 0.625rem; }
        }

        @media (min-width: 640px) {
          .doctor-card__front { padding: 0.875rem 1rem 0.75rem; }
        }

        @media (min-width: 1024px) {
          .doctor-card__front {
            padding: 1rem 1rem 1.125rem;
            overflow: hidden;
            will-change: transform, opacity, height;
          }
        }

        .doctor-card__department {
          margin: 0 0 0.2rem;
          font-family: "Josefin Sans", sans-serif;
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--doctor-gold);
        }

        @media (min-width: 480px) {
          .doctor-card__department { font-size: 0.5625rem; }
        }

        @media (min-width: 1024px) {
          .doctor-card__department {
            color: var(--doctor-ink-muted);
            margin-bottom: 0.45rem;
            font-size: 0.625rem;
          }
        }

        .doctor-card__name {
          margin: 0 0 0.15rem;
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.015em;
          color: var(--doctor-ink);
        }

        @media (min-width: 480px) {
          .doctor-card__name { font-size: 0.9rem; }
        }

        @media (min-width: 640px) {
          .doctor-card__name { font-size: 0.9375rem; letter-spacing: -0.02em; }
        }

        @media (min-width: 1024px) {
          .doctor-card__name { font-size: 1.0625rem; margin-bottom: 0.3rem; }
        }

        .doctor-card__role {
          margin: 0;
          font-family: var(--font-sans);
          font-size: 0.6875rem;
          line-height: 1.4;
          color: var(--doctor-ink-muted);
        }

        @media (min-width: 640px) {
          .doctor-card__role { font-size: 0.75rem; }
        }

        @media (min-width: 1024px) {
          .doctor-card__role { font-size: 0.8125rem; line-height: 1.45; }
        }

        /* ── Mobile expand toggle — only on <1024px ── */
        .doctor-card__toggle {
          display: none;
        }

        @media (max-width: 1023px) {
          .doctor-card__toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            width: 100%;
            padding: 0.45rem 0;
            margin-top: 0.5rem;
            background: none;
            border: none;
            border-top: 1px solid var(--doctor-line);
            padding-top: 0.45rem;
            cursor: pointer;
            font-family: "Josefin Sans", sans-serif;
            font-size: 0.5rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(35, 31, 32, 0.45);
            -webkit-tap-highlight-color: transparent;
            transition: color 0.2s ease;
            min-height: 2.25rem;
          }

          .doctor-card--expanded .doctor-card__toggle {
            color: var(--doctor-gold);
            background: rgba(224, 123, 10, 0.05);
          }

          .doctor-card__toggle-icon {
            width: 0.75rem;
            height: 0.75rem;
            flex-shrink: 0;
            transition: transform 0.3s var(--doctor-ease);
          }

          .doctor-card--expanded .doctor-card__toggle-icon {
            transform: rotate(180deg);
          }
        }

        /* Desktop CTA */
        .doctor-card__cta {
          display: none;
        }

        @media (min-width: 1024px) {
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
          }

          .doctor-card__cta svg {
            width: 0.7rem;
            height: 0.7rem;
            transition: transform 0.4s var(--doctor-ease);
          }

          .doctor-card--active .doctor-card__cta,
          .doctor-card__shell:hover .doctor-card__cta,
          .doctor-card__shell:focus-within .doctor-card__cta { color: var(--doctor-ink); }

          .doctor-card--active .doctor-card__cta svg,
          .doctor-card__shell:hover .doctor-card__cta svg,
          .doctor-card__shell:focus-within .doctor-card__cta svg { transform: translateX(2px); }
        }

        /* ── Reveal panel: bio + specialties ── */
        .doctor-card__reveal {
          flex-shrink: 0;
          overflow: hidden;
          background: #fff;
        }

        /* Mobile: collapse only the reveal (not the whole body) */
        @media (max-width: 1023px) {
          .doctor-card__reveal {
            max-height: 0;
            transition: max-height 0.42s var(--doctor-ease);
          }

          .doctor-card--expanded .doctor-card__reveal {
            max-height: 22rem;
          }
        }

        /* Desktop: GSAP controls height/opacity */
        @media (min-width: 1024px) {
          .doctor-card__reveal {
            height: 0;
            opacity: 0;
            border-top: 0 solid transparent;
          }

          .doctor-card--active .doctor-card__reveal {
            border-top-width: 1px;
            border-top-color: var(--doctor-line);
          }
        }

        .doctor-card__reveal-inner {
          padding: 0.875rem 0.875rem 1rem;
        }

        @media (min-width: 640px) {
          .doctor-card__reveal-inner { padding: 1rem 1rem 1.125rem; }
        }

        .doctor-card__reveal-line {
          transform: translateZ(0);
        }

        @media (min-width: 1024px) {
          .doctor-card__reveal-line { will-change: transform, opacity; }
        }

        .doctor-card__bio {
          margin: 0;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.62;
          color: var(--doctor-ink-muted);
        }

        .doctor-card__spec-list {
          margin: 0.65rem 0 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--doctor-line);
          padding-top: 0.55rem;
        }

        .doctor-card__spec-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          padding: 0.22rem 0;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--doctor-ink);
        }

        @media (min-width: 1024px) {
          .doctor-card__spec-item { will-change: transform, opacity; }
        }

        .doctor-card__spec-item::before {
          content: "";
          flex-shrink: 0;
          width: 0.35rem;
          height: 1px;
          background: var(--doctor-gold);
          transform: translateY(-0.05em);
        }

        /* ── Desktop hover state ── */
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
                  {/* Photo */}
                  <div className="doctor-card__media">
                    <img
                      className="doctor-card__photo"
                      src={doc.photo}
                      alt={doc.name}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 18vw, 50vw"
                    />
                    <div className="doctor-card__scrim" aria-hidden />
                    <div className="doctor-card__meta-bar">
                      <span className="doctor-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="doctor-card__credential">{doc.credentials}</span>
                    </div>
                  </div>

                  {/* Body: ALWAYS visible */}
                  <div className="doctor-card__body">
                    <div className="doctor-card__hairline" aria-hidden />

                    {/* Front info — always visible on every breakpoint */}
                    <div className="doctor-card__front">
                      <p className="doctor-card__department">{doc.department}</p>
                      <h3 className="doctor-card__name">{doc.name}</h3>
                      <p className="doctor-card__role">{doc.title}</p>

                      {/* Mobile toggle — bio/specialties expand */}
                      <button
                        type="button"
                        className="doctor-card__toggle"
                        aria-expanded="false"
                        aria-label={`View ${doc.name} credentials`}
                      >
                        <span>Bio &amp; specialties</span>
                        <svg className="doctor-card__toggle-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Desktop CTA */}
                      <span className="doctor-card__cta">
                        View credentials
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>

                    {/* Reveal: bio + specialties (toggle on mobile, GSAP on desktop) */}
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
