import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuizModal } from "@/providers/quiz-modal-provider";

import { createReorder, getLatestOrderForUser } from "@/lib/order-storage";
import { formatCurrency } from "@/lib/pricing";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account/reorder")({
  component: AccountReorderPage,
});

function AccountReorderPage() {
  const { user } = useAuth();
  const { openModal: openQuiz } = useQuizModal();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const order = user ? getLatestOrderForUser(user.id) : null;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-muted-foreground">No treatment available to refill.</p>
        <button type="button" onClick={() => openQuiz()} className="btn-primary mt-6 inline-flex">
          Start Assessment
        </button>
      </div>
    );
  }

  const handleReorder = () => {
    if (!user) return;
    const reorder = createReorder(user.id, order.id);
    if (reorder) {
      void navigate({ to: "/account/orders" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium">Request refill</h2>
        <p className="mt-2 text-muted-foreground">
          Confirm your existing treatment, dose, and shipping details.
        </p>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Refill request</p>
        <h3 className="mt-2 text-2xl font-medium">{order.treatmentName}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{order.dosage}</p>

        <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
          <div>
            <dt className="text-muted-foreground">Ship to</dt>
            <dd className="mt-1">
              {order.shipping.firstName} {order.shipping.lastName}
              <br />
              {order.shipping.addressLine1}
              {order.shipping.addressLine2 ? `, ${order.shipping.addressLine2}` : ""}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estimated total</dt>
            <dd className="mt-1 font-medium">{formatCurrency(order.pricing.total)}</dd>
          </div>
        </dl>

        <button type="button" onClick={handleReorder} className="btn-primary mt-8 inline-flex">
          Confirm refill
        </button>
      </section>
    </div>
  );
}
