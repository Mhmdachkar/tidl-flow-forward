import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

import product1 from "@/assets/product 1 3d.png";
import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";
import redman from "@/assets/men 3d.png";

const CARE_HERO = [
  {
    badge: "New",
    title: "Start your metabolic protocol today",
    link: "Find your Rx match",
    img: product1,
    tone: "dark" as const,
  },
  {
    badge: null,
    title: "Physician-guided care that evolves with you",
    link: "Explore the science",
    img: redman,
    tone: "gold" as const,
  },
] as const;

const CARE_CATEGORIES = [
  { label: "Hormonal balance", highlight: "Hormonal", img: product3, to: "/hormonal" as const },
  { label: "Metabolic care", highlight: "Metabolic", img: product1, to: "/metabolic" as const },
  { label: "Recovery science", highlight: "Recovery", img: product2, to: "/recovery" as const },
  { label: "Longevity stack", highlight: "Longevity", img: product4, to: "/longevity" as const },
] as const;

function CareHeroCard({ badge, title, link, img, tone }: (typeof CARE_HERO)[number]) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const card = cardRef.current;
    const image = imgRef.current;
    const copy = copyRef.current;
    const linkEl = linkRef.current;
    const chevron = chevronRef.current;
    const shine = shineRef.current;
    if (!card || !image || !copy || !linkEl || !chevron || !shine) return;

    gsap.set(image, { scale: 1, x: 0, y: 0, rotate: 0 });
    gsap.set(shine, { xPercent: -120, opacity: 0 });

    let hoverTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      hoverTl
        .to(card, { y: -10, scale: 1.02, duration: 0.45 }, 0)
        .to(image, { scale: 1.18, x: 14, y: -18, rotate: dark ? 8 : -6, duration: 0.55, ease: "back.out(1.8)" }, 0)
        .to(copy, { x: 6, y: -4, duration: 0.4 }, 0)
        .to(linkEl, { x: 8, opacity: 1, duration: 0.35 }, 0.05)
        .to(chevron, { x: 6, scale: 1.15, duration: 0.35, ease: "back.out(2)" }, 0.05)
        .to(shine, { xPercent: 120, opacity: dark ? 0.22 : 0.35, duration: 0.7, ease: "power2.inOut" }, 0);
    };
    const onLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      hoverTl
        .to(card, { y: 0, scale: 1, duration: 0.5 }, 0)
        .to(image, { scale: 1, x: 0, y: 0, rotate: 0, duration: 0.55 }, 0)
        .to(copy, { x: 0, y: 0, duration: 0.45 }, 0)
        .to(linkEl, { x: 0, duration: 0.4 }, 0)
        .to(chevron, { x: 0, scale: 1, duration: 0.4 }, 0)
        .to(shine, { xPercent: -120, opacity: 0, duration: 0.45 }, 0);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      hoverTl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [dark]);

  return (
    <a
      ref={cardRef}
      href="#treatments"
      className={`care-hero group relative flex min-h-[240px] overflow-hidden rounded-[1.75rem] will-change-transform sm:min-h-[300px] lg:min-h-[320px] ${
        dark ? "bg-black text-white" : "bg-[#F3C300] text-black"
      }`}
    >
      <div ref={shineRef} className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-transparent via-white to-transparent opacity-0" />
      <div ref={copyRef} className="care-hero-copy relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-9 will-change-transform">
        <div>
          {badge ? (
            <span className={`care-hero-badge mb-4 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${dark ? "bg-white/15 text-white" : "bg-black/10 text-black/80"}`}>
              {badge}
            </span>
          ) : null}
          <h3 className="max-w-[14ch] text-[clamp(1.35rem,2.8vw,2rem)] font-normal leading-[1.12] tracking-[-0.02em]">{title}</h3>
        </div>
        <span ref={linkRef} className={`text-sm will-change-transform ${dark ? "text-white/70" : "text-black/65"}`}>{link}</span>
      </div>
      <img ref={imgRef} src={img} alt="" className="care-hero-img pointer-events-none absolute bottom-0 right-0 z-[1] h-[72%] w-auto max-w-[58%] origin-bottom-right object-contain object-bottom will-change-transform sm:h-[78%] sm:max-w-[52%]" draggable={false} />
      <ChevronRight ref={chevronRef} className={`care-hero-chevron absolute bottom-6 right-6 z-10 h-5 w-5 will-change-transform ${dark ? "text-white/80" : "text-black/70"}`} strokeWidth={1.75} />
    </a>
  );
}

