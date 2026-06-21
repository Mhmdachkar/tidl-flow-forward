import type { GoalId, QuizFormData } from "@/types/quiz";

export const ORDERS_STORAGE_KEY = "tidl-orders-v1";

export type OrderStatus =
  | "assessment_received"
  | "physician_review"
  | "prescription_approved"
  | "pharmacy_preparing"
  | "shipped"
  | "delivered";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  assessment_received: "Assessment received",
  physician_review: "Physician review",
  prescription_approved: "Prescription approved",
  pharmacy_preparing: "Pharmacy preparing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const ORDER_TIMELINE: OrderStatus[] = [
  "assessment_received",
  "physician_review",
  "prescription_approved",
  "pharmacy_preparing",
  "shipped",
  "delivered",
];

export type PaymentMethod = "card" | "hsa_fsa";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface CheckoutFormData {
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  agreeTerms: boolean;
}

export interface OrderPricing {
  treatmentMonthly: number;
  consultationFee: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  treatmentName: string;
  treatmentDescription: string;
  goal: GoalId | null;
  dosage: string;
  pricing: OrderPricing;
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  quizSnapshot: QuizFormData;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  nextRefillDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createDefaultCheckoutForm(prefill?: Partial<ShippingAddress>): CheckoutFormData {
  return {
    shipping: {
      firstName: prefill?.firstName ?? "",
      lastName: prefill?.lastName ?? "",
      addressLine1: prefill?.addressLine1 ?? "",
      addressLine2: prefill?.addressLine2 ?? "",
      city: prefill?.city ?? "",
      state: prefill?.state ?? "",
      zip: prefill?.zip ?? "",
      phone: prefill?.phone ?? "",
    },
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    agreeTerms: false,
  };
}
