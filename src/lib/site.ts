/**
 * Global site constants.
 *
 * The name is the thesis: a casino is negative-sum by construction, a market
 * is positive-sum because the underlying assets produce things. Change it
 * here and it propagates everywhere.
 */
export const SITE = {
  name: "Positive Sum",
  tagline: "Investing, gambling, and the difference between them",
  description:
    "An interactive, fully cited look at where casino analogies genuinely explain investing — and where they fall apart. Built on real historical data, with every statistic sourced.",
  // Overridden at build time on Vercel via NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://positive-sum.vercel.app",
} as const;

export const NAV = [
  { href: "/analogies", label: "Analogies" },
  { href: "/play", label: "Play" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
] as const;
