/**
 * Generates the PWA icon set.
 *
 * The mark is the site's own argument in miniature: a field of squares, mostly
 * muted, a few emerald, one gold. Most outcomes are unremarkable, a minority
 * carry the result — the same picture as the constituent grid on the roulette
 * page.
 *
 * Run with:  node scripts/make-icons.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "icons");

const BG = "#000000";
const MUTED = "#272727";
const GAIN = "#00e58c";
const RARE = "#ffc64d";

/** Which cells light up. Deterministic, so the icon never changes between runs. */
const LIT = new Set([2, 5, 7, 10, 12, 15, 19, 21]);
const GOLD = 12;

function svg(size, { padding }) {
  const grid = 5;
  const inner = size - padding * 2;
  const gap = inner * 0.06;
  const cell = (inner - gap * (grid - 1)) / grid;

  let rects = "";
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const i = r * grid + c;
      const x = padding + c * (cell + gap);
      const y = padding + r * (cell + gap);
      const fill = i === GOLD ? RARE : LIT.has(i) ? GAIN : MUTED;
      rects += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" rx="${(cell * 0.16).toFixed(2)}" fill="${fill}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  ${rects}
</svg>`;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const targets = [
    { file: "icon-192.png", size: 192, padding: 192 * 0.14 },
    { file: "icon-512.png", size: 512, padding: 512 * 0.14 },
    // Maskable icons need a safe zone: the launcher may crop to a circle.
    { file: "maskable-512.png", size: 512, padding: 512 * 0.22 },
    { file: "apple-icon.png", size: 180, padding: 180 * 0.14 },
  ];

  for (const t of targets) {
    const buf = Buffer.from(svg(t.size, { padding: t.padding }));
    await sharp(buf).png().toFile(join(OUT, t.file));
    console.log(`  wrote public/icons/${t.file}`);
  }

  // Favicon source, kept as SVG for crispness at small sizes.
  await writeFile(join(OUT, "icon.svg"), svg(64, { padding: 64 * 0.12 }));
  console.log("  wrote public/icons/icon.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
