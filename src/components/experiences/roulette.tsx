"use client";

import { useMemo, useState } from "react";
import {
  constituentsForYear,
  pooledConstituents,
  constituentsMeta,
  constituentYears,
  statsForYear,
  pooledStats,
  coverageStats,
  constituentsDerived,
} from "@/lib/data";
import { mulberry32, randInt } from "@/lib/sim/random";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { PredictionGate } from "@/components/ui/prediction-gate";
import { DataTable } from "@/components/ui/data-table";
import { YearPicker, type YearSelection } from "@/components/ui/year-picker";
import { RouletteWheel } from "./roulette-wheel";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// A pooled grid of 14,000 squares would be unreadable and slow, so sample a
// fixed-size window from it. The sample is seeded, so it is reproducible.
const POOLED_SAMPLE = 600;

/**
 * Red or Black.
 *
 * A field of real companies coloured by their actual calendar-year return.
 * Defaults to every year pooled rather than one flattering year — the earlier
 * version hardcoded 2025, which had an unusually high share of winners and
 * would have been exactly the cherry-picking this site criticises.
 *
 * Gain/loss is encoded by colour AND shape AND position, never colour alone.
 */
export function Roulette() {
  const reduced = useReducedMotion();
  const [seed, setSeed] = useState(20250731);
  const [year, setYear] = useState<YearSelection>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<number | null>(null);
  const [mode, setMode] = useState<"grid" | "wheel">("grid");

  const universe = useMemo(
    () => (year === null ? pooledConstituents() : constituentsForYear(year)),
    [year]
  );

  const stat = year === null ? null : statsForYear(year);
  const positiveShare =
    year === null ? pooledStats.positiveShare : (stat?.positiveShare ?? 0);
  const meanReturn =
    year === null ? pooledStats.meanReturn : (stat?.meanReturn ?? 0);
  const medianReturn =
    year === null ? pooledStats.medianReturn : (stat?.medianReturn ?? 0);
  const total = year === null ? pooledStats.observations : (stat?.count ?? 0);
  const positive = year === null ? pooledStats.positive : (stat?.positive ?? 0);

  // Shuffled, seeded, and capped so the grid stays legible.
  const grid = useMemo(() => {
    const rng = mulberry32(seed + (year ?? 0));
    const arr = universe.map((c, i) => ({ ...c, i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(rng, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return year === null ? arr.slice(0, POOLED_SAMPLE) : arr;
  }, [universe, seed, year]);

  const pick = grid.find((g) => g.i === picked) ?? null;

  function pickRandom() {
    const rng = mulberry32(seed + (picked ?? 0) + 1);
    setPicked(grid[randInt(rng, grid.length)].i);
    setRevealed(false);
    if (reduced) setRevealed(true);
    else setTimeout(() => setRevealed(true), 650);
  }

  function reset() {
    setPicked(null);
    setRevealed(false);
  }

  function randomYear() {
    const rng = mulberry32(seed + 99);
    setYear(constituentYears[randInt(rng, constituentYears.length)]);
    setSeed((s) => s + 1);
    reset();
  }

  const label = year === null ? "all years" : String(year);

  return (
    <div className="space-y-6">
      <PredictionGate
        question={`Of the S&P 500 companies in this sample (${label}), what share do you think finished the year with a positive return?`}
        min={0}
        max={100}
        step={1}
        initial={50}
        answer={positiveShare * 100}
        format={(n) => `${n.toFixed(0)}%`}
        onCommit={setGuess}
      >
        <p className="measure mt-3 text-sm text-text-muted">
          Most people put this near 50% — the roulette intuition. The real
          number swings enormously: <span className="font-bold text-loss">7%</span>{" "}
          of companies finished 2008 positive,{" "}
          <span className="font-bold text-gain">95%</span> finished 2003
          positive. The odds here are estimated from history, not fixed by a
          wheel.
        </p>
      </PredictionGate>

      <ExperienceFrame
        title={`Every S&P 500 company — ${label}`}
        intro="One square per company, coloured by its actual return. Pick one before you can see which."
        datasets={[constituentsMeta]}
        seed={seed}
        onReseed={() => {
          setSeed((s) => s + 1);
          reset();
        }}
        onReset={reset}
      >
        <YearPicker
          value={year}
          onChange={(v) => {
            setYear(v);
            reset();
          }}
          onRandom={randomYear}
        />

        <div
          className="mt-5 flex gap-2"
          role="group"
          aria-label="Display mode"
        >
          {(["grid", "wheel"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`min-h-11 rounded-md border px-4 text-xs font-bold uppercase tracking-wider transition-all ${
                mode === m
                  ? "border-text bg-text text-bg"
                  : "border-border text-text-muted hover:-translate-y-px hover:bg-surface-raised hover:text-text"
              }`}
            >
              {m === "grid" ? "Whole field" : "Spin a wheel"}
            </button>
          ))}
        </div>

        {mode === "wheel" ? (
          <div className="mt-6">
            <RouletteWheel pockets={universe} seed={seed} />
            <p className="measure mx-auto mt-5 text-center text-xs leading-relaxed text-text-subtle">
              Twenty-four real companies, real returns, one pointer. It feels
              exactly like a casino wheel — which is the point, and also where
              the comparison starts to break: this wheel has no house pocket,
              the payouts are unbounded above, and the odds change every year.
            </p>
          </div>
        ) : (
        <div
          className="mt-5 grid gap-[3px]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(14px, 1fr))" }}
          role="img"
          aria-label={`${total.toLocaleString()} company-years: ${positive.toLocaleString()} finished positive, ${(total - positive).toLocaleString()} negative. Full figures in the table below.`}
        >
          {grid.map((c, idx) => {
            const up = c.return > 0;
            const isPick = c.i === picked;
            return (
              <span
                key={`${c.symbol}-${c.i}`}
                title={`${c.symbol} ${pct(c.return)}`}
                style={
                  reduced ? undefined : { animationDelay: `${Math.min(idx, 120) * 4}ms` }
                }
                // The selected square used to scale up with a ring, which
                // overlapped its neighbours and looked broken. An INSET ring
                // plus a brightness lift stays inside the cell, so nothing
                // shifts and the grid never reflows.
                className={[
                  "aspect-square rounded-[2px]",
                  reduced ? "" : "animate-pop transition-[opacity,box-shadow] duration-300",
                  isPick
                    ? "shadow-[inset_0_0_0_2px_var(--bg),0_0_0_2px_var(--text)] z-10"
                    : "",
                  picked !== null && !isPick ? "opacity-15" : "",
                  up ? "bg-gain" : "bg-loss",
                ].join(" ")}
              />
            );
          })}
        </div>
        )}

        {mode === "grid" && year === null && (
          <p className="mt-3 text-xs text-text-subtle">
            Showing a seeded sample of {POOLED_SAMPLE} of{" "}
            {pooledStats.observations.toLocaleString()} company-years. The
            statistics below use all of them.
          </p>
        )}

        {mode === "grid" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={pickRandom}
              className="min-h-11 rounded-md bg-text px-5 text-sm font-bold uppercase tracking-wider text-bg transition-all hover:-translate-y-px hover:opacity-90 active:translate-y-0"
            >
              {picked === null ? "Pick one at random" : "Pick another"}
            </button>
            {picked !== null && (
              <button
                type="button"
                onClick={reset}
                className="min-h-11 rounded-md border border-border px-5 text-sm font-bold uppercase tracking-wider text-text-muted transition-all hover:-translate-y-px hover:bg-surface-raised hover:text-text active:translate-y-0"
              >
                Show the whole field
              </button>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
          <div className="rounded-lg border border-border bg-bg p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
              Your one pick
            </p>
            {pick && revealed ? (
              <div className="animate-fade-up">
                <p className="mt-2 text-sm text-text-muted">
                  {pick.name}{" "}
                  <span className="text-text-subtle">({pick.symbol})</span>
                </p>
                <p
                  className={`tabular mt-1 text-3xl font-bold ${pick.return > 0 ? "text-gain" : "text-loss"}`}
                >
                  <span aria-hidden="true">{pick.return > 0 ? "▲" : "▼"}</span>{" "}
                  {pct(pick.return)}
                </p>
                <p className="mt-2 text-xs text-text-subtle">{pick.sector}</p>
              </div>
            ) : pick ? (
              <p className="mt-2 animate-pulse text-3xl text-text-subtle">···</p>
            ) : (
              <p className="mt-2 text-sm text-text-subtle">Nothing picked yet.</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-bg p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
              Owning all of them, equally weighted
            </p>
            <p className="tabular mt-2 text-3xl font-bold text-market">
              <span aria-hidden="true">{meanReturn > 0 ? "▲" : "▼"}</span>{" "}
              {pct(meanReturn)}
            </p>
            <p className="measure mt-2 text-xs text-text-subtle">
              The median company returned {pct(medianReturn)}. The average sits
              higher because a few large winners pull it up — that gap is the
              whole story.
            </p>
          </div>
        </div>

        <DataTable
          caption={`Share of S&P 500 companies finishing each year positive, ${constituentYears[0]}–${constituentYears[constituentYears.length - 1]}.`}
          columns={["Year", "Companies", "Positive", "Mean", "Median"]}
          rows={constituentYears
            .slice()
            .reverse()
            .map((y) => {
              const s = statsForYear(y)!;
              return [
                y,
                s.count,
                pct(s.positiveShare ?? 0),
                pct(s.meanReturn ?? 0),
                pct(s.medianReturn ?? 0),
              ];
            })}
        />

        <div className="mt-6 rounded-lg border border-border bg-bg p-5">
          <p className="text-sm leading-relaxed text-text-muted">
            <span className="font-bold text-text">
              {positive.toLocaleString()} of {total.toLocaleString()} (
              {pct(positiveShare)}) finished positive
            </span>{" "}
            in {label}.{" "}
            {guess !== null && <>You guessed {guess.toFixed(0)}%. </>}
            A roulette wheel would have given you a fixed 47.4% chance and paid
            a fixed 1:1. Here the odds move every year, the downside stops at
            −100%, and the upside has no ceiling.
          </p>
          <p className="measure mt-3 text-xs leading-relaxed text-text-subtle">
            <span className="font-bold text-text-muted">On survivorship:</span>{" "}
            membership here is point-in-time, so each year uses the companies
            genuinely in the index that January — including{" "}
            {constituentsDerived.tickers - 500}+ that have since failed, been
            acquired or been demoted. A company dropped mid-year is measured to
            its last traded price, so its collapse counts.
          </p>
          <p className="measure mt-2 text-xs leading-relaxed text-text-subtle">
            What remains is measured rather than assumed: this sample covers{" "}
            {(coverageStats.meanShareOfIndex * 100).toFixed(0)}% of real index
            members and sits{" "}
            {(coverageStats.meanResidualBias * 100).toFixed(1)}pp a year from
            the true index return — some of which is equal- versus
            cap-weighting rather than bias. Delisted companies whose price
            history is gone cannot be recovered, and those skew to the worst
            outcomes, so what is left still points slightly optimistic.
          </p>
        </div>
      </ExperienceFrame>
    </div>
  );
}
