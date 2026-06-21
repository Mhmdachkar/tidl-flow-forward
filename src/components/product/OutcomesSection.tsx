import type { Product } from "@/types/product";

interface OutcomesSectionProps {
  outcomes: Product["outcomes"];
}

export function OutcomesSection({ outcomes }: OutcomesSectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
          {outcomes.headline}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {outcomes.items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {outcomes.disclaimer}
        </p>
      </div>
    </section>
  );
}
