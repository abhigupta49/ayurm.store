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

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const form = await req.formData();

  const fields = {
    title: String(form.get("title") || "").trim(),
    category: String(form.get("category") || "Ayurveda & Wellness"),
    date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
    image: String(form.get("image") || ""),
    excerpt: String(form.get("excerpt") || "").trim(),
    seoTitle: String(form.get("seoTitle") || "").trim(),
    metaDescription: String(form.get("metaDescription") || "").trim(),
    content: String(form.get("content") || "").trim(),
  };

  await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), buildMarkdown(fields), "utf8");
  return NextResponse.redirect(new URL("/admin/blog", req.url), { status: 303 });
}
