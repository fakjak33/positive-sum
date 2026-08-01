"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { Analogy, Category } from "@/content/types";
import { CATEGORY_LABELS } from "@/content/types";
import { useBookmarks } from "@/lib/bookmarks";

type Props = { analogies: readonly Analogy[] };

/**
 * The analogy index: search, category filter and bookmark filter.
 *
 * Fuse runs over the bundled content in the browser — no request, works
 * offline, and searches the explanation and breakdown text as well as titles,
 * so you can find an analogy by the objection you remember rather than the
 * name you don't.
 */
export function AnalogyBrowser({ analogies }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [onlySaved, setOnlySaved] = useState(false);
  const { has, ready } = useBookmarks();

  const fuse = useMemo(
    () =>
      new Fuse(analogies as Analogy[], {
        keys: [
          { name: "title", weight: 3 },
          { name: "headline", weight: 2 },
          { name: "marketStat", weight: 2 },
          { name: "casinoComparison", weight: 2 },
          { name: "tags", weight: 2 },
          { name: "explanation", weight: 1 },
          { name: "breaksDownBecause", weight: 1 },
        ],
        threshold: 0.36,
        ignoreLocation: true,
      }),
    [analogies]
  );

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...analogies];
    if (category) list = list.filter((a) => a.category === category);
    if (onlySaved && ready) list = list.filter((a) => has(a.slug));
    return list;
  }, [query, category, onlySaved, fuse, analogies, has, ready]);

  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label htmlFor="search" className="sr-only">
          Search analogies
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search — try 'skew', 'fees', 'gambler's fallacy'…"
          className="min-h-11 w-full rounded-md border border-border bg-surface px-4 text-sm text-text placeholder:text-text-subtle"
        />

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={category === null}
            onClick={() => setCategory(null)}
          >
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {CATEGORY_LABELS[c]}
            </FilterChip>
          ))}
          <FilterChip
            active={onlySaved}
            onClick={() => setOnlySaved((v) => !v)}
          >
            Saved
          </FilterChip>
        </div>
      </div>

      <p className="mt-6 text-sm text-text-subtle" role="status" aria-live="polite">
        {results.length} of {analogies.length}
      </p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/analogies/${a.slug}`}
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-raised"
            >
              <p className="tabular text-2xl text-text">{a.headline}</p>
              <p className="mt-1 text-xs text-text-subtle">
                {a.headlineCaption}
              </p>
              <h2 className="mt-4 text-base leading-snug text-text">
                {a.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                {a.casinoComparison}
              </p>
              <div className="mt-4 flex items-center gap-2 pt-2 text-xs text-text-subtle">
                <span className="rounded border border-border px-2 py-0.5">
                  {CATEGORY_LABELS[a.category]}
                </span>
                {a.interactive && (
                  <span className="text-market">interactive</span>
                )}
                {ready && has(a.slug) && (
                  <span className="ml-auto text-rare" aria-label="Saved">
                    ★
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">
          Nothing matched. Try a broader term, or clear the filters.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-md border px-3 text-xs transition-colors ${
        active
          ? "border-text bg-text text-bg"
          : "border-border text-text-muted hover:bg-surface hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
