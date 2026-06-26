import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { getProductListItems } from "@/data/products";
import { observeSectionVisibility } from "@/lib/section-performance";

import categoryHormonal from "@/assets/product 3 3d pink.png";
import categoryMetabolic from "@/assets/product 1 3d.png";
import categoryRecovery from "@/assets/product 2 3d white.png";
import categoryLongevity from "@/assets/product 4 3d.png";

type Card = {
  slug: string;
  img: string;
  tag: string;
  name: string;
  sub: string;
  price: number;
  lightProduct?: boolean;
};

const CATEGORIES = [
  { before: "", highlight: "Hormonal", after: " balance", img: categoryHormonal, to: "/hormonal" },
  { before: "", highlight: "Metabolic", after: " care", img: categoryMetabolic, to: "/metabolic" },
  { before: "", highlight: "Recovery", after: " science", img: categoryRecovery, to: "/recovery" },
  { before: "", highlight: "Longevity", after: " stack", img: categoryLongevity, to: "/longevity" },
] as const;

const CARDS: Card[] = getProductListItems().map((item) => ({
  slug: item.slug,
  img: item.image,
  tag: item.tag,
  name: item.displayName,
  sub: item.tagline,
  price: item.startingPrice,
  lightProduct: item.lightProduct,
}));

export function TreatmentCategoriesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;

    const ambientTweens: gsap.core.Tween[] = [];
    const cleanups: Array<() => void> = [];

    const pauseAmbient = () => ambientTweens.forEach((tween) => tween.pause());
    const resumeAmbient = () => ambientTweens.forEach((tween) => tween.resume());
    cleanups.push(observeSectionVisibility(sec, resumeAmbient, pauseAmbient));

    const ctx = gsap.context(() => {
      const cards = sec.querySelectorAll<HTMLElement>(".pcard");

      cards.forEach((card, idx) => {
        const img = card.querySelector<HTMLImageElement>(".pc-img");
        const meta = card.querySelectorAll<HTMLElement>(".pc-meta");
        const imageFilter = card.dataset.lightProduct === "true"
          ? "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))"
          : "drop-shadow(0 22px 28px rgba(20,30,60,0.22))";

        gsap.fromTo(img, { opacity: 0, y: 60, scale: 0.92, filter: `blur(10px) ${imageFilter}` }, {
          opacity: 1, y: 0, scale: 1, filter: `blur(0px) ${imageFilter}`, duration: 1.4, ease: "power4.out", delay: idx * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
        gsap.fromTo(meta, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.4 + idx * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        if (!img) return;

        const ambient = gsap.to(img, {
          y: -8,
          duration: 4.0,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: idx * 0.4,
        });
        ambient.pause();
        ambientTweens.push(ambient);

        let hoverTl: gsap.core.Timeline | null = null;
        const onEnter = () => {
          ambient.pause();
          gsap.killTweensOf(img);
          hoverTl = gsap.timeline();
          hoverTl.to(img, { y: -28, scale: 1.14, rotate: 6, duration: 0.55, ease: "back.out(1.6)" });
          hoverTl.to(img, { rotate: -6, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        };
        const onLeave = () => {
          hoverTl?.kill();
          gsap.killTweensOf(img);
          gsap.to(img, {
            y: -8,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            ease: "power3.out",
            onComplete: () => ambient.restart(),
          });
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      const hub = sec.querySelector<HTMLElement>(".cat-hub");
      if (hub) {
        gsap.fromTo(
          hub.querySelectorAll<HTMLElement>(".cat-card, h3"),
          { opacity: 0, y: 34 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08,
            scrollTrigger: { trigger: hub, start: "top 85%" },
          },
        );
      }
    }, sec);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section id="treatments" ref={ref} className="relative py-24 lg:py-36" style={{ background: "rgb(226, 226, 226)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <span className="pill-tag mb-5"><span className="dot" /> Treatments</span>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.02] text-ink">
            Physician-guided <span className="italic text-gradient-clinical">treatments.</span>
          </h2>
          <p className="mt-4 text-ink-soft max-w-xl">
            Every TIDL therapy is reviewed by a licensed physician, matched to your goals, and delivered through licensed pharmacy partners.
          </p>
        </div>

        <div className="-mx-5 sm:mx-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-16 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none px-5 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
          {CARDS.map((c) => (
            <Link
              key={c.slug}
              to="/products/$slug"
              params={{ slug: c.slug }}
              data-light-product={c.lightProduct ? "true" : undefined}
              className="pcard group relative cursor-pointer shrink-0 sm:shrink w-[62%] xs:w-[58%] sm:w-auto snap-center"
            >
              <div className="relative h-44 sm:h-72 mb-4 sm:mb-6 flex items-end justify-center overflow-visible [perspective:900px]">
                <div
                  className="absolute inset-x-8 bottom-4 h-5 rounded-full blur-2xl opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125"
                  style={{ background: "radial-gradient(closest-side, rgba(224, 123, 10,0.35), transparent 70%)" }}
                />
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="pc-img relative z-10 max-h-full w-auto max-w-full origin-bottom object-contain transition-[filter] duration-500 group-hover:drop-shadow-[0_28px_36px_rgba(224, 123, 10,0.25)]"
                  style={{
                    background: "transparent",
                    filter: c.lightProduct
                      ? "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))"
                      : "drop-shadow(0 22px 28px rgba(20,30,60,0.22))",
                  }}
                />
              </div>
              <div className="pc-meta text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#A88A00]">{c.tag}</div>
              <div className="pc-meta mt-1 font-display text-lg sm:text-2xl text-ink">{c.name}</div>
              <div className="pc-meta text-xs sm:text-sm text-ink-soft">{c.sub}</div>
              <div className="pc-meta mt-3 sm:mt-4 flex items-center justify-between">
                <div className="font-display text-base sm:text-xl text-ink">${c.price}<span className="text-[10px] sm:text-xs text-ink/50"> / mo</span></div>
                <span className="text-[11px] sm:text-xs font-medium text-[#A88A00] group-hover:translate-x-1 transition-transform">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="cat-hub mt-20 sm:mt-28">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-tight text-ink">
              Explore by <span className="italic text-gradient-clinical">category.</span>
            </h3>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#A88A00] hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
                className="cat-card group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 flex h-24 items-end justify-center">
                  <img src={cat.img} alt="" className="h-full w-full object-contain" draggable={false} loading="lazy" decoding="async" />
                </div>
                <p className="font-display text-lg leading-tight text-ink">
                  {cat.before}<span className="italic text-gradient-clinical">{cat.highlight}</span>{cat.after}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
