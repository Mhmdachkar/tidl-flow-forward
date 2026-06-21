import { cn } from "@/lib/utils";

interface QuizSegmentedControlProps<T extends string> {
  value: T | null;
  options: ReadonlyArray<{ id: T; label: string }>;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export function QuizSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  columns = 2,
}: QuizSegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-3",
        columns === 4 && "grid-cols-2",
      )}
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-[56px] rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
              selected
                ? "border-foreground bg-surface text-foreground shadow-sm"
                : "border-border bg-surface/70 text-muted-foreground hover:border-foreground/30 hover:bg-surface hover:text-foreground",
            )}
            aria-pressed={selected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
