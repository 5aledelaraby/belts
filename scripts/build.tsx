// Static site build: images → bundles → pages → docs/
// Run with: npm run build

import { mkdir, rm, writeFile, readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import * as esbuild from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";

import { site, url } from "../src/data/site";
import { products } from "../src/data/products";
import { images } from "../src/lib/images";
import { assets } from "../src/lib/assets";
import { MARK_PATHS } from "../src/components/Logo";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "docs");
const SRC = path.join(ROOT, "src");

const hash = (buf: Buffer | string) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

async function buildImages() {
  const out = path.join(OUT, "assets", "img");
  await mkdir(out, { recursive: true });

  // "detail" = a 3:4 close-up of the knot, cut from the centre of the product photo; used for the hover swap.
  type Crop = { left: number; top: number; width: number; height: number };
  const detail = (size: number): Crop => ({ left: Math.round(size * 0.24), top: Math.round(size * 0.16), width: Math.round(size * 0.52), height: Math.round(size * 0.693) });
  const jobs: Array<{ key: string; file: string; widths: number[]; crop?: (size: number) => Crop }> = [
    ...products.map((p) => ({ key: p.id, file: path.join(SRC, "assets/products", `${p.id}.jpg`), widths: [400, 700, 1100] })),
    ...products.map((p) => ({ key: `${p.id}-detail`, file: path.join(SRC, "assets/products", `${p.id}.jpg`), widths: [400, 700], crop: detail })),
    { key: "hero", file: path.join(SRC, "assets/site/hero.jpg"), widths: [640, 1100, 1600] },
    { key: "mood-lace", file: path.join(SRC, "assets/site/mood-lace.jpg"), widths: [500, 900, 1400] },
    { key: "mood-bow", file: path.join(SRC, "assets/site/mood-bow.jpg"), widths: [500, 900, 1400] },
    { key: "mood-green", file: path.join(SRC, "assets/site/mood-green.jpg"), widths: [640, 1100, 1600] },
  ];

  await Promise.all(
    jobs.map(async ({ key, file, widths, crop }) => {
      let input = await readFile(file);
      if (crop) {
        const m0 = await sharp(input).metadata();
        input = await sharp(input).extract(crop(m0.width ?? 1200)).toBuffer();
      }
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

  // Logo files (mark) for social profiles, schema.org and print.
  const markSvg = (bg: string | null, ink: string, accent: string, knot: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${bg ? `<rect width="100" height="100" fill="${bg}"/>` : ""}<g transform="translate(14 14) scale(.72)">${MARK_PATHS(ink, accent, knot)}</g></svg>`;
  await writeFile(path.join(OUT, "assets", "logo-mark.svg"), markSvg(null, "#3A1F26", "#B5476A", "#8E2F50"));
  await sharp(Buffer.from(markSvg("#FFF5F3", "#3A1F26", "#B5476A", "#8E2F50"))).resize(1024, 1024).png().toFile(path.join(OUT, "assets", "logo.png"));
  await sharp(Buffer.from(markSvg("#B5476A", "#FFFFFF", "#F9D6DC", "#FFF5F3"))).resize(1024, 1024).png().toFile(path.join(OUT, "assets", "logo-dark.png"));
}

async function buildBundles() {
  const js = await esbuild.build({
    entryPoints: [path.join(SRC, "client/app.ts")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    write: false,
  });
  const jsText = js.outputFiles[0].text;
  assets.js = `assets/app.${hash(jsText)}.js`;
  await writeFile(path.join(OUT, assets.js), jsText);

  // Tailwind v4 standalone CLI scans the TSX sources for classes.
  const tw = process.env.TAILWIND_BIN || "tailwindcss";
  const tmp = path.join(OUT, "assets", "_tw.css");
  execFileSync(tw, ["-i", path.join(SRC, "styles/app.css"), "-o", tmp, "--minify"], { cwd: ROOT, stdio: "pipe" });
  const cssText = await readFile(tmp, "utf8");
  await rm(tmp);
  assets.css = `assets/app.${hash(cssText)}.css`;
  await writeFile(path.join(OUT, assets.css), cssText);

  // Self-hosted animation libraries (GSAP + plugins, Lenis).
  await mkdir(path.join(OUT, "assets", "vendor"), { recursive: true });
  for (const f of ["gsap.min.js", "ScrollTrigger.min.js", "Flip.min.js", "lenis.min.js"]) {
    const buf = await readFile(path.join(SRC, "vendor", f));
    const name = `assets/vendor/${f.replace(".min.js", "")}.${hash(buf)}.js`;
    await writeFile(path.join(OUT, name), buf);
    assets.vendor.push(name);
  }
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
