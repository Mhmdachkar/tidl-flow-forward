import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PixelButton } from "@/components/PixelButton";
import { useQuizModal } from "@/providers/quiz-modal-provider";

export function CtaSection() {
  const { openModal: openQuiz } = useQuizModal();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const pill = sec.querySelector<HTMLElement>(".cta-pill");
    const headline = sec.querySelector<HTMLElement>(".cta-headline");
    const para = sec.querySelector<HTMLElement>(".cta-para");
    const buttons = sec.querySelector<HTMLElement>(".cta-buttons");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([pill, headline, para, buttons].filter(Boolean) as HTMLElement[], { opacity: 1, y: 0 });
      return;
    }

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const dur = isMobile ? 0.7 : 1.0;
    const headDur = isMobile ? 0.9 : 1.6;

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: sec, start: "top 75%" },
    });
    tl.fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: dur }, 0);
    tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: headDur }, isMobile ? 0.15 : 0.3);
    tl.fromTo(para, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: dur }, isMobile ? 0.4 : 1.0);
    tl.fromTo(buttons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: dur }, isMobile ? 0.55 : 1.7);
  }, []);

  return (
    <section ref={ref} className="tidl-brand-section relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="absolute inset-0 bg-radial-light" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="cta-pill tidl-eyebrow mx-auto mb-10 inline-flex items-center gap-2 pill-tag" style={{ opacity: 0 }}>
          <span className="dot" /> Begin
        </div>
        <h2 className="cta-headline tidl-display text-[clamp(2.2rem,6vw,5rem)] text-ink" style={{ opacity: 0 }}>
          The next decade <span className="italic text-gradient-clinical">starts now.</span>
        </h2>
        <p className="cta-para tidl-body mx-auto mt-6 max-w-lg text-ink-soft" style={{ opacity: 0 }}>
          A 10-minute clinical intake. A complete lab panel. A protocol designed around the life you intend to live.
        </p>
        <div className="cta-buttons mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4" style={{ opacity: 0 }}>
          <PixelButton className="w-full sm:w-auto" label="Start your assessment" variant="primary" onClick={() => openQuiz()} />
          <PixelButton className="w-full sm:w-auto" label="Speak with a clinician" variant="ghost" />
        </div>
      </div>
    </section>
  );
}
