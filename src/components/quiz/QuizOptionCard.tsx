import { cn } from "@/lib/utils";

interface QuizOptionCardProps {
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function QuizOptionCard({
  label,
  description,
  selected = false,
  onClick,
  className,
}: QuizOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-5 py-4 text-left transition-all",
        "min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        selected
          ? "quiz-option-selected border-[#C9A200] bg-surface shadow-[0_0_0_1px_#C9A200,0_4px_24px_-6px_rgba(243,195,0,0.25)]"
          : "border-border bg-surface/70 hover:border-[#C9A200]/50 hover:bg-surface",
        className,
      )}
      aria-pressed={selected}
    >
      <span className="block text-base font-medium text-foreground">{label}</span>
      {description ? (
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      ) : null}
    </button>
  );
}
