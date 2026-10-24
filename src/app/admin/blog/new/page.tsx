import { cookies } from "next/headers";
import { BLOG_CATEGORIES } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Blog Post | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

const inputCls = "mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500";

export default function NewBlogPage({ searchParams }: { searchParams: { error?: string } }) {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">New Blog Post</h1>
        <a href="/admin/blog" className="btn-outline text-sm">← Back</a>
      </div>

      {searchParams.error && <p className="mt-4 text-sm text-red-600">Title is required.</p>}

      <form method="post" action="/api/admin/blog" className="mt-8 max-w-3xl space-y-5">
        <input type="hidden" name="action" value="create" />

        <div>
          <label className="text-xs font-medium text-ink/60">Title *</label>
          <input name="title" required placeholder="e.g. Benefits of Neem for Hair" className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-ink/60">Category</label>
            <select name="category" className={inputCls}>
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Date</label>
            <input name="date" type="date" defaultValue={today} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Image URL</label>
            <input name="image" type="url" placeholder="https://..." className={inputCls} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/60">Excerpt (shown on blog listing)</label>
          <textarea name="excerpt" rows={2} placeholder="A short summary..." className={inputCls} />
        </div>

        <div>
          <label className="text-xs font-medium text-ink/60">Content (Markdown)</label>
          <textarea name="content" rows={16} placeholder="## Your heading&#10;&#10;Write your article here in Markdown..." className={inputCls + " font-mono text-xs"} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink/60">SEO Title</label>
            <input name="seoTitle" placeholder="e.g. Benefits of Neem | AYURM" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Meta Description</label>
            <input name="metaDescription" placeholder="Short description for search engines..." className={inputCls} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary px-8">Publish Post</button>
          <a href="/admin/blog" className="btn-outline">Cancel</a>
        </div>
      </form>
    </div>
  );
}
