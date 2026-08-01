import { mulberry32 } from "./random";

export type SpinOutcome = { bet: number; won: boolean; bankroll: number };

/**
 * Simulate repeated even-money bets against a fixed house edge.
 *
 * An even-money bet with house edge h wins with probability (1 − h) / 2.
 * American roulette red/black: (1 − 0.0526)/2 = 0.4737, which is 18/38. That
 * identity is asserted in the tests — it is the check that the parameterisation
 * is right rather than merely plausible.
 */
export function simulateEvenMoneyBets(
  houseEdge: number,
  bets: number,
  stake: number,
  startingBankroll: number,
  seed: number
): { history: SpinOutcome[]; final: number; ruined: boolean } {
  const rng = mulberry32(seed);
  const winProb = (1 - houseEdge) / 2;
  const history: SpinOutcome[] = [];
  let bankroll = startingBankroll;
  let ruined = false;

  for (let i = 1; i <= bets; i++) {
    if (bankroll < stake) {
      ruined = true;
      break;
    }
    const won = rng() < winProb;
    bankroll += won ? stake : -stake;
    history.push({ bet: i, won, bankroll });
  }

  return { history, final: bankroll, ruined };
}

/**
 * A positive-expectancy coin flipped at a chosen stake fraction — the
 * ergodicity demonstration.
 *
 * The default (+50% / −40%) has a clearly positive expected value at full
 * stake yet drives almost every individual path toward zero, because the
 * time-average growth rate and the ensemble-average return are different
 * quantities. Kelly sizing is what reconciles them.
 */
export function simulateErgodicCoin(
  upFactor: number,
  downFactor: number,
  winProb: number,
  fraction: number,
  rounds: number,
  paths: number,
  seed: number
): {
  finals: number[];
  median: number;
  mean: number;
  ruinShare: number;
  samplePaths: number[][];
} {
  const rng = mulberry32(seed);
  const finals: number[] = [];
  const samplePaths: number[][] = [];

  for (let p = 0; p < paths; p++) {
    let wealth = 1;
    const keep = p < 40; // keep a handful of paths for the chart
    const path = keep ? [1] : null;

    for (let r = 0; r < rounds; r++) {
      const win = rng() < winProb;
      const move = win ? upFactor : downFactor;
      // Only `fraction` of wealth is exposed; the rest sits out.
      wealth = wealth * (1 - fraction) + wealth * fraction * (1 + move);
      if (path) path.push(wealth);
    }

    finals.push(wealth);
    if (path) samplePaths.push(path);
  }

  const sorted = finals.slice().sort((a, b) => a - b);
  return {
    finals,
    median: sorted[Math.floor(sorted.length / 2)] ?? 0,
    mean: finals.reduce((a, b) => a + b, 0) / (finals.length || 1),
    // "Ruin" here means having lost 99% of the starting stake — with
    // fractional betting you approach zero without ever exactly reaching it.
    ruinShare: finals.filter((f) => f < 0.01).length / (finals.length || 1),
    samplePaths,
  };
}

/**
 * Blackjack expectancy comparison: mechanical basic strategy against
 * improvised play, expressed as expected loss over a session.
 *
 * These are house-edge figures applied analytically rather than a hand-by-hand
 * simulation — the app is illustrating the size of the gap, not teaching card
 * play, and pretending to simulate real blackjack would overstate its fidelity.
 */
export function blackjackSession(
  handsPerHour: number,
  hours: number,
  betSize: number,
  houseEdge: number
): { hands: number; wagered: number; expectedLoss: number } {
  const hands = handsPerHour * hours;
  const wagered = hands * betSize;
  return { hands, wagered, expectedLoss: wagered * houseEdge };
}
