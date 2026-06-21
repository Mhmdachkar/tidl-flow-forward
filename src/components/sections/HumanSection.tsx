import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/MagneticButton";

export type Chip = { label: string; value: string; pos: string };

export function HumanSection({
  img,
  align,
  tag,
  title,
  body,
  chips,
  blendMode,
}: {
  img: string;
  align: "left" | "right";
  tag: string;
  title: string;
  body: string;
  chips: Chip[];
  blendMode?: "normal" | "multiply" | "darken";
}) {
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
    const floatWrap = sec.querySelector<HTMLElement>(".person-float");
    const stageWrap = sec.querySelector<HTMLElement>(".person-stage");

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
        (mctx) => {
          const { isMobile } = mctx.conditions as { isMobile: boolean };
          const travel = isMobile ? 36 : 56;
          const copyDrop = isMobile ? -22 : -32;

          gsap.set([pill, headline, para, cta], { opacity: 0, y: copyDrop });
          if (person) gsap.set(person, { opacity: 0, y: travel, scale: 0.96 });
          gsap.set(chipEls, { opacity: 0, y: 20, scale: 0.92, filter: "blur(4px)" });

          const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

          tl.to(pill, { opacity: 1, y: 0, duration: 0.35 }, 0);
          tl.to(headline, { opacity: 1, y: 0, duration: 0.38 }, 0.05);
          tl.to(para, { opacity: 1, y: 0, duration: 0.35 }, 0.1);
          tl.to(cta, { opacity: 1, y: 0, duration: 0.35 }, 0.15);

          if (person) {
            tl.to(person, { opacity: 1, y: 0, scale: 1, duration: isMobile ? 0.85 : 1 }, 0.08);
          }

          chipEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4 }, 0.22 + i * 0.05);
          });

          ScrollTrigger.create({
            trigger: sec,
            start: isMobile ? "top 90%" : "top 85%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse",
            animation: tl,
          });
        }
      );

      if (floatWrap) {
        gsap.to(floatWrap, { y: -8, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      if (stageWrap) {
        gsap.fromTo(
          stageWrap,
          { yPercent: 4 },
          { yPercent: -4, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.2 } }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, [align, chips]);

  const featherMask = blendMode === "multiply"
    ? "radial-gradient(ellipse 60% 76% at 50% 52%, #000 48%, rgba(0,0,0,0.7) 66%, rgba(0,0,0,0) 92%)"
    : "radial-gradient(ellipse 70% 82% at 50% 52%, #000 58%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0) 94%)";

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 sm:gap-12 px-5 sm:px-6 lg:grid-cols-12">
        <div className={`relative lg:col-span-7 ${align === "right" ? "lg:order-2" : ""}`}>
          <div className="person-stage relative aspect-[4/5] w-full max-w-[640px] mx-auto will-change-transform">
            <div className="person-float absolute inset-0">
              <img
                ref={personRef}
                src={img}
                alt=""
                className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
                style={{
                  filter: "drop-shadow(0 40px 60px rgba(40,60,100,0.22))",
                  background: "transparent",
                  mixBlendMode: blendMode ?? "normal",
                  WebkitMaskImage: featherMask,
                  maskImage: featherMask,
                }}
              />
              {chips.map((c, i) => (
                <div key={i} className={`chip-data absolute ${c.pos} will-change-transform z-10`}>
                  <div className="chip-glow relative rounded-2xl bg-white/75 backdrop-blur-md ring-1 ring-black/5 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_10px_30px_-10px_rgba(40,60,100,0.22)]">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-ink/50">{c.label}</div>
                    <div className="font-display text-[13px] sm:text-base text-ink leading-tight">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`copy lg:col-span-5 ${align === "right" ? "lg:order-1" : ""}`}>
          <span className="copy-pill pill-tag mb-5 inline-flex"><span className="dot" /> {tag}</span>
          <h2 className="copy-headline font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02] text-ink">{title}</h2>
          <p className="copy-para mt-5 text-ink-soft max-w-md">{body}</p>
          <div className="copy-cta mt-7">
            <MagneticButton className="btn-ghost">See the protocol →</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
