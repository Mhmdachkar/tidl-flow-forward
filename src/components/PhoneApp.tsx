import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * HTML phone mockup with independently-animating UI cards.
 * No static phone PNG — every element animates separately to feel "alive".
 */
export function PhoneApp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".app-card");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 24, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "expo.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );
      // Pulsing ring
      gsap.to(el.querySelector(".ring-pulse"), {
        scale: 1.08, opacity: 0.5, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      // Bar fill
      gsap.fromTo(
        el.querySelectorAll<HTMLElement>(".bar-fill"),
        { width: 0 },
        {
          width: (_, t: HTMLElement) => t.dataset.w || "60%",
          duration: 1.4, ease: "expo.out", stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 70%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto w-[300px] sm:w-[340px]">
      {/* Phone frame */}
      <div className="relative aspect-[9/19.5] rounded-[3rem] bg-[#0e1015] p-2.5 shadow-[0_50px_120px_-30px_rgba(20,30,60,0.35),0_20px_40px_-10px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-black/10" />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#fbfaf6] to-[#eef1f6]">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="relative z-10 flex h-full flex-col px-4 pt-10 pb-5">
            {/* Status row */}
            <div className="flex items-center justify-between text-[10px] font-medium text-ink/60">
              <span>9:41</span>
              <span className="font-display text-sm tracking-tight text-ink">TIDL</span>
              <span>●●●</span>
            </div>

            {/* Greeting */}
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Wednesday · Day 42</div>
              <div className="mt-0.5 font-display text-[22px] leading-tight text-ink">Good morning, Aria.</div>
            </div>

            {/* Biological age ring */}
            <div className="app-card card-clinical mt-3 flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0">
                <div className="ring-pulse absolute inset-0 rounded-full bg-[oklch(0.62_0.12_240/0.18)]" />
                <svg viewBox="0 0 40 40" className="h-14 w-14 -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#e7eaf0" strokeWidth="3" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="oklch(0.62 0.12 240)" strokeWidth="3"
                    strokeDasharray="100" strokeDashoffset="22" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display text-[15px] text-ink">31.6</div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.16em] text-ink/50">Biological age</div>
                <div className="font-display text-base text-ink">−3.4 years</div>
                <div className="text-[10px] text-[oklch(0.55_0.13_165)]">Improving · 12-wk trend</div>
              </div>
            </div>

            {/* Today's protocol */}
            <div className="app-card card-clinical mt-2.5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">Today's protocol</span>
                <span className="text-[10px] text-[oklch(0.62_0.12_240)]">3 of 4</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  { t: "Lirosiome 0.5 mg", d: "08:00 · done", ok: true },
                  { t: "Magnesium glycinate", d: "21:30 · pending", ok: false },
                  { t: "Zone 2 · 38 min", d: "Recorded", ok: true },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${r.ok ? "bg-[oklch(0.7_0.12_165)]" : "bg-ink/25"}`} />
                    <span className="flex-1 text-ink">{r.t}</span>
                    <span className="text-ink/45">{r.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Biomarkers */}
            <div className="app-card card-clinical mt-2.5 p-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-ink/50 mb-2">Biomarkers</div>
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
                    <div className="bar-fill h-full rounded-full bg-gradient-to-r from-[oklch(0.62_0.12_240)] to-[oklch(0.78_0.10_175)]" data-w={b.w} />
                  </div>
                </div>
              ))}
            </div>

            {/* Care team message */}
            <div className="app-card card-clinical mt-auto mb-1 flex items-center gap-2.5 p-2.5">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[oklch(0.78_0.08_240)] to-[oklch(0.62_0.12_240)]" />
              <div className="flex-1">
                <div className="text-[10px] text-ink/50">Dr. Mara Voss · Clinical lead</div>
                <div className="text-[11px] text-ink">"Your panel looks excellent. Hold dose."</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating side widgets */}
      <div className="app-card card-clinical absolute -left-16 top-24 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Sleep</div>
        <div className="font-display text-2xl text-ink">7h 42m</div>
        <div className="text-[10px] text-[oklch(0.55_0.13_165)]">+8% vs avg</div>
      </div>
      <div className="app-card card-clinical absolute -right-20 top-44 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Glucose</div>
        <div className="font-display text-2xl text-ink">87 mg/dL</div>
        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-ink/8">
          <div className="bar-fill h-full bg-[oklch(0.7_0.12_165)]" data-w="55%" />
        </div>
      </div>
      <div className="app-card card-clinical absolute -right-14 bottom-32 hidden p-3 lg:block">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Next visit</div>
        <div className="font-display text-base text-ink">Tue · 10:30</div>
        <div className="text-[10px] text-ink/50">Dr. Voss</div>
      </div>
    </div>
  );
}
