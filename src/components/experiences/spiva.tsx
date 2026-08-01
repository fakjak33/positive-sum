"use client";

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
  return (
    <ExperienceFrame
      title="The manager survival curve"
      intro="Share of US large-cap funds that failed to beat the S&P 500, by measurement horizon, net of fees."
    >
      <Curves
        series={[
          {
            label: "Underperformed the index",
            color: "var(--loss)",
            points: SPIVA.map((s) => ({ x: s.years, y: s.underperformed })),
          },
          {
            label: "Beat the index",
            color: "var(--gain)",
            dashed: true,
            points: SPIVA.map((s) => ({ x: s.years, y: 100 - s.underperformed })),
          },
        ]}
        formatX={(n) => `${n}y`}
        formatY={(n) => `${n.toFixed(0)}%`}
        yFromZero
        ariaLabel="Share of US large-cap funds underperforming the S&P 500 rises from 65% over one year to 89.5% over fifteen years."
      />

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
