import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assetsDir = join(root, "public", "assets");
const input = join(assetsDir, "lumadock-hero.png");
const widths = [640, 960, 1280];

await mkdir(assetsDir, { recursive: true });

await Promise.all(
  widths.map((width) =>
    sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ effort: 6, quality: 82 })
      .toFile(join(assetsDir, `lumadock-hero-${width}.webp`)),
  ),
);

console.log(`Optimized ${widths.length} LumaDock hero variants.`);
