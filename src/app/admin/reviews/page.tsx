import { cookies } from "next/headers";
import { getAllReviews } from "@/lib/reviews";
import { getAllProductsAsync } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Reviews | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export default async function AdminReviewsPage() {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const [reviews, products] = await Promise.all([getAllReviews(), getAllProductsAsync()]);

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Reviews ({reviews.length})</h1>
        <div className="flex gap-3">
          <a href="/admin/products" className="btn-outline text-sm">Products</a>
          <a href="/admin/blog" className="btn-outline text-sm">Blog</a>
          <a href="/admin/pages" className="btn-outline text-sm">Pages</a>
          <a href="/admin/reels" className="btn-outline text-sm">Reels</a>
          <a href="/admin/orders" className="btn-outline text-sm">Orders</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      {/* Add Review */}
      <div className="mt-8 card p-5">
        <h2 className="text-xl text-forest-800">Add Review</h2>
        <form method="post" action="/api/admin/reviews" className="mt-4 space-y-4">
          <input type="hidden" name="action" value="add" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-ink/60">Product</label>
              <select name="slug" required className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500">
                {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">Customer Name</label>
              <input name="name" required placeholder="e.g. Priya S." className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">Rating (1–5)</label>
              <select name="rating" defaultValue="5" className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{"★".repeat(r)} ({r})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Review Comment</label>
            <textarea name="comment" required rows={3} placeholder="Write the review..." className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
          </div>
          <button type="submit" className="btn-primary px-6 py-2 text-sm">Add Review</button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-ink/60">No reviews yet. Add one above.</p>
        ) : (
          reviews.map((r) => {
            const product = products.find((p) => p.slug === r.slug);
            return (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-forest-600 font-medium">{product?.name ?? r.slug}</p>
                    <p className="mt-0.5 font-semibold text-forest-800">{r.name}</p>
                    <p className="text-sm text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                    <p className="mt-1 text-sm text-ink/70">{r.comment}</p>
                    <p className="mt-1 text-xs text-ink/40">{new Date(r.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <form method="post" action="/api/admin/reviews">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
