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
              "min-h-[56px] rounded-2xl border px-4 py-3 text-[15px] font-medium transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85c00]/40",
              selected
                ? "border-[#1A1816] bg-[#1A1816] text-white shadow-sm"
                : "border-[#DDD9D1] bg-white text-[#1A1816] hover:border-[#BFBBAF] hover:shadow-sm",
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
