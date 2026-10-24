import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  cookies().delete("ayurm_admin");
  return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 303 });
}
