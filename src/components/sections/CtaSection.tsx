import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PixelButton } from "@/components/PixelButton";

export function CtaSection() {
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
