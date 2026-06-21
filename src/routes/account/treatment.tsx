import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getLatestOrderForUser } from "@/lib/order-storage";
import { formatCurrency } from "@/lib/pricing";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account/treatment")({
  component: AccountTreatmentPage,
});

function AccountTreatmentPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const order = user ? getLatestOrderForUser(user.id) : null;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center text-muted-foreground">
        No active treatment yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium">Treatment</h2>
        <p className="mt-2 text-muted-foreground">Your current physician-guided protocol.</p>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Active treatment</p>
        <h3 className="mt-2 text-2xl font-medium">{order.treatmentName}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {order.treatmentDescription}
        </p>

        <dl className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Dosage</dt>
            <dd className="mt-1 font-medium">{order.dosage}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Monthly cost</dt>
            <dd className="mt-1 font-medium">{formatCurrency(order.pricing.treatmentMonthly)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Delivery method</dt>
            <dd className="mt-1 font-medium">Pre-dosed injection pen</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Physician review</dt>
            <dd className="mt-1 font-medium">Reviewed by a licensed physician</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
