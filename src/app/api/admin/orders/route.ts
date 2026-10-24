import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as OrderStatus;

  if (!id || !ORDER_STATUSES.includes(status)) {
    return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 303 });
  }

  await updateOrderStatus(id, status);
  return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 303 });
}
