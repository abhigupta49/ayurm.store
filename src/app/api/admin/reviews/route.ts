import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addReview, deleteReview } from "@/lib/reviews";

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
    const slug = String(form.get("slug") || "").trim();
    const name = String(form.get("name") || "").trim();
    const rating = Math.min(5, Math.max(1, Number(form.get("rating") || 5)));
    const comment = String(form.get("comment") || "").trim();
    if (slug && name && comment) {
      await addReview({ slug, name, rating, comment });
    }
  } else if (action === "delete") {
    const id = String(form.get("id") || "").trim();
    if (id) await deleteReview(id);
  }

  return NextResponse.redirect(new URL("/admin/reviews", req.url), { status: 303 });
}
