import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Method",
  description:
    "How this site is built, what it claims, what it does not claim, and how to check it.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="display text-3xl sm:text-4xl">Method</h1>

      <div className="measure mt-8 space-y-10 text-base leading-relaxed text-text-muted">
        <section>
          <h2 className="display text-xl text-text">The argument</h2>
          <p className="mt-3">
            A casino is negative-sum by construction. Every game has an edge
            built into its rules, and the aggregate result of everyone playing
            is a loss equal to that edge. A stock market is positive-sum
            because the things being traded are claims on businesses that
            produce goods and services. The aggregate result of everyone owning
            the market is whatever those businesses earn.
          </p>
          <p className="mt-3">
            That single structural difference is the whole argument. Everything
            else here is a consequence of it.
          </p>
        </section>

        <section>
          <h2 className="display text-xl text-text">
            Why bother with the comparison at all
          </h2>
          <p className="mt-3">
            Because the statistical shapes really are alike, and pretending
            otherwise makes the honest case weaker rather than stronger. Most
            individual stocks lose money. A few outcomes dominate the result.
            Most active managers underperform. Costs compound relentlessly.
            Nearly every documented gambling bias shows up in investor
            behaviour. All of that is true and none of it is comfortable.
          </p>
          <p className="mt-3">
            An argument that only presents the flattering half of the evidence
            is not education. So this site catalogues the similarities as
            carefully as it can, and then shows exactly where each one stops.
          </p>
        </section>

        <section>
          <h2 className="display text-xl text-text">Rules this site follows</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-text-subtle"
              />
              <span>
                <span className="text-text">No invented statistics.</span> Every
                figure names a publisher, a date and a URL. Anything that could
                not be traced was cut rather than softened.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-text-subtle"
              />
              <span>
                <span className="text-text">
                  Assumptions travel with the number.
                </span>{" "}
                Nominal or real, total return or price return, before or after
                fees and tax. These qualifiers change the number, so they are
                shown with it.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-text-subtle"
              />
              <span>
                <span className="text-text">
                  Every analogy states where it fails.
                </span>{" "}
                This is enforced by the type system: an analogy without a
                non-empty list of limitations does not compile.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-text-subtle"
              />
              <span>
                <span className="text-text">
                  Disputed findings are shown as disputed.
                </span>{" "}
                Where researchers disagree — the investor behaviour gap is the
                clearest case — both sides appear together.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-text-subtle"
              />
              <span>
                <span className="text-text">Simulations use real data.</span>{" "}
                Portfolio simulations resample actual historical returns rather
                than drawing from a fitted curve, because a tidy distribution
                would quietly delete the extreme outcomes that drive the whole
                result. Where something is modelled rather than observed, the
                page says so.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display text-xl text-text">Known limitations</h2>
          <p className="mt-3">
            The historical data is overwhelmingly American. The US was the most
            successful equity market of the twentieth century, and several
            national markets went to zero over the same period, so using this
            record to estimate the odds of owning stocks is itself a
            survivorship bias — the same error as surveying only the gamblers
            still at the table.
          </p>
          <p className="mt-3">
            The constituent data uses current index membership applied
            backwards, which flatters the results by excluding companies that
            were dropped. The daily series is a price index and excludes
            dividends. The long monthly series ends in September 2023, where
            its inflation data stops. Each of these is noted on the pages that
            depend on it.
          </p>
        </section>

        <section>
          <h2 className="display text-xl text-text">What this is not</h2>
          <p className="mt-3">
            This is not financial advice, and it does not recommend any
            product, provider, or course of action. It criticises fees without
            suggesting where to go instead, and shows active managers
            underperforming without naming a fund.
          </p>
          <p className="mt-3">
            It also does not claim investing is safe. One page shows a
            twenty-nine-year recovery. Another shows how the same average
            return produces opposite outcomes for a retiree depending on the
            order it arrives in. A third points out that the long-horizon
            argument rests on about five independent observations.
          </p>
        </section>

        <section>
          <h2 className="display text-xl text-text">Checking the work</h2>
          <p className="mt-3">
            Every source is listed on the{" "}
            <Link
              href="/sources"
              className="text-text underline decoration-border underline-offset-4"
            >
              sources page
            </Link>
            , with its sample period and assumptions. The datasets are
            committed to the repository with provenance headers. The simulation
            code is tested against published figures — the fee calculations
            reproduce the SEC&rsquo;s own illustration, and if they ever stop
            doing so the build fails.
          </p>
        </section>
      </div>
    </div>
  );
}
