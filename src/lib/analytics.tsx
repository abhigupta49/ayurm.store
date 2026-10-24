"use client";

// Lightweight analytics wrapper. Safely no-ops when GA/Pixel are not
// configured, so missing credentials never break the site.

type Params = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Map our generic events to GA4 + Meta Pixel standard event names.
const META_EVENT_MAP: Record<string, string> = {
  page_view: "PageView",
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  whatsapp_click: "Contact",
};

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) {
      window.gtag("event", event, params);
    }
    if (window.fbq) {
      const metaEvent = META_EVENT_MAP[event];
      if (metaEvent) {
        window.fbq("track", metaEvent, params);
      } else {
        window.fbq("trackCustom", event, params);
      }
    }
  } catch {
    /* never throw from analytics */
  }
}
