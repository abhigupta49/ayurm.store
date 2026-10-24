"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/product-utils";
import { whatsappCartOrderLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, ready } = useCart();

  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Cart", path: "/cart" }]} />
      <h1 className="mt-5 text-3xl sm:text-4xl">Your Cart</h1>

      {!ready ? null : items.length === 0 ? (
        <div className="mt-10 card p-10 text-center">
          <p className="text-ink/70">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary mt-6">Continue Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.slug} className="card flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/products/${item.slug}`} className="font-semibold text-forest-800 hover:text-forest-600">
                        {item.name}
                      </Link>
                      <button type="button" onClick={() => removeItem(item.slug)} className="text-sm text-ink/50 hover:text-clay-600" aria-label={`Remove ${item.name}`}>
                        Remove
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{formatINR(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-cream-200">
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="px-3 py-1.5" aria-label="Decrease quantity">−</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="px-3 py-1.5" aria-label="Increase quantity">+</button>
                      </div>
                      <span className="font-semibold text-forest-800">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-outline mt-6">Continue Shopping</Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20 p-6">
              <h2 className="text-xl">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-ink/70">Subtotal</span>
                <span className="font-semibold">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink/50">Shipping calculated at checkout.</p>

              <Link href="/checkout" className="btn-primary mt-6 w-full" onClick={() => track("begin_checkout", { value: subtotal })}>
                Proceed to Checkout
              </Link>
              <a
                href={whatsappCartOrderLink(items, subtotal)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { source: "cart" })}
                className="btn-whatsapp mt-3 w-full"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
