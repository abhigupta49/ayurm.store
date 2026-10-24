import Link from "next/link";
import Logo from "./Logo";
import { siteConfig } from "@/lib/site";
import { whatsappChatLink } from "@/lib/whatsapp";

const COLS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms & Conditions" },
    ],
  },
];

export default function Footer() {
  const socials = [
    { href: siteConfig.social.instagram, label: "Instagram" },
    { href: siteConfig.social.facebook, label: "Facebook" },
    { href: siteConfig.social.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-10 border-t border-cream-200 bg-cream-100">
      <div className="container-px grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink/70">
            Modern personal care inspired by traditional Indian ingredients.
          </p>
          <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-5">
            Chat on WhatsApp
          </a>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-forest-800">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink/70 hover:text-forest-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-cream-200">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-sm text-ink/60 sm:flex-row">
          <p>© {new Date().getFullYear()} AYURM. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-forest-600">
              {siteConfig.contactEmail}
            </a>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-forest-600">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
