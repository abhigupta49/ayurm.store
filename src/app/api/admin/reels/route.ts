import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addReel, deleteReel } from "@/lib/reels";

export const dynamic = "force-dynamic";

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const action = String(form.get("action") || "");

  if (action === "add") {
    const url = String(form.get("url") || "").trim();
    const caption = String(form.get("caption") || "").trim();
    if (url) await addReel(url, caption);
  } else if (action === "delete") {
    const id = String(form.get("id") || "").trim();
    if (id) await deleteReel(id);
  }

  return NextResponse.redirect(new URL("/admin/reels", req.url), { status: 303 });
}
