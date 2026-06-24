import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { observeSectionVisibility, canUseHoverParallax, createScrollGate, rafThrottle } from "@/lib/section-performance";
import { createTiltQuickTo } from "@/lib/gsap-tilt";
import {
  ShowcaseCinematicBeam,
  ShowcaseHeroProduct,
} from "@/components/sections/ShowcaseCinematicBeam";
import { ShowcaseFigureStage } from "@/components/sections/ShowcaseFigureStage";
import type { ProductSlug } from "@/types/product";

import heroImage from "@/assets/hero image 3d.png";
import product1 from "@/assets/product 1 3d.png";
import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";
import tidlGif from "@/assets/TIDL GIF 2.gif";
import menFigure from "@/assets/men 2 3d.png";

const SHOWCASE_PRODUCTS = [
  {
    slug: "lirosome" as ProductSlug,
    image: product1,
    name: "Lirosiome",
    subtitle: "GLP-1 weight protocol",
    price: "$249 / mo",
    accent: "var(--showcase-rose)",
  },
  {
    slug: "tirosane" as ProductSlug,
    image: product4,
    name: "Tirosane",
    subtitle: "Cellular renewal",
    price: "$329 / mo",
    accent: "var(--showcase-violet)",
  },
  {
    slug: "tidl-core" as ProductSlug,
    image: product2,
    name: "TIDL Core",
    subtitle: "Foundational longevity",
    price: "$48 / mo",
    accent: "var(--showcase-sun)",
  },
  {
    slug: "tidl-cycle" as ProductSlug,
    image: product3,
    name: "TIDL Cycle",
    subtitle: "Female hormonal balance",
    price: "$58 / mo",
    accent: "var(--showcase-mint)",
  },
] as const;

