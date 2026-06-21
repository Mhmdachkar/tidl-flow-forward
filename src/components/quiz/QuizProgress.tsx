import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  value: number;
}

export function QuizProgress({ value }: QuizProgressProps) {
  return (
    <div className="px-4 pb-3 sm:px-6">
      <Progress
        value={value}
        className="h-1 rounded-full bg-surface-2 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:[background:linear-gradient(90deg,#C9A200,#F3C300,#F9DC6B)]"
        aria-label="Assessment progress"
      />
    </div>
  );
}
