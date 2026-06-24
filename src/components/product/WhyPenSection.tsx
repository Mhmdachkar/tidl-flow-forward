import { Pen3D } from "@/components/three/Pen3D";

interface WhyPenSectionProps {
  showPen?: boolean;
}

export function WhyPenSection({ showPen = true }: WhyPenSectionProps) {
  if (!showPen) return null;

  return (
    <section className="bg-surface py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="pill-tag mb-4 inline-flex w-fit">
              <span className="dot" />
              The TIDL pen
            </span>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
              Pre-dosed. No mixing. No measuring.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              TIDL&apos;s pre-dosed injection pens remove the complexity of traditional
              protocols. making physician-guided care more accessible for first-time patients.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Pre-measured doses. no vials or syringes to mix",
                "Designed for easier at-home use",
                "Safer, more consistent experience for beginners",
                "Shipped with clear physician-approved instructions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clinical" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[360px]">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(243,195,0,0.1),transparent_70%)]" />
            <Pen3D className="relative z-10 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
