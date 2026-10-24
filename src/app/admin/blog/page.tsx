import { cookies } from "next/headers";
import { getAllPostsMeta, formatDate } from "@/lib/blog";
import DeletePostButton from "./DeletePostButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Blog | AYURM", robots: { index: false, follow: false } };

function isAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme123";
  return cookies().get("ayurm_admin")?.value === expected;
}

export default async function AdminBlogPage() {
  if (!isAuthed()) {
    return (
      <div className="container-px section">
        <p className="text-ink/60">Please <a href="/admin/orders" className="text-forest-600 underline">log in</a> first.</p>
      </div>
    );
  }

  const posts = await getAllPostsMeta();

  return (
    <div className="container-px section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Blog ({posts.length})</h1>
        <div className="flex gap-3">
          <a href="/admin/blog/new" className="btn-primary text-sm">+ New Post</a>
          <a href="/admin/products" className="btn-outline text-sm">Products</a>
          <a href="/admin/orders" className="btn-outline text-sm">Orders</a>
          <form method="post" action="/api/admin/logout">
            <button type="submit" className="btn-outline text-sm">Log out</button>
          </form>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-ink/60">No blog posts yet. <a href="/admin/blog/new" className="text-forest-600 underline">Create one</a>.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <div key={post.slug} className="card p-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-forest-800">{post.title}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/50">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                {post.excerpt && <p className="mt-2 text-sm text-ink/60 max-w-xl">{post.excerpt}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-cream-200"
                >
                  View
                </a>
                <a
                  href={`/admin/blog/${post.slug}`}
                  className="rounded-lg bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 hover:bg-forest-100"
                >
                  Edit
                </a>
                <DeletePostButton slug={post.slug} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
