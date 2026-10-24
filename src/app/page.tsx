import Image from "next/image";
import Link from "next/link";
import { getFeaturedProductsAsync } from "@/lib/products";
import { getLatestPosts, formatDate } from "@/lib/blog";
import { getAllReels } from "@/lib/reels";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { whatsappChatLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/" });

const WHY = [
  { title: "Natural Ingredients", body: "Formulas built around time-honoured Indian botanicals." },
  { title: "Thoughtfully Formulated", body: "Simple, considered products made for everyday care." },
  { title: "Made for Everyday Care", body: "Gentle enough to become part of your daily routine." },
  { title: "Easy COD & WhatsApp", body: "Order with Cash on Delivery or directly on WhatsApp." },
];

const INGREDIENTS = [
  { name: "Amla", note: "Hair care" },
  { name: "Neem", note: "Scalp care" },
  { name: "Bhringraj", note: "Hair care" },
  { name: "Aloe Vera", note: "Skin care" },
  { name: "Saffron", note: "Skin care" },
  { name: "Rosemary", note: "Hair care" },
];

export default async function HomePage() {
  const featured = await getFeaturedProductsAsync(6);
  const posts = await getLatestPosts(3);
  const reels = await getAllReels();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100">
        <div className="container-px grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Modern Indian wellness</p>
            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Nature-inspired care, made for everyday you.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/70">
              Modern personal care inspired by traditional Indian ingredients.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">Shop Now</Link>
              <Link href="/shop" className="btn-outline">Explore Products</Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/60">
              <span>✓ COD Available</span>
              <span>✓ WhatsApp Support</span>
              <span>✓ Quality Ingredients</span>
            </div>
          </div>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-forest-700 shadow-sm">
            {/* Decorative leaf SVGs */}
            <svg className="absolute left-4 top-4 opacity-20" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M10 70C10 35 40 10 70 10C70 45 40 70 10 70Z" fill="#d4e8c2" />
              <path d="M10 70C25 55 45 40 65 18" stroke="#d4e8c2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute right-4 top-6 opacity-20 rotate-90" width="60" height="60" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M10 70C10 35 40 10 70 10C70 45 40 70 10 70Z" fill="#d4e8c2" />
              <path d="M10 70C25 55 45 40 65 18" stroke="#d4e8c2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-4 right-6 opacity-20 -rotate-45" width="70" height="70" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M10 70C10 35 40 10 70 10C70 45 40 70 10 70Z" fill="#d4e8c2" />
              <path d="M10 70C25 55 45 40 65 18" stroke="#d4e8c2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-6 left-8 opacity-20 rotate-45" width="50" height="50" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M10 70C10 35 40 10 70 10C70 45 40 70 10 70Z" fill="#d4e8c2" />
              <path d="M10 70C25 55 45 40 65 18" stroke="#d4e8c2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {/* Centre floral mandala */}
            <svg className="absolute opacity-10" width="260" height="260" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <path d="M100 100 C85 70 90 40 100 20 C110 40 115 70 100 100Z" fill="#d4e8c2" />
                </g>
              ))}
              <circle cx="100" cy="100" r="12" fill="#d4e8c2" />
            </svg>
            {/* Slogan text */}
            <div className="relative z-10 px-8 text-center">
              <p className="font-serif text-lg font-medium tracking-widest text-cream-200/80 uppercase">The Ayurvedic Way</p>
              <p
                className="mt-3 font-serif leading-tight text-cream-50"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontStyle: "italic" }}
              >
                Choose Ayurveda!<br />Choose Ayurm.
              </p>
              <div className="mx-auto mt-5 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-cream-200/40" />
                <svg width="20" height="20" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                  <path d="M10 70C10 35 40 10 70 10C70 45 40 70 10 70Z" fill="#d4e8c2" opacity="0.7" />
                </svg>
                <span className="h-px w-12 bg-cream-200/40" />
              </div>
              <p className="mt-4 font-serif text-sm italic text-cream-100/60">100% Natural · Authentic Ayurvedic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container-px">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Bestsellers" title="Featured Products" />
            <Link href="/shop" className="hidden text-sm font-semibold text-forest-600 hover:text-forest-700 sm:inline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why AYURM */}
      <section className="section bg-cream-100">
        <div className="container-px">
          <SectionHeading eyebrow="Why AYURM" title="Simple care you can trust" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="From nature" title="Ingredients we love" subtitle="Botanicals rooted in Indian tradition." center />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {INGREDIENTS.map((ing) => (
              <Link
                key={ing.name}
                href="/shop"
                className="card flex flex-col items-center p-5 text-center transition-colors hover:border-forest-500"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-xl text-forest-600" aria-hidden="true">
                  🌿
                </span>
                <span className="mt-3 font-semibold text-forest-800">{ing.name}</span>
                <span className="text-xs text-ink/50">{ing.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reels */}
      {reels.length > 0 && (
        <section className="section bg-forest-700">
          <div className="container-px">
            <div className="text-center">
              <p className="eyebrow text-clay-400">Follow us</p>
              <h2 className="mt-2 text-3xl text-cream-50 sm:text-4xl">See it in action</h2>
              <p className="mt-2 text-cream-100/70">Watch our latest reels.</p>
            </div>
            <div className={`mt-10 grid gap-4 ${
              reels.length === 1 ? "grid-cols-1 max-w-xs mx-auto" :
              reels.length === 2 ? "grid-cols-2 max-w-lg mx-auto" :
              "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}>
              {reels.map((reel) => (
                <div key={reel.id} className="flex flex-col gap-2">
                  <div className="overflow-hidden rounded-2xl bg-forest-800">
                    <iframe
                      src={reel.embedUrl}
                      className="aspect-[9/16] w-full"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      title={reel.caption || "Reel"}
                      loading="lazy"
                    />
                  </div>
                  {reel.caption && (
                    <p className="text-center text-xs text-cream-100/70">{reel.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="section">
          <div className="container-px">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="Journal" title="From the blog" />
              <Link href="/blog" className="hidden text-sm font-semibold text-forest-600 hover:text-forest-700 sm:inline">
                All articles →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card group overflow-hidden">
                  <div className="relative aspect-[16/10] bg-cream-100">
                    {post.image && (
                      <Image src={post.image} alt={post.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="eyebrow">{post.category}</span>
                    <h3 className="mt-2 text-lg leading-snug group-hover:text-forest-600">{post.title}</h3>
                    <p className="mt-2 text-xs text-ink/50">{formatDate(post.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="section bg-cream-100">
        <div className="container-px">
          <div className="card flex flex-col items-center gap-5 bg-white p-10 text-center">
            <h2 className="text-2xl sm:text-3xl">Have questions? Talk to AYURM on WhatsApp</h2>
            <p className="max-w-xl text-ink/70">
              Our team is happy to help you choose the right products or place an order.
            </p>
            <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
