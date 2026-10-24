# AYURM — D2C Store

A simple, premium, mobile-first e-commerce store for the AYURM personal-care
brand. Built with Next.js (App Router), TypeScript and Tailwind CSS. It supports
Cash on Delivery checkout, WhatsApp ordering, a Markdown blog, SEO, and a simple
protected admin for viewing orders.

Built for a fast launch: no external database required. Orders are stored in a
JSON file and the data layer is structured so you can move to a database later
without touching the UI.

---

## Quick start (local)

```bash
cp .env.example .env.local   # then edit values (see below)
npm install
npm run dev                  # http://localhost:3000
```

Production build + run:

```bash
npm run build
npm run start
```

---

## What's complete ✅

- Homepage: hero, featured products, why-AYURM, ingredients, brand story, latest
  blog, WhatsApp CTA
- Shop (`/shop`) with client-side search
- Product pages (`/products/[slug]`) with gallery, quantity, Add to Cart,
  Buy Now, Order on WhatsApp, benefits/ingredients/how-to-use/precautions/FAQ,
  related products, sticky mobile CTA bar
- Cart (`/cart`) with localStorage persistence (no login needed)
- COD checkout (`/checkout`) with validation
- Order creation API (`/api/orders`) — prices resolved **server-side** from the
  catalog (client-sent prices are ignored)
- Order confirmation (`/order-success`)
- Simple protected admin (`/admin/orders`) — view orders, change status
- Blog (`/blog`, `/blog/[slug]`) from Markdown files
- About, Contact, FAQ, and 4 legal pages (placeholders clearly marked)
- SEO: per-page metadata, canonical URLs, Open Graph, JSON-LD
  (Organization, WebSite, Product, Article, BreadcrumbList, FAQPage),
  `sitemap.xml`, `robots.txt`, breadcrumbs, internal links
- Analytics: GA4 + Meta Pixel support (safely disabled until IDs are set)
- Mobile-first design with sticky Add to Cart and sticky WhatsApp button

Verified: `npm run build` passes (25 routes). A full COD order flow was tested
end-to-end (validation, order creation with correct server-side totals, order
confirmation, admin login, and status update all work).

---

## What you need to configure 🔧

Edit `.env.local` (copy from `.env.example`):

| Variable | Required | What it is |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your live URL, no trailing slash, e.g. `https://ayurm.in` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | **Yes** | WhatsApp number, digits only with country code, e.g. `919876543210` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Business email shown on the site |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `_FACEBOOK_URL` / `_YOUTUBE_URL` | Optional | Social links (hidden if blank) |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 ID, e.g. `G-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta Pixel ID |
| `ADMIN_PASSWORD` | **Yes** | Password for `/admin/orders` — **change from the default** |

### Assets to add (`public/` folder — see `public/README.md`)
- `logo.png` (used in JSON-LD)
- `og-default.jpg` (1200×630 social share image)
- `favicon.ico` (an `icon.svg` placeholder is included)
- Real product photos — then update image URLs in `src/lib/products.ts`

### Edit your content
- **Products:** `src/lib/products.ts` — add/edit objects in the `products` array.
- **Legal pages:** replace every `[Placeholder — ...]` note in
  `src/app/{privacy-policy,terms-and-conditions,shipping-policy,refund-policy}/page.tsx`
  with your real policies.
- **About/Contact:** fill in business details where placeholders are noted.

---

## Credentials you'll need

- **WhatsApp number** (required for ordering/support links).
- **Admin password** (set `ADMIN_PASSWORD`).
- **Google Analytics 4 ID** (optional, for analytics).
- **Meta Pixel ID** (optional, for ad tracking).
- A **Vercel account** (free tier is fine) and a **domain** to go live.

---

## How to deploy (Vercel — fastest)

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Framework preset: **Next.js** (auto-detected). No build changes needed.
4. Add Environment Variables (from the table above) in Project Settings →
   Environment Variables. **Important:** set `NEXT_PUBLIC_SITE_URL` to your final
   domain and set a strong `ADMIN_PASSWORD`.
5. Deploy. You'll get a `*.vercel.app` URL immediately.

> **Note on order storage:** This launch build stores orders in a JSON file.
> On Vercel's serverless filesystem, writes are **ephemeral** (not guaranteed to
> persist between deploys/instances). For reliable production order storage you
> should either (a) deploy on a host with a persistent disk (e.g. a small VPS,
> Render, Railway, or a long-running Node server), or (b) move the four functions
> in `src/lib/orders.ts` to a database (see "Version 2"). For a 1–2 day launch,
> many brands rely on **WhatsApp ordering** as the primary channel and use COD
> on a persistent host. Choose based on your expected volume.

### Connect your domain
1. In Vercel → Project → Settings → **Domains** → add your domain.
2. At your domain registrar, add the DNS records Vercel shows (usually an `A`
   record to Vercel's IP, or a `CNAME` for `www`).
3. Wait for DNS to propagate; Vercel issues HTTPS automatically.
4. Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy.

---

## How to submit to Google

1. **Google Search Console** → add your domain property → verify (DNS TXT record
   or the HTML tag method).
2. Submit your sitemap: enter `sitemap.xml` under **Sitemaps**
   (full URL: `https://yourdomain/sitemap.xml`).
