import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenisScroll } from "@/lib/use-lenis";
import { MagneticButton } from "@/components/MagneticButton";
import { PixelButton } from "@/components/PixelButton";
import { HeroBackground } from "@/components/HeroBackground";

import hero from "@/assets/hero.png.asset.json";
import phoneImg from "@/assets/phone.png.asset.json";
import voxel from "@/assets/voxel.mp4.asset.json";
import men2 from "@/assets/men2.png.asset.json";
import womenCut from "@/assets/women-cut.png.asset.json";
import redman from "@/assets/redman.png.asset.json";
import product1 from "@/assets/product1.png.asset.json";
import product2 from "@/assets/product2.png.asset.json";
import product3 from "@/assets/product3.png.asset.json";
import product4 from "@/assets/product4.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIDL — A clinical operating system for longevity" },
      { name: "description", content: "TIDL pairs clinical diagnostics with the next generation of metabolic, hormonal and longevity therapies — engineered for a longer, better life." },
      { property: "og:title", content: "TIDL — A clinical operating system for longevity" },
      { property: "og:description", content: "Personalised, physician-supervised longevity care." },
    ],
  }),
  component: Index,
});

/* ───────── helpers ───────── */

function SplitWords({
  text, className = "", wordClassName = "", delay = 0, trigger = "scroll", duration = 1.6,
}: {
  text: string; className?: string; wordClassName?: string; delay?: number;
  trigger?: "scroll" | "immediate"; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".w");
    const base = { yPercent: 110, opacity: 0 };
    const to = { yPercent: 0, opacity: 1, duration, ease: "expo.out", stagger: 0.09, delay };
    if (trigger === "immediate") {
      gsap.fromTo(words, base, to);
    } else {
      gsap.fromTo(words, base, {
        ...to,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }
  }, [delay, trigger, duration]);
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className={`w inline-block will-change-transform ${wordClassName}`}>{w}</span>
        </span>
      ))}
    </span>
  );
}

/* ───────── page ───────── */

function Index() {
  useLenisScroll();
  return (
    <div className="relative bg-background text-foreground">
      <div className="scroll-progress" />
      <Nav />
      <Hero />
      <Marquee />
      <VoxelSection />
      <HumanSection
        img={womenCut.url}
        align="left"
        tag="Longevity intelligence"
        title="A clinical view of you."
        body="Bloodwork, biomarkers and lifestyle telemetry — synthesised by your care team into a single, evolving plan."
        chips={[
          { label: "Bio age",      value: "−3.4 yrs",  pos: "top-[10%] left-[-4%]"  },
          { label: "VO₂ max",      value: "48.2",      pos: "top-[6%] left-[70%]"   },
          { label: "ApoB",         value: "62 mg/dL",  pos: "top-[34%] left-[80%]"  },
          { label: "HRV",          value: "74 ms",     pos: "top-[60%] left-[78%]"  },
          { label: "Sleep",        value: "92%",       pos: "top-[48%] left-[-6%]"  },
          { label: "hsCRP",        value: "0.4",       pos: "top-[78%] left-[8%]"   },
        ]}
      />
      <ProductsSection />
      <RedManSection />
      <PhoneSection />
      <HumanSection
        img={men2.url}
        align="right"
        tag="Performance"
        title="Built for the long climb."
        body="Hormonal optimisation, metabolic care and recovery science — calibrated to where you're going, not just where you are."
        blendMode="multiply"
        chips={[
          { label: "Testosterone", value: "812 ng/dL", pos: "top-[12%] left-[-4%]"  },
          { label: "Recovery",     value: "Optimal",   pos: "top-[18%] left-[78%]"  },
          { label: "Zone 2",       value: "138 W",     pos: "top-[78%] left-[68%]"  },
          { label: "Grip",         value: "+18%",      pos: "top-[68%] left-[2%]"   },
          { label: "Resting HR",   value: "52 bpm",    pos: "top-[-2%] left-[40%]"  },
        ]}
      />
      <PenSection />
      <ProtocolTimelineSection />
      <ScienceMetricsSection />
      <Cta />
      <Footer />
    </div>
  );
}

/* ───────── nav ───────── */

function Nav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.from(ref.current, { y: -40, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.3 });
  }, []);
  return (
    <nav ref={ref} className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-4">
      <div className="glass-light mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[oklch(0.78_0.08_240)] to-[oklch(0.55_0.13_245)] ring-1 ring-black/5" />
          <span className="font-display text-xl tracking-tight text-ink">TIDL</span>
          <span className="text-[10px] tracking-[0.3em] text-ink/40 hidden sm:inline">·  LONGEVITY</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-ink/65">
          <a href="#science" className="hover:text-ink transition">Science</a>
          <a href="#treatments" className="hover:text-ink transition">Treatments</a>
          <a href="#app" className="hover:text-ink transition">App</a>
          <a href="#clinical" className="hover:text-ink transition">Clinical</a>
        </div>
        <MagneticButton className="btn-primary !py-2 !px-4 text-xs">Get started</MagneticButton>
      </div>
    </nav>
  );
}

