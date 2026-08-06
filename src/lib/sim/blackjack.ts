import { mulberry32, randInt } from "./random";

/**
 * A minimal but honest blackjack engine.
 *
 * Enough rules to make the basic-strategy lesson real: a six-deck shoe, dealer
 * stands on soft 17, blackjack pays 3:2, hit/stand/double. Splitting and
 * insurance are deliberately omitted — they add a lot of code and change the
 * edge by a fraction of a percent, and the point here is the gap between
 * following a rule and improvising, not casino-grade fidelity.
 *
 * Seeded throughout, so a hand can be reproduced and shared.
 */

export type Card = { rank: string; value: number };
export type Hand = Card[];

const RANKS: readonly [string, number][] = [
  ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8],
  ["9", 9], ["10", 10], ["J", 10], ["Q", 10], ["K", 10], ["A", 11],
];

export function freshShoe(seed: number, decks = 6): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < decks; d++) {
    for (let s = 0; s < 4; s++) {
      for (const [rank, value] of RANKS) cards.push({ rank, value });
    }
  }
  const rng = mulberry32(seed);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/** Best total for a hand, demoting aces from 11 to 1 as needed. */
export function handValue(hand: Hand): { total: number; soft: boolean } {
  let total = hand.reduce((s, c) => s + c.value, 0);
  let aces = hand.filter((c) => c.rank === "A").length;
  let soft = aces > 0;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
    soft = aces > 0;
  }
  return { total, soft };
}

export function isBlackjack(hand: Hand): boolean {
  return hand.length === 2 && handValue(hand).total === 21;
}

export type Move = "hit" | "stand" | "double";

/**
 * Basic strategy for the rules above.
 *
 * This is the printed card: no counting, no judgement, no reading the dealer.
 * That is exactly the point — the lesson is that a mechanical rule beats
 * improvisation, not that the rule is clever.
 */
export function basicStrategy(hand: Hand, dealerUp: Card): Move {
  const { total, soft } = handValue(hand);
  const up = dealerUp.value === 11 ? 11 : dealerUp.value;
  const canDouble = hand.length === 2;

  if (soft) {
    if (total >= 19) return "stand";
    if (total === 18) {
      if (up >= 9) return "hit";
      if (up >= 3 && up <= 6 && canDouble) return "double";
      return "stand";
    }
    if (total === 17 && up >= 3 && up <= 6 && canDouble) return "double";
    if (total >= 15 && total <= 16 && up >= 4 && up <= 6 && canDouble) return "double";
    if (total >= 13 && total <= 14 && up >= 5 && up <= 6 && canDouble) return "double";
    return "hit";
  }

  if (total >= 17) return "stand";
  if (total >= 13 && total <= 16) return up >= 7 ? "hit" : "stand";
  if (total === 12) return up >= 4 && up <= 6 ? "stand" : "hit";
  if (total === 11) return canDouble ? "double" : "hit";
  if (total === 10) return up <= 9 && canDouble ? "double" : "hit";
  if (total === 9) return up >= 3 && up <= 6 && canDouble ? "double" : "hit";
  return "hit";
}

export type Outcome = "win" | "lose" | "push" | "blackjack";

/** Dealer draws to 17, standing on soft 17. */
export function playDealer(hand: Hand, shoe: Card[], from: number) {
  let i = from;
  const h = hand.slice();
  while (true) {
    const { total } = handValue(h);
    if (total >= 17) break;
    h.push(shoe[i++]);
  }
  return { hand: h, next: i };
}

export function settle(player: Hand, dealer: Hand): Outcome {
  const p = handValue(player).total;
  const d = handValue(dealer).total;
  if (p > 21) return "lose";
  if (isBlackjack(player) && !isBlackjack(dealer)) return "blackjack";
  if (isBlackjack(dealer) && !isBlackjack(player)) return "lose";
  if (d > 21) return "win";
  if (p > d) return "win";
  if (p < d) return "lose";
  return "push";
}

export function payout(outcome: Outcome, bet: number): number {
  switch (outcome) {
    case "blackjack":
      return bet * 1.5;
    case "win":
      return bet;
    case "lose":
      return -bet;
    case "push":
      return 0;
  }
}
