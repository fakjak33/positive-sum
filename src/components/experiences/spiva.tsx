"use client";

import { useMemo, useState } from "react";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

/** SPIVA U.S. Scorecard, US large-cap funds vs the S&P 500, to 31 Dec 2024. */
const SPIVA = [
  { years: 1, underperformed: 65.24 },
  { years: 3, underperformed: 84.96 },
  { years: 5, underperformed: 76.26 },
  { years: 10, underperformed: 84.34 },
  { years: 15, underperformed: 89.5 },
];

export function Spiva() {
  const [managers, setManagers] = useState(1000);

  // Interpolate between the published horizons so the curve is smooth and
  // responds to the slider, rather than being five fixed points.
  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let y = 1; y <= 15; y += 0.5) {
      let lo = SPIVA[0];
      let hi = SPIVA[SPIVA.length - 1];
      for (let i = 0; i < SPIVA.length - 1; i++) {
        if (y >= SPIVA[i].years && y <= SPIVA[i + 1].years) {
          lo = SPIVA[i];
          hi = SPIVA[i + 1];
          break;
        }
      }
      const t = hi.years === lo.years ? 0 : (y - lo.years) / (hi.years - lo.years);
      pts.push({
        x: y,
        y: lo.underperformed + t * (hi.underperformed - lo.underperformed),
      });
    }
    return pts;
  }, []);

  const survivorsAt = (y: number) => {
    const p = curve.reduce((a, b) => (Math.abs(b.x - y) < Math.abs(a.x - y) ? b : a));
    return Math.round((managers * (100 - p.y)) / 100);
  };

  return (
    <ExperienceFrame
      title="The manager survival curve"
      intro="Share of US large-cap funds that failed to beat the S&P 500, by measurement horizon, net of fees."
    >
      <div>
        <label
          htmlFor="managers"
          className="flex items-baseline justify-between text-sm"
        >
          <span className="text-text-muted">Start with this many managers</span>
          <span className="tabular text-text">{managers.toLocaleString()}</span>
        </label>
        <input
          id="managers"
          type="range"
          min={100}
          max={5000}
          step={100}
          value={managers}
          onChange={(e) => setManagers(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[1, 5, 10, 15].map((y) => (
          <div key={y} className="rounded-lg border border-border bg-bg p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
              After {y} year{y > 1 ? "s" : ""}
            </p>
            <p className="tabular mt-1.5 text-2xl text-gain">
              {survivorsAt(y).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-text-subtle">still ahead</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Curves
          series={[
            {
              label: "Underperformed the index",
              color: "var(--loss)",
              points: curve,
            },
            {
              label: "Beat the index",
              color: "var(--gain)",
              dashed: true,
              points: curve.map((p) => ({ x: p.x, y: 100 - p.y })),
            },
          ]}
          formatX={(n) => `${n}y`}
          formatY={(n) => `${n.toFixed(0)}%`}
          yFromZero
          ariaLabel={`Share of US large-cap funds underperforming the S&P 500 rises from 65% over one year to 89.5% over fifteen years. Of ${managers} managers, ${survivorsAt(15)} would still be ahead after fifteen years.`}
        />
      </div>

      <DataTable
        caption="SPIVA U.S. Scorecard, US large-cap funds against the S&P 500, as of 31 December 2024. Net of fees, survivor-bias-free database."
        columns={["Horizon", "Underperformed", "Beat the index"]}
        rows={SPIVA.map((s) => [
          `${s.years} year${s.years > 1 ? "s" : ""}`,
          `${s.underperformed.toFixed(2)}%`,
          `${(100 - s.underperformed).toFixed(2)}%`,
        ])}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Why the curve rises
          </p>
          <p className="measure mt-2 text-sm leading-relaxed text-text-muted">
            Costs compound against the manager while the benchmark carries
            none. And by arithmetic, the average actively managed dollar must
            underperform the average passive dollar before fees — they hold the
            same market between them.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Why it is not pure attrition
          </p>
          <p className="measure mt-2 text-sm leading-relaxed text-text-muted">
            Part of the decline is survivorship arithmetic. SPIVA counts funds
            that closed — nearly 64% of domestic stock funds disappeared over
            twenty years — and a fund closing is not the same as a gambler
            busting out. Some managers genuinely do have skill; the finding is
            that identifying them in advance is very hard.
          </p>
        </div>
      </div>

      <p className="measure mt-4 text-sm leading-relaxed text-text-subtle">
        One more thing the curve hides: a fund that trails the index by one
        percentage point in a rising market still made its investors money.
        A losing gambler simply has less than they started with. The shapes
        rhyme; the outcomes do not.
      </p>
    </ExperienceFrame>
  );
}
