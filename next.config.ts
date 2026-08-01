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

  // Static hosts (GitHub Pages in particular) serve directories, not
  // extensionless files, so emit /about/index.html rather than /about.html.
  trailingSlash: true,

  images: {
    // No image optimisation server exists in a static export. The site uses
    // no <Image> components today; this keeps it honest if one is added.
    unoptimized: true,
  },
};

export default nextConfig;
