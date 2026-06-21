import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { StatusTimeline } from "@/components/account/StatusTimeline";
import { getOrderById } from "@/lib/order-storage";
import { formatCurrency } from "@/lib/pricing";

const confirmationSearchSchema = z.object({
  orderId: z.string().optional(),
});

export const Route = createFileRoute("/confirmation")({
  validateSearch: (search) => confirmationSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Order Confirmed — TIDL" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useSearch();
  const [ready, setReady] = useState(false);
  const order = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        Loading confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-medium">Order not found</h1>
        <p className="mt-3 text-muted-foreground">We couldn&apos;t locate this confirmation.</p>
        <Link to="/account" className="btn-primary mt-8 inline-flex justify-center">
          Go to account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-svh max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order confirmed</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Thank you.</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Your physician review has begun.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <p className="text-sm text-muted-foreground">Order number</p>
          <p className="mt-1 text-2xl font-medium">#{order.orderNumber}</p>
          <p className="mt-4 text-sm text-muted-foreground">{order.treatmentName}</p>
          <p className="mt-6 text-sm">
            Total paid: <span className="font-medium">{formatCurrency(order.pricing.total)}</span>
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="text-lg font-medium">What happens next</h2>
          <div className="mt-4">
            <StatusTimeline currentStatus={order.status} compact />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/account" className="btn-primary inline-flex">
          View your account
        </Link>
        <Link to="/account/support" className="btn-ghost inline-flex">
          Contact support
        </Link>
      </div>
    </div>
  );
}
