import { siteConfig } from "./site";
import { formatINR } from "./product-utils";

type OrderLine = { name: string; quantity: number; price: number; slug?: string };

function waBase(): string {
  return `https://wa.me/${siteConfig.whatsappNumber}`;
}

/** Generic "talk to us" link. */
export function whatsappChatLink(message?: string): string {
  const text = message || "Hi AYURM, I have a question.";
  return `${waBase()}?text=${encodeURIComponent(text)}`;
}

/** Order a single product from a product page. */
export function whatsappProductOrderLink(product: {
  name: string;
  slug: string;
  price: number;
}, quantity = 1): string {
  const url = `${siteConfig.url}/products/${product.slug}`;
  const message = [
    "Hi AYURM,",
    "I want to order:",
    `Product: ${product.name}`,
    `Quantity: ${quantity}`,
    `Price: ${formatINR(product.price)}`,
    `Product link: ${url}`,
    "Please help me place the order.",
  ].join("\n");
  return `${waBase()}?text=${encodeURIComponent(message)}`;
}

/** Order the whole cart from the cart page. */
export function whatsappCartOrderLink(lines: OrderLine[], total: number): string {
  const items = lines
    .map(
      (l) =>
        `- ${l.name} x${l.quantity} — ${formatINR(l.price * l.quantity)}`
    )
    .join("\n");
  const message = [
    "Hi AYURM,",
    "I want to order the following items:",
    items,
    `Total: ${formatINR(total)}`,
    "Please help me place the order.",
  ].join("\n");
  return `${waBase()}?text=${encodeURIComponent(message)}`;
}

/** Confirmation link shown after a COD order so the customer can reach support. */
export function whatsappOrderSupportLink(orderId: string): string {
  const message = `Hi AYURM, I just placed order ${orderId} (Cash on Delivery). Please confirm.`;
  return `${waBase()}?text=${encodeURIComponent(message)}`;
}
