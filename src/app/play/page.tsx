import type { Metadata } from "next";
import Link from "next/link";
import { ANALOGIES } from "@/content/analogies";
import { CATEGORY_LABELS } from "@/content/types";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Sixteen interactive experiences built on real historical market data and published casino odds.",
  alternates: { canonical: "/play" },
};

export default function PlayPage() {
  const interactive = ANALOGIES.filter((a) => a.interactive);
  const tier1 = interactive.filter((a) => a.tier === 1);
  const tier2 = interactive.filter((a) => a.tier === 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="measure">
        <h1 className="display text-3xl sm:text-4xl">Play</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          Every simulation here runs on real data — actual constituent returns,
          actual daily closes, published house edges — and every run is seeded,
          so you can share the exact result you saw.
        </p>
      </header>

      <Section title="Start here" items={tier1} />
      <Section title="Shorter pieces" items={tier2} />
    </div>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: readonly (typeof ANALOGIES)[number][];
}) {
  return (
    <section className="mt-12">
      <h2 className="text-xs uppercase tracking-widest text-text-subtle">
        {title}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/play/${a.interactive}`}
              className="flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-raised"
            >
              <h3 className="text-base text-text">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {a.casinoComparison}
              </p>
              <span className="mt-4 text-xs text-text-subtle">
                {CATEGORY_LABELS[a.category]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
