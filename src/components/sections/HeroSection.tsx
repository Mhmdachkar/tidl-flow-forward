import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/MagneticButton";
import { SplitWords } from "@/lib/SplitWords";

import hero from "@/assets/hero image 3d.png";
import heroBg from "@/assets/hero bg.jpeg";
import heroMobileBg from "@/assets/hero_section_mobileview.jpeg";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const discImgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    tl.fromTo(
      discRef.current,
      { opacity: 0, scale: 0.7, rotateY: -18, rotateX: 12, y: 60 },
      { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, y: 0, duration: 2.4, ease: "power4.out" },
      0.9
    );
    tl.fromTo(paraRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 2.4);
    tl.fromTo(
      ctaRef.current?.children || [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
      2.8
    );

    if (ringRef.current) {
      gsap.to(ringRef.current, { rotate: 360, duration: 60, ease: "none", repeat: -1, delay: 0.9 });
    }

    gsap.to(discImgRef.current, {
      y: -14, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.6,
    });

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      gsap.to(discImgRef.current, {
        rotateY: cx * 10, rotateX: -cy * 8, x: cx * 12, duration: 1.4, ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (discRef.current) {
          gsap.set(discRef.current, { yPercent: self.progress * 18 });
        }
      },
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero relative flex min-h-[88svh] flex-col overflow-hidden bg-background pt-[calc(5.5rem+1.5cm)] pb-8 lg:block lg:min-h-0 lg:pb-10 lg:pt-[calc(5.5rem+0.5cm)]">
      {/* Mobile-only background image */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src={heroMobileBg}
          alt=""
          className="h-full w-full object-cover object-[center_bottom]"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative overflow-visible">
        <div ref={bgRef} className="absolute inset-0 hidden opacity-0 lg:block">
          <img
            src={heroBg}
            alt=""
            className="h-full w-full object-cover object-[center_calc(50%-2cm)]"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
            <div className="text-left">
              <h1 className="font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.08] tracking-tight text-ink">
                <span className="block"><SplitWords text="Live better." trigger="immediate" delay={0.7} duration={1.6} /></span>
                <span className="block"><SplitWords text="Longer." wordClassName="text-gradient-clinical" trigger="immediate" delay={0.95} duration={1.6} /></span>
                <span className="block"><SplitWords text="Feel like you." trigger="immediate" delay={1.2} duration={1.6} /></span>
              </h1>

              <p ref={paraRef} className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft opacity-0 sm:text-base">
                Clinical-grade biomarkers paired<br className="sm:hidden" />
                with metabolic, hormonal<br className="sm:hidden" />
                and longevity therapies<br className="sm:hidden" />
                delivered to your door.
              </p>

              <div ref={ctaRef} className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <MagneticButton as="a" href="/quiz" className="btn-primary">
                  Start your assessment →
                </MagneticButton>
                <MagneticButton className="btn-ghost">Watch the film</MagneticButton>
              </div>
            </div>

            <div ref={discRef} className="relative mx-auto hidden h-[min(68vw,380px)] w-full max-w-[560px] [perspective:1400px] sm:h-[440px] lg:mx-0 lg:ml-auto lg:block lg:h-[480px] lg:max-w-none">
              <div
                className="absolute inset-x-10 bottom-6 h-12 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(243,195,0,0.22), transparent 70%)" }}
              />
              <div
                ref={ringRef}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[min(92vw,380px)] w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[520px] sm:w-[520px] lg:h-[560px] lg:w-[560px]"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(216,199,154,0.55) 60deg, transparent 130deg, rgba(216,199,154,0.35) 220deg, transparent 320deg)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
                  maskImage: "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
                  opacity: 0.85,
                }}
              />
              <img
                ref={discImgRef}
                src={hero}
                alt="TIDL longevity product"
                className="absolute inset-0 mx-auto h-full w-auto max-w-full object-contain will-change-transform"
                style={{
                  filter: "drop-shadow(0 50px 60px rgba(40,60,100,0.28)) drop-shadow(0 20px 30px rgba(216,199,154,0.18))",
                  background: "transparent",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
