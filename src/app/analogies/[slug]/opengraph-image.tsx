import { ImageResponse } from "next/og";
import { ANALOGIES, getAnalogy } from "@/content/analogies";
import { CATEGORY_LABELS } from "@/content/types";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ANALOGIES.map((a) => ({ slug: a.slug }));
}

// In Next 16 the image generation function receives `params` as a Promise,
// aligned with the async request APIs.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAnalogy(slug);

  const headline = a?.headline ?? SITE.name;
  const caption = a?.headlineCaption ?? SITE.tagline;
  const title = a?.title ?? SITE.name;
  const category = a ? CATEGORY_LABELS[a.category] : "";

  return new ImageResponse(
    (
      // ImageResponse supports flexbox only — no grid.
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d0f",
          padding: 72,
          color: "#f2f0eb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7d8691",
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              marginTop: 28,
              color: "#10b981",
              lineHeight: 1,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              marginTop: 20,
              color: "#9ba4ae",
              maxWidth: 900,
            }}
          >
            {caption}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 46, maxWidth: 1000 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 24,
              color: "#7d8691",
            }}
          >
            {SITE.name} — every analogy states where it breaks down
          </div>
        </div>
      </div>
    ),
    size
  );
}
