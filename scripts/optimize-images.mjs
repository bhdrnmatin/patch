// Converts raw raster images in public/images to optimized WebP.
// Usage: npm run optimize-images
// Finds every .png/.jpg/.jpeg, writes a resized WebP next to it, and
// removes the original. Re-running is safe (already-WebP files are skipped).
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const DIR = "public/images";
const MAX_EDGE = 1280; // longest side, in px — enough for a 390px viewport at 3x
const QUALITY = 80;

const sources = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

if (sources.length === 0) {
  console.log(`No .png/.jpg images to optimize in ${DIR}/ — nothing to do.`);
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of sources) {
  const src = path.join(DIR, file);
  const out = src.replace(/\.(png|jpe?g)$/i, ".webp");
  const srcSize = (await stat(src)).size;
  before += srcSize;

  await sharp(src)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  const outSize = (await stat(out)).size;
  after += outSize;
  await unlink(src);

  console.log(
    `${file.padEnd(28)} ${(srcSize / 1e6).toFixed(2)}MB -> ${(outSize / 1e3).toFixed(0)}KB`
  );
}

console.log(`\nTOTAL  ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(2)}MB`);
console.log("Remember to reference the new .webp paths in code.");
