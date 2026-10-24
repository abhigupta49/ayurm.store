"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatINR, discountPercent } from "@/lib/product-utils";
import { useCart } from "@/lib/cart";
import { whatsappProductOrderLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export default function ProductPurchase({ product, avgRating, reviewCount }: {
  product: Product;
  avgRating: number | null;
  reviewCount: number;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(product.gallery[0] || product.image);
  const off = discountPercent(product.price, product.mrp);
  const gallery = product.gallery.length ? product.gallery : [product.image];
  // Stable "bought this month" number derived from slug so it doesn't flicker
  const boughtThisMonth = product.boughtThisMonth ?? (20 + (product.slug.charCodeAt(0) % 11));

  function add() {
    addItem(
      { slug: product.slug, name: product.name, price: product.price, image: product.image },
      qty
    );
  }

  function buyNow() {
    add();
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100">
          <Image src={activeImg} alt={product.name} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
        {gallery.length > 1 && (
          <div className="mt-4 flex gap-3">
            {gallery.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImg(img)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border bg-cream-100 ${
                  activeImg === img ? "border-forest-500" : "border-cream-200"
                }`}
                aria-label="View image"
              >
                <Image src={img} alt={product.name} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info + purchase */}
      <div>
        <h1 className="text-3xl sm:text-4xl">{product.name}</h1>

        {/* Rating + social proof */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {avgRating !== null ? (
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</span>
              <span className="text-sm font-semibold text-forest-800">{avgRating}</span>
              <span className="text-sm text-ink/50">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
            </div>
          ) : (
            <span className="text-sm text-ink/40">No reviews yet</span>
          )}
          <span className="text-ink/20">|</span>
          <span className="text-sm font-medium text-forest-600">🔥 {boughtThisMonth} bought this month</span>
        </div>

        <p className="mt-4 text-ink/80">{product.shortDescription}</p>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-forest-800">{formatINR(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-lg text-ink/40 line-through">{formatINR(product.mrp)}</span>
          )}
          {off && <span className="rounded-full bg-clay-500 px-2.5 py-1 text-xs font-semibold text-white">{off}% OFF</span>}
        </div>

        <p className="mt-2 text-sm font-medium text-forest-600">
          {product.inStock ? "In stock • Cash on Delivery available" : "Currently out of stock"}
        </p>

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center rounded-full border border-cream-200">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg" aria-label="Decrease quantity">−</button>
            <span className="w-10 text-center">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-lg" aria-label="Increase quantity">+</button>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex gap-3">
            <button type="button" onClick={add} disabled={!product.inStock} className="btn-outline flex-1">
              Add to Cart
            </button>
            <button type="button" onClick={buyNow} disabled={!product.inStock} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>
          <a
            href={whatsappProductOrderLink(product, qty)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { source: "product", item_id: product.slug })}
            className="btn-whatsapp w-full"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Sticky mobile CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-200 bg-cream-50/95 p-3 backdrop-blur lg:hidden">
        <div className="container-px flex gap-2">
          <button type="button" onClick={add} disabled={!product.inStock} className="btn-outline flex-1 px-3 py-2.5 text-sm">
            Add
          </button>
          <button type="button" onClick={buyNow} disabled={!product.inStock} className="btn-primary flex-1 px-3 py-2.5 text-sm">
            Buy Now
          </button>
          <a
            href={whatsappProductOrderLink(product, qty)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { source: "product_sticky", item_id: product.slug })}
            className="btn-whatsapp flex-1 px-3 py-2.5 text-sm"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
