import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { getPageHtml } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Refund & Cancellation Policy",
  description: "AYURM refund and cancellation policy: order cancellation, returns and refunds.",
  path: "/refund-policy",
});

export default async function RefundPolicyPage() {
  const { title, html } = await getPageHtml("refund-policy");
  return (
    <LegalPage title={title} path="/refund-policy">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}
