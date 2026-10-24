import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { getPageHtml } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "AYURM privacy policy: what information we collect and how we use it.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const { title, html } = await getPageHtml("privacy-policy");
  return (
    <LegalPage title={title} path="/privacy-policy">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}
