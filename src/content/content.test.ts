import { describe, it, expect } from "vitest";
import { ANALOGIES } from "./analogies";
import { CITATIONS, CITATION_LIST } from "./citations";
import { isPublishable, CATEGORY_LABELS } from "./types";

/**
 * Editorial integrity, enforced as tests.
 *
 * The type system already prevents an uncited or one-sided analogy from
 * compiling. These tests cover the rules types cannot express: that sources
 * resolve, that dates and URLs are real, that unverified figures never become
 * headlines, and that disputed findings carry their rebuttal.
 */

describe("citation database", () => {
  it("has a self-consistent id on every entry", () => {
    for (const [key, c] of Object.entries(CITATIONS)) {
      expect(c.id).toBe(key);
    }
  });

  it("gives every source a publisher, a date and an absolute URL", () => {
    for (const c of CITATION_LIST) {
      expect(c.publisher.length).toBeGreaterThan(2);
      expect(c.publicationDate).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(c.url).toMatch(/^https?:\/\//);
      expect(c.statistic.length).toBeGreaterThan(20);
    }
  });

  it("never dates a source in the future", () => {
    const now = new Date();
    for (const c of CITATION_LIST) {
      const year = Number(c.publicationDate.slice(0, 4));
      expect(year).toBeGreaterThan(1900);
      expect(year).toBeLessThanOrEqual(now.getFullYear());
    }
  });

  it("attaches a counter-source to anything marked contested", () => {
    for (const c of CITATION_LIST) {
      if (!c.contested) continue;
      expect(c.contested.counterUrl).toMatch(/^https?:\/\//);
      expect(c.contested.summary.length).toBeGreaterThan(30);
      expect(c.contested.counterTitle.length).toBeGreaterThan(5);
    }
  });

  it("keeps at least one primary-verified source", () => {
    expect(CITATION_LIST.some((c) => c.status === "primary")).toBe(true);
  });
});

describe("analogies", () => {
  it("resolves every citation reference", () => {
    for (const a of ANALOGIES) {
      for (const id of a.citations) {
        expect(CITATIONS[id], `${a.slug} cites unknown source ${id}`).toBeDefined();
      }
    }
  });

  it("cites at least one source per analogy", () => {
    for (const a of ANALOGIES) {
      expect(a.citations.length, a.slug).toBeGreaterThan(0);
    }
  });

  it("states where every analogy breaks down", () => {
    // The core editorial rule. An analogy that only ever flatters the
    // comparison is not education.
    for (const a of ANALOGIES) {
      expect(a.breaksDownBecause.length, a.slug).toBeGreaterThan(0);
      for (const s of a.breaksDownBecause) {
        expect(s.length, `${a.slug}: breakdown too short`).toBeGreaterThan(30);
      }
    }
  });

  it("gives the breakdown at least as much substance as the endorsement", () => {
    // Guards against the failure mode where "what it explains" is three
    // paragraphs and "what it doesn't" is a shrug.
    for (const a of ANALOGIES) {
      const works = a.worksBecause.join(" ").length;
      const breaks = a.breaksDownBecause.join(" ").length;
      expect(breaks, `${a.slug} under-argues its own limits`).toBeGreaterThan(
        works * 0.5
      );
    }
  });

  it("uses unique slugs", () => {
    const slugs = ANALOGIES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const a of ANALOGIES) {
      expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("uses a known category", () => {
    for (const a of ANALOGIES) {
      expect(Object.keys(CATEGORY_LABELS)).toContain(a.category);
    }
  });

  it("gives every tier-1 and tier-2 analogy an interactive", () => {
    for (const a of ANALOGIES) {
      if (a.tier <= 2) expect(a.interactive, a.slug).toBeDefined();
    }
  });

  it("assigns each interactive to exactly one analogy", () => {
    const keys = ANALOGIES.map((a) => a.interactive).filter(Boolean);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("never headlines a figure that is not yet verified", () => {
    // A statistic still marked `to-verify` may inform a page but must not be
    // the number set in 61px at the top of it.
    for (const a of ANALOGIES) {
      const anyPublishable = a.citations.some((id) =>
        isPublishable(CITATIONS[id])
      );
      expect(
        anyPublishable,
        `${a.slug} headlines on unverified sources only`
      ).toBe(true);
    }
  });

  it("builds the expected tier distribution", () => {
    const t1 = ANALOGIES.filter((a) => a.tier === 1).length;
    const t2 = ANALOGIES.filter((a) => a.tier === 2).length;
    expect(t1).toBe(10);
    expect(t2).toBe(6);
    expect(ANALOGIES.length).toBeGreaterThanOrEqual(30);
  });

  it("cites every source it holds at least once", () => {
    const used = new Set(ANALOGIES.flatMap((a) => a.citations));
    const orphans = Object.keys(CITATIONS).filter((id) => !used.has(id as never));
    expect(orphans, `unused sources: ${orphans.join(", ")}`).toHaveLength(0);
  });
});
