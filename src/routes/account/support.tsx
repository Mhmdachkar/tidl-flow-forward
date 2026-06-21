import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/support")({
  component: AccountSupportPage,
});

const SUPPORT_CATEGORIES = [
  {
    title: "Shipping",
    description: "Tracking, delivery updates, and address changes.",
  },
  {
    title: "Orders & billing",
    description: "Receipts, subscription questions, and payment help.",
  },
  {
    title: "Medication questions",
    description: "Medical questions are escalated to a physician.",
  },
];

function AccountSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium">Support</h2>
        <p className="mt-2 text-muted-foreground">
          Concierge support is available for orders and account questions.
        </p>
      </div>

      <div className="grid gap-4">
        {SUPPORT_CATEGORIES.map((category) => (
          <section key={category.title} className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-lg font-medium">{category.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
          </section>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <h3 className="text-lg font-medium">Contact</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">support@tidl.com</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">(888) 555-0147</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Medical escalation</dt>
            <dd>Medical questions are reviewed by a physician, not automated support.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
