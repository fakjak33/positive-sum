/**
 * Builds a Windows .ico from the PWA icon, so the desktop shortcut shows the
 * app's mark rather than a generic browser glyph.
 *
 * Run with:  node scripts/make-ico.mjs
 *
 * sharp cannot write .ico, so the container is assembled by hand. Since
 * Windows Vista an ICO may embed PNG data directly, which keeps this to a
 * header plus the PNGs sharp already produces.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "icons", "icon-512.png");
const OUT = join(ROOT, "public", "icons", "icon.ico");

const SIZES = [16, 32, 48, 64, 128, 256];

async function main() {
  const source = await readFile(SRC);

  const images = await Promise.all(
    SIZES.map((size) => sharp(source).resize(size, size).png().toBuffer())
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(SIZES.length, 4);

  const entries = [];
  // Directory entries are fixed-width, so the first image starts after all of them.
  let offset = 6 + SIZES.length * 16;

  SIZES.forEach((size, i) => {
    const e = Buffer.alloc(16);
    // 256 is encoded as 0 — the field is a single byte.
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size, 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(images[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += images[i].length;
    entries.push(e);
  });

  await writeFile(OUT, Buffer.concat([header, ...entries, ...images]));
  console.log(`  wrote public/icons/icon.ico (${SIZES.join(", ")} px)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
