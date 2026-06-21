import { ShieldCheck, Truck, Stethoscope, CreditCard, HeartPulse } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Stethoscope, label: "Licensed physicians" },
  { icon: HeartPulse, label: "Prescription treatment" },
  { icon: Truck, label: "Delivered to your door" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: CreditCard, label: "HSA/FSA eligible" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/60 bg-surface/50 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Icon className="h-4 w-4 shrink-0 text-clinical" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
