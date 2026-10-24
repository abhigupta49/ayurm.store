import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { formatINR } from "@/lib/product-utils";
import { whatsappOrderSupportLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";

export const metadata = {
  ...buildMetadata({ title: "Order Confirmed", path: "/order-success" }),
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;
  const order = orderId ? await getOrder(orderId) : undefined;

  if (!order) {
    return (
      <div className="container-px section text-center">
        <h1 className="text-3xl">Order not found</h1>
        <p className="mt-3 text-ink/70">We couldn’t find this order. If you just placed it, please contact us on WhatsApp.</p>
        <Link href="/shop" className="btn-primary mt-6">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-px section">
      <div className="mx-auto max-w-2xl">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 text-3xl text-forest-600" aria-hidden="true">✓</div>
          <h1 className="mt-5 text-3xl">Order Confirmed</h1>
          <p className="mt-2 text-ink/70">Thank you! Your Cash on Delivery order has been placed.</p>
          <p className="mt-4 inline-block rounded-full bg-cream-100 px-4 py-2 font-mono text-sm font-semibold text-forest-800">
            Order #{order.id}
          </p>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="text-xl">Order details</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-2 text-sm">
                <span className="text-ink/70">{i.name} × {i.quantity}</span>
                <span className="font-medium">{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-cream-200 pt-4">
            <span className="font-semibold">Total (COD)</span>
            <span className="font-bold text-forest-800">{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="text-xl">Delivery to</h2>
          <div className="mt-3 text-sm text-ink/80">
            <p className="font-medium text-forest-800">{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            {order.customer.email && <p>{order.customer.email}</p>}
            <p className="mt-1">
              {order.customer.address}, {order.customer.city}, {order.customer.state} — {order.customer.pincode}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappOrderSupportLink(order.id)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1">
            Contact Support on WhatsApp
          </a>
          <Link href="/shop" className="btn-outline flex-1">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
