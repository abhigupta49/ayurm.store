// Blog data layer. Articles are Markdown files in /content/blog with
// frontmatter. To add an article: drop a new .md file in that folder.
// A CMS can be added later by replacing these functions.

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type BlogMeta = {
  title: string;
  slug: string;
  image?: string;
  category: string;
  date: string; // ISO
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
};

export type BlogPost = BlogMeta & { contentHtml: string };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const BLOG_CATEGORIES = [
  "Hair Care",
  "Skin Care",
  "Ingredients",
  "Ayurveda & Wellness",
] as const;

async function listFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    return files.filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

export async function getAllPostsMeta(): Promise<BlogMeta[]> {
  const files = await listFiles();
  const metas = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        title: data.title || slug,
        slug,
        image: data.image || "",
        category: data.category || "Ayurveda & Wellness",
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        excerpt: data.excerpt || "",
        seoTitle: data.seoTitle || "",
        metaDescription: data.metaDescription || "",
      } as BlogMeta;
    })
  );
  return metas.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getLatestPosts(limit = 3): Promise<BlogMeta[]> {
  const all = await getAllPostsMeta();
  return all.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf8");
    const { data, content } = matter(raw);
    const processed = await remark().use(html).process(content);
    return {
      title: data.title || slug,
      slug,
      image: data.image || "",
      category: data.category || "Ayurveda & Wellness",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || "",
      seoTitle: data.seoTitle || "",
      metaDescription: data.metaDescription || "",
      contentHtml: processed.toString(),
    };
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await listFiles();
  return files.map((f) => f.replace(/\.md$/, ""));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
