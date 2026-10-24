import { promises as fs } from "fs";
import path from "path";
import { ensureSeeded } from "./seed";
import { remark } from "remark";
import html from "remark-html";

export const PAGE_KEYS = [
  "about",
  "privacy-policy",
  "terms-and-conditions",
  "shipping-policy",
  "refund-policy",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export type PageData = {
  title: string;
  content: string; // Markdown
};

export type Pages = Record<PageKey, PageData>;

const PAGES_FILE = path.join(process.cwd(), "data", "pages.json");

export async function readPages(): Promise<Pages> {
  await ensureSeeded();
  try {
    const raw = await fs.readFile(PAGES_FILE, "utf8");
    return JSON.parse(raw) as Pages;
  } catch {
    return {} as Pages;
  }
}

export async function updatePage(key: PageKey, data: Partial<PageData>): Promise<void> {
  const pages = await readPages();
  pages[key] = { ...pages[key], ...data };
  await fs.writeFile(PAGES_FILE, JSON.stringify(pages, null, 2), "utf8");
}

export async function getPageHtml(key: PageKey): Promise<{ title: string; html: string }> {
  const pages = await readPages();
  const page = pages[key];
  if (!page) return { title: "", html: "" };
  const processed = await remark().use(html).process(page.content);
  return { title: page.title, html: processed.toString() };
}
