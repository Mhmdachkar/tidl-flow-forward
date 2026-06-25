import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { observeSectionVisibility, canUseHoverParallax, createScrollGate, rafThrottle } from "@/lib/section-performance";
import { createTiltQuickTo } from "@/lib/gsap-tilt";
import {
  ShowcaseCinematicBeam,
  ShowcaseHeroVideo,
} from "@/components/sections/ShowcaseCinematicBeam";
import type { ProductSlug } from "@/types/product";

import productVideo from "@/assets/product_video.mp4";
import product1 from "@/assets/product 1 3d.png";
import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";

const SHOWCASE_PRODUCTS = [
  {
    slug: "lirosome" as ProductSlug,
    image: product1,
    name: "Lirosiome",
    subtitle: "GLP-1 weight protocol",
    accent: "var(--showcase-rose)",
  },
  {
    slug: "tirosane" as ProductSlug,
    image: product4,
    name: "Tirosane",
    subtitle: "Cellular renewal",
    accent: "var(--showcase-violet)",
  },
  {
    slug: "tidl-core" as ProductSlug,
    image: product2,
    name: "TIDL Core",
    subtitle: "Foundational longevity",
    accent: "var(--showcase-sun)",
  },
  {
    slug: "tidl-cycle" as ProductSlug,
    image: product3,
    name: "TIDL Cycle",
    subtitle: "Female hormonal balance",
    accent: "var(--showcase-mint)",
  },
] as const;

