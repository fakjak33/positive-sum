import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Required by `output: "export"` — metadata routes must declare themselves
// static, since there is no server to generate them on request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/bookmarks" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
