import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildMarkdown(fields: Record<string, string>): string {
  const { title, category, date, image, excerpt, seoTitle, metaDescription, content } = fields;
  return `---
title: "${title.replace(/"/g, '\\"')}"
category: "${category}"
date: "${date}"
image: "${image}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
seoTitle: "${seoTitle.replace(/"/g, '\\"')}"
metaDescription: "${metaDescription.replace(/"/g, '\\"')}"
---

${content}
`;
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const action = String(form.get("action") || "");

  if (action === "delete") {
    const slug = String(form.get("slug") || "").trim();
    if (slug) {
      try {
        await fs.unlink(path.join(BLOG_DIR, `${slug}.md`));
      } catch {}
    }
    return NextResponse.redirect(new URL("/admin/blog", req.url), { status: 303 });
  }

  if (action === "create") {
    const title = String(form.get("title") || "").trim();
    if (!title) return NextResponse.redirect(new URL("/admin/blog/new?error=1", req.url), { status: 303 });

    const slug = toSlug(title);
    const fields = {
      title,
      category: String(form.get("category") || "Ayurveda & Wellness"),
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      image: String(form.get("image") || ""),
      excerpt: String(form.get("excerpt") || "").trim(),
      seoTitle: String(form.get("seoTitle") || title).trim(),
      metaDescription: String(form.get("metaDescription") || "").trim(),
      content: String(form.get("content") || "").trim(),
    };

    await fs.mkdir(BLOG_DIR, { recursive: true });
    await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), buildMarkdown(fields), "utf8");
    return NextResponse.redirect(new URL("/admin/blog", req.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin/blog", req.url), { status: 303 });
}
