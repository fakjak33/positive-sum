import type { NextConfig } from "next";

/**
 * The whole site is prerendered — there is no server-side runtime, no
 * database and no API. `output: "export"` makes that explicit and emits a
 * plain folder of HTML/CSS/JS in `out/`, which any static host will serve:
 * Vercel, GitHub Pages, Netlify, Cloudflare Pages, or a USB stick.
 *
 * Nothing here depends on Vercel specifically.
 */
const nextConfig: NextConfig = {
  output: "export",

  // NOTE: do not set `trailingSlash: true` here without re-testing share
  // cards. It makes the host redirect the extensionless metadata image
  // (/analogies/<slug>/opengraph-image) into a 308 loop, which silently
  // breaks every Open Graph preview. Verified against the live deployment.
  //
  // If this site is ever moved to GitHub Pages — which serves directories
  // rather than extensionless files — trailingSlash will be needed, and the
  // OG images will need a real .png extension to compensate.

  images: {
    // No image optimisation server exists in a static export. The site uses
    // no <Image> components today; this keeps it honest if one is added.
    unoptimized: true,
  },
};

export default nextConfig;
