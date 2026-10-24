import { NextResponse } from "next/server";
import { createOrder, type OrderItem, type Customer } from "@/lib/orders";
import { getProductBySlugAsync } from "@/lib/products";

export const dynamic = "force-dynamic";

type Body = {
  customer?: Partial<Customer>;
  items?: { slug: string; quantity: number }[];
};

function validCustomer(c: Partial<Customer> | undefined): c is Customer {
  if (!c) return false;
  const required = ["name", "phone", "address", "city", "state", "pincode"] as const;
  for (const key of required) {
    if (!c[key] || String(c[key]).trim() === "") return false;
  }
  if (!/^\d{10}$/.test(String(c.phone).replace(/\D/g, "").slice(-10))) return false;
  if (!/^\d{6}$/.test(String(c.pincode))) return false;
  return true;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!validCustomer(body.customer)) {
    return NextResponse.json(
      { error: "Please provide valid name, 10-digit mobile, address, city, state and 6-digit pincode." },
      { status: 400 }
    );
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Resolve prices server-side from the product catalog (never trust client prices).
  const items: OrderItem[] = [];
  for (const line of body.items) {
    const product = await getProductBySlugAsync(line.slug);
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 0));
    if (!product || !product.inStock) {
      return NextResponse.json(
        { error: `A product in your cart is unavailable.` },
        { status: 400 }
      );
    }
    items.push({ slug: product.slug, name: product.name, quantity, price: product.price });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  try {
    const order = await createOrder({
      customer: {
        name: String(body.customer.name).trim(),
        phone: String(body.customer.phone).trim(),
        email: body.customer.email ? String(body.customer.email).trim() : undefined,
        address: String(body.customer.address).trim(),
        city: String(body.customer.city).trim(),
        state: String(body.customer.state).trim(),
        pincode: String(body.customer.pincode).trim(),
      },
      items,
      total,
    });

    // NOTE: order notification hook — this is where you can later email the
    // order to AYURM or trigger a WhatsApp Business API message. For launch,
    // the order is stored safely and viewable at /admin/orders.

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
