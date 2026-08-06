"use client";

import { useState } from "react";
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
  const [cohort, setCohort] = useState(1000);

  // The published survival rates applied to a cohort the reader chooses, at
  // quarterly granularity so the curve is smooth rather than four points.
  const decay = Math.pow(0.15, 1 / 3); // annual survival implied by 15% at 3y
  const curve = Array.from({ length: 13 }, (_, i) => {
    const y = i / 4;
    const exact = SURVIVAL.find((s) => s.year === y);
    return {
      x: y,
      y: exact ? exact.share : 100 * Math.pow(decay, y),
    };
  });

  const left = (y: number) =>
    Math.round((cohort * (curve.find((c) => c.x === y)?.y ?? 0)) / 100);

  return (
    <ExperienceFrame
      title="How long do day traders last"
      intro="Survival of Taiwanese day traders from complete exchange records — not a survey, and not self-reported."
    >
      <div>
        <label
          htmlFor="cohort"
          className="flex items-baseline justify-between text-sm"
        >
          <span className="text-text-muted">Start with this many traders</span>
          <span className="tabular text-text">{cohort.toLocaleString()}</span>
        </label>
        <input
          id="cohort"
          type="range"
          min={100}
          max={10000}
          step={100}
          value={cohort}
          onChange={(e) => setCohort(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((y) => (
          <div key={y} className="rounded-lg border border-border bg-bg p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
              {y === 0 ? "Started" : `Year ${y}`}
            </p>
            <p
              className={`tabular mt-1.5 text-2xl ${y === 0 ? "text-text" : "text-loss"}`}
            >
              {left(y).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-text-subtle">still trading</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Curves
          series={[
            { label: "Still trading", color: "var(--loss)", points: curve },
          ]}
          formatX={(n) => `${n}y`}
          formatY={(n) => `${n.toFixed(0)}%`}
          yFromZero
          ariaLabel={`Day trader survival falls from 100% to 44% after one year, 24% after two and 15% after three. Of ${cohort} traders, ${left(3)} would still be trading after three years.`}
        />
      </div>

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
