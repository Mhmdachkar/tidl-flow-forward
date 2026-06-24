import type { ProductStep } from "@/types/product";

interface HowItWorksSectionProps {
  steps: ProductStep[];
}

export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="pill-tag mb-4 inline-flex w-fit">
            <span className="dot" />
            Your care journey
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[-0.02em] text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From assessment to ongoing care. every step is physician-guided.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <li
              key={step.step}
              className="relative rounded-2xl border border-border bg-background p-5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-sm font-medium text-foreground">
                {step.step}
              </span>
              <h3 className="mt-4 font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
