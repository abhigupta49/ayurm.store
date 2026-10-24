import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const slug = String(form.get("slug") || "");
  const action = String(form.get("action") || "");

  if (!slug) return NextResponse.redirect(new URL("/admin/products", req.url), { status: 303 });

  if (action === "toggle-stock") {
    const current = form.get("inStock") === "true";
    await updateProduct(slug, { inStock: !current });
  } else if (action === "toggle-featured") {
    const current = form.get("featured") === "true";
    await updateProduct(slug, { featured: !current });
  } else if (action === "update-details") {
    const price = Number(form.get("price"));
    const mrp = Number(form.get("mrp"));
    const boughtThisMonth = Number(form.get("boughtThisMonth"));
    const name = String(form.get("name") || "").trim();
    const shortDescription = String(form.get("shortDescription") || "").trim();
    const fullDescription = String(form.get("fullDescription") || "").trim();
    const suitableFor = String(form.get("suitableFor") || "").trim();
    const precautions = String(form.get("precautions") || "").trim();
    const ingredients = String(form.get("ingredients") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const benefits = String(form.get("benefits") || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const howToUse = String(form.get("howToUse") || "").split("\n").map((s) => s.trim()).filter(Boolean);

    await updateProduct(slug, {
      ...(name && { name }),
      ...(price > 0 && { price }),
      ...(mrp > 0 && { mrp }),
      ...(boughtThisMonth >= 0 && { boughtThisMonth }),
      ...(shortDescription && { shortDescription }),
      ...(fullDescription && { fullDescription }),
      ...(suitableFor && { suitableFor }),
      ...(precautions && { precautions }),
      ...(ingredients.length > 0 && { ingredients }),
      ...(benefits.length > 0 && { benefits }),
      ...(howToUse.length > 0 && { howToUse }),
    });
  }

  return NextResponse.redirect(new URL("/admin/products", req.url), { status: 303 });
}
