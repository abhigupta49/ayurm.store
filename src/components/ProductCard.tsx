import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatINR, discountPercent } from "@/lib/product-utils";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {off && (
          <span className="absolute left-3 top-3 rounded-full bg-clay-500 px-2.5 py-1 text-xs font-semibold text-white">
            {off}% OFF
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold leading-snug text-forest-800 hover:text-forest-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{product.shortDescription}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-forest-800">{formatINR(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-sm text-ink/40 line-through">{formatINR(product.mrp)}</span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <AddToCartButton product={product} className="btn-primary w-full" />
          <Link href={`/products/${product.slug}`} className="btn-outline w-full">
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