export function ProductShowcaseSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

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

      const cards = gsap.utils.toArray<HTMLElement>(".showcase-card");
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.25,
      });

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

      const mediaPanels = gsap.utils.toArray<HTMLElement>(".media-panel");
      gsap.from(mediaPanels, {
        y: 100,
        opacity: 0,
        scale: 0.95,
        stagger: 0.18,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.45,
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
        .showcase-shell--paused .showcase-card::before,
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
        .showcase-card, .media-panel { transform-style: preserve-3d; }
        .showcase-card::before, .media-panel::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          border: 1px solid color-mix(in oklab, var(--showcase-line) 74%, transparent);
          opacity: 0.55;
          pointer-events: none;
          animation: cardBorder 5s ease-in-out infinite;
        }
        /* ── mobile: horizontal swipe carousel ── */
        .showcase-card-responsive {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          gap: 14px;
          padding-bottom: 6px;
        }
        .showcase-card-responsive::-webkit-scrollbar { display: none; }
        .showcase-card-responsive .showcase-card {
          flex: 0 0 78vw;
          max-width: 320px;
          min-width: 220px;
          scroll-snap-align: start;
        }
        /* ── desktop: 4-col grid ── */
        @media (min-width: 768px) {
          .showcase-card-responsive {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1.25rem;
            overflow: visible;
          }
          .showcase-card-responsive .showcase-card {
            flex: unset;
            max-width: none;
            min-width: 0;
            scroll-snap-align: unset;
          }
        }
        .showcase-card-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .showcase-figure-stage {
          overflow: visible;
        }
        .showcase-figure-glow {
          position: absolute;
          bottom: 8%;
          left: 50%;
          width: min(72%, 340px);
          height: 38%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(closest-side, rgba(243, 195, 0, 0.28) 0%, rgba(243, 195, 0, 0.08) 42%, transparent 100%);
          filter: blur(28px);
          pointer-events: none;
        }
        .showcase-figure-3d {
          position: relative;
          z-index: 2;
          width: min(100%, 440px);
          height: auto;
          object-fit: contain;
          object-position: bottom center;
          mix-blend-mode: multiply;
          filter:
            drop-shadow(0 0 42px rgba(243, 195, 0, 0.38))
            drop-shadow(0 0 90px rgba(243, 195, 0, 0.16))
            drop-shadow(-30px 52px 68px rgba(35, 31, 32, 0.26));
        }
        @media (max-width: 980px) {
          .media-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 720px) {
          .media-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="relative z-20 px-5 pb-2 pt-6 md:px-10 md:pt-10 lg:px-14">
        <ShowcaseCinematicBeam>
          <div className="mx-auto max-w-7xl text-center">
            <h2
              className="showcase-headline"
              style={{
                color: "var(--showcase-ink-strong)",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
              }}
            >
              Your longevity
              <br />
              <span className="showcase-headline-accent">breakthrough is here</span>
            </h2>

            <ShowcaseHeroProduct
              src={heroImage}
              alt="TIDL auto-injector pen and peptide products"
              productRef={productRef}
            />

            <button
              type="button"
              onClick={openModal}
              className="showcase-body mt-6 inline-flex items-center justify-center rounded-full px-7 py-3 cursor-pointer transition-[filter] duration-200 hover:brightness-95"
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
        </ShowcaseCinematicBeam>
      </section>

      <section className="relative z-20 px-5 pb-8 pt-4 md:px-10 md:pt-6 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 text-center">
            <h3
              className="showcase-headline"
              style={{
                color: "var(--showcase-ink-strong)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
              }}
            >
              Four precision-built products.
            </h3>
          </div>

          {/* Single container: swipe-scroll on mobile, 4-col grid on desktop */}
          <div ref={cardsRef} className="showcase-card-responsive">
            {SHOWCASE_PRODUCTS.map((product) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => goToProduct(product.slug)}
                className="showcase-card relative overflow-hidden rounded-[2rem] p-5 text-left cursor-pointer"
                style={{
                  background:
                    "linear-gradient(180deg, var(--showcase-card-top) 0%, var(--showcase-card-bottom) 100%)",
                  boxShadow:
                    "0 24px 70px color-mix(in oklab, var(--showcase-shadow-soft) 24%, transparent), inset 0 1px 0 color-mix(in oklab, var(--showcase-surface) 85%, transparent)",
                }}
              >
                <div className="showcase-card-badges relative z-10 flex items-center justify-end">
                  <span
                    className="showcase-card-badge rounded-full px-3 py-1 text-xs"
                    style={{
                      background: "color-mix(in oklab, var(--showcase-surface) 90%, transparent)",
                      color: "var(--showcase-ink)",
                      border: "1px solid var(--showcase-line)",
                    }}
                  >
                    {product.price}
                  </span>
                </div>

                <div className="showcase-card-media-wrap relative z-10 mt-5 flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[1.6rem]">
                  <img
                    className="showcase-card-media relative z-10"
                    src={product.image}
                    alt={`${product.name} · TIDL ${product.subtitle}`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    style={{
                      width: "78%",
                      height: "auto",
                      objectFit: "contain",
                      filter:
                        "drop-shadow(0 26px 34px color-mix(in oklab, var(--showcase-shadow-strong) 28%, transparent))",
                    }}
                  />
                </div>

                <div className="showcase-card-footer relative z-10 mt-5">
                  <div className="h-px w-full" style={{ background: "var(--showcase-line)" }} />
                  <h4
                    className="showcase-card-title showcase-headline mt-4"
                    style={{
                      color: "var(--showcase-ink-strong)",
                      fontSize: "1.45rem",
                      lineHeight: 1.05,
                    }}
                  >
                    {product.name}
                  </h4>
                  <p className="showcase-card-sub showcase-body mt-2" style={{ color: "var(--showcase-ink)" }}>
                    {product.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={mediaRef} className="relative z-20 px-5 pb-24 pt-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <h3
              className="showcase-headline"
              style={{
                color: "var(--showcase-ink-strong)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
              }}
            >
              Built for precision. Delivered with care.
            </h3>
          </div>

          <div className="media-grid grid gap-6">
            <article
              className="media-panel relative flex flex-col items-center justify-center overflow-hidden rounded-[2.25rem] p-6 md:p-8"
              style={{
                minHeight: "28rem",
                background: "var(--showcase-bg)",
              }}
            >
              <img
                src={tidlGif}
                alt=""
                aria-hidden="true"
                className="max-w-full object-contain"
                loading="lazy"
                decoding="async"
                style={{ maxHeight: "320px" }}
              />
              <p className="showcase-body mt-6 text-center text-sm" style={{ color: "var(--showcase-ink)" }}>
                Cold-chain pharmacy dispatch. Every order physician-approved.
              </p>
            </article>

            <ShowcaseFigureStage
              src={menFigure}
              alt="Athletic figure standing on rock · TIDL performance and longevity"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
