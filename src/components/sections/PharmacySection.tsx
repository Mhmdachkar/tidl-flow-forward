import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import fulfillmentImg from "@/assets/pharmacy-fulfillment.png";
import coldchainImg   from "@/assets/pharmacy-coldchain.png";
import penHero        from "@/assets/tidl-pen-hero.png";
import peptideHero    from "@/assets/tidl-peptide.png";
import preparedHero   from "@/assets/tidl-prepared.png";

/* ─── primitives ──────────────────────────────────────────────────────────── */

const EASE_LUX:  [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_MASK: [number, number, number, number] = [0.85, 0, 0.15, 1];

type Dir = "up" | "down" | "left" | "right";

function offsetFor(dir: Dir, distance: number) {
  switch (dir) {
    case "up":    return { x: 0,         y: distance  };
    case "down":  return { x: 0,         y: -distance };
    case "left":  return { x: distance,  y: 0         };
    case "right": return { x: -distance, y: 0         };
  }
}

function SlideIn({
  children,
  from = "up",
  distance = 80,
  delay = 0,
  duration = 1.6,
  className = "",
  blur = true,
}: {
  children: React.ReactNode;
  from?: Dir;
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  blur?: boolean;
}) {
  const o = offsetFor(from, distance);
  const variants: Variants = {
    hidden: { opacity: 0, x: o.x, y: o.y, filter: blur ? "blur(10px)" : "blur(0px)" },
    show:   { opacity: 1, x: 0,   y: 0,   filter: "blur(0px)" },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={variants}
      transition={{ duration, delay, ease: EASE_LUX }}
    >
      {children}
    </motion.div>
  );
}

function SplitHeadline({
  text,
  className = "",
  delay = 0,
  from = "up",
}: {
  text: string;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right";
}) {
  const words = text.split(" ");
  const hidden =
    from === "left"  ? { x: "-40%", y: 0,      opacity: 0 } :
    from === "right" ? { x: "40%",  y: 0,      opacity: 0 } :
                       { x: 0,      y: "110%", opacity: 0 };
  return (
    <motion.span
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {words.map((word, w) => (
        <span key={w} className="inline-block overflow-hidden align-baseline pr-[0.25em] last:pr-0">
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden, show: { x: 0, y: "0%", opacity: 1 } }}
            transition={{ duration: 1.2, ease: EASE_LUX }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function MaskReveal({
  src,
  alt,
  className = "",
  ratio = "4/5",
  from = "top",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  from?: "top" | "left" | "right" | "bottom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 20%"] });
  const y     = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);

  const origin =
    from === "top"    ? "origin-top"    :
    from === "bottom" ? "origin-bottom" :
    from === "left"   ? "origin-left"   :
                        "origin-right";
  const isHoriz = from === "left" || from === "right";

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-cream-deep ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        className={`absolute inset-0 z-20 bg-cream ${origin}`}
        initial={isHoriz ? { scaleX: 1 } : { scaleY: 1 }}
        whileInView={isHoriz ? { scaleX: 0 } : { scaleY: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.6, ease: EASE_MASK }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
    </div>
  );
}

/* ─── section ─────────────────────────────────────────────────────────────── */

export function PharmacySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ghostY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const penY   = useTransform(scrollYProgress, [0.3, 0.7], [20, -20]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const smy = useSpring(my, { stiffness: 80, damping: 20 });
  const glow = useTransform(
    [smx, smy] as never,
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${(x as number) * 100}% ${(y as number) * 100}%, oklch(0.34 0.055 155 / 0.06), transparent 60%)`,
  );

  const steps = [
    { n: "01", t: "Prescription received",    d: "A licensed physician issues your prescription. It routes directly to our partner pharmacy network. no shelf, no marketplace." },
    { n: "02", t: "Pharmacist verification",  d: "A registered pharmacist verifies dose, history, and clinical fit before any preparation begins." },
    { n: "03", t: "Prepared to specification", d: "Your medication is compounded or dispensed to exact clinical parameters in a sterile, regulated environment." },
    { n: "04", t: "Cold-chain sealed",        d: "Temperature-sensitive treatments are sealed with validated cold-pack insulation to preserve potency in transit." },
    { n: "05", t: "Discreetly delivered",     d: "Plain outer packaging, tracked end-to-end, signed for at your door. No branding. No assumptions." },
  ];

  const trust = [
    "Licensed pharmacy partners only",
    "FDA-regulated fulfillment",
    "Cold-chain integrity, end-to-end",
    "Unbranded, discreet packaging",
    "Live shipment tracking in account",
    "No fulfillment without prescription",
  ];

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: railProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });
  const railH = useTransform(railProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="TIDL pharmacy fulfillment"
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      className="relative isolate w-full overflow-hidden bg-cream text-ink"
    >
      {/* cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-60 mix-blend-multiply"
        style={{ background: glow }}
      />

      {/* dot grid texture */}
      <div aria-hidden className="grain-dot pointer-events-none absolute inset-0 -z-0 opacity-60" />

      {/* ── chapter mark ── */}
      <div className="relative mx-auto max-w-[1400px] px-6 pt-14 sm:px-10 sm:pt-20 lg:px-16 lg:pt-32">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:items-end sm:justify-between">
          <SlideIn from="left" distance={40}>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-clinical-deep" />
              Chapter 04. The Pharmacy
            </p>
          </SlideIn>
          <SlideIn from="right" distance={40} delay={0.1}>
            <p className="font-display text-[0.6875rem] tracking-[0.22em] text-ink-mute">
              TIDL · LIC. PHARMACY NETWORK
            </p>
          </SlideIn>
        </div>
        <div className="hairline-grow mt-8" />
      </div>

      {/* ── editorial headline ── */}
      <div className="relative mx-auto max-w-[1400px] px-6 pt-10 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
        <motion.div
          aria-hidden
          style={{ y: ghostY }}
          className="pointer-events-none absolute -top-10 right-4 select-none font-serif text-[18vw] leading-none text-ink/[0.04] sm:right-10"
        >
          04
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="col-span-12 font-serif text-[clamp(2.75rem,8vw,8.5rem)] leading-[0.92] tracking-[-0.02em] lg:col-span-9">
            <SplitHeadline text="Your medication isn't" from="left" />
            <br />
            <SplitHeadline text="pulled from a shelf." delay={0.1} from="up" />
            <br />
            <span className="italic text-clinical-deep">
              <SplitHeadline text="It is prepared for you." delay={0.25} from="right" />
            </span>
          </h2>

          <SlideIn
            from="right"
            distance={60}
            delay={0.5}
            className="col-span-12 max-w-md self-end text-[1.0625rem] leading-relaxed text-ink-soft lg:col-span-3"
          >
            <p>
              Every TIDL treatment is reviewed by a licensed pharmacist, compounded or dispensed
              to clinical specification, sealed for cold-chain integrity when required, and
              delivered without a single line of branding on the outside.
            </p>
          </SlideIn>
        </div>
        <div className="hairline-grow mt-10 lg:mt-24" />
      </div>

      {/* ── editorial split: fulfillment photo + pen hero ── */}
      <div className="relative mx-auto max-w-[1400px] px-6 py-12 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <SlideIn from="left" distance={120} duration={1.8} className="lg:col-span-7">
            <MaskReveal
              src={fulfillmentImg}
              alt="A pharmacist in sterile gloves placing a TIDL medication box into a discreet shipping parcel."
              ratio="16/11"
              from="left"
              className="rounded-sm"
            />
            <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
              <span className="mt-2 inline-block h-px w-10 bg-ink/40" />
              <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-mute">
                Fig. 01. Sterile fulfillment station, partner pharmacy network
              </p>
            </div>
          </SlideIn>

          <div className="relative lg:col-span-5">
            <SlideIn from="right" distance={80}>
              <p className="eyebrow">The Pen. GLP-1, pre-dosed</p>
            </SlideIn>
            <SlideIn from="right" distance={80} delay={0.1} className="mt-6">
              <h3 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-tight">
                A precision instrument,
                <br />
                <span className="italic text-clinical-deep">not a consumer product.</span>
              </h3>
            </SlideIn>

            <motion.div
              className="relative mt-10 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-cream-deep"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE_LUX }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, oklch(1 0 0 / 0.6), transparent 60%)",
                }}
              />
              <motion.img
                src={penHero}
                alt="TIDL pre-dosed GLP-1 injection pen."
                loading="lazy"
                className="relative z-10 h-[110%] w-auto object-contain"
                initial={{ y: 80, rotate: -6, opacity: 0, filter: "blur(8px)" }}
                whileInView={{ y: 0, rotate: 0, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: EASE_LUX }}
                style={{ y: penY }}
              />
              <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-ink/10" />
              <div className="absolute left-4 top-4 z-20 font-display text-[0.625rem] uppercase tracking-[0.2em] text-ink-mute">
                TIDL · GLP-1 · 01
              </div>
              <div className="absolute bottom-4 right-4 z-20 font-display text-[0.625rem] uppercase tracking-[0.2em] text-ink-mute">
                Pre-dosed · Single-use
              </div>
            </motion.div>

            <SlideIn from="right" distance={60} delay={0.2} className="mt-8">
              <ul className="space-y-3 text-[0.95rem] text-ink-soft">
                {[
                  "Pharmacy-prepared, never pre-bottled",
                  "Pre-dosed. no mixing, no measuring",
                  "Clinically sealed, cold-chain shipped",
                ].map((line) => (
                  <li key={line} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                    <span className="mt-[0.65em] inline-block h-px w-5 bg-clinical-deep/70" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </SlideIn>
          </div>
        </div>
      </div>

      {/* ── the journey ── */}
      <div className="relative">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-cream via-cream-deep/60 to-cream" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-32 sm:px-10 lg:px-16">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:items-end sm:justify-between">
            <SlideIn from="left" distance={50}>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-clinical-deep" />
                The journey. prescription to door
              </p>
            </SlideIn>
            <SlideIn from="right" distance={50} delay={0.1}>
              <p className="font-display text-[0.6875rem] tracking-[0.22em] text-ink-mute">
                05 stages · avg. 48–72h dispatch
              </p>
            </SlideIn>
          </div>

          <div className="mt-12 max-w-4xl">
            <h3 className="font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] tracking-tight">
              <SplitHeadline text="Five steps between" />{" "}
              <span className="italic text-clinical-deep">
                <SplitHeadline text="a prescription" delay={0.1} />
              </span>
              <br />
              <SplitHeadline text="and your front door." delay={0.2} from="right" />
            </h3>
          </div>

          {/* animated rail */}
          <div ref={railRef} className="relative mt-24 grid gap-16 lg:grid-cols-[80px_minmax(0,1fr)]">
            <div className="relative hidden lg:block">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/10" />
              <motion.div
                style={{ height: railH }}
                className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-clinical-deep origin-top"
              />
            </div>

            <ol className="space-y-20">
              {steps.map((s, i) => (
                <li key={s.n}>
                  <SlideIn from={i % 2 === 0 ? "left" : "right"} distance={100} duration={1.6} delay={i * 0.05}>
                    <div className="grid items-start gap-8 sm:grid-cols-[120px_minmax(0,1fr)]">
                      <div className="font-serif text-5xl text-clinical-deep sm:text-6xl">
                        <span className="italic">{s.n}</span>
                      </div>
                      <div className="max-w-2xl">
                        <h4 className="font-serif text-2xl tracking-tight sm:text-3xl text-ink">{s.t}</h4>
                        <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{s.d}</p>
                      </div>
                    </div>
                  </SlideIn>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ── cold chain + peptide ── */}
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 sm:px-10 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SlideIn from="left" distance={70}>
              <p className="eyebrow">The Peptide. clinical longevity</p>
            </SlideIn>
            <SlideIn from="left" distance={70} delay={0.1} className="mt-6">
              <h3 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-tight">
                Compounded peptides.
                <br />
                <span className="italic text-clinical-deep">Not supplements.</span>
              </h3>
            </SlideIn>

            <motion.div
              className="relative mt-10 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-cream-deep"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE_LUX }}
            >
              <motion.img
                src={peptideHero}
                alt="TIDL clinical peptide product."
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-8"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.0, ease: EASE_LUX }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
              <div className="absolute left-4 top-4 font-display text-[0.625rem] uppercase tracking-[0.2em] text-ink-mute">
                TIDL · Peptide · 02
              </div>
              <div className="absolute bottom-4 right-4 font-display text-[0.625rem] uppercase tracking-[0.2em] text-ink-mute">
                Compounding pharmacy
              </div>
            </motion.div>

            <SlideIn from="up" distance={40} delay={0.2} className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              <p>
                Each peptide therapy is prepared in a 503A/503B-aligned compounding facility,
                physician-prescribed for metabolic health, recovery, and longevity, never sold
                over a counter, never shipped without review.
              </p>
            </SlideIn>
          </div>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <SlideIn from="right" distance={70}>
                <p className="eyebrow flex items-center gap-3">
                  <span className="inline-block h-px w-10 bg-clinical-deep" />
                  Cold-chain integrity
                </p>
              </SlideIn>
              <SlideIn from="right" distance={70} delay={0.1} className="mt-6">
                <h3 className="font-serif text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] tracking-tight">
                  Sealed at the pharmacy.
                  <br />
                  <span className="italic">Opened at your door.</span>
                </h3>
              </SlideIn>
              <MaskReveal
                src={coldchainImg}
                alt="An insulated TIDL shipping parcel sealed with cold-pack gel."
                ratio="3/4"
                from="right"
                className="mt-10"
              />
              <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
                <span className="mt-2 inline-block h-px w-10 bg-ink/40" />
                <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-mute">
                  Fig. 02. Validated cold-pack insulation, unbranded outer parcel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── prepared moment + metrics ── */}
      <div className="relative mx-auto max-w-[1400px] px-6 pb-32 sm:px-10 lg:px-16">
        <div className="hairline-grow mb-24" />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SlideIn from="left" distance={60}>
              <p className="eyebrow">Prepared for shipment</p>
            </SlideIn>
            <SlideIn from="left" distance={60} delay={0.1} className="mt-6">
              <h3 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight">
                Pen, peptide, packaging —
                <br />
                <span className="italic text-clinical-deep">arranged for one patient.</span>
              </h3>
            </SlideIn>
            <div className="mt-10 overflow-hidden rounded-sm bg-cream-deep">
              <MaskReveal
                src={preparedHero}
                alt="TIDL injection pen, peptide product, and minimal pharmacy packaging."
                ratio="16/10"
                from="bottom"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <SlideIn from="right" distance={60}>
              <p className="eyebrow">By the numbers</p>
            </SlideIn>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline">
              {([
                { k: "Dispatch window",      v: <CountUp to={72} suffix="h" />,  s: "After Rx approval" },
                { k: "Cold-chain integrity", v: <CountUp to={100} suffix="%" />, s: "Validated insulation" },
                { k: "Pharmacist review",    v: "1:1",                            s: "Every order, every time" },
                { k: "Outer packaging",      v: "Plain",                          s: "Unbranded, discreet" },
              ] as const).map((m, i) => (
                <SlideIn key={m.k} from={i % 2 === 0 ? "left" : "right"} distance={50} delay={i * 0.08} blur={false}>
                  <div className="h-full bg-cream p-6">
                    <p className="font-display text-[0.625rem] uppercase tracking-[0.22em] text-ink-mute">
                      {m.k}
                    </p>
                    <p className="mt-4 font-serif text-5xl leading-none tracking-tight text-ink">
                      {m.v}
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">{m.s}</p>
                  </div>
                </SlideIn>
              ))}
            </dl>

            <SlideIn from="up" distance={40} delay={0.2} className="mt-10">
              <ul className="space-y-3">
                {trust.map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: EASE_LUX }}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-hairline py-3 text-[0.95rem] text-ink-soft"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-clinical-deep">
                      <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </motion.li>
                ))}
              </ul>
            </SlideIn>
          </div>
        </div>

        <div className="mt-32 max-w-4xl">
          <SlideIn from="up" distance={50}>
            <p className="eyebrow">Physician-prescribed. Pharmacy-prepared.</p>
          </SlideIn>
          <SlideIn from="up" distance={60} delay={0.1} className="mt-6">
            <p className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] tracking-tight text-ink">
              Your medication was not pulled from a shelf. It was{" "}
              <span className="italic text-clinical-deep">reviewed by a doctor</span>, handled by
              a pharmacist, and delivered with care.
            </p>
          </SlideIn>
        </div>

        <div className="hairline-grow mt-24" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-display text-[0.625rem] uppercase tracking-[0.22em] text-ink-mute">
          <span>TIDL · Pharmacy &amp; Fulfillment</span>
          <span>End of Chapter 04</span>
        </div>
      </div>
    </section>
  );
}
