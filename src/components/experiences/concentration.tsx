"use client";

import { useMemo, useState } from "react";
import {
  constituentsForYear,
  pooledConstituents,
  constituentsMeta,
  constituentYears,
  latestConstituentYear,
} from "@/lib/data";
import { mulberry32, randInt } from "@/lib/sim/random";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DataTable } from "@/components/ui/data-table";
import { YearPicker, type YearSelection } from "@/components/ui/year-picker";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/**
 * When the Index Is a Few Companies.
 *
 * Shows the dispersion of the real cross-section by sector, and how much of
 * the index's behaviour is driven by a small number of names.
 *
 * The dataset has returns but not market weights, so the top-10-weight figure
 * is quoted from S&P Dow Jones Indices rather than computed here — stated
 * plainly rather than implied.
 */
export function Concentration() {
  const [sector, setSector] = useState<string | null>(null);
  const [year, setYear] = useState<YearSelection>(latestConstituentYear);

  const universe = useMemo(
    () => (year === null ? pooledConstituents() : constituentsForYear(year)),
    [year]
  );

  const sectors = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const c of universe) {
      const list = map.get(c.sector) ?? [];
      list.push(c.return);
      map.set(c.sector, list);
    }
    return [...map.entries()]
      .map(([name, rs]) => ({
        name,
        count: rs.length,
        mean: rs.reduce((a, b) => a + b, 0) / rs.length,
        positive: rs.filter((r) => r > 0).length / rs.length,
        best: Math.max(...rs),
        worst: Math.min(...rs),
      }))
      .sort((a, b) => b.mean - a.mean);
  }, [universe]);

  const shown = sector
    ? universe.filter((c) => c.sector === sector)
    : universe;

  const top10 = universe.slice(0, 10);
  const top10Contribution =
    top10.reduce((a, c) => a + c.return, 0) /
    (universe.reduce((a, c) => a + c.return, 0) || 1);

  const label = year === null ? "all years" : String(year);

  function randomYear() {
    const rng = mulberry32(Date.now() & 0xffff);
    setYear(constituentYears[randInt(rng, constituentYears.length)]);
    setSector(null);
  }

  return (
    <ExperienceFrame
      title={`Where the ${label} return actually came from`}
      intro="Owning 'the market' sounds like maximum diversification. In a capitalisation-weighted index it increasingly means owning a handful of very large companies."
      datasets={[constituentsMeta]}
    >
      <div className="mb-5">
        <YearPicker
          value={year}
          onChange={(v) => {
            setYear(v);
            setSector(null);
          }}
          onRandom={randomYear}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-rare/30 bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Top 10 by index weight
          </p>
          <p className="tabular mt-1.5 text-2xl text-rare">~40%</p>
          <p className="mt-1 text-xs text-text-subtle">
            of the S&amp;P 500, mid-2025 — highest since the mid-1960s
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Best 10 performers
          </p>
          <p className="tabular mt-1.5 text-2xl text-gain">
            {pct(top10Contribution)}
          </p>
          <p className="mt-1 text-xs text-text-subtle">
            of the summed equal-weighted return
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Companies shown
          </p>
          <p className="tabular mt-1.5 text-2xl text-text">{shown.length}</p>
          <p className="mt-1 text-xs text-text-subtle">
            {sector ?? "all sectors"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
        <button
          type="button"
          onClick={() => setSector(null)}
          aria-pressed={sector === null}
          className={`min-h-11 rounded-md border px-3 text-xs transition-colors ${
            sector === null
              ? "border-text bg-text text-bg"
              : "border-border text-text-muted hover:bg-surface-raised hover:text-text"
          }`}
        >
          All
        </button>
        {sectors.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setSector(s.name)}
            aria-pressed={sector === s.name}
            className={`min-h-11 rounded-md border px-3 text-xs transition-colors ${
              sector === s.name
                ? "border-text bg-text text-bg"
                : "border-border text-text-muted hover:bg-surface-raised hover:text-text"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <DataTable
        caption={`S&P 500 constituent returns by sector, ${label}.`}
        columns={["Sector", "Companies", "Average", "Share positive", "Best", "Worst"]}
        rows={sectors.map((s) => [
          s.name,
          s.count,
          pct(s.mean),
          pct(s.positive),
          pct(s.best),
          pct(s.worst),
        ])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          A capitalisation-weighted index automatically allocates more to
          whatever has already grown. That punctures a real complacency:
          nominal diversification across 500 names is not the same as economic
          diversification, and a passive choice still embeds an active
          concentration bet.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">
            But concentration is not automatically a mistake.
          </span>{" "}
          Those companies are large because they generated real earnings — that
          is not how a lucky number becomes a big pile of chips. And past
          concentration episodes resolved in very different ways, so this is
          not a timing signal.
        </p>
        <p className="measure mt-3 text-xs leading-relaxed text-text-subtle">
          The ~40% weight figure is from S&amp;P Dow Jones Indices. This
          dataset holds constituent returns but not market weights, so that
          number is quoted, not computed here.
        </p>
      </div>
    </ExperienceFrame>
  );
}
