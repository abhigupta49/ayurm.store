import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { BLOG_CATEGORIES } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Blog Post | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

const inputCls = "mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500";

export default async function EditBlogPage({ params }: { params: { slug: string } }) {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const filePath = path.join(process.cwd(), "content", "blog", `${params.slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const { data, content } = matter(raw);

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Edit Post</h1>
        <a href="/admin/blog" className="btn-outline text-sm">← Back</a>
      </div>

      <form method="post" action={`/api/admin/blog/${params.slug}`} className="mt-8 max-w-3xl space-y-5">

        <div>
          <label className="text-xs font-medium text-ink/60">Title *</label>
          <input name="title" required defaultValue={data.title || ""} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-ink/60">Category</label>
            <select name="category" defaultValue={data.category || "Ayurveda & Wellness"} className={inputCls}>
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Date</label>
            <input name="date" type="date" defaultValue={data.date ? String(data.date).slice(0, 10) : ""} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Image URL</label>
            <input name="image" type="url" defaultValue={data.image || ""} className={inputCls} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/60">Excerpt</label>
          <textarea name="excerpt" rows={2} defaultValue={data.excerpt || ""} className={inputCls} />
        </div>

        <div>
          <label className="text-xs font-medium text-ink/60">Content (Markdown)</label>
          <textarea name="content" rows={16} defaultValue={content.trim()} className={inputCls + " font-mono text-xs"} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink/60">SEO Title</label>
            <input name="seoTitle" defaultValue={data.seoTitle || ""} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Meta Description</label>
            <input name="metaDescription" defaultValue={data.metaDescription || ""} className={inputCls} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary px-8">Save Changes</button>
          <a href={`/blog/${params.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline">Preview</a>
          <a href="/admin/blog" className="btn-outline">Cancel</a>
        </div>
      </form>
    </div>
  );
}
