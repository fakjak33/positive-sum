"use client";

import { useState } from "react";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

/**
 * Bali, Cakici & Whitelaw (2011): the spread between the lowest and highest
 * MAX deciles exceeds 1% a month. The intermediate deciles here are a linear
 * interpolation for illustration — the paper's headline result is the
 * decile-1-minus-decile-10 spread, and the chart says so.
 */
const SPREAD_PER_MONTH = 0.01;

export function MaxEffect() {
  const [months, setMonths] = useState(60);

  const deciles = Array.from({ length: 10 }, (_, i) => {
    const d = i + 1;
    const monthly = (SPREAD_PER_MONTH * (9 - i)) / 9;
    return { decile: d, monthly, cumulative: Math.pow(1 + monthly, months) - 1 };
  });

  return (
    <ExperienceFrame
      title="Lottery tickets inside the stock market"
      intro="Sorting stocks by their single biggest daily gain last month. Decile 1 is the calmest, decile 10 the most lottery-like."
    >
      <div>
        <label htmlFor="months" className="flex items-baseline justify-between text-sm">
          <span className="text-text-muted">Compounded over</span>
          <span className="tabular text-text">{months} months</span>
        </label>
        <input
          id="months"
          type="range"
          min={1}
          max={120}
          step={1}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
        />
      </div>

      <div className="mt-6">
        <Curves
          series={[
            {
              label: "Cumulative return relative to the most lottery-like decile",
              color: "var(--gain)",
              points: deciles.map((d) => ({ x: d.decile, y: d.cumulative * 100 })),
            },
          ]}
          formatX={(n) => `D${n}`}
          formatY={(n) => `${n.toFixed(0)}%`}
          yFromZero
          baseline={0}
          ariaLabel={`Relative cumulative return by MAX decile over ${months} months. The calmest decile leads the most lottery-like decile by about ${(deciles[0].cumulative * 100).toFixed(0)} percent.`}
        />
      </div>

      <DataTable
        caption="Return relative to the highest-MAX decile, by decile. Endpoints from Bali, Cakici & Whitelaw (2011); intermediate deciles are linearly interpolated for illustration."
        columns={["Decile", "Character", "Per month", `Over ${months} months`]}
        rows={deciles.map((d) => [
          `D${d.decile}`,
          d.decile <= 3 ? "Calm" : d.decile <= 7 ? "Middling" : "Lottery-like",
          `+${(d.monthly * 100).toFixed(2)}%`,
          `+${(d.cumulative * 100).toFixed(0)}%`,
        ])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          Investors appear to pay a premium for lottery-shaped payoffs and are
          compensated with lower returns for it. The gambling impulse does not
          stop at the casino door — it operates inside the stock market, and it
          is priced.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">Read this as an average, not a rule.</span>{" "}
          Plenty of individual high-MAX stocks did extremely well; the finding
          is about the cross-section. And like most documented anomalies, it
          may weaken now that it is widely known.
        </p>
      </div>
    </ExperienceFrame>
  );
}
