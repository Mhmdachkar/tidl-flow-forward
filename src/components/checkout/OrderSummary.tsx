import { ShieldCheck } from "lucide-react";

import { formatCurrency } from "@/lib/pricing";
import type { OrderPricing } from "@/types/order";

interface OrderSummaryProps {
  treatmentName: string;
  treatmentDescription: string;
  pricing: OrderPricing;
  compact?: boolean;
}

export function OrderSummary({
  treatmentName,
  treatmentDescription,
  pricing,
  compact = false,
}: OrderSummaryProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_2px_24px_-8px_rgba(0,0,0,0.10),0_0_0_1px_rgba(243,195,0,0.07)]">
      {/* Gold top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F3C300] to-transparent opacity-60" />

      <div className={compact ? "p-5" : "p-6 sm:p-8"}>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order summary</p>
        <h2 className="mt-3 text-xl font-medium text-foreground">{treatmentName}</h2>
        {!compact ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{treatmentDescription}</p>
        ) : null}

        <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Monthly treatment</span>
            <span className="tabular-nums">{formatCurrency(pricing.treatmentMonthly)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Physician consultation</span>
            <span className="tabular-nums">{formatCurrency(pricing.consultationFee)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Shipping</span>
            <span className="tabular-nums">{formatCurrency(pricing.shipping)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Estimated tax</span>
            <span className="tabular-nums">{formatCurrency(pricing.tax)}</span>
          </div>

          {/* Gold total row */}
          <div className="flex justify-between gap-4 rounded-xl bg-gradient-to-r from-[rgba(243,195,0,0.07)] to-[rgba(243,195,0,0.03)] px-3 py-2.5 text-base font-medium">
            <span>Total due today</span>
            <span className="tabular-nums text-[#C9A200]">{formatCurrency(pricing.total)}</span>
          </div>
        </div>

        <div className="mt-5 space-y-1.5 rounded-xl border border-border/60 bg-surface-2/60 px-4 py-3 text-xs text-muted-foreground">
          <p>Recurring monthly billing after physician approval.</p>
          <p>Cancel anytime before your next refill.</p>
          <p className="flex items-center gap-1.5 pt-0.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#C9A200]" />
            HSA / FSA cards may be accepted.
          </p>
        </div>
      </div>
    </div>
  );
}
