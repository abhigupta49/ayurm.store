import Breadcrumbs from "./Breadcrumbs";
import { siteConfig } from "@/lib/site";

export default function LegalPage({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-px section">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink/50">Last updated: on launch</p>
        <div className="prose-ayurm mt-6">{children}</div>
        <p className="mt-10 text-sm text-ink/50">
          Questions? Email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-forest-600 underline">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
