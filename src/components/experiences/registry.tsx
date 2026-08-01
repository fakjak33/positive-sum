import type { ExperienceKey } from "@/content/types";

import { Roulette } from "./roulette";
import { SlotMachine } from "./slot-machine";
import { BestDays } from "./best-days";
import { Diversification } from "./diversification";
import { HouseEdge } from "./house-edge";
import { Crash } from "./crash";
import { HoldingPeriod } from "./holding-period";
import { GuessOdds } from "./guess-odds";
import { CoinFlip } from "./coin-flip";
import { Blackjack } from "./blackjack";
import { Spiva } from "./spiva";
import { DayTraders } from "./day-traders";
import { MaxEffect } from "./max-effect";
import { Ipo } from "./ipo";
import { IntraYear } from "./intra-year";
import { Concentration } from "./concentration";

/**
 * Interactive registry.
 *
 * A plain server-side switch over statically imported client components.
 *
 * This deliberately does NOT use `next/dynamic`. Routing the components
 * through a lazy registry left the server-rendered markup permanently
 * suspended on the client — the DOM was present but never hydrated, so every
 * control was inert. Static imports keep the interactives reliably
 * interactive, which matters more here than shaving a chunk off a site whose
 * pages are all prerendered anyway.
 */
const REGISTRY: Record<ExperienceKey, React.ComponentType> = {
  roulette: Roulette,
  "slot-machine": SlotMachine,
  "best-days": BestDays,
  diversification: Diversification,
  "house-edge": HouseEdge,
  crash: Crash,
  "holding-period": HoldingPeriod,
  "guess-odds": GuessOdds,
  "coin-flip": CoinFlip,
  blackjack: Blackjack,
  spiva: Spiva,
  "day-traders": DayTraders,
  "max-effect": MaxEffect,
  ipo: Ipo,
  "intra-year": IntraYear,
  concentration: Concentration,
};

export function Experience({ id }: { id: ExperienceKey }) {
  const Component = REGISTRY[id];
  if (!Component) return null;
  return <Component />;
}
