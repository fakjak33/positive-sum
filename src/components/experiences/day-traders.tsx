"use client";

import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

/** Barber, Lee, Liu & Odean — complete Taiwan Stock Exchange records, 1992–2006. */
const SURVIVAL = [
  { year: 0, share: 100 },
  { year: 1, share: 44 },
  { year: 2, share: 24 },
  { year: 3, share: 15 },
];

export function DayTraders() {
  return (
    <ExperienceFrame
      title="How long do day traders last"
      intro="Survival of Taiwanese day traders from complete exchange records — not a survey, and not self-reported."
    >
      <Curves
        series={[
          {
            label: "Still trading",
            color: "var(--loss)",
            points: SURVIVAL.map((s) => ({ x: s.year, y: s.share })),
          },
        ]}
        formatX={(n) => `${n}y`}
        formatY={(n) => `${n.toFixed(0)}%`}
        yFromZero
        ariaLabel="Day trader survival falls from 100% to 44% after one year, 24% after two and 15% after three."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Predictably profitable
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">&lt;1%</p>
          <p className="mt-1 text-xs text-text-subtle">net of fees, Taiwan</p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Lost money in Brazil
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">97%</p>
          <p className="mt-1 text-xs text-text-subtle">
            of those persisting past 300 sessions
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Beat minimum wage
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">1.1%</p>
          <p className="mt-1 text-xs text-text-subtle">Brazil, index futures</p>
        </div>
      </div>

      <DataTable
        caption="Day trader survival by year, Taiwan Stock Exchange complete records 1992–2006."
        columns={["Years trading", "Still active"]}
        rows={SURVIVAL.map((s) => [s.year, `${s.share}%`])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          This is where the comparison is most nearly literal. Short-horizon
          leveraged speculation, after costs, is structurally a
          negative-expectancy activity, and the attrition curve looks very much
          like persistent gambling.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">Two honest qualifications.</span> A small
          minority genuinely are skilled and persistently profitable, which is
          not true of roulette at any sample size. And these findings are about
          day trading specifically — extending them to long-horizon diversified
          investing is exactly the error this site exists to correct.
        </p>
      </div>
    </ExperienceFrame>
  );
}
