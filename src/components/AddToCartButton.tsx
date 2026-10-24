"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

type Props = {
  product: Pick<Product, "slug" | "name" | "price" | "image" | "inStock">;
  quantity?: number;
  className?: string;
  label?: string;
};

export default function AddToCartButton({ product, quantity = 1, className, label = "Add to Cart" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      { slug: product.slug, name: product.name, price: product.price, image: product.image },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (!product.inStock) {
    return (
      <button type="button" disabled className={className || "btn-outline w-full"}>
        Out of Stock
      </button>
    );
  }

  return (
    <button type="button" onClick={handleAdd} className={className || "btn-primary w-full"}>
      {added ? "Added ✓" : label}
    </button>
  );
}
