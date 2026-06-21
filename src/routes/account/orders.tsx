import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ORDER_STATUS_LABELS } from "@/types/order";
import { getOrdersForUser } from "@/lib/order-storage";
import { formatCurrency } from "@/lib/pricing";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account/orders")({
  component: AccountOrdersPage,
});

function AccountOrdersPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const orders = user ? getOrdersForUser(user.id) : [];

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium">Orders</h2>
        <p className="mt-2 text-muted-foreground">Track shipments and order history.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-8 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                  <h3 className="mt-1 text-xl font-medium">{order.treatmentName}</h3>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-sm">
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Placed</dt>
                  <dd>{new Date(order.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd>{formatCurrency(order.pricing.total)}</dd>
                </div>
                {order.trackingNumber ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Tracking</dt>
                    <dd className="font-medium">{order.trackingNumber}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
