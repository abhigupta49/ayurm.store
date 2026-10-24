import { cookies } from "next/headers";
import { readOrders, ORDER_STATUSES } from "@/lib/orders";
import { formatINR } from "@/lib/product-utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Orders | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

function LoginForm({ error }: { error?: boolean }) {
  return (
    <div className="container-px section">
      <div className="mx-auto max-w-sm card p-8">
        <h1 className="text-2xl">Admin Login</h1>
        <p className="mt-2 text-sm text-ink/60">Enter the admin password to view orders.</p>
        <form method="post" action="/api/admin/login" className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            placeholder="Admin password"
            className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none focus:border-forest-500"
          />
          {error && <p className="text-sm text-clay-600">Incorrect password.</p>}
          <button type="submit" className="btn-primary w-full">Log in</button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: { error?: string } }) {
  if (!isAuthed()) {
    return <LoginForm error={searchParams.error === "1"} />;
  }

  const orders = await readOrders();

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Orders ({orders.length})</h1>
        <div className="flex gap-3">
          <a href="/admin/products" className="btn-outline text-sm">Products</a>
          <a href="/admin/reviews" className="btn-outline text-sm">Reviews</a>
          <a href="/admin/blog" className="btn-outline text-sm">Blog</a>
          <a href="/admin/pages" className="btn-outline text-sm">Pages</a>
          <a href="/admin/reels" className="btn-outline text-sm">Reels</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-ink/60">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-forest-800">#{o.id}</p>
                  <p className="text-xs text-ink/50">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-forest-800">{formatINR(o.total)}</p>
                  <p className="text-xs text-ink/50">{o.paymentMethod} • {o.paymentStatus}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="text-sm">
                  <p className="font-semibold text-forest-800">Customer</p>
                  <p>{o.customer.name}</p>
                  <p>{o.customer.phone}</p>
                  {o.customer.email && <p>{o.customer.email}</p>}
                  <p className="mt-1 text-ink/70">
                    {o.customer.address}, {o.customer.city}, {o.customer.state} — {o.customer.pincode}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-forest-800">Items</p>
                  <ul className="mt-1 space-y-0.5">
                    {o.items.map((i) => (
                      <li key={i.slug} className="text-ink/70">{i.name} × {i.quantity} — {formatINR(i.price * i.quantity)}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <form method="post" action="/api/admin/orders" className="mt-4 flex items-center gap-3">
                <input type="hidden" name="id" value={o.id} />
                <label className="text-sm font-medium">Status</label>
                <select name="status" defaultValue={o.status} className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" className="btn-primary px-4 py-2 text-sm">Update</button>
                <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-forest-700">Current: {o.status}</span>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
