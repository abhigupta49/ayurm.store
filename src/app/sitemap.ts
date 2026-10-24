import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllProductsAsync } from "@/lib/products";
import { getAllSlugs } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticPaths = [
    "",
    "/shop",
    "/cart",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = (await getAllProductsAsync()).map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const slugs = await getAllSlugs();
  const blogEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
