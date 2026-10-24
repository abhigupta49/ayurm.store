import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProductsAsync, getProductBySlugAsync, getRelatedProductsAsync } from "@/lib/products";
import { getReviewsBySlug } from "@/lib/reviews";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import ProductPurchase from "./ProductPurchase";
import ReviewsSection from "./ReviewsSection";

export async function generateStaticParams() {
  const products = await getAllProductsAsync();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlugAsync(params.slug);
  if (!product) return buildMetadata({ title: "Product not found", path: `/products/${params.slug}` });
  return buildMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-cream-200 py-6">
      <h2 className="text-xl text-forest-800">{title}</h2>
      <div className="mt-3 text-ink/80">{children}</div>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugAsync(params.slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProductsAsync(product.slug, 3),
    getReviewsBySlug(product.slug),
  ]);

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return (
    <div className="container-px section pb-28 lg:pb-20">
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />

      <div className="mt-6">
        <ProductPurchase product={product} avgRating={avgRating} reviewCount={reviews.length} />
      </div>

      {/* Details */}
      <div className="mt-10 max-w-3xl">
        <InfoBlock title="Benefits">
          <ul className="list-disc space-y-1 pl-5">
            {product.benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </InfoBlock>

        <InfoBlock title="Ingredients">
          <p>{product.ingredients.join(", ")}</p>
        </InfoBlock>

        <InfoBlock title="How to Use">
          <ol className="list-decimal space-y-1 pl-5">
            {product.howToUse.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </InfoBlock>

        <InfoBlock title="Suitable For">
          <p>{product.suitableFor}</p>
        </InfoBlock>

        <InfoBlock title="Precautions">
          <p>{product.precautions}</p>
        </InfoBlock>

        {product.faqs && product.faqs.length > 0 && (
          <InfoBlock title="FAQ">
            <dl className="space-y-4">
              {product.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-forest-800">{f.q}</dt>
                  <dd className="mt-1 text-ink/70">{f.a}</dd>
                </div>
              ))}
            </dl>
          </InfoBlock>
        )}

        <InfoBlock title="Shipping Information">
          <p>
            Orders are typically dispatched within 2–4 business days. Delivery timelines
            vary by location. Cash on Delivery is available. See our{" "}
            <a href="/shipping-policy" className="text-forest-600 underline">Shipping Policy</a> for details.
          </p>
        </InfoBlock>

        {/* Reviews */}
        <ReviewsSection slug={product.slug} initialReviews={reviews} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading eyebrow="You may also like" title="Related products" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
