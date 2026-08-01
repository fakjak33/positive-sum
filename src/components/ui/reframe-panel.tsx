import type { NonEmpty } from "@/content/types";

type Props = {
  worksBecause: NonEmpty<string>;
  breaksDownBecause: NonEmpty<string>;
};

/**
 * The "what this explains / what it doesn't" pair.
 *
 * This component is the reason the site exists, so its API is deliberately
 * constrained: there is no `primary`, `emphasis` or `variant` prop. Both
 * panels get identical width, identical type and identical weight, and no
 * caller can style one as the conclusion.
 *
 * The only visual difference is a thin accent rule, which distinguishes the
 * two without ranking them.
 */
export function ReframePanel({ worksBecause, breaksDownBecause }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <section
        aria-labelledby="works-heading"
        className="lift rounded-lg border border-border bg-surface p-5 hover:border-border-strong"
      >
        <div className="mb-4 flex items-center gap-2">
          <span aria-hidden="true" className="h-4 w-0.5 rounded bg-gain" />
          <h3
            id="works-heading"
            className="text-xs font-extrabold uppercase tracking-widest text-text"
          >
            What this explains well
          </h3>
        </div>
        <ul className="stagger space-y-3">
          {worksBecause.map((point, i) => (
            <li
              key={point}
              style={{ "--i": i } as React.CSSProperties}
              className="flex gap-3 text-sm leading-relaxed"
            >
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gain" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="breaks-heading"
        className="lift rounded-lg border border-border bg-surface p-5 hover:border-border-strong"
      >
        <div className="mb-4 flex items-center gap-2">
          <span aria-hidden="true" className="h-4 w-0.5 rounded bg-loss" />
          <h3
            id="breaks-heading"
            className="text-xs font-extrabold uppercase tracking-widest text-text"
          >
            What it does not explain
          </h3>
        </div>
        <ul className="stagger space-y-3">
          {breaksDownBecause.map((point, i) => (
            <li
              key={point}
              style={{ "--i": i } as React.CSSProperties}
              className="flex gap-3 text-sm leading-relaxed"
            >
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-loss" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
