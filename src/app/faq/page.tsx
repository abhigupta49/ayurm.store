import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Frequently asked questions about AYURM orders, Cash on Delivery, shipping and WhatsApp support.",
  path: "/faq",
});

const FAQS = [
  { q: "Do you offer Cash on Delivery?", a: "Yes. Cash on Delivery (COD) is available across most serviceable pincodes in India." },
  { q: "Can I order on WhatsApp?", a: "Absolutely. Use the 'Order on WhatsApp' button on any product or in your cart, and our team will help you place the order." },
  { q: "How long does delivery take?", a: "Orders are typically dispatched within 2–4 business days. Delivery timelines vary by location." },
  { q: "Do I need an account to order?", a: "No account is needed. Simply add products to your cart and check out with your delivery details." },
  { q: "How can I track my order?", a: "For order status, please contact us on WhatsApp with your order number." },
  { q: "What is your return policy?", a: "Please see our Refund & Cancellation Policy page for full details." },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-px section">
      <JsonLd data={faqJsonLd} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">Frequently Asked Questions</h1>
        <dl className="mt-8 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="card p-6">
              <dt className="font-semibold text-forest-800">{f.q}</dt>
              <dd className="mt-2 text-ink/70">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
