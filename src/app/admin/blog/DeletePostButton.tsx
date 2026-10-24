"use client";

export default function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      method="post"
      action="/api/admin/blog"
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="action" value="delete" />
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
        Delete
      </button>
    </form>
  );
}
