import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="display text-3xl">You are offline</h1>
      <p className="measure mt-4 text-text-muted">
        This page has not been visited before, so there is no cached copy of it.
        Pages you have already opened will still work — everything here runs on
        data bundled with the app rather than fetched from a server.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="min-h-11 rounded-md border border-border px-5 py-3 text-sm text-text-muted hover:bg-surface hover:text-text"
        >
          Home
        </Link>
        <Link
          href="/analogies"
          className="min-h-11 rounded-md border border-border px-5 py-3 text-sm text-text-muted hover:bg-surface hover:text-text"
        >
          Analogies
        </Link>
      </div>
    </div>
  );
}
