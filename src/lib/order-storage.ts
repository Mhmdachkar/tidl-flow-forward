import { calculateOrderPricing } from "@/lib/pricing";
import { getRecommendedTreatment } from "@/lib/products";
import {
  ORDERS_STORAGE_KEY,
  type CheckoutFormData,
  type Order,
  type OrderStatus,
} from "@/types/order";
import type { QuizFormData } from "@/types/quiz";

function isBrowser() {
  return typeof window !== "undefined";
}

function readOrders(): Order[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function createOrderNumber() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function createOrder(params: {
  userId: string;
  quiz: QuizFormData;
  checkout: CheckoutFormData;
}): Order {
  const treatment = getRecommendedTreatment(params.quiz.goal, params.quiz.productSlug);
  const pricing = calculateOrderPricing(treatment.startingPrice);
  const now = new Date().toISOString();

  const order: Order = {
    id: crypto.randomUUID(),
    userId: params.userId,
    orderNumber: createOrderNumber(),
    status: "physician_review",
    treatmentName: treatment.name,
    treatmentDescription: treatment.description,
    goal: params.quiz.goal,
    dosage: "2.5mg",
    pricing,
    shipping: params.checkout.shipping,
    paymentMethod: params.checkout.paymentMethod,
    quizSnapshot: params.quiz,
    trackingNumber: null,
    estimatedDelivery: addDays(new Date(), 5),
    nextRefillDate: addDays(new Date(), 28),
    createdAt: now,
    updatedAt: now,
  };

  writeOrders([order, ...readOrders()]);
  return order;
}

export function getOrderById(orderId: string): Order | null {
  return readOrders().find((order) => order.id === orderId) ?? null;
}

export function getOrdersForUser(userId: string): Order[] {
  return readOrders()
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLatestOrderForUser(userId: string): Order | null {
  return getOrdersForUser(userId)[0] ?? null;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return null;

  const updated: Order = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
    trackingNumber:
      status === "shipped" || status === "delivered"
        ? `1Z${Math.random().toString(36).slice(2, 10).toUpperCase()}`
        : orders[index].trackingNumber,
  };

  orders[index] = updated;
  writeOrders(orders);
  return updated;
}

export function createReorder(userId: string, sourceOrderId: string): Order | null {
  const source = getOrderById(sourceOrderId);
  if (!source || source.userId !== userId) return null;

  const now = new Date().toISOString();
  const reorder: Order = {
    ...source,
    id: crypto.randomUUID(),
    orderNumber: createOrderNumber(),
    status: "pharmacy_preparing",
    trackingNumber: null,
    estimatedDelivery: addDays(new Date(), 3),
    nextRefillDate: addDays(new Date(), 28),
    createdAt: now,
    updatedAt: now,
  };

  writeOrders([reorder, ...readOrders()]);
  return reorder;
}
