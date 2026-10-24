import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const COOKIE = "ayurm_admin";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "changeme123";

  if (password && password === expected) {
    cookies().set(COOKIE, expected, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin/orders?error=1", req.url), { status: 303 });
}

export async function DELETE(req: Request) {
  cookies().delete(COOKIE);
  return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 303 });
}
