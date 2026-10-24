import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updatePage, PAGE_KEYS, type PageKey } from "@/lib/pages";

export const dynamic = "force-dynamic";

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const key = String(form.get("key") || "") as PageKey;
  const content = String(form.get("content") || "");
  const title = String(form.get("title") || "").trim();

  if (!PAGE_KEYS.includes(key)) {
    return NextResponse.redirect(new URL("/admin/pages", req.url), { status: 303 });
  }

  await updatePage(key, { ...(title && { title }), content });
  return NextResponse.redirect(new URL(`/admin/pages?saved=${key}`, req.url), { status: 303 });
}
