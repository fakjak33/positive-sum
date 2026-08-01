/**
 * Seeded pseudo-random number generation.
 *
 * Every simulation in the app is deterministic given a seed, so a result can
 * be reproduced and shared by URL — someone can send you the exact run they
 * saw. `Math.random()` is never used in simulation code for this reason.
 */

/** Fast, well-distributed 32-bit PRNG. Good enough for illustration, not for cryptography. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn an arbitrary string (e.g. a shared URL slug) into a usable seed. */
export function seedFromString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A random integer in [0, n). */
export function randInt(rng: () => number, n: number): number {
  return Math.floor(rng() * n);
}

/** Draw one element uniformly at random. */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[randInt(rng, arr.length)];
}

/**
 * Standard normal via Box–Muller. Used only where a parametric draw is
 * explicitly wanted; the portfolio simulations resample real returns instead.
 */
export function normal(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Fisher–Yates, non-mutating. */
export function shuffle<T>(rng: () => number, arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
