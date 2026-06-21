import type { Product } from "@/types/product";

interface SafetySectionProps {
  safety: Product["safety"];
}

export function SafetySection({ safety }: SafetySectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] leading-tight text-foreground">
          {safety.headline}
        </h2>
        <ul className="mt-8 space-y-3">
          {safety.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">{safety.disclaimer}</p>
      </div>
    </section>
  );
}
