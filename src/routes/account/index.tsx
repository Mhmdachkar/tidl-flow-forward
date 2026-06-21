import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { StatusTimeline } from "@/components/account/StatusTimeline";
import { formatCurrency } from "@/lib/pricing";
import { getLatestOrderForUser } from "@/lib/order-storage";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account/")({
  component: AccountDashboardPage,
});

function AccountDashboardPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const order = user ? getLatestOrderForUser(user.id) : null;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || !user) {
    return null;
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <h2 className="font-display text-2xl font-medium">No active treatment yet</h2>
        <p className="mt-3 text-muted-foreground">
          Complete your assessment to begin physician review.
        </p>
        <Link to="/quiz" className="btn-primary mt-6 inline-flex">
          Start Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current status</p>
        <h2 className="mt-3 font-display text-3xl font-medium">
          {ORDER_STATUS_LABELS[order.status]}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {getStatusMessage(order.status)}
        </p>

        {order.estimatedDelivery ? (
          <p className="mt-4 text-sm">
            Expected delivery:{" "}
            <span className="font-medium">
              {new Date(order.estimatedDelivery).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-surface p-6">
          <h3 className="text-lg font-medium">Care timeline</h3>
          <div className="mt-4">
            <StatusTimeline currentStatus={order.status} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6">
          <h3 className="text-lg font-medium">Active treatment</h3>
          <p className="mt-3 text-xl font-medium">{order.treatmentName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{order.dosage}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Monthly: {formatCurrency(order.pricing.treatmentMonthly)}
          </p>
          {order.nextRefillDate ? (
            <p className="mt-2 text-sm">
              Next refill:{" "}
              <span className="font-medium">
                {new Date(order.nextRefillDate).toLocaleDateString()}
              </span>
            </p>
          ) : null}
          <Link to="/account/reorder" className="btn-primary mt-6 inline-flex">
            Request refill
          </Link>
        </section>
      </div>
    </div>
  );
}

function getStatusMessage(status: keyof typeof ORDER_STATUS_LABELS) {
  switch (status) {
    case "assessment_received":
      return "Your assessment has been received and is being prepared for physician review.";
    case "physician_review":
      return "A licensed physician is reviewing your information now.";
    case "prescription_approved":
      return "Your prescription has been approved and is moving to pharmacy fulfillment.";
    case "pharmacy_preparing":
      return "Your medication is being prepared by a licensed pharmacy.";
    case "shipped":
      return "Your medication has shipped. Tracking updates are available in Orders.";
    case "delivered":
      return "Your medication has been delivered. Continue care from your treatment page.";
    default:
      return "Your care team will keep you updated.";
  }
}
