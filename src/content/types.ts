/**
 * Content model for Positive Sum.
 *
 * The editorial integrity rules from docs/01-research-corpus.md are expressed
 * here as types rather than as guidelines, because a rule the compiler
 * enforces is a rule that survives contact with a deadline:
 *
 *   - `NonEmpty<CitationId>` — an analogy cannot ship without a source.
 *   - `NonEmpty<string>` on `breaksDownBecause` — an analogy cannot ship
 *     one-sided. Every casino comparison must state where it fails.
 *   - `Citation` requires `publisher`, `publicationDate` and `url`. There is
 *     no "studies suggest" tier.
 *
 * If you find yourself wanting to weaken one of these, the honest move is to
 * cut the analogy instead.
 */

/** An array guaranteed by the compiler to have at least one element. */
export type NonEmpty<T> = [T, ...T[]];

/**
 * How far a statistic has been verified. Anything still `to-verify` must not
 * be rendered as a headline figure — see `isPublishable` below.
 */
export type VerificationStatus =
  /** Confirmed by reading the primary source directly. */
  | "primary"
  /** Figure agrees across independent summaries; primary source identified. */
  | "secondary"
  /** Not yet traced to a primary source. Cannot be a headline figure. */
  | "to-verify";

export type Citation = {
  /** Stable slug used to reference this source from an analogy. */
  readonly id: string;
  readonly title: string;
  readonly authors?: readonly string[];
  /** The organisation that published it, not the site that summarised it. */
  readonly publisher: string;
  /** ISO 8601. Use the year alone (`"2018"`) when that is all that is known. */
  readonly publicationDate: string;
  readonly url: string;
  /** The specific claim this source supports, in one sentence. */
  readonly statistic: string;
  /** e.g. "Dec 1925 – Dec 2023, CRSP universe". */
  readonly samplePeriod?: string;
  /**
   * Qualifiers without which the number misleads: nominal vs real, total
   * return vs price return, pre- or post-fee, pre- or post-tax.
   */
  readonly assumptions?: readonly string[];
  readonly status: VerificationStatus;
  /**
   * Set when the finding is genuinely disputed in the literature. The UI
   * renders both sides together rather than picking the louder one.
   */
  readonly contested?: {
    readonly summary: string;
    readonly counterTitle: string;
    readonly counterUrl: string;
  };
};

export type Category =
  | "skew"
  | "costs"
  | "behaviour"
  | "time"
  | "diversification"
  | "skill";

export const CATEGORY_LABELS: Record<Category, string> = {
  skew: "Concentration & skew",
  costs: "Costs & expectancy",
  behaviour: "Behaviour",
  time: "Time & timing",
  diversification: "Diversification",
  skill: "Skill & luck",
};

/**
 * Build tier.
 *  1 — bespoke full interactive
 *  2 — chart with a focused interaction
 *  3 — cited card with a small static visual
 */
export type Tier = 1 | 2 | 3;

/** Keys of the interactive experiences. Kept as a union so routes are typed. */
export type ExperienceKey =
  | "roulette"
  | "slot-machine"
  | "best-days"
  | "diversification"
  | "house-edge"
  | "crash"
  | "holding-period"
  | "guess-odds"
  | "coin-flip"
  | "blackjack"
  | "spiva"
  | "day-traders"
  | "max-effect"
  | "ipo"
  | "intra-year"
  | "concentration";

export type Analogy<TCitationId extends string = string> = {
  readonly slug: string;
  readonly title: string;
  readonly category: Category;
  readonly tier: Tier;
  /** The market fact, stated plainly. */
  readonly marketStat: string;
  /** The headline figure, formatted for display (e.g. "51.6%"). */
  readonly headline: string;
  /** One line under the headline saying what the figure measures. */
  readonly headlineCaption: string;
  /** The casino comparison being drawn. */
  readonly casinoComparison: string;
  /** Why the two behave alike — the mechanism, not the vibe. */
  readonly explanation: string;
  /** What the analogy genuinely teaches. */
  readonly worksBecause: NonEmpty<string>;
  /** Where it fails. Required: no one-sided analogies. */
  readonly breaksDownBecause: NonEmpty<string>;
  /** Required: no uncited claims. */
  readonly citations: NonEmpty<TCitationId>;
  readonly interactive?: ExperienceKey;
  readonly tags: readonly string[];
};

/**
 * A statistic may headline a page only once it has been traced to a primary
 * or corroborated secondary source. Used by the build-time content check.
 */
export function isPublishable(citation: Citation): boolean {
  return citation.status !== "to-verify";
}
