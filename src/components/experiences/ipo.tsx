"use client";

import { useMemo, useState } from "react";
import { mulberry32 } from "@/lib/sim/random";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DistributionChart } from "@/components/charts/distribution";
import { DataTable } from "@/components/ui/data-table";

/**
 * Ritter: mean first-day return ~19%, median ~7%. That gap is the finding.
 *
 * The draws below are a lognormal illustration calibrated to reproduce that
 * mean/median pair — this is a MODEL of the skew, not a sample of real IPOs,
 * and the panel says so plainly rather than implying these are actual deals.
 */
const MEAN = 0.19;
const MEDIAN = 0.07;

export function Ipo() {
  const [seed, setSeed] = useState(31);

  const draws = useMemo(() => {
    const rng = mulberry32(seed);
    // Lognormal: median = exp(mu) - 1, mean = exp(mu + s^2/2) - 1.
    const mu = Math.log(1 + MEDIAN);
    const s = Math.sqrt(2 * (Math.log(1 + MEAN) - mu));
    const out: number[] = [];
    for (let i = 0; i < 3000; i++) {
      let u = 0;
      let v = 0;
      while (u === 0) u = rng();
      while (v === 0) v = rng();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      out.push(Math.exp(mu + s * z) - 1);
    }
    return out;
  }, [seed]);

  const bins = useMemo(() => {
    const clipped = draws.filter((d) => d < 2);
    const min = Math.min(...clipped);
    const max = Math.max(...clipped);
    const n = 40;
    const w = (max - min) / n;
    const b = Array.from({ length: n }, (_, i) => ({
      x0: min + i * w,
      x1: min + (i + 1) * w,
      count: 0,
    }));
    for (const d of clipped) {
      b[Math.min(n - 1, Math.floor((d - min) / w))].count++;
    }
    return b;
  }, [draws]);

  return (
    <ExperienceFrame
      title="The average IPO and the typical IPO"
      intro="First-day returns are heavily skewed: a handful of enormous pops drag the average far above what most listings actually do."
      seed={seed}
      onReseed={() => setSeed((s) => s + 1)}
    >
      <DistributionChart
        bins={bins}
        markers={[
          { value: MEDIAN, label: "median 7%", tone: "var(--market)" },
          { value: MEAN, label: "mean 19%", tone: "var(--rare)" },
        ]}
        ariaLabel="Distribution of IPO first-day returns. The median sits at 7% while the mean sits at 19%, pulled up by a small right tail."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-rare/30 bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            The number in the headline
          </p>
          <p className="tabular mt-2 text-3xl text-rare">+19%</p>
          <p className="mt-2 text-xs text-text-subtle">average first-day return</p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            What the middle listing did
          </p>
          <p className="tabular mt-2 text-3xl text-text">+7%</p>
          <p className="mt-2 text-xs text-text-subtle">median first-day return</p>
        </div>
      </div>

      <DataTable
        caption="IPO performance, Ritter (University of Florida). Long-run figures from Ritter (1991)."
        columns={["Measure", "Value"]}
        rows={[
          ["Mean first-day return", "+19%"],
          ["Median first-day return", "+7%"],
          ["Three-year buy-and-hold, IPOs", "+34.5%"],
          ["Three-year buy-and-hold, matched firms", "+61.9%"],
        ]}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The jackpot on the wall is real. It is just not what most players
          get — and reporting the mean makes the typical IPO look like
          something it is not. This is the same skew story as the wider market,
          at a scale you can hold in your head.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-subtle">
          Two caveats. Most retail investors cannot buy at the offer price
          anyway, so the first-day return was never really on the table for
          them. And IPO underperformance varies a lot by period and sector — it
          is a tendency, not a law.
        </p>
        <p className="measure mt-3 text-xs leading-relaxed text-text-subtle">
          The histogram is a lognormal model calibrated to reproduce Ritter&rsquo;s
          published mean and median. It illustrates the shape of the skew; it is
          not a sample of real listings.
        </p>
      </div>
    </ExperienceFrame>
  );
}
