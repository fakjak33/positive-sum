"use client";

import { useMemo, useState } from "react";
import {
  constituents,
  constituentsMeta,
  constituentsYear,
  constituentsDerived,
} from "@/lib/data";
import { mulberry32, randInt } from "@/lib/sim/random";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { PredictionGate } from "@/components/ui/prediction-gate";
import { DataTable } from "@/components/ui/data-table";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/**
 * Red or Black, 500 Times.
 *
 * A field of every real S&P 500 constituent, coloured by its actual calendar
 * year return. The reader picks one blind, then sees it resolve against the
 * whole index.
 *
 * Gain/loss is encoded by colour AND by shape (▲/▼ in the detail readout) and
 * by ordering, never by colour alone — red/green is this app's main axis and
 * also the most common colour-vision deficiency.
 */
export function Roulette() {
  const reduced = useReducedMotion();
  const [seed, setSeed] = useState(() => 20250731);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<number | null>(null);

  // Stable shuffle so the grid doesn't reorder on every render, but changes
  // with the seed so "new run" feels genuinely new.
  const grid = useMemo(() => {
    const rng = mulberry32(seed);
    const arr = constituents.map((c, i) => ({ ...c, i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(rng, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [seed]);

  const positive = constituentsDerived.positive;
  const total = constituentsDerived.count;
  const positiveShare = constituentsDerived.positiveShare ?? 0;
  const meanReturn = constituentsDerived.meanReturn;
  const medianReturn = constituentsDerived.medianReturn ?? 0;

  const pick = grid.find((g) => g.i === picked) ?? null;

  function pickRandom() {
    const rng = mulberry32(seed + (picked ?? 0) + 1);
    const chosen = grid[randInt(rng, grid.length)];
    setPicked(chosen.i);
    setRevealed(false);
    // With reduced motion there is no suspense beat to wait for.
    if (reduced) setRevealed(true);
    else setTimeout(() => setRevealed(true), 650);
  }

  function reset() {
    setPicked(null);
    setRevealed(false);
  }

  return (
    <div className="space-y-6">
      <PredictionGate
        question={`Of the roughly 500 companies in the S&P 500, what share do you think finished ${constituentsYear} with a positive return?`}
        min={0}
        max={100}
        step={1}
        initial={50}
        answer={positiveShare * 100}
        format={(n) => `${n.toFixed(0)}%`}
        onCommit={(g) => setGuess(g)}
      >
        <p className="measure mt-3 text-sm text-text-muted">
          Most people put this near 50% — the roulette intuition. The real
          number moves a lot from year to year, which is itself the point: the
          odds here are estimated from history, not fixed by a wheel.
        </p>
      </PredictionGate>

      <ExperienceFrame
        title={`Every S&P 500 company, ${constituentsYear}`}
        intro="One square per company, coloured by its actual return. Pick one before you can see which."
        datasets={[constituentsMeta]}
        seed={seed}
        onReseed={() => {
          setSeed((s) => s + 1);
          reset();
        }}
        onReset={reset}
      >
        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(14px, 1fr))" }}
          role="img"
          aria-label={`${total} companies: ${positive} finished ${constituentsYear} positive, ${total - positive} negative. The full figures are available in the table below.`}
        >
          {grid.map((c) => {
            const up = c.return > 0;
            const isPick = c.i === picked;
            return (
              <span
                key={c.symbol}
                title={`${c.symbol} ${pct(c.return)}`}
                className={[
                  "aspect-square rounded-[2px] transition-all",
                  reduced ? "" : "duration-300",
                  isPick
                    ? "scale-125 ring-2 ring-text ring-offset-2 ring-offset-surface"
                    : "",
                  picked !== null && !isPick ? "opacity-25" : "",
                  up ? "bg-gain" : "bg-loss",
                ].join(" ")}
              />
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={pickRandom}
            className="min-h-11 rounded-md bg-text px-5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            {picked === null ? "Pick one at random" : "Pick another"}
          </button>
          {picked !== null && (
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-md border border-border px-5 text-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
            >
              Show the whole field
            </button>
          )}
        </div>

        {/* Result readout. Shape and words carry the outcome, not just colour. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
          <div className="rounded-lg border border-border bg-bg p-5">
            <p className="text-xs uppercase tracking-widest text-text-subtle">
              Your one pick
            </p>
            {pick && revealed ? (
              <>
                <p className="mt-2 text-sm text-text-muted">
                  {pick.name} <span className="text-text-subtle">({pick.symbol})</span>
                </p>
                <p
                  className={`tabular mt-1 text-3xl ${pick.return > 0 ? "text-gain" : "text-loss"}`}
                >
                  <span aria-hidden="true">{pick.return > 0 ? "▲" : "▼"}</span>{" "}
                  {pct(pick.return)}
                </p>
                <p className="mt-2 text-xs text-text-subtle">{pick.sector}</p>
              </>
            ) : pick ? (
              <p className="mt-2 text-3xl text-text-subtle">…</p>
            ) : (
              <p className="mt-2 text-sm text-text-subtle">
                Nothing picked yet.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-bg p-5">
            <p className="text-xs uppercase tracking-widest text-text-subtle">
              Owning all of them, equally weighted
            </p>
            <p className="tabular mt-2 text-3xl text-market">
              <span aria-hidden="true">{meanReturn > 0 ? "▲" : "▼"}</span>{" "}
              {pct(meanReturn)}
            </p>
            <p className="measure mt-2 text-xs text-text-subtle">
              The median company returned {pct(medianReturn)}. The average is
              higher than the median because a few large winners pull it up —
              that gap is the whole story.
            </p>
          </div>
        </div>

        <DataTable
          caption={`S&P 500 constituent returns, ${constituentsYear}. Ten best and ten worst of ${total} companies.`}
          columns={["Company", "Symbol", "Sector", "Return"]}
          rows={[
            ...constituents.slice(0, 10),
            ...constituents.slice(-10),
          ].map((c) => [c.name, c.symbol, c.sector, pct(c.return)])}
        />

        <div className="mt-6 rounded-lg border border-border bg-bg p-5">
          <p className="text-sm leading-relaxed text-text-muted">
            <span className="text-text">
              {positive} of {total} companies ({pct(positiveShare)}) finished{" "}
              {constituentsYear} positive.
            </span>{" "}
            {guess !== null && (
              <>
                You guessed {guess.toFixed(0)}%.{" "}
              </>
            )}
            A roulette wheel would have given you a fixed 47.4% chance and paid
            a fixed 1:1. Here the odds shift every year, the downside stops at
            −100%, and the upside has no ceiling at all.
          </p>
        </div>
      </ExperienceFrame>
    </div>
  );
}
