"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/product-utils";
import { track } from "@/lib/analytics";
import Breadcrumbs from "@/components/Breadcrumbs";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, ready } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const customer = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      pincode: String(form.get("pincode") || ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place order.");
        setSubmitting(false);
        return;
      }
      track("purchase", { transaction_id: data.orderId, value: subtotal });
      clear();
      router.push(`/order-success?order=${encodeURIComponent(data.orderId)}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <div className="container-px section">
        <h1 className="text-3xl">Checkout</h1>
        <div className="mt-8 card p-10 text-center">
          <p className="text-ink/70">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary mt-6">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none focus:border-forest-500";

  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Cart", path: "/cart" }, { name: "Checkout", path: "/checkout" }]} />
      <h1 className="mt-5 text-3xl sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="text-xl">Delivery details</h2>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name *</label>
              <input id="name" name="name" required autoComplete="name" className={inputCls} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">Mobile Number *</label>
                <input id="phone" name="phone" required inputMode="numeric" autoComplete="tel" pattern="[0-9]{10}" placeholder="10-digit mobile" className={inputCls} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email (optional)</label>
                <input id="email" name="email" type="email" autoComplete="email" className={inputCls} />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-medium">Address *</label>
              <textarea id="address" name="address" required rows={3} autoComplete="street-address" className={inputCls} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium">City *</label>
                <input id="city" name="city" required className={inputCls} />
              </div>
              <div>
                <label htmlFor="state" className="mb-1 block text-sm font-medium">State *</label>
                <select id="state" name="state" required defaultValue="" className={inputCls}>
                  <option value="" disabled>Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="pincode" className="mb-1 block text-sm font-medium">Pincode *</label>
                <input id="pincode" name="pincode" required inputMode="numeric" pattern="[0-9]{6}" placeholder="6-digit" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl">Payment</h2>
            <label className="mt-4 flex items-center gap-3 rounded-xl border border-forest-500 bg-forest-50 p-4">
              <input type="radio" name="payment" value="cod" defaultChecked readOnly className="h-4 w-4 accent-forest-600" />
              <span className="font-medium text-forest-800">Cash on Delivery (COD)</span>
            </label>
            <p className="mt-2 text-xs text-ink/50">Pay in cash when your order is delivered.</p>
          </div>

          {error && <p className="rounded-xl bg-clay-500/10 px-4 py-3 text-sm text-clay-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
            {submitting ? "Placing order…" : "Place Order (COD)"}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <h2 className="text-xl">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.slug} className="flex justify-between gap-2 text-sm">
                  <span className="text-ink/70">{i.name} × {i.quantity}</span>
                  <span className="font-medium">{formatINR(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-cream-200 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-forest-800">{formatINR(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-ink/50">COD • Secure checkout • WhatsApp support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
