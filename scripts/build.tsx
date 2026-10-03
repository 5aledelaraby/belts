// Static site build: images → bundles → pages → docs/
// Run with: npm run build

import { mkdir, rm, writeFile, readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import * as esbuild from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";

import { site, url } from "../src/data/site";
import { products } from "../src/data/products";
import { images } from "../src/lib/images";
import { assets } from "../src/lib/assets";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "docs");
const SRC = path.join(ROOT, "src");

const hash = (buf: Buffer | string) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

async function buildImages() {
  const out = path.join(OUT, "assets", "img");
  await mkdir(out, { recursive: true });

  const jobs: Array<{ key: string; file: string; widths: number[] }> = [
    ...products.map((p) => ({ key: p.id, file: path.join(SRC, "assets/products", `${p.id}.jpg`), widths: [400, 700, 1100] })),
    { key: "hero", file: path.join(SRC, "assets/site/hero.jpg"), widths: [600, 1000, 1400] },
    { key: "mood-lace", file: path.join(SRC, "assets/site/mood-lace.jpg"), widths: [500, 900] },
    { key: "mood-bow", file: path.join(SRC, "assets/site/mood-bow.jpg"), widths: [500, 900] },
  ];

  await Promise.all(
    jobs.map(async ({ key, file, widths }) => {
      const input = await readFile(file);
      const meta = await sharp(input).metadata();
      const files: Array<{ w: number; name: string }> = [];
      for (const w of widths.filter((w) => w <= (meta.width ?? w))) {
        const buf = await sharp(input).resize({ width: w }).webp({ quality: 74, effort: 5 }).toBuffer();
        const name = `${key}-${w}.${hash(buf)}.webp`;
        await writeFile(path.join(out, name), buf);
        files.push({ w, name });
      }
      const src = (n: string) => url(`assets/img/${n}`);
      const first = files[0];
      images[key] = {
        src: src(first.name),
        srcset: files.map((f) => `${src(f.name)} ${f.w}w`).join(", "),
        large: src(files[files.length - 1].name),
        width: first.w,
        height: Math.round((first.w * (meta.height ?? 1)) / (meta.width ?? 1)),
      };
    }),
  );

  // Social share image (1200×630).
  await sharp(path.join(SRC, "assets/site/hero.jpg"))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, "assets", "og.jpg"));
}

async function buildBundles() {
  const js = await esbuild.build({
    entryPoints: [path.join(SRC, "client/app.ts")],
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    write: false,
  });
  const css = await esbuild.build({
    entryPoints: [path.join(SRC, "styles/main.css")],
    bundle: true,
    minify: true,
    write: false,
  });
  const jsText = js.outputFiles[0].text;
  const cssText = css.outputFiles[0].text;
  assets.js = `assets/app.${hash(jsText)}.js`;
  assets.css = `assets/app.${hash(cssText)}.css`;
  await writeFile(path.join(OUT, assets.js), jsText);
  await writeFile(path.join(OUT, assets.css), cssText);
}

async function buildPages() {
  // Imported after images/assets are known, because components read them while rendering.
  const { pages } = await import("../src/pages");
  for (const page of pages) {
    const file = page.path.endsWith(".html") ? page.path : path.join(page.path, "index.html");
    const target = path.join(OUT, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, "<!doctype html>" + renderToStaticMarkup(page.element));
  }

  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.hidden)
    .map((p) => `  <url><loc>${site.url}${url(p.path)}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");
  await writeFile(
    path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}${url("sitemap.xml")}\n`);
  await writeFile(path.join(OUT, ".nojekyll"), "");
  if (site.customDomain) await writeFile(path.join(OUT, "CNAME"), site.customDomain + "\n");
  return pages.length;
}

const t0 = Date.now();
await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, "assets"), { recursive: true });
await buildImages();
await buildBundles();
const n = await buildPages();
const files = await readdir(path.join(OUT, "assets", "img"));
console.log(`Built ${n} pages, ${files.length} images in ${Date.now() - t0} ms → docs/`);
