import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { getPageHtml } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "AYURM terms and conditions of use and sale.",
  path: "/terms-and-conditions",
});

export default async function TermsPage() {
  const { title, html } = await getPageHtml("terms-and-conditions");
  return (
    <LegalPage title={title} path="/terms-and-conditions">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}
