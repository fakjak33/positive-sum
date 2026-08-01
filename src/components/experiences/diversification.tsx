"use client";

import { useMemo, useState } from "react";
import {
  constituentReturns,
  constituentsMeta,
  constituentYears,
  casinoMeta,
  AMERICAN_ROULETTE_EDGE,
} from "@/lib/data";
import { simulatePortfolios, histogram } from "@/lib/sim/portfolio";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DistributionChart } from "@/components/charts/distribution";
import { DataTable } from "@/components/ui/data-table";

const SIZES = [1, 5, 20, 100, 500] as const;
const DRAWS = 5000;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/**
 * How Many Stocks Is Enough.
 *
 * Monte Carlo over the real cross-section: each simulated portfolio picks N
 * companies at random and equal-weights them. Resampling real returns rather
 * than a fitted distribution is essential — the cross-section is violently
 * skewed and any tidy parametric fit would delete the extreme winners that
 * drive the whole result.
 *
 * The casino column runs the identical operation on a negative-expectancy
 * game, which is the entire lesson: diversification narrows the distribution
 * in both places and only moves the destination in one of them.
 */
export function Diversification() {
  const [size, setSize] = useState<number>(1);
  const [seed, setSeed] = useState(4242);

  const result = useMemo(
    () => simulatePortfolios(constituentReturns, size, DRAWS, seed),
    [size, seed]
  );

  const bins = useMemo(() => histogram(result.outcomes, 44), [result]);

  // All five sizes, for the comparison table.
  const allSizes = useMemo(
    () =>
      SIZES.map((n) => ({
        n,
        ...simulatePortfolios(constituentReturns, n, 2000, seed),
      })),
    [seed]
  );

  const marketMean =
    constituentReturns.reduce((a, b) => a + b, 0) / constituentReturns.length;

  return (
    <ExperienceFrame
      title="Build a portfolio, then run it 5,000 times"
      intro={`Each run picks companies at random from the real S&P 500 cross-section (${constituentYears[0]}–${constituentYears[constituentYears.length - 1]}, every company-year pooled) and weights them equally. Watch the spread of outcomes narrow as you add holdings — and watch where the centre stays.`}
      datasets={[constituentsMeta, casinoMeta]}
      seed={seed}
      onReseed={() => setSeed((s) => s + 1)}
    >
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Number of stocks in the portfolio"
      >
        {SIZES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setSize(n)}
            aria-pressed={size === n}
            className={`min-h-11 rounded-md border px-4 text-sm transition-colors ${
              size === n
                ? "border-text bg-text text-bg"
                : "border-border text-text-muted hover:bg-surface-raised hover:text-text"
            }`}
          >
            {n === 500 ? "All 500" : `${n} stock${n > 1 ? "s" : ""}`}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DistributionChart
          bins={bins}
          markers={[{ value: marketMean, label: "index", tone: "var(--market)" }]}
          ariaLabel={`Distribution of ${DRAWS} simulated ${size}-stock portfolios. Median ${pct(result.median)}, 5th percentile ${pct(result.p5)}, 95th percentile ${pct(result.p95)}. ${pct(result.lossShare)} lost money.`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Stat label="Median outcome" value={pct(result.median)} />
        <Stat
          label="Worst 5% below"
          value={pct(result.p5)}
          tone={result.p5 < 0 ? "text-loss" : undefined}
        />
        <Stat label="Best 5% above" value={pct(result.p95)} tone="text-gain" />
        <Stat
          label="Lost money"
          value={pct(result.lossShare)}
          tone={result.lossShare > 0.3 ? "text-loss" : undefined}
        />
      </div>

      <DataTable
        caption={`Simulated portfolio outcomes by number of holdings, ${DRAWS} runs each, drawn from real company-year returns ${constituentYears[0]}–${constituentYears[constituentYears.length - 1]}.`}
        columns={["Holdings", "5th pct", "Median", "95th pct", "Spread", "Lost money"]}
        rows={allSizes.map((r) => [
          r.n === 500 ? "All 500" : r.n,
          pct(r.p5),
          pct(r.median),
          pct(r.p95),
          pct(r.p95 - r.p5),
          pct(r.lossShare),
        ])}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Spreading bets in a market
          </p>
          <p className="measure mt-2 text-sm leading-relaxed text-text-muted">
            Going from 1 holding to 20 cuts the gap between the best and worst
            5% of outcomes from{" "}
            <span className="tabular text-text">
              {pct(allSizes[0].p95 - allSizes[0].p5)}
            </span>{" "}
            to{" "}
            <span className="tabular text-text">
              {pct(allSizes[2].p95 - allSizes[2].p5)}
            </span>
            . The centre of the distribution barely moves.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Spreading bets in a casino
          </p>
          <p className="measure mt-2 text-sm leading-relaxed text-text-muted">
            The same operation on American roulette narrows the spread exactly
            as effectively — and leaves the expected value pinned at{" "}
            <span className="tabular text-loss">
              −{(AMERICAN_ROULETTE_EDGE * 100).toFixed(2)}%
            </span>{" "}
            however many numbers you cover. Diversification is a risk tool, not
            an expectancy tool. It cannot rescue a negative edge.
          </p>
        </div>
      </div>

      <p className="measure mt-6 text-sm leading-relaxed text-text-subtle">
        One caveat the chart cannot show: variance settles down far faster than
        your chance of owning the rare enormous winners. A 30-stock portfolio
        looks well diversified here and is still very likely to miss every
        company in the top few percent that drives long-run wealth creation.
      </p>
    </ExperienceFrame>
  );
}

function Stat({
  label,
  value,
  tone = "text-text",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <p className="text-xs uppercase tracking-widest text-text-subtle">
        {label}
      </p>
      <p className={`tabular mt-1.5 text-xl ${tone}`}>{value}</p>
    </div>
  );
}
