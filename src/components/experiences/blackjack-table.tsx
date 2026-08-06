"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  freshShoe,
  handValue,
  isBlackjack,
  basicStrategy,
  playDealer,
  settle,
  payout,
  type Card,
  type Hand,
  type Move,
  type Outcome,
} from "@/lib/sim/blackjack";

const BET = 10;

/**
 * A playable blackjack table.
 *
 * The teaching device is the running comparison: alongside your bankroll, the
 * table tracks what a player following basic strategy mechanically would have
 * on the SAME cards. You are not playing against the house so much as against
 * the printed card — which is the actual lesson.
 */
export function BlackjackTable({ seed }: { seed: number }) {
  const shoeRef = useRef<Card[]>(freshShoe(seed));
  const posRef = useRef(0);

  const [player, setPlayer] = useState<Hand>([]);
  const [dealer, setDealer] = useState<Hand>([]);
  const [phase, setPhase] = useState<"idle" | "player" | "done">("idle");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [bet, setBet] = useState(BET);

  const [you, setYou] = useState(0);
  const [strategyBank, setStrategyBank] = useState(0);
  const [hands, setHands] = useState(0);
  const [deviations, setDeviations] = useState(0);

  const draw = useCallback(() => {
    if (posRef.current >= shoeRef.current.length - 20) {
      shoeRef.current = freshShoe(seed + posRef.current);
      posRef.current = 0;
    }
    return shoeRef.current[posRef.current++];
  }, [seed]);

  function deal() {
    const p = [draw(), draw()];
    const d = [draw(), draw()];
    setPlayer(p);
    setDealer(d);
    setBet(BET);
    setOutcome(null);

    if (isBlackjack(p) || isBlackjack(d)) {
      finish(p, d, BET);
    } else {
      setPhase("player");
    }
  }

  function finish(p: Hand, d: Hand, stake: number) {
    let dealerHand = d;
    if (handValue(p).total <= 21) {
      const res = playDealer(d, shoeRef.current, posRef.current);
      posRef.current = res.next;
      dealerHand = res.hand;
      setDealer(res.hand);
    }
    const o = settle(p, dealerHand);
    setOutcome(o);
    setYou((v) => v + payout(o, stake));
    setPhase("done");
    setHands((h) => h + 1);
  }

  function act(move: Move) {
    if (phase !== "player") return;

    // What the printed card would have done on this exact hand.
    const correct = basicStrategy(player, dealer[0]);
    if (move !== correct) setDeviations((d) => d + 1);

    if (move === "stand") {
      finish(player, dealer, bet);
      return;
    }

    const next = [...player, draw()];
    const stake = move === "double" ? bet * 2 : bet;
    if (move === "double") setBet(stake);
    setPlayer(next);

    if (handValue(next).total > 21 || move === "double") {
      finish(next, dealer, stake);
    }
  }

  /**
   * Replay the same starting cards under basic strategy, so the comparison is
   * like-for-like. It draws from a private copy of the shoe rather than the
   * live one, so the two players never affect each other's cards.
   */
  const playStrategyHand = useCallback(() => {
    const shoe = freshShoe(seed + hands * 31 + 1);
    let i = 0;
    let p: Hand = [shoe[i++], shoe[i++]];
    const d: Hand = [shoe[i++], shoe[i++]];
    let stake = BET;

    if (!isBlackjack(p) && !isBlackjack(d)) {
      while (true) {
        const move = basicStrategy(p, d[0]);
        if (move === "stand") break;
        if (move === "double") {
          stake = BET * 2;
          p = [...p, shoe[i++]];
          break;
        }
        p = [...p, shoe[i++]];
        if (handValue(p).total > 21) break;
      }
    }

    let dh = d;
    if (handValue(p).total <= 21) {
      const res = playDealer(d, shoe, i);
      dh = res.hand;
    }
    return payout(settle(p, dh), stake);
  }, [seed, hands]);

  function nextHand() {
    setStrategyBank((v) => v + playStrategyHand());
    deal();
  }

  const hint = useMemo(
    () => (phase === "player" && player.length && dealer.length
      ? basicStrategy(player, dealer[0])
      : null),
    [phase, player, dealer]
  );

  const pv = handValue(player);
  const dv = handValue(dealer);

  return (
    <div className="rounded-lg border border-border bg-bg p-5">
      {/* Dealer */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
          Dealer{" "}
          {phase === "done" && dealer.length > 0 && (
            <span className="tabular text-text-muted">— {dv.total}</span>
          )}
        </p>
        <div className="mt-2 flex gap-2" aria-live="polite">
          {dealer.map((c, i) => (
            <CardFace
              key={i}
              card={c}
              hidden={phase === "player" && i === 1}
              delay={i * 90}
            />
          ))}
          {dealer.length === 0 && <Placeholder />}
        </div>
      </div>

      {/* Player */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
          You{" "}
          {player.length > 0 && (
            <span className="tabular text-text-muted">
              — {pv.total}
              {pv.soft && pv.total <= 21 ? " (soft)" : ""}
            </span>
          )}
        </p>
        <div className="mt-2 flex gap-2" aria-live="polite">
          {player.map((c, i) => (
            <CardFace key={i} card={c} delay={i * 90} />
          ))}
          {player.length === 0 && <Placeholder />}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap gap-2">
        {phase === "player" ? (
          <>
            <Action onClick={() => act("hit")}>Hit</Action>
            <Action onClick={() => act("stand")}>Stand</Action>
            {player.length === 2 && (
              <Action onClick={() => act("double")}>Double</Action>
            )}
          </>
        ) : (
          <Action primary onClick={nextHand}>
            {phase === "idle" ? "Deal" : "Next hand"}
          </Action>
        )}
      </div>

      {hint && (
        <p className="mt-3 text-xs text-text-subtle">
          The printed card says:{" "}
          <span className="font-bold uppercase text-market">{hint}</span>
        </p>
      )}

      {outcome && (
        <p
          className={`animate-fade-up mt-4 text-lg font-bold uppercase tracking-wider ${
            outcome === "lose"
              ? "text-loss"
              : outcome === "push"
                ? "text-text-muted"
                : "text-gain"
          }`}
          role="status"
        >
          {outcome === "blackjack" ? "Blackjack — pays 3:2" : outcome}
        </p>
      )}

      {/* The actual lesson */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Your bankroll" value={you} />
        <Stat label="Basic strategy, same seed" value={strategyBank} />
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
            Times you deviated
          </p>
          <p
            className={`tabular mt-1 text-xl ${deviations > 0 ? "text-rare" : "text-text"}`}
          >
            {deviations}
            <span className="text-sm text-text-subtle"> / {hands || 0}</span>
          </p>
        </div>
      </div>

      <p className="measure mt-4 text-xs leading-relaxed text-text-subtle">
        Both columns are playing the same game against the same house edge.
        Over a short session the gap is mostly noise — which is itself the
        lesson, and the reason a few good hands tell you nothing about whether
        you are playing well.
      </p>
    </div>
  );
}

function Action({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-md px-5 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-px active:translate-y-0 ${
        primary
          ? "bg-text text-bg hover:opacity-90"
          : "border border-border text-text-muted hover:bg-surface-raised hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

function CardFace({
  card,
  hidden,
  delay = 0,
}: {
  card: Card;
  hidden?: boolean;
  delay?: number;
}) {
  const red = false; // suits are omitted; colour would imply information it doesn't carry
  return (
    <div
      className="animate-pop grid h-20 w-14 place-items-center rounded-md border-2 border-border-strong bg-surface-raised"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={hidden ? "Face-down card" : `${card.rank}`}
    >
      <span
        className={`tabular text-xl font-bold ${hidden ? "text-text-subtle" : red ? "text-loss" : "text-text"}`}
      >
        {hidden ? "?" : card.rank}
      </span>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="grid h-20 w-14 place-items-center rounded-md border-2 border-dashed border-border">
      <span className="text-text-subtle">·</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
        {label}
      </p>
      <p
        className={`tabular mt-1 text-xl ${value > 0 ? "text-gain" : value < 0 ? "text-loss" : "text-text"}`}
      >
        {value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(0)}
      </p>
    </div>
  );
}
