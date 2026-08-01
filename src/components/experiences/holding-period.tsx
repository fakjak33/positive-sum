"use client";

import { useMemo, useState } from "react";
import {
  annualReturnValues,
  annualMeta,
  casinoMeta,
  AMERICAN_ROULETTE_EDGE,
} from "@/lib/data";
import {
  holdingPeriodStats,
  probabilityAheadAfterBets,
} from "@/lib/sim/timing";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

const LENGTHS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30];
const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

/**
 * Time in the Market.
 *
 * Two curves driven by the same theorem, running in opposite directions. This
 * is the clearest single statement of the site's thesis, so it also carries
 * the heaviest caveats — the market curve is an empirical frequency from a
 * very small effective sample, not a law.
 */
export function HoldingPeriod() {
  const [years, setYears] = useState(10);

  const stats = useMemo(
    () => holdingPeriodStats(annualReturnValues, LENGTHS),
    []
  );

  const marketSeries = {
    label: "Chance a US stock holding finished positive",
    color: "var(--gain)",
    points: stats.map((s) => ({ x: s.years, y: s.positiveShare * 100 })),
  };

  // One "bet" per year keeps both curves on a shared x-axis. A real gambler
  // places far more than one bet a year, so the casino curve shown here is
  // dramatically kinder than reality.
  const casinoSeries = {
    label: "Chance a roulette player is ahead (1 bet/year)",
    color: "var(--loss)",
    dashed: true,
    points: LENGTHS.map((n) => ({
      x: n,
      y: probabilityAheadAfterBets(AMERICAN_ROULETTE_EDGE, 0.99, n) * 100,
    })),
  };

  const current = stats.find((s) => s.years === years) ?? stats[0];
  const casinoNow =
    probabilityAheadAfterBets(AMERICAN_ROULETTE_EDGE, 0.99, years) * 100;

  const nonOverlapping = Math.floor(annualReturnValues.length / years);

  return (
    <ExperienceFrame
      title="The same theorem, pointed in opposite directions"
      intro="The law of large numbers pulls repeated outcomes toward their expected value. That is why time helps one of these and destroys the other."
      datasets={[annualMeta, casinoMeta]}
    >
      <div>
        <label
          htmlFor="years"
          className="flex items-baseline justify-between text-sm"
        >
          <span className="text-text-muted">Holding period</span>
          <span className="tabular text-text">
            {years} year{years > 1 ? "s" : ""}
          </span>
        </label>
        <input
          id="years"
          type="range"
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
        />
      </div>

      <div className="mt-6">
        <Curves
          series={[marketSeries, casinoSeries]}
          formatX={(n) => `${n}y`}
          formatY={(n) => `${n.toFixed(0)}%`}
          yFromZero
          ariaLabel={`Probability of being ahead against holding period. Over ${years} years, ${pct(current.positiveShare)} of historical stock windows finished positive, against ${casinoNow.toFixed(1)} percent for a roulette player.`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-gain/30 bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Holding US stocks for {years} year{years > 1 ? "s" : ""}
          </p>
          <p className="tabular mt-2 text-3xl text-gain">
            {pct(current.positiveShare)}
          </p>
          <p className="mt-2 text-xs text-text-subtle">
            of {current.windows} historical windows finished positive. Worst{" "}
            {pct(current.worst)}, best {pct(current.best)}.
          </p>
        </div>
        <div className="rounded-lg border border-loss/30 bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Roulette, one bet a year for {years} year{years > 1 ? "s" : ""}
          </p>
          <p className="tabular mt-2 text-3xl text-loss">
            {casinoNow.toFixed(1)}%
          </p>
          <p className="mt-2 text-xs text-text-subtle">
            chance of being ahead. It only falls from here, and a real player
            bets far more than once a year.
          </p>
        </div>
      </div>

      <DataTable
        caption="Share of historical US stock holding periods that finished positive, nominal total return."
        columns={["Years", "Windows", "Positive", "Worst", "Median", "Best"]}
        rows={stats.map((s) => [
          s.years,
          s.windows,
          pct(s.positiveShare),
          pct(s.worst),
          pct(s.median),
          pct(s.best),
        ])}
      />

      <div className="mt-6 rounded-lg border border-rare/30 bg-rare/5 p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-rare">
          Three caveats this chart cannot draw
        </p>
        <ul className="measure mt-3 space-y-2.5 text-sm leading-relaxed text-text-muted">
          <li>
            <span className="text-text">The windows overlap.</span> There are{" "}
            {current.windows} {years}-year windows in this data but only{" "}
            {nonOverlapping} genuinely independent ones. At the long end the
            smooth curve rests on a handful of observations, not hundreds.
          </li>
          <li>
            <span className="text-text">These are nominal returns.</span>{" "}
            Inflation-adjusted, the picture is worse — real 20-year holding
            periods have been negative, most notably for anyone who bought in
            the late 1960s.
          </li>
          <li>
            <span className="text-text">
              This is the winning market, chosen after the fact.
            </span>{" "}
            The US was the most successful equity market of the twentieth
            century. Several national markets went to zero over the same
            period. Using US history to estimate the odds of owning stocks is
            itself a survivorship bias — the same error as asking only the
            gamblers still at the table.
          </li>
        </ul>
      </div>
    </ExperienceFrame>
  );
}
