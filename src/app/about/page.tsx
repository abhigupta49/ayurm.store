import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { whatsappChatLink } from "@/lib/whatsapp";
import { getPageHtml } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "About",
  description: "AYURM is modern personal care inspired by traditional Indian ingredients. Learn about our story.",
  path: "/about",
});

export default async function AboutPage() {
  const { title, html } = await getPageHtml("about");

  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        <div className="prose-ayurm mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">Shop Products</Link>
          <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Chat on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
