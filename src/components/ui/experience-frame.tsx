"use client";

import type { DatasetMeta } from "@/lib/data";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  title: string;
  intro?: string;
  /** Datasets this interactive draws on — shown so the numbers are traceable. */
  datasets?: readonly DatasetMeta[];
  onReset?: () => void;
  seed?: number;
  onReseed?: () => void;
  children: React.ReactNode;
};

/**
 * Chrome shared by every interactive: title, reset, seed control and the
 * provenance of whatever data is on screen.
 *
 * Exposing the seed is what makes a run shareable — someone can send a link
 * that reproduces exactly the simulation they saw, rather than a different one
 * that happens to make the same point.
 */
export function ExperienceFrame({
  title,
  intro,
  datasets,
  onReset,
  seed,
  onReseed,
  children,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="display text-xl">{title}</h2>
          {intro && (
            <p className="measure mt-2 text-sm text-text-muted">{intro}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {seed !== undefined && (
            <span className="tabular hidden text-xs text-text-subtle sm:inline">
              seed {seed}
            </span>
          )}
          {onReseed && (
            <button
              type="button"
              onClick={onReseed}
              className="min-h-11 rounded-md border border-border px-3 text-xs text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
            >
              New run
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 rounded-md border border-border px-3 text-xs text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">{children}</div>

      {reduced && (
        <p className="mt-4 text-xs text-text-subtle">
          Reduced motion is on, so results appear immediately rather than
          animating. Nothing is omitted.
        </p>
      )}

      {datasets?.length ? (
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Data on screen
          </p>
          <ul className="mt-2 space-y-1.5">
            {datasets.map((d) => (
              <li key={d.name} className="text-xs leading-relaxed text-text-muted">
                <a
                  href={d.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-4 hover:decoration-text-muted"
                >
                  {d.name}
                </a>
                {" — "}
                {d.source}
                {d.assumptions[0] ? (
                  <span className="text-text-subtle"> · {d.assumptions[0]}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
