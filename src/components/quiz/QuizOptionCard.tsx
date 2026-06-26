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
        "w-full rounded-2xl border px-5 py-4 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85c00]/40",
        selected
          ? "border-[#1A1816] bg-[#1A1816] text-white shadow-sm"
          : "border-[#DDD9D1] bg-white text-[#1A1816] hover:border-[#BFBBAF] hover:shadow-sm",
        className,
      )}
      aria-pressed={selected}
    >
      <span className="block text-[15px] font-medium leading-snug">{label}</span>
      {description ? (
        <span
          className={cn(
            "mt-1 block text-[13px] leading-relaxed",
            selected ? "text-white/70" : "text-[#7A766D]",
          )}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
