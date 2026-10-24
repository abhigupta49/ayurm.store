"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ShopClient({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.ingredients.some((i) => i.toLowerCase().includes(term))
    );
  }, [q, products]);

  return (
    <>
      <div className="mt-6 max-w-md">
        <label htmlFor="shop-search" className="sr-only">Search products</label>
        <input
          id="shop-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products or ingredients…"
          className="w-full rounded-full border border-cream-200 bg-white px-5 py-3 text-sm outline-none focus:border-forest-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-ink/60">No products match “{q}”.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
