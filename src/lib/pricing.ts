import type { OrderPricing } from "@/types/order";

const CONSULTATION_FEE = 49;
const SHIPPING_FEE = 15;
const TAX_RATE = 0.08;

export function calculateOrderPricing(treatmentMonthly: number): OrderPricing {
  const subtotal = treatmentMonthly + CONSULTATION_FEE + SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

  return {
    treatmentMonthly,
    consultationFee: CONSULTATION_FEE,
    shipping: SHIPPING_FEE,
    tax,
    total: Math.round((subtotal + tax) * 100) / 100,
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
