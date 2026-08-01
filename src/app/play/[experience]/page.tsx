import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANALOGIES } from "@/content/analogies";
import { Experience } from "@/components/experiences/registry";
import { ReframePanel } from "@/components/ui/reframe-panel";
import type { ExperienceKey } from "@/content/types";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ experience: string }> };

export function generateStaticParams() {
  return ANALOGIES.filter((a) => a.interactive).map((a) => ({
    experience: a.interactive as string,
  }));
}

function find(key: string) {
  return ANALOGIES.find((a) => a.interactive === key);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { experience } = await params;
  const a = find(experience);
  if (!a) return {};
  return {
    title: a.title,
    description: a.casinoComparison,
    alternates: { canonical: `/play/${experience}` },
    openGraph: {
      title: a.title,
      description: a.casinoComparison,
      url: `${SITE.url}/play/${experience}`,
    },
  };
}

export default async function ExperiencePage({ params }: Params) {
  const { experience } = await params;
  const a = find(experience);
  if (!a) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/play" className="text-sm text-text-muted hover:text-text">
        ‹ All experiences
      </Link>

      <header className="measure mt-8">
        <h1 className="display text-3xl sm:text-4xl">{a.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          {a.marketStat}
        </p>
      </header>

      <div className="mt-10">
        <Experience id={a.interactive as ExperienceKey} />
      </div>

      <div className="mt-10">
        <ReframePanel
          worksBecause={a.worksBecause}
          breaksDownBecause={a.breaksDownBecause}
        />
      </div>

      <p className="mt-8 text-sm">
        <Link
          href={`/analogies/${a.slug}`}
          className="text-text-muted underline decoration-border underline-offset-4 hover:text-text"
        >
          Read the full analogy and its sources
        </Link>
      </p>
    </div>
  );
}
