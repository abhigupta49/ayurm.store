# Public assets to add before launch

Replace / add these files in the `public/` folder:

- `logo.png` — your brand logo (used in JSON-LD, ~512x512 PNG).
- `og-default.jpg` — default Open Graph share image (1200x630). Used when a page
  has no specific image.
- `favicon.ico` — browser tab icon. (An `icon.svg` placeholder is already here.)
- `/products/*.jpg` — your real product photos. Then update image URLs in
  `src/lib/products.ts` to point at e.g. `/products/aloe-vera-saffron-gel.jpg`.

Until `og-default.jpg` is added, social shares will reference a missing image —
this does not break the site, but adding it improves link previews.