/* ───────── hero ───────── */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const discImgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    tl.fromTo(pillRef.current, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4);
    // Headline reveals via SplitWords delays 0.7 / 1.0 / 1.3 (each ~1.8s)
    tl.fromTo(
      discRef.current,
      { opacity: 0, scale: 0.7, rotateY: -18, rotateX: 12, y: 60 },
      { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, y: 0, duration: 2.4, ease: "power4.out" },
      1.4
    );
    tl.fromTo(paraRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 3.2);
    tl.fromTo(ctaRef.current?.children || [], { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.1 }, 3.7);
    tl.fromTo(trustRef.current?.children || [], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 4.1);

    if (ringRef.current) {
      gsap.to(ringRef.current, { rotate: 360, duration: 60, ease: "none", repeat: -1, delay: 1.4 });
    }

    // continuous luxurious float of the disc
    gsap.to(discImgRef.current, {
      y: -14, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3.4,
    });

    // mouse parallax on disc
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      gsap.to(discImgRef.current, {
        rotateY: cx * 10, rotateX: -cy * 8, x: cx * 12, duration: 1.4, ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    // scroll parallax
    gsap.to(discRef.current, {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero relative min-h-[100svh] overflow-hidden noise pt-28 pb-12">
      <div ref={bgRef} className="absolute inset-0 opacity-0">
        <HeroBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div ref={pillRef} className="mb-7 flex justify-center opacity-0">
          <span className="pill-tag"><span className="dot" /> Personalised longevity · clinician-supervised</span>
        </div>

        <h1 className="font-display text-[clamp(2.6rem,8.6vw,8rem)] leading-[0.95] tracking-tight text-ink">
          <span className="block"><SplitWords text="Live better." trigger="immediate" delay={0.7} duration={1.8} /></span>
          <span className="block"><SplitWords text="Longer." wordClassName="text-gradient-clinical" trigger="immediate" delay={1.0} duration={1.8} /></span>
          <span className="block"><SplitWords text="Feel like you." trigger="immediate" delay={1.3} duration={1.8} /></span>
        </h1>

        <p ref={paraRef} className="mx-auto mt-7 max-w-xl text-base sm:text-lg text-ink-soft opacity-0">
          A clinical operating system pairing diagnostic-grade biomarkers with metabolic, hormonal and longevity therapies — delivered to your door.
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton className="btn-primary">Start your assessment →</MagneticButton>
          <MagneticButton className="btn-ghost">Watch the film</MagneticButton>
        </div>

        {/* TIDL disc — uploaded 3D render, floating */}
        <div ref={discRef} className="relative mt-10 mx-auto h-[440px] sm:h-[540px] w-full max-w-[760px] [perspective:1400px]">
          <div className="absolute inset-x-10 bottom-6 h-12 rounded-full blur-3xl"
               style={{ background: "radial-gradient(closest-side, oklch(0.62 0.12 240 / 0.22), transparent 70%)" }} />
          <div
            ref={ringRef}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] sm:h-[640px] sm:w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(216,199,154,0.55) 60deg, transparent 130deg, rgba(216,199,154,0.35) 220deg, transparent 320deg)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
              maskImage:
                "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
              opacity: 0.85,
            }}
          />
          <img
            ref={discImgRef}
            src={hero.url}
            alt="TIDL longevity disc"
            className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
            style={{
              filter: "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))",
              background: "transparent",
            }}
          />
        </div>

        <div ref={trustRef} className="mt-2 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] tracking-[0.22em] text-ink/40 uppercase">
          <span>FDA-registered partners</span>
          <span className="hidden sm:inline">·</span>
          <span>HSA / FSA eligible</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Board-certified physicians</span>
        </div>
      </div>
    </section>
  );
}

/* ───────── marquee ───────── */