function CareCategoryCard({ label, highlight, img, to }: (typeof CARE_CATEGORIES)[number]) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [before, after] = label.split(highlight);

  useEffect(() => {
    const card = cardRef.current;
    const labelEl = labelRef.current;
    const image = imgRef.current;
    const wrap = imgWrapRef.current;
    const chevron = chevronRef.current;
    const glow = glowRef.current;
    if (!card || !labelEl || !image || !wrap || !chevron || !glow) return;

    gsap.set(image, { opacity: 0, scale: 0.55, rotate: -14, y: 18 });
    gsap.set(wrap, { scale: 0.85 });
    gsap.set(glow, { opacity: 0, scale: 0.8 });

    let hoverTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      hoverTl
        .to(card, { y: -8, scale: 1.03, backgroundColor: "#ffffff", duration: 0.42, ease: "back.out(1.6)" }, 0)
        .to(labelEl, { x: -4, duration: 0.35 }, 0)
        .to(wrap, { scale: 1.15, duration: 0.45, ease: "back.out(2)" }, 0)
        .to(image, { opacity: 1, scale: 1.12, rotate: 0, y: 0, duration: 0.5, ease: "back.out(2.2)" }, 0.02)
        .to(glow, { opacity: 1, scale: 1, duration: 0.4 }, 0.05)
        .to(chevron, { x: 5, scale: 1.2, duration: 0.35, ease: "back.out(2)" }, 0.05);
    };
    const onLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      hoverTl
        .to(card, { y: 0, scale: 1, backgroundColor: "#ffffff", duration: 0.48 }, 0)
        .to(labelEl, { x: 0, duration: 0.4 }, 0)
        .to(wrap, { scale: 0.85, duration: 0.45 }, 0)
        .to(image, { opacity: 0, scale: 0.55, rotate: -14, y: 18, duration: 0.4 }, 0)
        .to(glow, { opacity: 0, scale: 0.8, duration: 0.35 }, 0)
        .to(chevron, { x: 0, scale: 1, duration: 0.35 }, 0);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      hoverTl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link ref={cardRef} to={to} className="care-cat group relative flex items-center gap-3 overflow-hidden rounded-[1.25rem] bg-white px-4 py-5 will-change-transform sm:gap-4 sm:px-5 sm:py-6">
      <div ref={glowRef} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(243,195,0,0.22),transparent_65%)] opacity-0" />
      <p ref={labelRef} className="care-cat-label relative z-10 min-w-0 flex-1 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-snug text-ink will-change-transform">
        {before}<span className="text-[#C9A200]">{highlight}</span>{after}
      </p>
      <div ref={imgWrapRef} className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center will-change-transform sm:h-16 sm:w-16">
        <img ref={imgRef} src={img} alt="" className="care-cat-img h-full w-full object-contain will-change-transform" draggable={false} />
      </div>
      <ChevronRight ref={chevronRef} className="care-cat-chevron relative z-10 h-4 w-4 shrink-0 text-ink/35 will-change-transform" strokeWidth={1.75} />
    </Link>
  );
}

export function RedManSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      const headItems = sec.querySelectorAll<HTMLElement>(".care-head-item");
      const heroGrid = sec.querySelector<HTMLElement>(".care-hero-grid");
      const catGrid = sec.querySelector<HTMLElement>(".care-cat-grid");
      const heroes = sec.querySelectorAll<HTMLElement>(".care-hero");
      const cats = sec.querySelectorAll<HTMLElement>(".care-cat");

      gsap.set(headItems, { opacity: 0, y: 56, filter: "blur(12px)" });
      gsap.set(heroes, { opacity: 0, y: 90, scale: 0.88, rotateX: 14, transformPerspective: 1000 });
      gsap.set(cats, { opacity: 0, y: 48, scale: 0.92 });

      gsap.to(headItems, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.14, ease: "power4.out",
        scrollTrigger: { trigger: sec, start: "top 85%", toggleActions: "play none none reverse" },
      });

      if (heroGrid) {
        gsap.fromTo(heroGrid, { y: 48 }, { y: -36, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.4 } });
      }
      if (catGrid) {
        gsap.fromTo(catGrid, { y: 32 }, { y: -20, ease: "none", scrollTrigger: { trigger: sec, start: "top 70%", end: "bottom top", scrub: 1.8 } });
      }

      heroes.forEach((card, i) => {
        const image = card.querySelector<HTMLElement>(".care-hero-img");
        const copy = card.querySelector<HTMLElement>(".care-hero-copy");
        const chevron = card.querySelector<HTMLElement>(".care-hero-chevron");

        gsap.to(card, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.15, ease: "back.out(1.45)", scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" } });

        if (image) {
          gsap.fromTo(image, { opacity: 0, x: 70, y: 36, scale: 0.68, rotate: i === 0 ? 14 : -10 }, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 1.25, ease: "back.out(1.75)", scrollTrigger: { trigger: card, start: "top 86%", toggleActions: "play none none reverse" } });
          gsap.fromTo(image, { y: 24 }, { y: -32, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.6 + i * 0.25 } });
        }
        if (copy) {
          gsap.fromTo(copy, { opacity: 0, x: -36, y: 12 }, { opacity: 1, x: 0, y: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: card, start: "top 84%", toggleActions: "play none none reverse" } });
        }
        if (chevron) {
          gsap.fromTo(chevron, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none reverse" } });
        }
      });

      cats.forEach((card, i) => {
        const label = card.querySelector<HTMLElement>(".care-cat-label");
        const chevron = card.querySelector<HTMLElement>(".care-cat-chevron");
        gsap.fromTo(card, { x: i % 2 === 0 ? -56 : 56 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.95, ease: "back.out(1.55)", scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none reverse" } });
        if (label) gsap.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" } });
        if (chevron) gsap.fromTo(chevron, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2)", scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" } });
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="care-head mb-8 max-w-3xl sm:mb-10">
          <span className="care-head-item pill-tag mb-4 inline-flex"><span className="dot" /> Whole-system care</span>
          <h2 className="care-head-item text-[clamp(1.75rem,4.2vw,3.25rem)] font-normal leading-[1.06] tracking-[-0.03em] text-ink">
            The care you&apos;ve always deserved.
          </h2>
        </div>

        <div className="care-hero-grid grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {CARE_HERO.map((card) => (
            <CareHeroCard key={card.title} {...card} />
          ))}
        </div>

        <div className="care-cat-grid mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4 lg:gap-4">
          {CARE_CATEGORIES.map((card) => (
            <CareCategoryCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
