import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { getPageHtml } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Shipping Policy",
  description: "AYURM shipping policy: dispatch times, delivery timelines, charges and Cash on Delivery.",
  path: "/shipping-policy",
});

export default async function ShippingPolicyPage() {
  const { title, html } = await getPageHtml("shipping-policy");
  return (
    <LegalPage title={title} path="/shipping-policy">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}
