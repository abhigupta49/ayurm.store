import { promises as fs } from "fs";
import path from "path";
import { ensureSeeded } from "./seed";
export { formatINR, discountPercent } from "./product-utils";

export type Product = {
  name: string;
  slug: string;
  image: string;
  gallery: string[];
  price: number;
  mrp?: number;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
  suitableFor: string;
  precautions: string;
  sku: string;
  inStock: boolean;
  featured?: boolean;
  boughtThisMonth?: number;
  faqs?: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
};

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

async function readProductsFromFile(): Promise<Product[]> {
  await ensureSeeded();
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, "utf8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

async function writeProductsToFile(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
}

export async function getAllProductsAsync(): Promise<Product[]> {
  return readProductsFromFile();
}

export async function getProductBySlugAsync(slug: string): Promise<Product | undefined> {
  const products = await readProductsFromFile();
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProductsAsync(limit = 6): Promise<Product[]> {
  const products = await readProductsFromFile();
  return products.filter((p) => p.featured && p.inStock).slice(0, limit);
}

export async function getRelatedProductsAsync(slug: string, limit = 3): Promise<Product[]> {
  const products = await readProductsFromFile();
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function updateProduct(slug: string, updates: Partial<Product>): Promise<Product | undefined> {
  const products = await readProductsFromFile();
  const index = products.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...updates };
  await writeProductsToFile(products);
  return products[index];
}

