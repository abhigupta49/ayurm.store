import { NextResponse } from "next/server";
import { addReview } from "@/lib/reviews";
import { getProductBySlugAsync } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug || "").trim();
    const name = String(body.name || "").trim();
    const comment = String(body.comment || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!slug || !name || !comment) {
      return NextResponse.json({ error: "Name and comment are required." }, { status: 400 });
    }

    // Verify product exists
    const product = await getProductBySlugAsync(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const review = await addReview({ slug, name, rating, comment });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not submit review." }, { status: 500 });
  }
}
