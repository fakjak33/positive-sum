import type { Metadata } from "next";
import { BookmarkList } from "@/components/bookmark-list";

export const metadata: Metadata = {
  title: "Saved",
  description: "Analogies you have saved. Stored locally in your browser.",
  robots: { index: false, follow: true },
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="display text-3xl sm:text-4xl">Saved</h1>
      <p className="measure mt-4 text-text-muted">
        Stored in this browser only. There is no account and nothing is sent
        anywhere.
      </p>
      <div className="mt-8">
        <BookmarkList />
      </div>
    </div>
  );
}
