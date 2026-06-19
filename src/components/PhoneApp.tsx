import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * HTML phone mockup with independently-animating UI cards.
 */
export function PhoneApp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const frame = el.querySelector<HTMLElement>(".phone-frame");
      const cards = el.querySelectorAll<HTMLElement>(".app-card");
      const floats = el.querySelectorAll<HTMLElement>(".app-float");
      const bars = el.querySelectorAll<HTMLElement>(".bar-fill");

      gsap.set(frame, { opacity: 0, y: 40, scale: 0.92 });
      gsap.set(cards, { y: 28, opacity: 0, scale: 0.94 });
      gsap.set(floats, { opacity: 0, scale: 0.85, y: 20 });

      gsap.to(frame, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
      });

      gsap.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: "back.out(1.5)",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" },
      });

      gsap.to(floats, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(
        bars,
        { width: 0 },
        {
          width: (_, t: Element) => (t as HTMLElement).dataset.w || "60%",
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 68%", toggleActions: "play none none reverse" },
        }
      );

      gsap.to(el.querySelector(".ring-pulse"), {
        scale: 1.12,
        opacity: 0.45,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      floats.forEach((widget, i) => {
        gsap.to(widget, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 3.2 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.3,
        });

        gsap.fromTo(
          widget,
          { y: i % 2 === 0 ? 12 : -12 },
          {
            y: i % 2 === 0 ? -18 : 18,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4 + i * 0.2,
            },
          }
        );
      });

      cards.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, { scale: 1.03, y: -2, duration: 0.35, ease: "back.out(1.8)" });
        };
        const onLeave = () => {
          gsap.to(card, { scale: 1, y: 0, duration: 0.4, ease: "power3.out" });
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="phone-app relative mx-auto w-[300px] sm:w-[340px]">
      <div className="phone-frame relative aspect-[9/19.5] rounded-[3rem] bg-[#0e1015] p-2.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.35),0_20px_40px_-10px_rgba(243,195,0,0.12)]">
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#fbfaf6] to-[#eef1f6]">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="relative z-10 flex h-full flex-col px-4 pt-10 pb-5">
            <div className="flex items-center justify-between text-[10px] font-medium text-ink/60">
              <span>9:41</span>
              <span className="font-display text-sm tracking-tight text-ink">TIDL</span>
              <span className="text-[#F3C300]">●●●</span>
            </div>

            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Wednesday · Day 42</div>
              <div className="mt-0.5 font-display text-[22px] leading-tight text-ink">Good morning, Aria.</div>
            </div>

            <div className="app-card card-clinical mt-3 flex cursor-default items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0">
                <div className="ring-pulse absolute inset-0 rounded-full bg-[#F3C300]/20" />
                <svg viewBox="0 0 40 40" className="h-14 w-14 -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#e7eaf0" strokeWidth="3" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#F3C300"
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset="22"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display text-[15px] text-ink">31.6</div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.16em] text-ink/50">Biological age</div>
                <div className="font-display text-base text-ink">−3.4 years</div>
                <div className="text-[10px] text-[#A88A00]">Improving · 12-wk trend</div>
              </div>
            </div>

            <div className="app-card card-clinical mt-2.5 cursor-default p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">Today&apos;s protocol</span>
                <span className="rounded-full bg-[#F3C300]/15 px-2 py-0.5 text-[10px] text-[#A88A00]">4 of 4</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  { t: "Lirosiome 0.5 mg", d: "08:00 · done", ok: true },
                  { t: "Magnesium glycinate", d: "21:30 · pending", ok: false },
                  { t: "Zone 2 · 38 min", d: "Recorded", ok: true },
                  { t: "Creatine · 5 g", d: "Done", ok: true },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${r.ok ? "bg-[#F3C300]" : "bg-ink/25"}`} />
                    <span className="flex-1 text-ink">{r.t}</span>
                    <span className="text-ink/45">{r.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="app-card card-clinical mt-2.5 cursor-default p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">Biomarkers</span>
                <span className="text-[10px] text-ink/40">Updated 2h ago</span>
              </div>
              {[
                { l: "VO₂ max", v: "48.2", w: "82%" },
                { l: "ApoB", v: "62 mg/dL", w: "64%" },
                { l: "HRV", v: "74 ms", w: "76%" },
              ].map((b, i) => (
                <div key={i} className="mb-1.5 last:mb-0">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-ink/70">{b.l}</span>
                    <span className="font-display text-ink">{b.v}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-ink/8">
                    <div
                      className="bar-fill h-full rounded-full bg-gradient-to-r from-[#C9A200] to-[#F3C300]"
                      data-w={b.w}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="app-card card-clinical mt-auto mb-1 flex cursor-default items-center gap-2.5 p-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F9DC6B] to-[#F3C300] text-[10px] font-medium text-black">
                MV
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-ink/50">Dr. Mara Voss · Clinical lead</div>
                <div className="text-[11px] text-ink">&ldquo;Your panel looks excellent. Hold dose.&rdquo;</div>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#F3C300]" />
            </div>
          </div>
        </div>
      </div>

      <div className="app-float app-card card-clinical absolute -left-16 top-24 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Sleep</div>
        <div className="font-display text-2xl text-ink">7h 42m</div>
        <div className="text-[10px] text-[#A88A00]">+8% vs avg</div>
      </div>
      <div className="app-float app-card card-clinical absolute -right-20 top-44 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Glucose</div>
        <div className="font-display text-2xl text-ink">87 mg/dL</div>
        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-ink/8">
          <div className="bar-fill h-full bg-[#F3C300]" data-w="55%" />
        </div>
      </div>
      <div className="app-float app-card card-clinical absolute -right-14 bottom-32 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Shipment</div>
        <div className="font-display text-base text-ink">Out for delivery</div>
        <div className="text-[10px] text-[#A88A00]">2.4°C · monitored</div>
      </div>
    </div>
  );
}
