// Central site configuration. All values come from env with safe fallbacks
// so the site runs even before you've filled in real credentials.

export const siteConfig = {
  name: "AYURM",
  // No trailing slash.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ayurm.in").replace(/\/$/, ""),
  description:
    "Modern personal care inspired by traditional Indian ingredients. Thoughtfully formulated hair and skin care, with easy Cash on Delivery and WhatsApp ordering.",
  tagline: "Nature-inspired care, made for everyday you.",
  // WhatsApp number in international format, digits only (e.g. 919876543210).
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "ADD_NUMBER_HERE",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@ayurm.in",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  },
};

export type SiteConfig = typeof siteConfig;

/** True when a real WhatsApp number has been configured. */
export function isWhatsAppConfigured(): boolean {
  return /^\d{8,15}$/.test(siteConfig.whatsappNumber);
}
