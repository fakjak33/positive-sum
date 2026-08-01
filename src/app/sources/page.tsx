import type { Metadata } from "next";
import { CITATION_LIST } from "@/content/citations";
import { ANALOGIES } from "@/content/analogies";
import { SourceCard } from "@/components/ui/source-card";
import {
  annualMeta,
  dailyMeta,
  monthlyMeta,
  constituentsMeta,
  drawdownsMeta,
  casinoMeta,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Every statistic used on this site, with its publisher, date, sample period, assumptions and a link to the original.",
  alternates: { canonical: "/sources" },
};

export default function SourcesPage() {
  const sorted = [...CITATION_LIST].sort((a, b) =>
    b.publicationDate.localeCompare(a.publicationDate)
  );

  const datasets = [
    annualMeta,
    dailyMeta,
    monthlyMeta,
    constituentsMeta,
    drawdownsMeta,
    casinoMeta,
  ];

  const counts = {
    primary: CITATION_LIST.filter((c) => c.status === "primary").length,
    secondary: CITATION_LIST.filter((c) => c.status === "secondary").length,
    toVerify: CITATION_LIST.filter((c) => c.status === "to-verify").length,
    contested: CITATION_LIST.filter((c) => c.contested).length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="measure">
        <h1 className="display text-3xl sm:text-4xl">Sources</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          Every figure on this site traces to one of these. Assumptions are
          shown with the number, because a return figure without them —
          nominal or real, total or price, before or after fees — is not a
          finished citation.
        </p>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Sources" value={CITATION_LIST.length} />
        <Stat label="Analogies" value={ANALOGIES.length} />
        <Stat label="Primary-verified" value={counts.primary} />
        <Stat label="Disputed" value={counts.contested} tone="text-rare" />
      </dl>

      {counts.toVerify > 0 && (
        <p className="measure mt-6 rounded-lg border border-rare/30 bg-rare/5 p-4 text-sm leading-relaxed text-text-muted">
          {counts.toVerify} source
          {counts.toVerify === 1 ? " is" : "s are"} still marked as not yet
          traced to a primary document. Nothing in that state is used as a
          headline figure — the content tests enforce it.
        </p>
      )}

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-widest text-text-subtle">
          Published research
        </h2>
        <ul className="mt-4 space-y-3">
          {sorted.map((c) => (
            <SourceCard key={c.id} citation={c} />
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-widest text-text-subtle">
          Datasets bundled with this app
        </h2>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          These are committed to the repository as JSON with provenance
          headers, so every chart is reproducible and the app works offline.
        </p>
        <ul className="mt-4 space-y-3">
          {datasets.map((d) => (
            <li
              key={d.name}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="text-sm font-medium">
                <a
                  href={d.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text underline decoration-border underline-offset-4 hover:decoration-text-muted"
                >
                  {d.name}
                </a>
              </h3>
              <p className="mt-1 text-xs text-text-muted">{d.source}</p>
              <p className="mt-2 text-xs text-text-subtle">
                Retrieved {d.retrieved}
              </p>
              <ul className="mt-3 space-y-1">
                {d.assumptions.map((a) => (
                  <li
                    key={a}
                    className="flex gap-2 text-xs leading-relaxed text-text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-border-strong"
                    />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "text-text",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <dt className="text-xs uppercase tracking-widest text-text-subtle">
        {label}
      </dt>
      <dd className={`tabular mt-1.5 text-2xl ${tone}`}>{value}</dd>
    </div>
  );
}