export function ProductShowcaseSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { openModal } = useQuizModal();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverParallax = canUseHoverParallax();
    const sectionActive = { current: true };
    const loopTweens: gsap.core.Tween[] = [];
    const scrollGate = createScrollGate();
    const cleanups: Array<() => void> = [scrollGate.dispose];

    const pauseAmbient = () => {
      sectionActive.current = false;
      loopTweens.forEach((tween) => tween.pause());
      stage.classList.add("showcase-shell--paused");
    };

    const resumeAmbient = () => {
      sectionActive.current = true;
      if (!reduced) {
        loopTweens.forEach((tween) => tween.resume());
        stage.classList.remove("showcase-shell--paused");
      }
    };

    cleanups.push(observeSectionVisibility(stage, resumeAmbient, pauseAmbient));

    const syncScrollLoops = () => {
      const pause = scrollGate.isScrolling() || !sectionActive.current;
      loopTweens.forEach((tween) => (pause ? tween.pause() : tween.resume()));
    };
    window.addEventListener("tidl:lenis-scroll", syncScrollLoops, { passive: true });
    cleanups.push(() => window.removeEventListener("tidl:lenis-scroll", syncScrollLoops));

    const registerLoop = (tween: gsap.core.Tween) => {
      tween.pause();
      loopTweens.push(tween);
      return tween;
    };

    stage.classList.add("showcase-shell--paused");
    sectionActive.current = false;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // ── "Your longevity / breakthrough is here" headline: arc in + arc out ──
      const headline = stage.querySelector<HTMLElement>(".showcase-headline");
      if (headline) {
        // Single scrubbed timeline: fade-in as it enters → hold → fade-out as it exits
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headline,
            start: "top 94%",   // headline just cresting the bottom of the viewport
            end: "top -18%",    // headline fully gone off the top
            scrub: 2.8,
          },
        });
        tl.fromTo(
          headline,
          { opacity: 0, y: 52 },
          { opacity: 1, y: 0, ease: "none", duration: 0.32 },
        )
          .to(headline, { opacity: 1, y: 0, duration: 0.36 })         // hold
          .to(headline, { opacity: 0, y: -70, ease: "none", duration: 0.32 }); // exit
      }

      const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".showcase-card") ?? [];
      if (cards.length) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        gsap.from(cards, {
          x: isMobile ? 0 : 72,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      cards.forEach((card, index) => {
        registerLoop(
          gsap.to(card.querySelector(".showcase-card-media"), {
            y: index % 2 === 0 ? -10 : 10,
            duration: 4.8 + index * 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
        );
      });

    }, stageRef);

    const cardInteractions = () => {
      if (!hoverParallax || reduced) return () => undefined;

      const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".showcase-card") ?? [];
      const cardCleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const media = card.querySelector<HTMLElement>(".showcase-card-media");
        const tilt = createTiltQuickTo(card);

        const onCardMove = rafThrottle((e: PointerEvent) => {
          if (!sectionActive.current || scrollGate.isScrolling()) return;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          tilt.rotateY(px * 12);
        });

        const onEnter = () => {
          gsap.to(media, { y: -12, scale: 1.08, duration: 0.55, ease: "power3.out" });
          card.addEventListener("pointermove", onCardMove, { passive: true });
        };

        const onLeave = () => {
          card.removeEventListener("pointermove", onCardMove);
          tilt.reset();
          gsap.to(media, { y: 0, scale: 1, duration: 0.55, ease: "power3.out" });
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cardCleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
          card.removeEventListener("pointermove", onCardMove);
        });
      });

      return () => cardCleanups.forEach((fn) => fn());
    };

    const disposeCards = cardInteractions();

    return () => {
      cleanups.forEach((fn) => fn());
      disposeCards();
      ctx.revert();
    };
  }, []);

  const goToProduct = (slug: ProductSlug) => {
    navigate({ to: "/products/$slug", params: { slug } });
  };

  return (
    <div
      ref={stageRef}
      className="showcase-shell"
      data-nav-zone="showcase"
      role="region"
      aria-label="TIDL product collection"
    >
      <style>{`
        @keyframes cardBorder {
          0%, 100% { opacity: 0.40; }
          50%      { opacity: 0.72; }
        }
        @keyframes showcaseProductFloat {
          0%, 100% { transform: translate3d(0, -8px, 0); }
          50%      { transform: translate3d(0, 8px, 0); }
        }
        @keyframes showcaseFigureFloat {
          0%, 100% { transform: translate3d(0, -8px, 0); }
          50%      { transform: translate3d(0, 10px, 0); }
        }
        .showcase-beam-stage {
          contain: layout style;
        }
        .showcase-product-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
        .showcase-figure-float--on {
          animation: showcaseProductFloat 5.2s ease-in-out infinite;
        }
        .showcase-product-float {
          position: relative;
        }
        .showcase-figure-float--on {
          animation: showcaseFigureFloat 5.2s ease-in-out infinite;
        }
        .showcase-shell {
          min-height: auto;
          background: linear-gradient(180deg, var(--showcase-bg) 0%, var(--showcase-bg-deep) 100%);
          color: var(--showcase-ink-strong);
          font-family: var(--font-sans);
          overflow: hidden;
          position: relative;
          isolation: isolate;
          contain: layout style;
        }
        .showcase-shell--paused .showcase-product-float--on,
        .showcase-shell--paused .showcase-figure-float--on {
          animation-play-state: paused;
        }
        .showcase-headline {
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 0.96;
        }
        .showcase-headline-accent {
          font-style: italic;
          font-weight: 700;
          color: var(--showcase-accent);
        }
        .showcase-body {
          font-family: var(--font-sans);
          font-weight: 400;
          letter-spacing: 0.01em;
        }
        .showcase-label {
          font-family: "Josefin Sans", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .showcase-card { transform-style: preserve-3d; }
        /* Cream band: curved bottom edge (mirrors video top radius) */
        .showcase-cream-band {
          background: rgb(251, 251, 248);
          position: relative;
          overflow: hidden;
          border-bottom-left-radius: clamp(2.75rem, 6vw, 4rem);
          border-bottom-right-radius: clamp(2.75rem, 6vw, 4rem);
          padding-bottom: clamp(0.5rem, 1.5vw, 1rem);
        }
        .showcase-video-block {
          position: relative;
        }
        .showcase-video-cta {
          position: absolute;
          left: 50%;
          bottom: clamp(1.5rem, 4vh, 2.75rem);
          z-index: 30;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .showcase-video-cta button {
          pointer-events: auto;
        }
        /* ── Hims-style horizontal product rail (all breakpoints) ── */
        .showcase-products-rail {
          background: transparent;
          border-radius: 0;
          width: 100%;
          padding: 0.75rem 0 1.25rem;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .showcase-products-rail {
            padding: 1rem 0 1.5rem;
          }
        }
        .showcase-products-rail-heading {
          padding-inline: var(--showcase-products-gutter, 1.25rem);
          margin-bottom: 1.25rem;
        }
        @media (min-width: 768px) {
          .showcase-products-rail-heading {
            margin-bottom: 1.5rem;
          }
        }
        .showcase-card-responsive {
          --showcase-product-card-w: min(72vw, 17.5rem);
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 1rem;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: var(--showcase-products-gutter, 1.25rem);
          scrollbar-width: none;
          padding: 0 0 0.25rem;
        }
        .showcase-card-responsive::-webkit-scrollbar { display: none; }
        @media (max-width: 767px) {
          .showcase-card-lead {
            display: none;
            width: 0;
            min-width: 0;
          }
          .showcase-card-responsive {
            scroll-padding-inline-start: 0;
            padding: 0 0 0.25rem;
          }
        }
        @media (min-width: 768px) {
          .showcase-card-responsive {
            --showcase-product-card-w: 17.75rem;
            gap: 1.125rem;
            scroll-padding-inline: var(--showcase-products-gutter, 2.5rem);
          }
        }
        @media (min-width: 1024px) {
          .showcase-card-responsive {
            scroll-padding-inline: var(--showcase-products-gutter, 3.5rem);
          }
        }
        /* Empty first slot: one card width before the lineup starts */
        .showcase-card-lead,
        .showcase-card-trail {
          flex: 0 0 auto;
          width: var(--showcase-product-card-w);
          scroll-snap-align: start;
          pointer-events: none;
        }
        .showcase-card-trail {
          width: max(var(--showcase-products-gutter, 1.25rem), 1rem);
        }
        .showcase-card-responsive .showcase-card {
          flex: 0 0 auto;
          width: var(--showcase-product-card-w);
          height: 22.5rem;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          padding: 0;
          border: none;
          border-radius: 1.75rem;
          text-align: left;
          background: linear-gradient(180deg, var(--showcase-card-top) 0%, var(--showcase-card-bottom) 100%);
          box-shadow: none;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 768px) {
          .showcase-card-responsive .showcase-card {
            height: 23.5rem;
            border-radius: 2rem;
          }
        }
        .showcase-card-responsive .showcase-card:hover {
          transform: translateY(-4px);
        }
        .showcase-card-media-wrap {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.125rem 1.125rem 0.5rem;
        }
        .showcase-card-media-wrap img {
          width: 78%;
          max-height: 9.5rem;
          height: auto;
          object-fit: contain;
          filter: none;
        }
        .showcase-card-footer {
          margin-top: auto;
          padding: 0.875rem 1.125rem 1.125rem;
        }
        .showcase-card-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      `}</style>

      <section className="showcase-video-block relative z-20">
        <ShowcaseCinematicBeam>
          <ShowcaseHeroVideo
            src={productVideo}
            videoRef={productRef}
            overlay={
              <h2
                className="showcase-headline pointer-events-none"
                style={{
                  color: "var(--showcase-ink-strong)",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  textShadow: "0 2px 24px rgba(250, 250, 247, 0.85)",
                }}
              >
                Your longevity
                <br />
                <span className="showcase-headline-accent">breakthrough is here</span>
              </h2>
            }
          />
        </ShowcaseCinematicBeam>
        <div className="showcase-video-cta">
          <button
            type="button"
            onClick={openModal}
            className="showcase-body inline-flex items-center justify-center rounded-full px-7 py-3 cursor-pointer transition-[filter] duration-200 hover:brightness-95"
            style={{
              background: "var(--showcase-button-bg)",
              color: "var(--showcase-button-foreground)",
              border: "1px solid var(--showcase-button-border)",
              boxShadow: "0 16px 40px rgba(243, 195, 0, 0.28)",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            Get started
          </button>
        </div>
      </section>

      <div className="showcase-cream-band">
      <section className="showcase-products-section relative z-20 pb-10 pt-6 md:pb-12 md:pt-8">
        <div
          className="showcase-products-rail"
          style={
            {
              "--showcase-products-gutter": "clamp(1.25rem, 4vw, 3.5rem)",
            } as React.CSSProperties
          }
        >
          <div className="showcase-products-rail-heading">
            <div className="mx-auto max-w-7xl">
              <h3
                className="showcase-headline"
                style={{
                  color: "var(--showcase-ink-strong)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  lineHeight: 1.05,
                }}
              >
                Four precision-built products.
              </h3>
            </div>
          </div>

          <div ref={cardsRef} className="showcase-card-responsive">
            <div className="showcase-card-lead" aria-hidden="true" />
            {SHOWCASE_PRODUCTS.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => goToProduct(product.slug)}
                  className="showcase-card relative overflow-hidden cursor-pointer"
                >
                  <div className="showcase-card-media-wrap relative z-10">
                    <img
                      className="showcase-card-media relative z-10"
                      src={product.image}
                      alt={`${product.name} · TIDL ${product.subtitle}`}
                      loading="lazy"
                      width={1024}
                      height={1024}
                    />
                  </div>

                  <div className="showcase-card-footer relative z-10">
                    <h4
                      className="showcase-card-title showcase-headline"
                      style={{
                        color: "var(--showcase-ink-strong)",
                        fontSize: "1.35rem",
                        lineHeight: 1.08,
                      }}
                    >
                      {product.name}
                    </h4>
                    <p
                      className="showcase-card-sub showcase-body mt-1.5"
                      style={{ color: "var(--showcase-ink)", fontSize: "0.875rem", lineHeight: 1.35 }}
                    >
                      {product.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            <div className="showcase-card-trail" aria-hidden="true" />
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
