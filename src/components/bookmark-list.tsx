"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/bookmarks";

export function BookmarkList() {
  const { items, toggle, ready } = useBookmarks();

  if (!ready) {
    return <div className="h-24 animate-pulse rounded-lg bg-surface" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <p className="text-text-muted">
        Nothing saved yet.{" "}
        <Link
          href="/analogies"
          className="text-text underline decoration-border underline-offset-4"
        >
          Browse the analogies
        </Link>{" "}
        and use the save button on any of them.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items
        .slice()
        .sort((a, b) => b.saved - a.saved)
        .map((b) => (
          <li
            key={b.slug}
            className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
          >
            <Link
              href={`/analogies/${b.slug}`}
              className="flex-1 text-sm text-text hover:underline"
            >
              {b.title}
            </Link>
            <button
              type="button"
              onClick={() => toggle(b.slug, b.title)}
              className="min-h-11 rounded-md border border-border px-3 text-xs text-text-muted hover:bg-surface-raised hover:text-text"
            >
              Remove
            </button>
          </li>
        ))}
    </ul>
  );
}