function Marquee() {
  const items = ["Metabolic care", "Hormonal optimisation", "Longevity diagnostics", "GLP-1 protocols", "Recovery science", "Clinical concierge"];
  return (
    <section className="relative border-y border-border py-5 overflow-hidden bg-surface">
      <div className="flex gap-12 whitespace-nowrap animate-[scroll_42s_linear_infinite] will-change-transform">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-xl text-ink/35">
            {t} <span className="text-[oklch(0.62_0.12_240)]/50 mx-2">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { to { transform: translateX(-33.333%); } }`}</style>
    </section>
  );
}

/* ───────── voxel section ───────── */

function VoxelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const pin = ScrollTrigger.create({
      trigger: section, start: "top top", end: "+=180%", pin: true,
      onEnter: () => video.play().catch(() => {}),
      onEnterBack: () => video.play().catch(() => {}),
    });

    gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, ease: "expo.out",
      scrollTrigger: { trigger: section, start: "+=110% top", end: "+=70%", scrub: 1 },
    });

    return () => { pin.kill(); };
  }, []);

  return (
    <section id="science" ref={sectionRef} className="relative h-[100svh] overflow-hidden bg-[#0d1117]">
      <video ref={videoRef} src={voxel.url} muted playsInline loop preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/0" />

      <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-20 px-6 pb-16">
        <div className="mx-auto max-w-5xl text-center text-white">
          <span className="pill-tag mb-6 !bg-white/10 !border-white/20 !text-white/85"><span className="dot !bg-[oklch(0.78_0.10_175)]" /> Voxel-level diagnostics</span>
          <h2 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[1.02]">
            We rebuild you, <span className="italic text-gradient-clinical">one voxel at a time.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            High-resolution imaging, continuous biomarkers and lifestyle data are fused into a living model of your physiology — the substrate for every TIDL decision.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <MagneticButton className="btn-primary">Explore the science</MagneticButton>
            <MagneticButton className="btn-ghost !bg-white/8 !text-white !border-white/25">Read the methodology</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── human storytelling ───────── */

type Chip = { label: string; value: string; pos: string };

function HumanSection({
  img, align, tag, title, body, chips, blendMode,
}: { img: string; align: "left" | "right"; tag: string; title: string; body: string; chips: Chip[]; blendMode?: "normal" | "multiply" | "darken" }) {
  const ref = useRef<HTMLElement>(null);
  const personRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const person = personRef.current;
    const chipEls = Array.from(sec.querySelectorAll<HTMLElement>(".chip-data"));
    const headline = sec.querySelector<HTMLElement>(".copy-headline");
    const para = sec.querySelector<HTMLElement>(".copy-para");
    const cta = sec.querySelector<HTMLElement>(".copy-cta");
    const pill = sec.querySelector<HTMLElement>(".copy-pill");

    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
      (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        const travel = isMobile ? 40 : 80;
        const dur = isMobile ? 1.4 : 2.0;

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: { trigger: sec, start: isMobile ? "top 80%" : "top 70%" },
        });

        tl.fromTo(person,
          { opacity: 0, scale: 0.94, y: travel },
          { opacity: 1, scale: 1, y: 0, duration: dur },
          0
        );

        const chipStart = dur + 0.3;
        const chipStep = isMobile ? 0.1 : 0.15;
        chipEls.forEach((el, i) => {
          tl.fromTo(el,
            { opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" },
            { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
            chipStart + i * chipStep
          );
        });

        const copyStart = chipStart + chipEls.length * chipStep + 0.2;
        tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, copyStart);
        tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: isMobile ? 1.2 : 1.6 }, copyStart + 0.2);
        tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.0 }, copyStart + 0.8);
        tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, copyStart + 1.3);
      }
    );

    gsap.to(person, {
      y: -10, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3,
    });
    gsap.to(person, {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
    });

    return () => mm.revert();
  }, [align, chips]);

  // Feathered radial mask removes residual rectangular PNG background bleed.
  // Stronger feather + multiply blending for assets with visible rectangular fills (e.g. men2).
  const featherMask = blendMode === "multiply"
    ? "radial-gradient(ellipse 60% 76% at 50% 52%, #000 48%, rgba(0,0,0,0.7) 66%, rgba(0,0,0,0) 92%)"
    : "radial-gradient(ellipse 70% 82% at 50% 52%, #000 58%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0) 94%)";

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 sm:gap-12 px-5 sm:px-6 lg:grid-cols-12">
        <div className={`relative lg:col-span-7 ${align === "right" ? "lg:order-2" : ""}`}>
          <div className="relative aspect-[4/5] w-full max-w-[640px] mx-auto">
            <img
              ref={personRef}
              src={img}
              alt=""
              className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
              style={{
                filter: "drop-shadow(0 40px 60px rgba(40,60,100,0.22))",
                background: "transparent",
                opacity: 0,
                mixBlendMode: blendMode ?? "normal",
                WebkitMaskImage: featherMask,
                maskImage: featherMask,
              }}
            />
            {chips.map((c, i) => (
              <div key={i} className={`chip-data absolute ${c.pos} will-change-transform z-10`} style={{ opacity: 0 }}>
                <div className="chip-glow relative rounded-2xl bg-white/75 backdrop-blur-md ring-1 ring-black/5 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_10px_30px_-10px_rgba(40,60,100,0.22)]">
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-ink/50">{c.label}</div>
                  <div className="font-display text-[13px] sm:text-base text-ink leading-tight">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`copy lg:col-span-5 ${align === "right" ? "lg:order-1" : ""}`}>
          <span className="copy-pill pill-tag mb-5 inline-flex" style={{ opacity: 0 }}><span className="dot" /> {tag}</span>
          <h2 className="copy-headline font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02] text-ink" style={{ opacity: 0 }}>{title}</h2>
          <p className="copy-para mt-5 text-ink-soft max-w-md" style={{ opacity: 0 }}>{body}</p>
          <div className="copy-cta mt-7" style={{ opacity: 0 }}><MagneticButton className="btn-ghost">See the protocol →</MagneticButton></div>
        </div>
      </div>
    </section>
  );
}

/* ───────── red sweater man section ───────── */

function RedManSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const person = sec.querySelector<HTMLElement>(".rm-person");
    const words = Array.from(sec.querySelectorAll<HTMLElement>(".rm-word"));
    const pill = sec.querySelector<HTMLElement>(".rm-pill");
    const headline = sec.querySelector<HTMLElement>(".rm-headline");
    const para = sec.querySelector<HTMLElement>(".rm-para");
    const cta = sec.querySelector<HTMLElement>(".rm-cta");

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      scrollTrigger: { trigger: sec, start: "top 65%" },
    });

    tl.fromTo(person,
      { opacity: 0, scale: 0.92, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 2.0 },
      0
    );

    const shuffled = words.map((w) => ({ w, r: Math.random() })).sort((a, b) => a.r - b.r).map((o) => o.w);
    shuffled.forEach((w, i) => {
      tl.fromTo(w,
        { opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" },
        { opacity: 0.85, scale: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        2.5 + i * 0.15
      );
    });

    const after = 2.5 + shuffled.length * 0.15 + 0.3;

    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, after);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6 }, after + 0.2);
    tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, after + 0.9);
    tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, after + 1.6);

    gsap.to(person, {
      y: -12, duration: 5.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3,
    });
  }, []);

  const words = [
    { t: "Hormones",     pos: "top-[14%] left-[8%]"  },
    { t: "Metabolism",   pos: "top-[26%] right-[10%]" },
    { t: "Thyroid",      pos: "top-[44%] left-[4%]" },
    { t: "Recovery",     pos: "top-[58%] right-[6%]" },
    { t: "Inflammation", pos: "top-[72%] left-[12%]" },
    { t: "Longevity",    pos: "top-[8%] right-[26%]" },
    { t: "Performance",  pos: "bottom-[10%] right-[14%]" },
    { t: "Sleep",        pos: "bottom-[6%] left-[28%]" },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-24 lg:py-32"
      style={{ background: "linear-gradient(180deg, #efdcd5 0%, #e8d2ca 60%, #e3ccc4 100%)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-20 mix-blend-multiply" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="relative mx-auto h-[62vh] min-h-[440px] sm:h-[80vh] sm:min-h-[640px] w-full max-w-[1100px]">
          <div className="pointer-events-none absolute inset-0 z-0">
            {words.map((w, i) => (
              <span
                key={i}
                className={`rm-word absolute font-display tracking-tight ${w.pos}`}
                style={{
                  fontSize: "clamp(1rem, 3vw, 2.6rem)",
                  color: "rgba(120, 40, 30, 0.55)",
                  letterSpacing: "-0.01em",
                  opacity: 0,
                }}
              >
                {w.t}
              </span>
            ))}
          </div>

          <img
            src={redman.url}
            alt=""
            className="rm-person absolute left-1/2 top-1/2 z-10 h-[72%] sm:h-[88%] w-auto max-w-[78%] sm:max-w-[90%] -translate-x-1/2 -translate-y-1/2 object-contain will-change-transform"
            style={{
              filter: "drop-shadow(0 40px 60px rgba(120, 40, 30, 0.25))",
              opacity: 0,
              mixBlendMode: "multiply",
              WebkitMaskImage: "radial-gradient(ellipse 65% 80% at 50% 50%, #000 58%, rgba(0,0,0,0.85) 74%, rgba(0,0,0,0) 95%)",
              maskImage: "radial-gradient(ellipse 65% 80% at 50% 50%, #000 58%, rgba(0,0,0,0.85) 74%, rgba(0,0,0,0) 95%)",
            }}
          />

          <div
            className="pointer-events-none absolute left-1/2 top-[55%] -z-0 h-[220px] w-[340px] sm:h-[300px] sm:w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(220, 130, 110, 0.45), transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-2xl text-center">
          <span className="rm-pill pill-tag mb-5 inline-flex" style={{ opacity: 0 }}><span className="dot !bg-[#b35846]" /> Whole-system care</span>
          <h2 className="rm-headline font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-ink" style={{ opacity: 0 }}>
            Every system, <span className="italic text-gradient-clinical">in one plan.</span>
          </h2>
          <p className="rm-para mt-5 text-ink-soft mx-auto max-w-md" style={{ opacity: 0 }}>
            Hormones, metabolism, recovery and inflammation — measured together, optimised together. One physician, one continuous protocol.
          </p>
          <div className="rm-cta mt-7 flex justify-center" style={{ opacity: 0 }}>
            <MagneticButton className="btn-primary">See your full picture →</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── products ───────── */

type Card = { img: string; tag: string; name: string; sub: string; price: string };
const CARDS: Card[] = [
  { img: product1.url, tag: "Metabolic", name: "Lirosiome", sub: "GLP-1 weight protocol", price: "$249" },
  { img: product4.url, tag: "Longevity", name: "Tirosane", sub: "Cellular renewal", price: "$329" },
  { img: product2.url, tag: "Daily",     name: "TIDL Core", sub: "Foundational longevity", price: "$48" },
  { img: product3.url, tag: "Hormonal",  name: "TIDL Cycle", sub: "Female hormonal balance", price: "$58" },
];

function ProductsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const cards = sec.querySelectorAll<HTMLElement>(".pcard");

    cards.forEach((card, idx) => {
      const img = card.querySelector<HTMLImageElement>(".pc-img");
      const meta = card.querySelectorAll<HTMLElement>(".pc-meta");

      // entrance — image floats up first, then meta
      gsap.fromTo(img, { opacity: 0, y: 60, scale: 0.92, filter: "blur(10px)" }, {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out", delay: idx * 0.12,
        scrollTrigger: { trigger: card, start: "top 88%" },
      });
      gsap.fromTo(meta, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.4 + idx * 0.12,
        scrollTrigger: { trigger: card, start: "top 88%" },
      });

      if (!img) return;

      // ambient float loop
      const ambient = gsap.to(img, {
        y: -8, duration: 4.0, ease: "sine.inOut", yoyo: true, repeat: -1, delay: idx * 0.4,
      });

      let hoverTl: gsap.core.Timeline | null = null;
      const onEnter = () => {
        ambient.pause();
        gsap.killTweensOf(img);
        // Initial lift + scale + rotation
        hoverTl = gsap.timeline();
        hoverTl
          .to(img, { y: -18, scale: 1.05, duration: 0.8, ease: "power3.out" })
          .to(img, {
            y: -28, rotate: 3, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1,
          })
          .to(img, {
            rotate: -3, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1,
          }, "<");
      };
      const onLeave = () => {
        hoverTl?.kill();
        gsap.killTweensOf(img);
        gsap.to(img, {
          y: -8, scale: 1, rotate: 0, duration: 0.8, ease: "power3.out",
          onComplete: () => {
            gsap.to(img, { y: -8, duration: 4.0, ease: "sine.inOut", yoyo: true, repeat: -1 });
          },
        });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
    });
  }, []);

  return (
    <section id="treatments" ref={ref} className="relative py-24 lg:py-36 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <span className="pill-tag mb-5"><span className="dot" /> Treatments</span>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.02] text-ink">
            Protocols, not <span className="italic text-gradient-clinical">prescriptions.</span>
          </h2>
          <p className="mt-4 text-ink-soft max-w-xl">
            Every TIDL therapy is matched to your biomarkers, adjusted by your physician, and delivered with the precision of a luxury product.
          </p>
        </div>

        {/* Mobile: horizontal snap carousel. Tablet+: grid. */}
        <div
          className="
            -mx-5 sm:mx-0
            flex sm:grid sm:grid-cols-2 lg:grid-cols-4
            gap-x-4 sm:gap-x-6 gap-y-16
            overflow-x-auto sm:overflow-visible
            snap-x snap-mandatory sm:snap-none
            px-5 sm:px-0
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            [-webkit-overflow-scrolling:touch]
          "
        >
          {CARDS.map((c, i) => (
            <div
              key={i}
              className="
                pcard group relative cursor-pointer shrink-0 sm:shrink
                w-[62%] xs:w-[58%] sm:w-auto snap-center
              "
            >
              <div className="relative h-44 sm:h-72 mb-4 sm:mb-6 flex items-end justify-center overflow-visible">
                <div className="absolute inset-x-8 bottom-4 h-5 rounded-full blur-2xl opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                     style={{ background: "radial-gradient(closest-side, rgba(20,30,60,0.30), transparent 70%)" }} />
                <img
                  src={c.img}
                  alt={c.name}
                  className="pc-img relative z-10 max-h-full max-w-full object-contain will-change-transform"
                  style={{ filter: "drop-shadow(0 22px 28px rgba(20,30,60,0.22))" }}
                />
              </div>
              <div className="pc-meta text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[oklch(0.55_0.13_245)]">{c.tag}</div>
              <div className="pc-meta mt-1 font-display text-lg sm:text-2xl text-ink">{c.name}</div>
              <div className="pc-meta text-xs sm:text-sm text-ink-soft">{c.sub}</div>
              <div className="pc-meta mt-3 sm:mt-4 flex items-center justify-between">
                <div className="font-display text-base sm:text-xl text-ink">{c.price}<span className="text-[10px] sm:text-xs text-ink/50"> / mo</span></div>
                <span className="text-[11px] sm:text-xs font-medium text-[oklch(0.55_0.13_245)] group-hover:translate-x-1 transition-transform">Start →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── phone section ───────── */

function PhoneSection() {
  const ref = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const phone = phoneRef.current;
    if (!sec || !phone || !wrapRef.current) return;

    const pill = sec.querySelector<HTMLElement>(".pcopy-pill");
    const headline = sec.querySelector<HTMLElement>(".pcopy-headline");
    const para = sec.querySelector<HTMLElement>(".pcopy-para");
    const list = sec.querySelectorAll<HTMLElement>(".pcopy-li");
    const cta = sec.querySelector<HTMLElement>(".pcopy-cta");

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      scrollTrigger: { trigger: sec, start: "top 70%" },
    });

    // Phone emerges from the page
    tl.fromTo(phone,
      { opacity: 0, scale: 0.7, rotateX: 18, y: 120 },
      { opacity: 1, scale: 1, rotateX: 0, y: 0, duration: 2.3 },
      0
    );

    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 1.2);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6 }, 1.4);
    tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 2.1);
    tl.fromTo(list, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 2.6);
    tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 3.4);

    // Continuous gentle float after entrance
    gsap.to(phone, {
      y: -10, duration: 5.0, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.6,
    });

    // Mouse parallax — max 6px
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current!.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width - 0.5);
      const cy = ((e.clientY - rect.top) / rect.height - 0.5);
      gsap.to(phone, {
        x: cx * 6, rotateY: cx * 4, rotateX: -cy * 4, duration: 1.2, ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    // scroll parallax
    gsap.to(phone, {
      yPercent: -10, ease: "none",
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="app" ref={ref} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="pcopy-pill pill-tag mb-5 inline-flex" style={{ opacity: 0 }}><span className="dot" /> The TIDL app</span>
          <h2 className="pcopy-headline font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1.02] text-ink" style={{ opacity: 0 }}>
            Your care plan, <span className="italic text-gradient-clinical">in your pocket.</span>
          </h2>
          <p className="pcopy-para mt-5 text-ink-soft max-w-md" style={{ opacity: 0 }}>
            Dosing reminders, weekly check-ins, weight and lab trends, and direct messages with your clinical care team — all in one calm interface.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-ink/80">
            {[
              "Daily protocol guidance",
              "Continuous biomarker tracking",
              "24/7 clinical messaging",
              "Cold-chain delivery, monitored",
            ].map((t) => (
              <li key={t} className="pcopy-li flex items-center gap-3" style={{ opacity: 0 }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.12_240)]" /> {t}
              </li>
            ))}
          </ul>
          <div className="pcopy-cta mt-8" style={{ opacity: 0 }}><MagneticButton className="btn-primary">Download for iOS</MagneticButton></div>
        </div>
        <div ref={wrapRef} className="relative lg:col-span-7 flex justify-center [perspective:1400px]">
          <div className="pointer-events-none absolute inset-x-12 bottom-8 h-16 rounded-full blur-3xl"
               style={{ background: "radial-gradient(closest-side, oklch(0.55 0.12 245 / 0.25), transparent 70%)" }} />
          <img
            ref={phoneRef}
            src={phoneImg.url}
            alt="TIDL longevity app"
            className="relative z-10 max-h-[720px] w-auto object-contain will-change-transform"
            style={{
              filter: "drop-shadow(0 60px 80px rgba(20,30,60,0.30)) drop-shadow(0 20px 30px rgba(40,60,100,0.18))",
              background: "transparent",
              opacity: 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────── pen section ───────── */

function PenSection() {
  const ref = useRef<HTMLElement>(null);
  const penRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const pen = penRef.current;
    if (!sec || !pen) return;

    const pill = sec.querySelector<HTMLElement>(".pen-pill");
    const headline = sec.querySelector<HTMLElement>(".pen-headline");
    const items = sec.querySelectorAll<HTMLElement>(".penbenefit");

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      scrollTrigger: { trigger: sec, start: "top 70%" },
    });

    tl.fromTo(pen,
      { opacity: 0, scale: 0.85, rotate: -8, y: 80, filter: "blur(8px)" },
      { opacity: 1, scale: 1, rotate: -4, y: 0, filter: "blur(0px)", duration: 2.2 },
      0
    );

    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 1.2);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6 }, 1.4);
    tl.fromTo(items, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.0, stagger: 0.18 }, 2.2);

    gsap.to(pen, {
      y: -14, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.8,
    });

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      gsap.to(pen, {
        rotateY: cx * 8, rotateX: -cy * 6, duration: 1.4, ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const benefits = [
    { n: "01", t: "Pre-filled, pre-dosed", b: "Calibrated for your protocol — no measuring, no mixing." },
    { n: "02", t: "Single-step injection", b: "Click, hold, release. Designed by industrial engineers, not pharmacists." },
    { n: "03", t: "Cold-chain delivered", b: "Monitored from compounding pharmacy to your front door." },
  ];

  return (
    <section id="clinical" ref={ref} className="relative py-24 lg:py-36 overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
        <div className="relative lg:col-span-7 h-[560px] lg:h-[720px] flex items-center justify-center [perspective:1400px]">
          <div className="pointer-events-none absolute inset-x-16 bottom-16 h-10 rounded-full blur-3xl"
               style={{ background: "radial-gradient(closest-side, rgba(40,60,100,0.18), transparent 70%)" }} />
          <img
            ref={penRef}
            src={product1.url}
            alt="TIDL auto-injector"
            className="relative z-10 max-h-full max-w-full object-contain will-change-transform"
            style={{
              filter: "drop-shadow(0 50px 60px rgba(20,30,60,0.28))",
              background: "transparent",
              opacity: 0,
            }}
          />
        </div>
        <div className="lg:col-span-5">
          <span className="pen-pill pill-tag mb-5 inline-flex" style={{ opacity: 0 }}><span className="dot" /> The injector</span>
          <h2 className="pen-headline font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1.02] text-ink" style={{ opacity: 0 }}>
            Pharmaceutical-grade, <span className="italic text-gradient-clinical">designed.</span>
          </h2>
          <div className="mt-8 space-y-5">
            {benefits.map((b) => (
              <div key={b.n} className="penbenefit border-t border-border pt-4" style={{ opacity: 0 }}>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-xl text-ink">{b.t}</span>
                  <span className="text-xs tracking-[0.2em] text-ink/40">{b.n}</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft max-w-sm">{b.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── cta ───────── */

function Cta() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const pill = sec.querySelector<HTMLElement>(".cta-pill");
    const headline = sec.querySelector<HTMLElement>(".cta-headline");
    const para = sec.querySelector<HTMLElement>(".cta-para");
    const buttons = sec.querySelector<HTMLElement>(".cta-buttons");

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: sec, start: "top 75%" },
    });
    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 0);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6 }, 0.3);
    tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 1.0);
    tl.fromTo(buttons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 1.7);
  }, []);
  return (
    <section ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="cta-pill mx-auto mb-10 inline-flex items-center gap-2 pill-tag" style={{ opacity: 0 }}>
          <span className="dot" /> Begin
        </div>
        <h2 className="cta-headline font-display text-[clamp(2.2rem,6vw,5rem)] leading-[1] text-ink" style={{ opacity: 0 }}>
          The next decade <span className="italic text-gradient-clinical">starts now.</span>
        </h2>
        <p className="cta-para mx-auto mt-6 max-w-lg text-ink-soft" style={{ opacity: 0 }}>
          A 10-minute clinical intake. A complete lab panel. A protocol designed around the life you intend to live.
        </p>
        <div className="cta-buttons mt-10 flex flex-wrap justify-center gap-4" style={{ opacity: 0 }}>
          <PixelButton label="Start your assessment" variant="primary" />
          <PixelButton label="Speak with a clinician" variant="ghost" />
        </div>
      </div>
    </section>
  );
}

/* ───────── protocol timeline (horizontal pinned) ───────── */

function ProtocolTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const phases = [
    {
      day: "Day 0",
      title: "Clinical intake",
      body: "Full medical history, lifestyle telemetry and a 60-marker blood panel. Your baseline, in high resolution.",
      stats: [["Markers", "62"], ["Visit", "Virtual"]],
    },
    {
      day: "Day 14",
      title: "Protocol designed",
      body: "Your physician composes a personalised metabolic, hormonal and longevity protocol — reviewed, signed, shipped.",
      stats: [["Compounds", "4"], ["Cadence", "Weekly"]],
    },
    {
      day: "Day 45",
      title: "First recalibration",
      body: "We re-measure. Dose, cadence and stack are tuned to how your body actually responded — not how it should have.",
      stats: [["ApoB", "−21%"], ["HRV", "+18%"]],
    },
    {
      day: "Day 90",
      title: "Compounded gains",
      body: "Bio-age, metabolic health and recovery converge. The plan keeps evolving — quarterly, for life.",
      stats: [["Bio age", "−3.4 yrs"], ["VO₂ max", "+11%"]],
    },
  ];

  useEffect(() => {
    const sec = ref.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const ctx = gsap.context(() => {
      const cards = track.querySelectorAll<HTMLElement>(".phase-card");
      const distance = () => track.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card) => {
        const num = card.querySelector<HTMLElement>(".phase-day");
        const title = card.querySelector<HTMLElement>(".phase-title");
        const body = card.querySelector<HTMLElement>(".phase-body");
        const stats = card.querySelectorAll<HTMLElement>(".phase-stat");
        gsap.fromTo(
          [num, title, body, ...stats],
          { opacity: 0, y: 40, filter: "blur(8px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 1.0, stagger: 0.08, ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 70%",
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative h-screen flex flex-col">
        <div className="px-6 lg:px-12 pt-24">
          <span className="pill-tag inline-flex"><span className="dot" /> The protocol</span>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-ink max-w-3xl">
            Ninety days, <span className="italic text-gradient-clinical">measured.</span>
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <div ref={trackRef} className="flex gap-8 px-6 lg:px-12 will-change-transform">
            {phases.map((p, i) => (
              <div
                key={p.day}
                className="phase-card card-clinical relative shrink-0 w-[78vw] sm:w-[440px] h-[440px] p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="phase-day font-mono text-xs tracking-[0.3em] text-ink/45">
                    {String(i + 1).padStart(2, "0")} · {p.day}
                  </div>
                  <h3 className="phase-title mt-5 font-display text-3xl text-ink leading-tight">
                    {p.title}
                  </h3>
                  <p className="phase-body mt-3 text-ink-soft text-sm max-w-[36ch]">{p.body}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  {p.stats.map(([k, v]) => (
                    <div key={k} className="phase-stat">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-ink/45">{k}</div>
                      <div className="mt-1 font-display text-xl text-ink">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="shrink-0 w-[40vw]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── science metrics (counter + ring draw) ───────── */

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tw = gsap.to(obj, {
      v: to,
      duration: 2.2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals) + suffix;
      },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [to, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

function ScienceMetricsSection() {
  const ref = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sec.querySelectorAll(".sm-reveal"),
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.4, stagger: 0.12, ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 75%" },
        }
      );

      if (ringRef.current) {
        const r = ringRef.current;
        const len = r.getTotalLength();
        r.style.strokeDasharray = String(len);
        r.style.strokeDashoffset = String(len);
        gsap.to(r, {
          strokeDashoffset: len * 0.18,
          duration: 2.4,
          ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 70%" },
        });
      }
    }, sec);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-light pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <span className="sm-reveal pill-tag inline-flex"><span className="dot" /> Outcomes</span>
          <h2 className="sm-reveal mt-5 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-ink">
            The numbers that <span className="italic text-gradient-clinical">change.</span>
          </h2>
          <p className="sm-reveal mt-5 text-ink-soft max-w-lg">
            Aggregated across TIDL members on a longevity protocol for at least ninety days. Every measurement is clinician-reviewed.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {[
              { v: 82, s: "%", l: "ApoB in range" },
              { v: 3.4, s: " yrs", l: "Bio-age reduction", d: 1 },
              { v: 18, s: "%", l: "VO₂ max gain" },
              { v: 11, s: " hrs", l: "Sleep debt cleared" },
              { v: 92, s: "%", l: "Member retention" },
              { v: 24, s: "/7", l: "Clinical support" },
            ].map((m) => (
              <div key={m.l} className="sm-reveal">
                <div className="font-display text-5xl text-ink tracking-tight">
                  <Counter to={m.v} suffix={m.s} decimals={m.d ?? 0} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.22em] text-ink/45">{m.l}</div>
              </div>
            ))}
          </div>

          <div className="sm-reveal mt-14 flex flex-wrap gap-4">
            <PixelButton label="See the data" variant="primary" />
            <PixelButton label="Read the science" variant="ghost" />
          </div>
        </div>

        <div className="sm-reveal lg:col-span-5 relative flex items-center justify-center h-[420px]">
          <svg viewBox="0 0 320 320" className="w-full max-w-[380px]">
            <defs>
              <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.08 240)" />
                <stop offset="100%" stopColor="oklch(0.55 0.13 245)" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r="130" fill="none" stroke="currentColor" className="text-ink/10" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="160" cy="160" r="130"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              transform="rotate(-90 160 160)"
            />
            <text x="160" y="155" textAnchor="middle" className="fill-ink font-display" fontSize="56">82</text>
            <text x="160" y="190" textAnchor="middle" className="fill-ink/45" fontSize="11" letterSpacing="3">METABOLIC SCORE</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ───────── footer ───────── */

function Footer() {
  return (
    <footer className="relative border-t border-border py-14 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[oklch(0.78_0.08_240)] to-[oklch(0.55_0.13_245)]" />
            <div className="font-display text-2xl text-ink">TIDL</div>
          </div>
          <p className="mt-3 text-ink-soft max-w-xs">Premium telehealth and longevity, supervised by board-certified clinicians.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink/45 mb-3">Treatments</div>
          <ul className="space-y-2 text-ink/75"><li>Metabolic</li><li>Hormonal</li><li>Longevity</li><li>Recovery</li></ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink/45 mb-3">Company</div>
          <ul className="space-y-2 text-ink/75"><li>Science</li><li>Clinicians</li><li>Press</li><li>Careers</li></ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink/45 mb-3">Legal</div>
          <ul className="space-y-2 text-ink/75"><li>Privacy</li><li>Terms</li><li>HIPAA</li></ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-6 text-xs text-ink/45">
        © {new Date().getFullYear()} TIDL Health, Inc. Treatments require physician evaluation. Not all patients qualify.
      </div>
    </footer>
  );
}
