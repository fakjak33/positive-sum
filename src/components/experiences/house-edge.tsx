"use client";

import { useMemo, useState } from "react";
import { casinoGames, casinoMeta } from "@/lib/data";
import { feeDrag, houseEdgeDrag } from "@/lib/sim/finance";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { Curves } from "@/components/charts/curves";
import { DataTable } from "@/components/ui/data-table";

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * House Edge vs Expense Ratio.
 *
 * The arithmetic of a recurring percentage drag, shown twice: once against a
 * positive-expectancy asset and once against a zero-sum wager. The mechanism
 * is identical and the destination is opposite, which is the whole point.
 *
 * The fee side reproduces the SEC's published illustration exactly — pinned in
 * the test suite, so if this chart ever disagrees with the SEC, the build fails.
 */
export function HouseEdge() {
  const [fee, setFee] = useState(1.0);
  const [years, setYears] = useState(20);
  const [gameName, setGameName] = useState("European roulette");

  const principal = 100_000;
  const growth = 0.04;

  const withFee = useMemo(
    () => feeDrag(principal, growth, fee / 100, years),
    [fee, years]
  );
  const noFee = useMemo(() => feeDrag(principal, growth, 0, years), [years]);
  const lowFee = useMemo(
    () => feeDrag(principal, growth, 0.0025, years),
    [years]
  );

  const game = casinoGames.find((g) => g.game === gameName) ?? casinoGames[0];

  // One "bet" per year, so the two panels are on a common time base and the
  // comparison is apples to apples rather than per-bet against per-year.
  const casino = useMemo(
    () => houseEdgeDrag(principal, game.houseEdge, years),
    [game, years]
  );

  const investSeries = [
    {
      label: "No fee",
      color: "var(--market)",
      dashed: true,
      points: [{ x: 0, y: principal }, ...noFee.path.map((p) => ({ x: p.year, y: p.gross }))],
    },
    {
      label: `${fee.toFixed(2)}% annual fee`,
      color: "var(--gain)",
      points: [{ x: 0, y: principal }, ...withFee.path.map((p) => ({ x: p.year, y: p.net }))],
    },
  ];

  const casinoSeries = [
    {
      label: "Starting stake",
      color: "var(--text-subtle)",
      dashed: true,
      points: [
        { x: 0, y: principal },
        { x: years, y: principal },
      ],
    },
    {
      label: `${game.game} (${(game.houseEdge * 100).toFixed(2)}% edge)`,
      color: "var(--loss)",
      points: [{ x: 0, y: principal }, ...casino.path.map((p) => ({ x: p.bet, y: p.expected }))],
    },
  ];

  return (
    <ExperienceFrame
      title="A percentage, taken over and over"
      intro="$100,000 growing at 4% a year. On the left, an annual fee. On the right, the same percentage taken as a house edge. Same arithmetic — watch where each one ends up."
      datasets={[casinoMeta]}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fee"
            className="flex items-baseline justify-between text-sm"
          >
            <span className="text-text-muted">Annual fee</span>
            <span className="tabular text-text">{fee.toFixed(2)}%</span>
          </label>
          <input
            id="fee"
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            className="mt-2 h-11 w-full cursor-pointer accent-[var(--gain)]"
            aria-valuetext={`${fee.toFixed(2)} percent`}
          />
        </div>
        <div>
          <label
            htmlFor="years"
            className="flex items-baseline justify-between text-sm"
          >
            <span className="text-text-muted">Years</span>
            <span className="tabular text-text">{years}</span>
          </label>
          <input
            id="years"
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 h-11 w-full cursor-pointer accent-[var(--gain)]"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-text-subtle">
            Invested at 4%, minus a fee
          </h3>
          <div className="mt-3">
            <Curves
              series={investSeries}
              formatX={(n) => `${n}y`}
              formatY={(n) => `$${Math.round(n / 1000)}k`}
              ariaLabel={`After ${years} years, ${money(noFee.gross)} with no fee against ${money(withFee.net)} after a ${fee.toFixed(2)} percent annual fee.`}
            />
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Ends at{" "}
            <span className="tabular text-text">{money(withFee.net)}</span>{" "}
            instead of{" "}
            <span className="tabular text-text">{money(noFee.gross)}</span>. The
            fee took{" "}
            <span className="tabular text-loss">{money(withFee.cost)}</span> —{" "}
            {(withFee.costShare * 100).toFixed(1)}% of the final pot.
          </p>
          <p className="mt-2 text-sm text-gain">
            Still ahead of where you started, by{" "}
            <span className="tabular">{money(withFee.net - principal)}</span>.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-text-subtle">
            Wagered against a house edge
          </h3>
          <div className="mt-3">
            <Curves
              series={casinoSeries}
              formatX={(n) => `${n}`}
              formatY={(n) => `$${Math.round(n / 1000)}k`}
              ariaLabel={`After ${years} rounds against a ${(game.houseEdge * 100).toFixed(2)} percent house edge, the expected value falls from ${money(principal)} to ${money(casino.expected)}.`}
              baseline={principal}
            />
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Expected value falls to{" "}
            <span className="tabular text-text">{money(casino.expected)}</span>{" "}
            after {years} rounds.
          </p>
          <p className="mt-2 text-sm text-loss">
            Behind where you started, by{" "}
            <span className="tabular">{money(principal - casino.expected)}</span>
            .
          </p>
          <div className="mt-4">
            <label htmlFor="game" className="sr-only">
              Casino game
            </label>
            <select
              id="game"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-text"
            >
              {casinoGames.map((g) => (
                <option key={g.game} value={g.game}>
                  {g.game} — {(g.houseEdge * 100).toFixed(2)}%
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        caption="Ending value by annual fee, $100,000 growing at 4%."
        columns={["Annual fee", `After ${years} years`, "Cost of the fee", "Share of final pot"]}
        rows={[0, 0.25, 0.5, 1, 1.5, 2].map((f) => {
          const r = feeDrag(principal, growth, f / 100, years);
          return [
            `${f.toFixed(2)}%`,
            money(r.net),
            money(r.cost),
            `${(r.costShare * 100).toFixed(1)}%`,
          ];
        })}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          A 1% annual fee over 20 years removes a larger share of your wealth
          than a single spin of European roulette removes from a single bet.
          That comparison is arithmetically fair, and it is the strongest case
          for keeping costs down.{" "}
          <span className="text-text">
            It is also where the analogy stops.
          </span>{" "}
          The fee is subtracted from an asset with a positive expected return,
          so you still expect to finish ahead — just less far ahead. The house
          edge is subtracted from a zero-sum wager, so you expect to finish
          behind. Same mechanism, opposite destination.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-subtle">
          Note also that the two panels are not on identical footing: a fee is
          charged per year regardless of what you do, while a house edge is
          charged per bet. Setting one bet per year makes them comparable, but
          a gambler placing a hundred bets an evening is on a completely
          different clock.
        </p>
      </div>

      <p className="mt-4 text-xs text-text-subtle">
        Fee figures reproduce the SEC&rsquo;s published illustration: $100,000
        at 4% for 20 years is worth about {money(lowFee.net)} at a 0.25% fee and{" "}
        {money(feeDrag(principal, growth, 0.01, 20).net)} at 1.00%.
      </p>
    </ExperienceFrame>
  );
}
