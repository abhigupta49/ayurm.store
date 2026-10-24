import { cookies } from "next/headers";
import { readPages, PAGE_KEYS } from "@/lib/pages";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Pages | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

const PAGE_LABELS: Record<string, string> = {
  "about": "About",
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms & Conditions",
  "shipping-policy": "Shipping Policy",
  "refund-policy": "Refund Policy",
};

const PAGE_PATHS: Record<string, string> = {
  "about": "/about",
  "privacy-policy": "/privacy-policy",
  "terms-and-conditions": "/terms-and-conditions",
  "shipping-policy": "/shipping-policy",
  "refund-policy": "/refund-policy",
};

const inputCls = "mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: { page?: string; saved?: string };
}) {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const pages = await readPages();
  const activeKey = (searchParams.page && PAGE_KEYS.includes(searchParams.page as any))
    ? searchParams.page
    : "about";
  const activePage = pages[activeKey as keyof typeof pages];

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Pages</h1>
        <div className="flex gap-3">
          <a href="/admin/reels" className="btn-outline text-sm">Reels</a>
          <a href="/admin/blog" className="btn-outline text-sm">Blog</a>
          <a href="/admin/products" className="btn-outline text-sm">Products</a>
          <a href="/admin/orders" className="btn-outline text-sm">Orders</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      {searchParams.saved && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ {PAGE_LABELS[searchParams.saved]} saved successfully.
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PAGE_KEYS.map((key) => (
          <a
            key={key}
            href={`/admin/pages?page=${key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeKey === key
                ? "bg-forest-700 text-cream-50"
                : "bg-cream-100 text-ink/70 hover:bg-cream-200"
            }`}
          >
            {PAGE_LABELS[key]}
          </a>
        ))}
      </div>

      {/* Editor */}
      <div className="mt-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-forest-800">{PAGE_LABELS[activeKey]}</h2>
          <a
            href={PAGE_PATHS[activeKey]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-forest-600 underline"
          >
            Preview →
          </a>
        </div>

        <form method="post" action="/api/admin/pages" className="mt-4 space-y-4">
          <input type="hidden" name="key" value={activeKey} />

          <div>
            <label className="text-xs font-medium text-ink/60">Page Title</label>
            <input name="title" defaultValue={activePage?.title || ""} className={inputCls} />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60">
              Content (Markdown) —{" "}
              <span className="text-ink/40">use ## for headings, **bold**, *italic*, - for lists</span>
            </label>
            <textarea
              name="content"
              rows={20}
              defaultValue={activePage?.content || ""}
              className={inputCls + " font-mono text-xs leading-relaxed"}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-primary px-8">Save Changes</button>
            <a href={PAGE_PATHS[activeKey]} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Preview
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
