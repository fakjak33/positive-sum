import type { MetadataRoute } from "next";
import { ANALOGIES } from "@/content/analogies";
import { SITE } from "@/lib/site";

// Required by `output: "export"` — see robots.ts.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/analogies", "/play", "/sources", "/about"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const analogyRoutes = ANALOGIES.map((a) => ({
    url: `${SITE.url}/analogies/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: a.tier === 1 ? 0.9 : 0.6,
  }));

  const playRoutes = ANALOGIES.filter((a) => a.interactive).map((a) => ({
    url: `${SITE.url}/play/${a.interactive}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // /bookmarks is intentionally excluded — it is per-device and noindex.
  return [...staticRoutes, ...analogyRoutes, ...playRoutes];
}
