import { cookies } from "next/headers";
import { getAllProductsAsync, formatINR } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Products | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export default async function AdminProductsPage() {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const products = await getAllProductsAsync();

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Products ({products.length})</h1>
        <div className="flex gap-3">
          <a href="/admin/reviews" className="btn-outline text-sm">Manage Reviews</a>
          <a href="/admin/blog" className="btn-outline text-sm">Blog</a>
          <a href="/admin/pages" className="btn-outline text-sm">Pages</a>
          <a href="/admin/reels" className="btn-outline text-sm">Reels</a>
          <a href="/admin/orders" className="btn-outline text-sm">Orders</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {products.map((p) => (
          <div key={p.slug} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-forest-800">{p.name}</p>
                  <p className="text-xs text-ink/50">{p.sku}</p>
                  <div className="mt-1 flex gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.featured ? "bg-forest-100 text-forest-700" : "bg-cream-100 text-ink/50"}`}>
                      {p.featured ? "Featured" : "Not Featured"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-forest-800">{formatINR(p.price)}</p>
                {p.mrp && <p className="text-xs text-ink/50 line-through">{formatINR(p.mrp)}</p>}
              </div>
            </div>

            {/* Toggle Stock & Featured */}
            <div className="mt-4 flex flex-wrap gap-3">
              <form method="post" action="/api/admin/products">
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="action" value="toggle-stock" />
                <input type="hidden" name="inStock" value={String(p.inStock)} />
                <button type="submit" className={`px-4 py-2 text-sm rounded-lg font-medium ${p.inStock ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                  {p.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                </button>
              </form>
              <form method="post" action="/api/admin/products">
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="action" value="toggle-featured" />
                <input type="hidden" name="featured" value={String(p.featured)} />
                <button type="submit" className={`px-4 py-2 text-sm rounded-lg font-medium ${p.featured ? "bg-cream-100 text-ink/60 hover:bg-cream-200" : "bg-forest-50 text-forest-700 hover:bg-forest-100"}`}>
                  {p.featured ? "Remove from Featured" : "Add to Featured"}
                </button>
              </form>
            </div>

            {/* Edit Details */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-forest-600 hover:text-forest-800">Edit Details</summary>
              <form method="post" action="/api/admin/products" className="mt-4 space-y-4">
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="action" value="update-details" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-ink/60">Product Name</label>
                    <input name="name" defaultValue={p.name} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-ink/60">Price (₹)</label>
                      <input name="price" type="number" defaultValue={p.price} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/60">MRP (₹)</label>
                      <input name="mrp" type="number" defaultValue={p.mrp} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink/60">Bought This Month</label>
                    <input name="boughtThisMonth" type="number" min="0" defaultValue={p.boughtThisMonth ?? 0} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/60">Short Description</label>
                  <input name="shortDescription" defaultValue={p.shortDescription} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/60">Full Description</label>
                  <textarea name="fullDescription" rows={3} defaultValue={p.fullDescription} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-ink/60">Ingredients (comma separated)</label>
                    <input name="ingredients" defaultValue={p.ingredients.join(", ")} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink/60">Suitable For</label>
                    <input name="suitableFor" defaultValue={p.suitableFor} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-ink/60">Benefits (one per line)</label>
                    <textarea name="benefits" rows={4} defaultValue={p.benefits.join("\n")} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink/60">How to Use (one per line)</label>
                    <textarea name="howToUse" rows={4} defaultValue={p.howToUse.join("\n")} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/60">Precautions</label>
                  <textarea name="precautions" rows={2} defaultValue={p.precautions} className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500" />
                </div>

                <button type="submit" className="btn-primary px-6 py-2 text-sm">Save Changes</button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
