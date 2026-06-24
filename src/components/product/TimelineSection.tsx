import type { Product } from "@/types/product";

const DEFAULT_TIMELINE: NonNullable<Product["timeline"]> = [
  {
    period: "Week 1–4",
    title: "Getting started",
    description:
      "You begin treatment with guidance from your care team and settle into a simple routine. Early check-ins help you feel confident with your pen.",
  },
  {
    period: "Week 5–8",
    title: "Finding your rhythm",
    description:
      "Your physician reviews how you're responding and adjusts your plan if it's clinically appropriate. no fixed program, just personalised care.",
  },
  {
    period: "Week 9+",
    title: "Ongoing care",
    description:
      "Continued physician support, easy refills, and regular check-ins for as long as treatment remains right for you.",
  },
];

interface TimelineSectionProps {
  timeline?: Product["timeline"];
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  const phases = timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;

  return (
    <section className="bg-surface/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
          What to expect over time
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="text-xs uppercase tracking-[0.16em] text-clinical">
                {phase.period}
              </span>
              <p className="mt-3 font-display text-xl tracking-[-0.01em] text-foreground">
                {phase.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Individual experiences vary. This timeline is for education only and is not a
          guarantee of results. Your physician determines what's appropriate for you.
        </p>
      </div>
    </section>
  );
}
