import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE, type OrderStatus } from "@/types/order";

interface StatusTimelineProps {
  currentStatus: OrderStatus;
  compact?: boolean;
}

export function StatusTimeline({ currentStatus, compact = false }: StatusTimelineProps) {
  const currentIndex = ORDER_TIMELINE.indexOf(currentStatus);

  return (
    <ol className={cn("space-y-0", compact ? "space-y-3" : "space-y-4")}>
      {ORDER_TIMELINE.map((status, index) => {
        const complete = index <= currentIndex;
        const active = index === currentIndex;

        return (
          <li key={status} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                complete
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div>
              <p className={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                {ORDER_STATUS_LABELS[status]}
              </p>
              {active && !compact ? (
                <p className="mt-1 text-sm text-muted-foreground">Current step</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
