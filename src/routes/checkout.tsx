import { createFileRoute } from "@tanstack/react-router";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import { useEffect, useMemo, useState } from "react";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { calculateOrderPricing } from "@/lib/pricing";
import { loadQuizState } from "@/lib/quiz-storage";
import { createDefaultCheckoutForm } from "@/types/order";
import { getRecommendedTreatment } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · TIDL" },
      {
        name: "description",
        content: "Secure checkout for physician-reviewed prescription treatment.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { openModal: openQuiz } = useQuizModal();
  const [ready, setReady] = useState(false);
  const stored = loadQuizState();

  useEffect(() => {
    setReady(true);
  }, []);

  const treatment = useMemo(
    () => getRecommendedTreatment(stored?.data.goal ?? null, stored?.data.productSlug ?? null),
    [stored?.data.goal, stored?.data.productSlug],
  );
  const pricing = useMemo(() => calculateOrderPricing(treatment.startingPrice), [treatment.startingPrice]);

  const defaultCheckout = useMemo(
    () =>
      createDefaultCheckoutForm({
        phone: stored?.data.phone ?? "",
      }),
    [stored?.data.phone],
  );

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  if (!stored || stored.currentStep < 8) {
    return (
      <div className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-medium">Complete your assessment first</h1>
        <p className="mt-3 text-muted-foreground">
          Checkout is available after you finish the medical intake.
        </p>
        <button type="button" onClick={() => openQuiz()} className="btn-primary mt-8 inline-flex justify-center">
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <CheckoutLayout
      summary={
        <div className="space-y-4">
          <OrderSummary
            treatmentName={treatment.name}
            treatmentDescription={treatment.description}
            pricing={pricing}
          />
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-4 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total due today</p>
                <p className="text-lg font-medium">${pricing.total.toFixed(2)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Use the form above to submit</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutForm quiz={stored.data} defaultValues={defaultCheckout} />
    </CheckoutLayout>
  );
}
