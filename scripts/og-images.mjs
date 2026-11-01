// Generates 1200x630 JPG social-preview images (og:image) for every page.
//
// Why: WhatsApp and some other apps do not reliably show .webp link previews.
// The site templates automatically use /assets/images/og/<same path>.jpg when
// that file exists (see the `ogImage` filter in eleventy.config.js).
//
// Usage:  npm run og        (builds the site, then creates any missing JPGs)
// Run it again after adding new products, categories or guides, then commit
// the new files in src/assets/images/og/.

import { readdir, readFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const siteDir = path.join(root, "_site");
const force = process.argv.includes("--force");

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

const exists = (p) => access(p).then(() => true, () => false);

const sources = new Set();
for await (const file of htmlFiles(siteDir)) {
  const html = await readFile(file, "utf8");
  const match = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!match) continue;
  const url = new URL(match[1]);
  const imgPath = decodeURIComponent(url.pathname);
  if (imgPath.startsWith("/assets/images/og/")) {
    // Page already uses a generated JPG: find its original so --force can redo it.
    const base = imgPath.replace(/^\/assets\/images\/og\//, "/assets/images/").replace(/\.jpg$/i, "");
    for (const ext of [".webp", ".png", ".jpg", ".jpeg"]) {
      if (await exists(path.join(root, "src", base + ext))) { sources.add(base + ext); break; }
    }
  } else if (imgPath.startsWith("/assets/images/")) {
    sources.add(imgPath);
  }
}

let created = 0;
let skipped = 0;
for (const imgPath of sources) {
  const input = path.join(root, "src", imgPath);
  const output = path.join(
    root,
    "src",
    imgPath.replace(/^\/assets\/images\//, "/assets/images/og/").replace(/\.(webp|png|jpe?g)$/i, ".jpg")
  );
  if (!(await exists(input))) {
    console.warn(`Missing source image: ${imgPath}`);
    continue;
  }
  if (!force && (await exists(output))) {
    skipped++;
    continue;
  }
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);
  created++;
}

console.log(`OG images: ${created} created, ${skipped} already existed, ${sources.size} total.`);
if (created) console.log("Run `npm run build` again so pages pick up the new images.");
