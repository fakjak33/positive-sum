import Link from "next/link";
import { ANALOGIES } from "@/content/analogies";
import { CITATION_LIST } from "@/content/citations";
import { annualDerived } from "@/lib/data";

const FEATURED = [
  "the-4-percent-jackpot",
  "house-edge-vs-fees",
  "red-or-black",
] as const;

export default function Home() {
  const featured = FEATURED.map(
    (slug) => ANALOGIES.find((a) => a.slug === slug)!
  );
  const positiveShare = ((annualDerived.positiveShare ?? 0) * 100).toFixed(0);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <h1 className="display max-w-4xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          Half of all stocks lose money.
          <br />
          The market still goes up.
        </h1>
        <p className="measure mt-8 text-lg leading-relaxed text-text-muted">
          Both of those are true. Understanding why is the difference between
          investing and gambling — and most of the arguments you have heard
          about it are missing a step.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/play/guess-odds"
            className="min-h-11 rounded-md bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Test your intuition
          </Link>
          <Link
            href="/analogies/the-4-percent-jackpot"
            className="min-h-11 rounded-md border border-border px-6 py-3 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            Start from the beginning
          </Link>
          <Link
            href="/analogies"
            className="min-h-11 rounded-md border border-border px-6 py-3 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            Browse the evidence
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-xs uppercase tracking-widest text-text-subtle">
            Three places to start
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {featured.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/analogies/${a.slug}`}
                  className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-surface-raised"
                >
                  <p className="tabular text-3xl text-text">{a.headline}</p>
                  <p className="mt-2 text-xs text-text-subtle">
                    {a.headlineCaption}
                  </p>
                  <h3 className="mt-6 text-base text-text">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {a.casinoComparison}
                  </p>
                  <span className="mt-4 text-xs text-market">
                    Open the interactive →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="display text-2xl sm:text-3xl">
                The argument in one line
              </h2>
              <p className="measure mt-5 text-base leading-relaxed text-text-muted">
                A casino is negative-sum by construction: every game has an edge
                built into its rules, so the aggregate result of everyone
                playing is a loss. A market is positive-sum because the things
                being traded are claims on businesses that produce goods and
                services.
              </p>
              <p className="measure mt-4 text-base leading-relaxed text-text-muted">
                Everything else on this site is a consequence of that one
                structural fact — including all the places where the comparison
                genuinely holds.
              </p>
              <Link
                href="/analogies/zero-sum-vs-positive-sum"
                className="mt-6 inline-block text-sm text-text underline decoration-border underline-offset-4 hover:decoration-text-muted"
              >
                Read the full case
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 self-start">
              <Fact value={String(ANALOGIES.length)} label="analogies, each with its limits stated" />
              <Fact value={String(CITATION_LIST.length)} label="cited sources with dates and assumptions" />
              <Fact value="16" label="interactives running on real data" />
              <Fact value={`${positiveShare}%`} label="of years since 1928 finished positive" />
            </div>
          </div>
        </div>
      </section>

      {/* Integrity */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="measure">
            <h2 className="display text-2xl">What this site will not do</h2>
            <p className="mt-5 text-base leading-relaxed text-text-muted">
              It will not tell you investing is just gambling, and it will not
              tell you investing is safe. It shows a crash that took
              twenty-nine years to recover, states that the long-horizon
              argument rests on about five independent observations, and marks
              a headline statistic as disputed where researchers disagree.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              Every analogy here has a panel saying where it breaks down. That
              panel is required — the site does not compile without it.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm text-text underline decoration-border underline-offset-4 hover:decoration-text-muted"
            >
              How this was built
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="tabular text-3xl text-text">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-text-subtle">{label}</p>
    </div>
  );
}
