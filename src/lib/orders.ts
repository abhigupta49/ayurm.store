// Simple file-based order storage for launch.
// Orders are stored as JSON in /data/orders.json. This keeps launch
// dependency-free. To move to a database later, re-implement the four
// functions below (readOrders/createOrder/getOrder/updateOrderStatus)
// against your DB — the rest of the app only uses these functions.

import { promises as fs } from "fs";
import path from "path";

export const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  price: number;
};

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  paymentMethod: "COD";
  paymentStatus: "Pending" | "Paid";
  status: OrderStatus;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf8");
  }
}

export async function readOrders(): Promise<Order[]> {
  await ensureFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function generateOrderId(): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AYM-${ymd}-${rand}`;
}

export async function createOrder(input: {
  customer: Customer;
  items: OrderItem[];
  total: number;
}): Promise<Order> {
  const orders = await readOrders();
  const order: Order = {
    id: generateOrderId(),
    customer: input.customer,
    items: input.items,
    total: input.total,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    status: "New",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.id === id);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const orders = await readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  await writeOrders(orders);
  return order;
}
