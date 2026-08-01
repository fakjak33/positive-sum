"use client";

import { useMemo, useState } from "react";
import { simulateErgodicCoin } from "@/lib/sim/casino";
import { kellyFraction } from "@/lib/sim/finance";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

const UP = 0.5;
const DOWN = -0.4;
const P = 0.5;
const ROUNDS = 100;
const PATHS = 2000;

/**
 * Coin Flip and the Ergodicity Trap.
 *
 * A coin that pays +50% or −40% on even odds has an expected value of +5% per
 * round. Bet everything each time and almost every individual path still goes
 * to nearly zero, because the average across players and the average for one
 * player over time are different quantities.
 *
 * This is the deepest idea in the app and the one where the casino analogy
 * holds essentially without leakage — the mathematics is identical for a card
 * counter and a leveraged portfolio.
 */
export function CoinFlip() {
  const [fraction, setFraction] = useState(1);
  const [seed, setSeed] = useState(1717);

  const sim = useMemo(
    () => simulateErgodicCoin(UP, DOWN, P, fraction, ROUNDS, PATHS, seed),
    [fraction, seed]
  );

  // Kelly for this coin: net odds 0.5/0.4 = 1.25 on a 50/50 bet.
  const netOdds = UP / -DOWN;
  const kelly = kellyFraction(P, netOdds);
  const expectedPerRound = P * UP + (1 - P) * DOWN;

  const pathSeries = sim.samplePaths.slice(0, 24).map((p, i) => ({
    label: `path-${i}`,
    color: i === 0 ? "var(--text-muted)" : "var(--border-strong)",
    points: p.map((v, x) => ({ x, y: Math.max(v, 0.0001) })),
  }));

  return (
    <ExperienceFrame
      title="A coin worth playing that still ruins you"
      intro={`Heads pays +50%, tails costs 40%, on a fair coin. Expected value is +${(expectedPerRound * 100).toFixed(0)}% every round — a bet no casino would ever offer. Now stake all of it, ${ROUNDS} times.`}
      seed={seed}
      onReseed={() => setSeed((s) => s + 1)}
    >
      <div>
        <label
          htmlFor="fraction"
          className="flex items-baseline justify-between text-sm"
        >
          <span className="text-text-muted">Share of your wealth staked each round</span>
          <span className="tabular text-text">
            {(fraction * 100).toFixed(0)}%
          </span>
        </label>
        <input
          id="fraction"
          type="range"
          min={0.05}
          max={1}
          step={0.05}
          value={fraction}
          onChange={(e) => setFraction(Number(e.target.value))}
          className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
          aria-valuetext={`${(fraction * 100).toFixed(0)} percent`}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFraction(Math.round(kelly * 20) / 20)}
            className="min-h-11 rounded-md border border-border px-3 text-xs text-text-muted hover:bg-surface-raised hover:text-text"
          >
            Jump to Kelly ({(kelly * 100).toFixed(0)}%)
          </button>
          <button
            type="button"
            onClick={() => setFraction(1)}
            className="min-h-11 rounded-md border border-border px-3 text-xs text-text-muted hover:bg-surface-raised hover:text-text"
          >
            Bet everything
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Curves
          series={pathSeries}
          height={240}
          formatX={(n) => `${n}`}
          formatY={(n) => `${n.toFixed(1)}×`}
          baseline={1}
          ariaLabel={`Twenty-four sample wealth paths over ${ROUNDS} rounds at a ${(fraction * 100).toFixed(0)} percent stake. Median final wealth ${sim.median.toFixed(3)} times the starting amount, mean ${sim.mean.toFixed(1)} times.`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Typical player (median)
          </p>
          <p
            className={`tabular mt-1.5 text-2xl ${sim.median < 1 ? "text-loss" : "text-gain"}`}
          >
            {sim.median < 0.01 ? "≈0×" : `${sim.median.toFixed(2)}×`}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Average across all players
          </p>
          <p className="tabular mt-1.5 text-2xl text-market">
            {sim.mean > 1000
              ? `${(sim.mean / 1000).toFixed(0)}k×`
              : `${sim.mean.toFixed(1)}×`}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Lost 99% or more
          </p>
          <p
            className={`tabular mt-1.5 text-2xl ${sim.ruinShare > 0.2 ? "text-loss" : "text-text"}`}
          >
            {(sim.ruinShare * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <DataTable
        caption={`Outcome of ${PATHS} simulated players by stake size, ${ROUNDS} rounds each.`}
        columns={["Stake", "Median wealth", "Mean wealth", "Lost 99%+"]}
        rows={[0.1, 0.25, kelly, 0.5, 0.75, 1].map((f) => {
          const r = simulateErgodicCoin(UP, DOWN, P, f, ROUNDS, 500, seed);
          return [
            `${(f * 100).toFixed(0)}%${Math.abs(f - kelly) < 0.001 ? " (Kelly)" : ""}`,
            r.median < 0.01 ? "≈0×" : `${r.median.toFixed(2)}×`,
            `${r.mean.toFixed(1)}×`,
            `${(r.ruinShare * 100).toFixed(0)}%`,
          ];
        })}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          At a full stake the <span className="text-text">average</span> player
          does spectacularly and the{" "}
          <span className="text-text">typical</span> player is wiped out. Both
          numbers are correct. The mean is dragged up by a vanishing number of
          paths that won almost every flip; nobody actually experiences the
          mean.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          This is why expected value alone is not a strategy. Maximising the
          average outcome across a population tells you to bet everything;
          maximising your own growth over time tells you to bet{" "}
          <span className="tabular text-text">
            {(kelly * 100).toFixed(0)}%
          </span>
          . The second is the Kelly fraction, and it is the same calculation a
          card counter and a portfolio manager are doing.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-subtle">
          Where it does break down: Kelly assumes you know the odds. A card
          counter roughly does. An investor does not, which is why betting a
          fraction of Kelly is the practical advice. Real portfolios also hold
          correlated positions with fatter tails than a coin, so the clean
          formula understates the risk.
        </p>
      </div>
    </ExperienceFrame>
  );
}