3. Use **URL Inspection** → "Request indexing" for your homepage and key products.
4. **Google Analytics 4:** create a property, copy the `G-XXXX` ID into
   `NEXT_PUBLIC_GA_ID`, redeploy.
5. **Google Merchant Center** (later): create an account and a product feed to
   list products in Google Shopping.

Robots and sitemap are already live at `/robots.txt` and `/sitemap.xml`.

---

## How to test a COD order

1. Open the site, go to **Shop** → open a product → **Add to Cart**.
2. Go to **Cart** → **Proceed to Checkout**.
3. Fill the form (valid 10-digit mobile and 6-digit pincode are required) and
   **Place Order (COD)**.
4. You'll be redirected to **Order Confirmed** with an order number
   (format `AYM-YYYYMMDD-XXXX`).
5. Log in to **`/admin/orders`** with your `ADMIN_PASSWORD` to see the order and
   change its status (New → Confirmed → Shipped → Delivered / Cancelled).

Command-line smoke test (server running locally):

```bash
curl -X POST http://localhost:3000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customer":{"name":"Test","phone":"9876543210","address":"A","city":"B","state":"Delhi","pincode":"110001"},"items":[{"slug":"bhringraj-hair-oil","quantity":1}]}'
```

---

## How to add your first blog article

1. Create a new Markdown file in `content/blog/`, e.g.
   `content/blog/neem-for-scalp-care.md`.
2. Add frontmatter at the top, then write the article in Markdown:

```markdown
---
title: "Neem for Scalp Care"
category: "Ingredients"
date: "2026-02-01"
image: "/blog/neem.jpg"
excerpt: "A short summary that appears on the blog listing."
seoTitle: "Neem for Scalp Care | AYURM"
metaDescription: "Meta description for search engines."
---

## Your heading

Your content here. You can [link to products](/products/amla-neem-anti-hairfall-shampoo).
```

3. Save. The article automatically appears at `/blog/neem-for-scalp-care`, in the
   blog listing, in the homepage "latest" section, and in `sitemap.xml`.
   (On Vercel, redeploy to publish; locally it shows after a refresh.)

Valid categories: `Hair Care`, `Skin Care`, `Ingredients`, `Ayurveda & Wellness`.

---

## How to add a product

Edit `src/lib/products.ts` and append an object to the `products` array. Copy an
existing entry and change the fields. Set `featured: true` to show it on the
homepage. Images can be remote URLs or local files in `public/products/`.

---

## Project structure

```
content/blog/            Markdown blog articles
public/                  Static assets (add logo.png, og-default.jpg, product images)
src/app/                 Routes (App Router): pages + API routes
src/components/           Reusable UI (Header, Footer, ProductCard, ...)
src/lib/                  Data + logic (products, orders, blog, cart, whatsapp, seo, site, analytics)
data/orders.json         Order store (git-ignored, created at runtime)
```

Key design choices:
- **One WhatsApp config** (`NEXT_PUBLIC_WHATSAPP_NUMBER`) used everywhere via
  `src/lib/whatsapp.ts`.
- **Prices resolved server-side** in `/api/orders` — client prices are never trusted.
- **Analytics never block the site** — events no-op until IDs are set.
- **Order storage is a thin interface** (`src/lib/orders.ts`) — swap for a DB
  without changing any pages.

---

## Version 2 — what to add after launch

These were intentionally left out to launch fast. Suggested next steps:

1. **Database for orders** — replace the file store in `src/lib/orders.ts` with
   Supabase/Postgres (or similar). This is the most important upgrade for scale
   and reliable persistence on serverless hosts.
2. **Order notifications** — wire the hook in `/api/orders` to email the order to
   you (e.g. Resend) and/or send a WhatsApp Business API message.
3. **Online payments (Razorpay)** — add as an optional method alongside COD;
   keep secrets server-side only.
4. **Coupon codes** at checkout.
5. **Product reviews & ratings** (only real, verified reviews — never fake).
6. **Order tracking** page for customers.
7. **CMS for the blog** (e.g. Sanity/Contentful) replacing Markdown files.
8. **Customer accounts**, wishlist, and a richer admin dashboard.

---

## Security notes

- Change `ADMIN_PASSWORD` before launch; never commit `.env.local`.
- Payment credentials (when you add Razorpay) must stay server-side only.
- `/admin`, `/api`, `/checkout`, `/order-success` are disallowed in `robots.txt`.
```
