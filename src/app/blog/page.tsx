import Image from "next/image";
import Link from "next/link";
import { getAllPostsMeta, formatDate } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Simple, honest articles on hair care, skin care and Indian wellness ingredients from AYURM.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPostsMeta();

  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <div className="mt-5">
        <SectionHeading eyebrow="Journal" title="AYURM Blog" subtitle="Simple, honest notes on ingredients, hair and skin care." />
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-ink/60">No articles yet. Check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group overflow-hidden">
              <div className="relative aspect-[16/10] bg-cream-100">
                {post.image && (
                  <Image src={post.image} alt={post.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <span className="eyebrow">{post.category}</span>
                <h2 className="mt-2 text-lg leading-snug group-hover:text-forest-600">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>
                <p className="mt-3 text-xs text-ink/50">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
