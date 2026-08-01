import type { Citation } from "@/content/types";

const STATUS_LABEL: Record<Citation["status"], string> = {
  primary: "Verified against the primary source",
  secondary: "Corroborated; primary source identified",
  "to-verify": "Not yet traced to a primary source",
};

const STATUS_TONE: Record<Citation["status"], string> = {
  primary: "text-gain",
  secondary: "text-text-muted",
  "to-verify": "text-rare",
};

/**
 * A single source, with everything needed to check it.
 *
 * Assumptions are rendered inline rather than hidden behind a disclosure,
 * because a return figure without its qualifiers (nominal or real, total or
 * price, pre- or post-fee) is not a finished citation.
 *
 * Contested findings render their rebuttal in the same card at the same size.
 */
export function SourceCard({ citation }: { citation: Citation }) {
  const year = citation.publicationDate.slice(0, 4);

  return (
    <li className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-sm font-medium">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline decoration-border underline-offset-4 hover:decoration-text-muted"
          >
            {citation.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>
        <span className="tabular text-xs text-text-subtle">{year}</span>
      </div>

      <p className="mt-1 text-xs text-text-muted">
        {citation.authors?.length ? `${citation.authors.join(", ")} — ` : ""}
        {citation.publisher}
      </p>

      <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
        {citation.statistic}
      </p>

      {citation.samplePeriod && (
        <p className="mt-3 text-xs text-text-subtle">
          <span className="uppercase tracking-widest">Sample</span>{" "}
          {citation.samplePeriod}
        </p>
      )}

      {citation.assumptions?.length ? (
        <div className="mt-3">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Assumptions
          </p>
          <ul className="mt-1.5 space-y-1">
            {citation.assumptions.map((a) => (
              <li key={a} className="flex gap-2 text-xs leading-relaxed text-text-muted">
                <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-border-strong" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {citation.contested && (
        <div className="mt-4 rounded-md border border-rare/30 bg-rare/5 p-3">
          <p className="text-xs font-medium uppercase tracking-widest text-rare">
            This finding is disputed
          </p>
          <p className="measure mt-1.5 text-xs leading-relaxed text-text-muted">
            {citation.contested.summary}
          </p>
          <a
            href={citation.contested.counterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-text underline decoration-border underline-offset-4 hover:decoration-text-muted"
          >
            {citation.contested.counterTitle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      <p className={`mt-3 text-xs ${STATUS_TONE[citation.status]}`}>
        {STATUS_LABEL[citation.status]}
      </p>
    </li>
  );
}
