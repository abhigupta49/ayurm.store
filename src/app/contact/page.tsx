import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { whatsappChatLink } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with AYURM. Reach us on WhatsApp or by email for product help and order support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">Contact AYURM</h1>
        <p className="mt-4 text-ink/70">
          We&apos;re happy to help with product questions or your order. The fastest
          way to reach us is on WhatsApp.
        </p>

        <div className="mt-8 space-y-4">
          <div className="card p-6">
            <h2 className="text-lg">WhatsApp</h2>
            <p className="mt-1 text-sm text-ink/60">Chat with us for quick help and ordering.</p>
            <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4">
              Chat on WhatsApp
            </a>
          </div>

          <div className="card p-6">
            <h2 className="text-lg">Email</h2>
            <p className="mt-1 text-sm text-ink/60">For detailed queries, email us anytime.</p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="btn-outline mt-4">
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm text-ink/50">
          Business address and support hours will be added here. <em>[Placeholder — add your details.]</em>
        </p>
      </div>
    </div>
  );
}
