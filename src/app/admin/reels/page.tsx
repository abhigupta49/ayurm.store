import { cookies } from "next/headers";
import { getAllReels } from "@/lib/reels";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Reels | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

const PLATFORM_BADGE: Record<string, string> = {
  instagram: "bg-pink-50 text-pink-600",
  youtube: "bg-red-50 text-red-600",
  facebook: "bg-blue-50 text-blue-700",
  unknown: "bg-cream-100 text-ink/50",
};

export default async function AdminReelsPage() {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const reels = await getAllReels();

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Reels ({reels.length})</h1>
        <div className="flex gap-3">
          <a href="/admin/blog" className="btn-outline text-sm">Blog</a>
          <a href="/admin/products" className="btn-outline text-sm">Products</a>
          <a href="/admin/orders" className="btn-outline text-sm">Orders</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      {/* Add reel */}
      <div className="mt-8 card p-5">
        <h2 className="text-xl text-forest-800">Add Reel</h2>
        <p className="mt-1 text-sm text-ink/50">Paste an Instagram, YouTube Shorts, or Facebook reel link.</p>
        <form method="post" action="/api/admin/reels" className="mt-4 space-y-3">
          <input type="hidden" name="action" value="add" />
          <div>
            <label className="text-xs font-medium text-ink/60">Reel URL *</label>
            <input
              name="url"
              required
              placeholder="https://www.instagram.com/reel/..."
              className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Caption (optional)</label>
            <input
              name="caption"
              placeholder="e.g. How to use Bhringaraj Hair Oil"
              className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
            />
          </div>
          <button type="submit" className="btn-primary px-6 py-2 text-sm">Add Reel</button>
        </form>
      </div>

      {/* Reels list */}
      <div className="mt-8 space-y-4">
        {reels.length === 0 ? (
          <p className="text-ink/60">No reels added yet.</p>
        ) : (
          reels.map((reel) => (
            <div key={reel.id} className="card p-4 flex flex-wrap items-start gap-4">
              {/* Preview */}
              <div className="w-full sm:w-48 shrink-0">
                <iframe
                  src={reel.embedUrl}
                  className="h-64 w-full rounded-lg sm:h-48"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  title={reel.caption || "Reel"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PLATFORM_BADGE[reel.platform]}`}>
                  {reel.platform}
                </span>
                {reel.caption && <p className="mt-2 font-medium text-forest-800">{reel.caption}</p>}
                <p className="mt-1 truncate text-xs text-ink/40">{reel.url}</p>
                <form method="post" action="/api/admin/reels" className="mt-3">
                  <input type="hidden" name="action" value="delete" />
                  <input type="hidden" name="id" value={reel.id} />
                  <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
