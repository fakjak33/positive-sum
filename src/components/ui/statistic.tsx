type Props = {
  /** Pre-formatted display value, e.g. "51.6%" or "2× Kelly ≈ 0". */
  value: string;
  caption?: string;
  className?: string;
  tone?: "default" | "gain" | "loss" | "rare" | "market";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-text",
  gain: "text-gain",
  loss: "text-loss",
  rare: "text-rare",
  market: "text-market",
};

/**
 * The hero figure at the top of an analogy page.
 *
 * Renders a plain string rather than animating a count-up. An earlier version
 * counted up from zero, but the headlines here are frequently not numbers at
 * all — "2× Kelly ≈ 0", "Same average, different ending", "The whole argument"
 * — so a numeric animation was both dead code and the wrong idea for the
 * content.
 *
 * The reveal is CSS-only and therefore already respects
 * `prefers-reduced-motion` via the global rule in globals.css, with no
 * JavaScript needed and nothing withheld from anyone.
 */
export function Statistic({
  value,
  caption,
  className = "",
  tone = "default",
}: Props) {
  return (
    <div className={className}>
      <p
        className={`tabular animate-fade-up text-4xl leading-none sm:text-5xl ${TONE[tone]}`}
      >
        {value}
      </p>
      {caption && (
        <p className="measure mt-3 text-sm text-text-muted">{caption}</p>
      )}
    </div>
  );
}
