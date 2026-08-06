"use client";

import { useId } from "react";
import {
  constituentYears,
  statsForYear,
  pooledStats,
  GOOD_COVERAGE,
} from "@/lib/data";

/** `null` means "all years pooled". */
export type YearSelection = number | null;

type Props = {
  value: YearSelection;
  onChange: (v: YearSelection) => void;
  /** Seeded randomness is the caller's job, so the choice stays reproducible. */
  onRandom?: () => void;
};

/**
 * Year selector shared by the data-driven interactives.
 *
 * Betting the whole argument on a single flattering year would be exactly the
 * cherry-picking this site criticises, so the default is every year pooled and
 * any individual year is one click away.
 */
export function YearPicker({ value, onChange, onRandom }: Props) {
  const id = useId();
  const stat = value === null ? null : statsForYear(value);

  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-widest text-text-subtle"
        >
          Sample
        </label>

        <select
          id={id}
          value={value === null ? "all" : String(value)}
          onChange={(e) =>
            onChange(e.target.value === "all" ? null : Number(e.target.value))
          }
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm font-bold text-text"
        >
          <option value="all">
            All years ({constituentYears[0]}–
            {constituentYears[constituentYears.length - 1]})
          </option>
          {constituentYears
            .slice()
            .reverse()
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>

        {onRandom && (
          <button
            type="button"
            onClick={onRandom}
            className="min-h-11 rounded-md border border-border px-3 text-xs font-bold uppercase tracking-wider text-text-muted transition-all hover:-translate-y-px hover:bg-surface hover:text-text active:translate-y-0"
          >
            Random year
          </button>
        )}

        {value !== null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-11 rounded-md px-3 text-xs font-bold uppercase tracking-wider text-text-subtle transition-colors hover:text-text"
          >
            Back to all years
          </button>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-text-subtle">
        {value === null ? (
          <>
            <span className="font-bold text-text-muted">
              {pooledStats.observations.toLocaleString()} company-years
            </span>{" "}
            across {constituentYears.length} calendar years, pooled. One
            observation per company per year.
          </>
        ) : stat ? (
          <>
            <span className="font-bold text-text-muted">
              {stat.count} of the {stat.inIndex} companies
            </span>{" "}
            actually in the index in {value} ({(stat.coverage * 100).toFixed(0)}%
            covered).{" "}
            {stat.coverage < GOOD_COVERAGE && (
              <span className="text-rare">
                Thin coverage — many companies from this era have no price
                history left anywhere public, and those are disproportionately
                the worst outcomes.
              </span>
            )}
          </>
        ) : null}
      </p>
    </div>
  );
}
