import type { Metadata } from "next";
import { ANALOGIES } from "@/content/analogies";
import { AnalogyBrowser } from "@/components/analogy-browser";

export const metadata: Metadata = {
  title: "Analogies",
  description:
    "Thirty-one comparisons between investing and casino gambling, each with what it explains, where it breaks down, and its sources.",
  alternates: { canonical: "/analogies" },
};

export default function AnalogiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="measure">
        <h1 className="display text-3xl sm:text-4xl">Analogies</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          {ANALOGIES.length} comparisons, ranked by how much they teach and how
          well they survive scrutiny. Every one states where it breaks down.
        </p>
      </header>

      <div className="mt-10">
        {/* Search and filtering run entirely client-side over the bundled
            content, so they work offline and need no request. */}
        <AnalogyBrowser analogies={ANALOGIES} />
      </div>
    </div>
  );
}
