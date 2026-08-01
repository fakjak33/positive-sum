"use client";

import { useMemo, useState } from "react";
import { dailyCloses, dailyMeta } from "@/lib/data";
import { missingDays } from "@/lib/sim/timing";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

const MAX = 30;
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * Missing the Best Days — and the mirror the statistic is usually shown without.
 *
 * The one-sided version of this chart is a sales pitch. Best and worst days
 * cluster in the same volatile weeks, so an investor who could dodge one could
 * very likely dodge the other. The toggle is not a bonus feature; it is the
 * analogy, and the default view shows both series at once.
 */
export function BestDays() {
  const [removed, setRemoved] = useState(10);

  const best = useMemo(() => missingDays(dailyCloses, MAX, "best"), []);
  const worst = useMemo(() => missingDays(dailyCloses, MAX, "worst"), []);

  const from = dailyCloses[0]?.date ?? "";
  const to = dailyCloses[dailyCloses.length - 1]?.date ?? "";

  const bestSeries = {
    label: "Missing the best days",
    color: "var(--loss)",
    points: best.map((r) => ({ x: r.daysRemoved, y: r.annualised * 100 })),
  };
  const worstSeries = {
    label: "Missing the worst days",
    color: "var(--gain)",
    dashed: true,
    points: worst.map((r) => ({ x: r.daysRemoved, y: r.annualised * 100 })),
  };

  const b = best[removed];
  const w = worst[removed];
  const full = best[0];

  return (
    <ExperienceFrame
      title={`${dailyCloses.length.toLocaleString()} trading days, ${from.slice(0, 4)}–${to.slice(0, 4)}`}
      intro="Remove the strongest days one at a time and watch a thirty-year return collapse. Then look at the other line."
      datasets={[dailyMeta]}
    >
      <div>
        <label
          htmlFor="removed"
          className="flex items-baseline justify-between text-sm"
        >
          <span className="text-text-muted">Days removed</span>
          <span className="tabular text-text">{removed}</span>
        </label>
        <input
          id="removed"
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={removed}
          onChange={(e) => setRemoved(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
          aria-valuetext={`${removed} days removed`}
        />
      </div>

      <div className="mt-6">
        <Curves
          series={[bestSeries, worstSeries]}
          formatX={(n) => `${n}`}
          formatY={(n) => `${n.toFixed(0)}%`}
          baseline={full?.annualised ? full.annualised * 100 : 0}
          ariaLabel={`Annualised return against number of days removed. Removing the ${removed} best days lowers it from ${pct(full.annualised)} to ${pct(b.annualised)}. Removing the ${removed} worst days raises it to ${pct(w.annualised)}.`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Stayed invested
          </p>
          <p className="tabular mt-1.5 text-2xl text-text">
            {pct(full.annualised)}
          </p>
          <p className="tabular mt-1 text-xs text-text-subtle">
            {money(full.endingValue)} from {money(10000)}
          </p>
        </div>
        <div className="rounded-lg border border-loss/30 bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Missed the {removed} best
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">
            <span aria-hidden="true">▼</span> {pct(b.annualised)}
          </p>
          <p className="tabular mt-1 text-xs text-text-subtle">
            {money(b.endingValue)}
          </p>
        </div>
        <div className="rounded-lg border border-gain/30 bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Missed the {removed} worst
          </p>
          <p className="tabular mt-1.5 text-2xl text-gain">
            <span aria-hidden="true">▲</span> {pct(w.annualised)}
          </p>
          <p className="tabular mt-1 text-xs text-text-subtle">
            {money(w.endingValue)}
          </p>
        </div>
      </div>

      <DataTable
        caption={`Annualised return after removing the N best or worst trading days, ${from} to ${to}.`}
        columns={["Days removed", "Missing best", "Missing worst", "Gap"]}
        rows={[0, 5, 10, 15, 20, 25, 30].map((n) => [
          n,
          pct(best[n].annualised),
          pct(worst[n].annualised),
          pct(worst[n].annualised - best[n].annualised),
        ])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The usual version of this chart shows only the red line, and concludes
          that you must never sell. The green line is the same calculation run
          the other way, and it is just as dramatic.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">
            Both lines are true, and neither is achievable.
          </span>{" "}
          The best and worst days cluster in the same handful of volatile weeks
          — most of the biggest up days happen during bear markets. Anyone who
          could reliably sidestep one would sidestep the other. The honest
          conclusion is not &ldquo;never sell&rdquo; but &ldquo;returns arrive
          in bursts, and the bursts are not forecastable.&rdquo;
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-subtle">
          There is also no casino equivalent here at all. Roulette spins are
          independent and identically distributed — there are no &ldquo;best
          spins&rdquo; whose absence changes your expected result. This is one
          of the places where the analogy simply has nothing to say.
        </p>
      </div>

      <p className="mt-4 text-xs text-text-subtle">
        Computed on the price index, which excludes dividends, so the levels
        here sit below the total-return figures Hartford Funds publishes. The
        shape and the size of the gap are what the interactive is about.
        Removing a day means treating it as a flat day in cash.
      </p>
    </ExperienceFrame>
  );
}
