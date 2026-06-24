import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

import product1 from "@/assets/product 1 3d.png";

const PEN_LINES = [
  "› Pre-filled, pre-dosed. calibrated for your protocol.",
  "› Single-step injection. click, hold, release.",
  "› Cold-chain delivered. pharmacy to your door.",
] as const;

export function PenSection() {
  const ref = useRef<HTMLElement>(null);
  const penRef = useRef<HTMLImageElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const lineRefs = [line1Ref, line2Ref, line3Ref] as const;

  useEffect(() => {
    const sec = ref.current;
    const pen = penRef.current;
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!sec || !pen || !header || !progress) return;

    lineRefs.forEach(({ current }) => { if (current) current.textContent = ""; });
    if (descRef.current) descRef.current.textContent = "";

    const typewriter = (tl: gsap.core.Timeline, el: HTMLElement, text: string, position: number | string, duration = 0.18) => {
      const proxy = { p: 0 };
      el.textContent = "";
      tl.to(proxy, {
        p: 1, duration, ease: "none",
        onUpdate: () => { el.textContent = text.slice(0, Math.round(proxy.p * text.length)); },
      }, position);
    };

    const pin = ScrollTrigger.create({
      trigger: sec, start: "top top", end: "+=280%", pin: true, anticipatePin: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: "top top", end: "+=280%", scrub: 1 },
    });

    tl.fromTo(header, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08 }, 0);
    tl.fromTo(pen, { opacity: 0, y: 120, scale: 0.65, rotate: -20 }, { opacity: 1, y: -20, scale: 1.05, rotate: 380, duration: 0.55, ease: "power2.inOut" }, 0);
    tl.to(pen, { y: 0, scale: 1, rotate: 720, duration: 0.35, ease: "sine.inOut" }, 0.55);

    if (line1Ref.current) typewriter(tl, line1Ref.current, PEN_LINES[0], 0.18);
    if (line2Ref.current) typewriter(tl, line2Ref.current, PEN_LINES[1], 0.38);
    if (line3Ref.current) typewriter(tl, line3Ref.current, PEN_LINES[2], 0.58);

    if (descRef.current) {
      typewriter(tl, descRef.current, "Pharmaceutical-grade precision. engineered for consistency, comfort, and clinical confidence.", 0.76, 0.16);
    }

    tl.to(progress, { scaleX: 1, duration: 1, ease: "none", transformOrigin: "left center" }, 0);

    return () => { pin.kill(); tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section id="clinical" ref={ref} className="relative h-[100svh] bg-black">
      <div className="relative flex h-[100svh] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 40% 45%, rgba(243,195,0,0.08), transparent 70%)" }}
        />

        <div ref={headerRef} className="relative z-20 px-6 pt-16 lg:px-10 lg:pt-20">
          <span className="pill-tag mb-4 inline-flex !border-[#F3C300]/25 !bg-[#F3C300]/10 !text-white/85">
            <span className="dot !bg-[#F3C300]" /> The injector
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-snug text-white">
            Pharmaceutical-grade, designed.
          </h2>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10">
          <div className="relative flex h-[42vh] w-full items-center justify-center [perspective:1200px] lg:h-auto lg:flex-1">
            <div
              className="pointer-events-none absolute inset-x-10 bottom-6 h-10 rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.25), transparent 70%)" }}
            />
            <img
              ref={penRef}
              src={product1}
              alt="TIDL auto-injector"
              className="relative z-10 max-h-full max-w-[min(72vw,420px)] object-contain will-change-transform"
              style={{
                filter: "drop-shadow(0 40px 50px rgba(243,195,0,0.15)) drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
                opacity: 0,
              }}
            />
          </div>

          <div className="w-full max-w-md space-y-4 pb-10 lg:flex-1 lg:pb-0">
            {lineRefs.map(({ current: _ }, i) => (
              <p
                key={i}
                ref={lineRefs[i]}
                className="min-h-[1.6em] text-sm leading-relaxed text-white/75 sm:text-base"
              />
            ))}
            <p ref={descRef} className="min-h-[3.2em] border-t border-white/10 pt-4 text-sm leading-relaxed text-white/55" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-20 px-6 lg:px-10">
          <div className="h-px w-full origin-left scale-x-0 bg-[#F3C300]/60" ref={progressRef} />
          <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/35">Scroll to explore the injector</p>
        </div>
      </div>
    </section>
  );
}
