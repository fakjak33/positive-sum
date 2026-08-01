"use client";

import { useBookmarks } from "@/lib/bookmarks";

export function BookmarkButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const { toggle, has, ready } = useBookmarks();
  const saved = ready && has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug, title)}
      aria-pressed={saved}
      className={`flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
        saved
          ? "border-rare/40 text-rare"
          : "border-border text-text-muted hover:bg-surface hover:text-text"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
