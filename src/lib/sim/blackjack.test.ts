import { describe, it, expect } from "vitest";
import {
  freshShoe,
  handValue,
  isBlackjack,
  basicStrategy,
  playDealer,
  settle,
  payout,
  type Hand,
} from "./blackjack";

const card = (rank: string, value: number) => ({ rank, value });
const A = card("A", 11);
const K = card("K", 10);
const T = card("10", 10);
const NINE = card("9", 9);
const SIX = card("6", 6);
const FIVE = card("5", 5);
const TWO = card("2", 2);

describe("shoe", () => {
  it("holds six full decks", () => {
    const shoe = freshShoe(1);
    expect(shoe).toHaveLength(312);
  });

  it("has the right rank distribution", () => {
    const shoe = freshShoe(1);
    // 24 of each rank in six decks; 96 ten-valued cards (10/J/Q/K).
    expect(shoe.filter((c) => c.rank === "A")).toHaveLength(24);
    expect(shoe.filter((c) => c.value === 10)).toHaveLength(96);
  });

  it("is reproducible for a seed", () => {
    expect(freshShoe(42)).toEqual(freshShoe(42));
    expect(freshShoe(1)).not.toEqual(freshShoe(2));
  });
});

describe("hand value", () => {
  it("counts an ace as 11 when it fits", () => {
    expect(handValue([A, SIX])).toEqual({ total: 17, soft: true });
  });

  it("demotes an ace to avoid busting", () => {
    expect(handValue([A, SIX, K])).toEqual({ total: 17, soft: false });
  });

  it("demotes multiple aces independently", () => {
    expect(handValue([A, A, NINE]).total).toBe(21);
  });

  it("recognises blackjack only on two cards", () => {
    expect(isBlackjack([A, K])).toBe(true);
    expect(isBlackjack([A, FIVE, FIVE])).toBe(false);
  });
});

describe("basic strategy", () => {
  it("stands on hard 17 or better", () => {
    expect(basicStrategy([K, NINE], SIX)).toBe("stand");
  });

  it("hits hard 16 against a strong dealer card", () => {
    expect(basicStrategy([K, SIX], NINE)).toBe("hit");
  });

  it("stands on hard 16 against a weak dealer card", () => {
    expect(basicStrategy([K, SIX], SIX)).toBe("stand");
  });

  it("doubles 11", () => {
    expect(basicStrategy([SIX, FIVE], NINE)).toBe("double");
  });

  it("never doubles on three cards", () => {
    expect(basicStrategy([TWO, FIVE, card("4", 4)], NINE)).not.toBe("double");
  });

  it("hits 12 against a 2 but stands against a 5", () => {
    expect(basicStrategy([K, TWO], TWO)).toBe("hit");
    expect(basicStrategy([K, TWO], FIVE)).toBe("stand");
  });

  it("stands on soft 19", () => {
    expect(basicStrategy([A, card("8", 8)], SIX)).toBe("stand");
  });

  it("always has a legal move for any two-card hand", () => {
    const shoe = freshShoe(7);
    for (let i = 0; i + 2 < shoe.length; i += 3) {
      const hand: Hand = [shoe[i], shoe[i + 1]];
      const move = basicStrategy(hand, shoe[i + 2]);
      expect(["hit", "stand", "double"]).toContain(move);
    }
  });
});

describe("dealer play", () => {
  it("draws to 17", () => {
    const shoe = [card("3", 3), card("4", 4), K];
    const { hand } = playDealer([card("7", 7), FIVE], shoe, 0);
    expect(handValue(hand).total).toBeGreaterThanOrEqual(17);
  });

  it("stands on soft 17", () => {
    const { hand } = playDealer([A, SIX], freshShoe(3), 0);
    expect(hand).toHaveLength(2);
  });
});

describe("settlement", () => {
  it("pays blackjack 3:2", () => {
    expect(payout(settle([A, K], [K, NINE]), 10)).toBe(15);
  });

  it("pushes on equal blackjacks", () => {
    expect(settle([A, K], [A, T])).toBe("push");
  });

  it("loses a bust regardless of the dealer", () => {
    expect(settle([K, NINE, FIVE], [K, K, K])).toBe("lose");
  });

  it("wins when the dealer busts", () => {
    expect(settle([K, NINE], [K, SIX, NINE])).toBe("win");
  });

  it("pushes on equal totals", () => {
    expect(settle([K, NINE], [T, NINE])).toBe("push");
  });

  it("never pays out on a push", () => {
    expect(payout("push", 25)).toBe(0);
  });
});

describe("the house edge is real", () => {
  it("loses money over many hands played by basic strategy", () => {
    // Not a precise edge measurement — no splits or insurance — but perfect
    // play must still lose. If this ever turns positive, the engine is wrong.
    let bank = 0;
    for (let h = 0; h < 4000; h++) {
      const shoe = freshShoe(h * 17 + 3);
      let i = 0;
      let player: Hand = [shoe[i++], shoe[i++]];
      const dealer: Hand = [shoe[i++], shoe[i++]];
      let stake = 1;

      if (!isBlackjack(player) && !isBlackjack(dealer)) {
        while (true) {
          const move = basicStrategy(player, dealer[0]);
          if (move === "stand") break;
          if (move === "double") {
            stake = 2;
            player = [...player, shoe[i++]];
            break;
          }
          player = [...player, shoe[i++]];
          if (handValue(player).total > 21) break;
        }
      }

      let dh = dealer;
      if (handValue(player).total <= 21) {
        dh = playDealer(dealer, shoe, i).hand;
      }
      bank += payout(settle(player, dh), stake);
    }
    expect(bank).toBeLessThan(0);
  });
});
