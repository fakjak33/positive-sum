import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="measure">
            <p className="display text-lg text-text">{SITE.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Educational material, not financial advice. Every statistic on
              this site is cited to a named source with a publication date.
              Where the evidence is disputed, the dispute is shown.
            </p>
          </div>
          <nav aria-label="Footer" className="flex gap-6 text-sm">
            <Link href="/sources" className="text-text-muted hover:text-text">
              Sources
            </Link>
            <Link href="/about" className="text-text-muted hover:text-text">
              Method
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
