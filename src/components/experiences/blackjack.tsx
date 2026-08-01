"use client";

import { useState } from "react";
import { blackjackSession } from "@/lib/sim/casino";
import { casinoMeta, BLACKJACK_EDGE } from "@/lib/data";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DataTable } from "@/components/ui/data-table";

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

// Typical improvised play runs several times the basic-strategy edge. 2% is a
// commonly cited figure for an average recreational player.
const INTUITION_EDGE = 0.02;

/**
 * Basic Strategy vs Discipline.
 *
 * Analytical rather than a hand-by-hand simulation: the app is illustrating
 * the size of the gap a mechanical rule creates, not teaching card play, and
 * simulating real blackjack would overstate its own fidelity.
 *
 * This is the weakest tier-1 analogy and the page says so.
 */
export function Blackjack() {
  const [hours, setHours] = useState(4);
  const [bet, setBet] = useState(25);
  const handsPerHour = 70;

  const strategy = blackjackSession(handsPerHour, hours, bet, BLACKJACK_EDGE);
  const intuition = blackjackSession(handsPerHour, hours, bet, INTUITION_EDGE);
  const saved = intuition.expectedLoss - strategy.expectedLoss;

  return (
    <ExperienceFrame
      title="A printed card, followed exactly"
      intro="Blackjack basic strategy is a small laminated table. Following it without deviation cuts the house edge by most of its size — the discipline, not the insight, is what does the work."
      datasets={[casinoMeta]}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="hours" className="flex items-baseline justify-between text-sm">
            <span className="text-text-muted">Hours at the table</span>
            <span className="tabular text-text">{hours}</span>
          </label>
          <input
            id="hours"
            type="range"
            min={1}
            max={12}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
          />
        </div>
        <div>
          <label htmlFor="bet" className="flex items-baseline justify-between text-sm">
            <span className="text-text-muted">Bet per hand</span>
            <span className="tabular text-text">{money(bet)}</span>
          </label>
          <input
            id="bet"
            type="range"
            min={5}
            max={200}
            step={5}
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="mt-2 h-11 w-full cursor-pointer accent-[var(--market)]"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-loss/30 bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Playing on instinct ({(INTUITION_EDGE * 100).toFixed(1)}% edge)
          </p>
          <p className="tabular mt-2 text-3xl text-loss">
            −{money(intuition.expectedLoss)}
          </p>
          <p className="mt-2 text-xs text-text-subtle">
            expected loss over {intuition.hands} hands
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Basic strategy ({(BLACKJACK_EDGE * 100).toFixed(2)}% edge)
          </p>
          <p className="tabular mt-2 text-3xl text-text">
            −{money(strategy.expectedLoss)}
          </p>
          <p className="mt-2 text-xs text-text-subtle">
            {money(saved)} less, for following a card
          </p>
        </div>
      </div>

      <DataTable
        caption={`Expected loss by session length, ${handsPerHour} hands per hour at ${money(bet)} a hand.`}
        columns={["Hours", "Hands", "Wagered", "On instinct", "Basic strategy"]}
        rows={[1, 2, 4, 8, 12].map((h) => {
          const s = blackjackSession(handsPerHour, h, bet, BLACKJACK_EDGE);
          const i = blackjackSession(handsPerHour, h, bet, INTUITION_EDGE);
          return [
            h,
            s.hands,
            money(s.wagered),
            `−${money(i.expectedLoss)}`,
            `−${money(s.expectedLoss)}`,
          ];
        })}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The behavioural lesson is real. A dull mechanical rule beats
          case-by-case judgement, the urge to deviate arrives exactly when the
          rule matters most, and the deviations are what cost the money. That
          pattern shows up in portfolios as reliably as at a table.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">
            But this is the weakest comparison on the site,
          </span>{" "}
          for two reasons. Basic strategy is <em>provably</em> optimal against
          known probabilities; no investing rule has that status, and putting
          &ldquo;always rebalance annually&rdquo; next to &ldquo;always split
          aces&rdquo; lends it a certainty it has not earned.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          And notice where both numbers sit: below zero. Perfect play at
          blackjack still loses money in expectation. Discipline here minimises
          a loss. In a diversified portfolio it improves an already-positive
          expectation. Those are not the same activity.
        </p>
      </div>
    </ExperienceFrame>
  );
}
