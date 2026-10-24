import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug, formatDate } from "@/lib/blog";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: "Article not found", path: `/blog/${params.slug}` });
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image || undefined,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="container-px section">
      <JsonLd data={articleJsonLd({ title: post.title, slug: post.slug, description: post.metaDescription || post.excerpt, image: post.image || undefined, date: post.date })} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />

        <span className="eyebrow mt-6 block">{post.category}</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-ink/50">{formatDate(post.date)}</p>

        {post.image && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-cream-100">
            <Image src={post.image} alt={post.title} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
          </div>
        )}

        <div className="prose-ayurm mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </article>
  );
}
