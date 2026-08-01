"use client";

import { useMemo } from "react";
import { annualReturns, annualMeta } from "@/lib/data";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DataTable } from "@/components/ui/data-table";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/**
 * The Year Feels Worse Than It Is.
 *
 * Calendar-year outcomes for every year on record. The published −14.2%
 * average intra-year drawdown is quoted from J.P. Morgan rather than computed,
 * because the annual dataset has no within-year path — and the panel says so
 * instead of implying the bars show drawdowns.
 */
export function IntraYear() {
  const recent = useMemo(() => annualReturns.slice(-46), []);
  const positive = recent.filter((r) => r.return > 0).length;

  const max = Math.max(...recent.map((r) => Math.abs(r.return)));

  return (
    <ExperienceFrame
      title="Every year, start to finish"
      intro="Each bar is one calendar year's total return. Most are green — and almost every one of them contained a decline that felt like the end of the world at the time."
      datasets={[annualMeta]}
    >
      <div
        className="flex items-end gap-[3px]"
        style={{ height: 200 }}
        role="img"
        aria-label={`Calendar year returns for the last ${recent.length} years. ${positive} finished positive.`}
      >
        {recent.map((r) => {
          const h = (Math.abs(r.return) / max) * 92;
          const up = r.return > 0;
          return (
            <div
              key={r.year}
              className="flex flex-1 flex-col justify-end"
              style={{ height: "100%" }}
              title={`${r.year}: ${pct(r.return)}`}
            >
              {up && <div className="flex-1" />}
              <div
                className={up ? "bg-gain" : "bg-loss"}
                style={{ height: `${h}%` }}
              />
              {!up && <div className="flex-1" />}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-text-subtle">
        <span className="tabular">{recent[0].year}</span>
        <span className="tabular">{recent[recent.length - 1].year}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Average intra-year fall
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">−14.2%</p>
          <p className="mt-1 text-xs text-text-subtle">J.P. Morgan, 1980 on</p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Years finishing positive
          </p>
          <p className="tabular mt-1.5 text-2xl text-gain">
            {positive}/{recent.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Worst year shown
          </p>
          <p className="tabular mt-1.5 text-2xl text-loss">
            {pct(Math.min(...recent.map((r) => r.return)))}
          </p>
        </div>
      </div>

      <DataTable
        caption="S&P 500 calendar year total returns, nominal, including dividends."
        columns={["Year", "Return"]}
        rows={recent.slice().reverse().map((r) => [r.year, pct(r.return)])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The path is far more alarming than the destination, and the low point
          is what gets remembered. That is a real psychological effect and it
          works the same way at a table: a winning session can feel like a
          losing one because of how far down you were at the midpoint.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">Where it stops working:</span> a casino
          session&rsquo;s low point carries no information about how it ends. A
          market drawdown sometimes does reflect genuine deterioration. And
          &ldquo;it recovers within the year&rdquo; is an average over a sample
          where most years were positive — the years that did not recover are
          precisely the ones that matter.
        </p>
        <p className="measure mt-3 text-xs leading-relaxed text-text-subtle">
          The bars show calendar-year outcomes, not the within-year path. The
          −14.2% average drawdown is quoted from J.P. Morgan&rsquo;s Guide to
          the Markets; this dataset is annual and cannot produce it.
        </p>
      </div>
    </ExperienceFrame>
  );
}
