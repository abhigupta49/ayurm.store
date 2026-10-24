import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import ShopClient from "./ShopClient";
import { buildMetadata } from "@/lib/seo";
import { getAllProductsAsync } from "@/lib/products";

export const metadata = buildMetadata({
  title: "Shop",
  description: "Browse AYURM hair and skin care products. Cash on Delivery available. Order online or on WhatsApp.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getAllProductsAsync();
  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <div className="mt-5">
        <SectionHeading eyebrow="All products" title="Shop AYURM" subtitle="Thoughtfully formulated personal care for everyday use." />
      </div>
      <ShopClient products={products} />
    </div>
  );
}
