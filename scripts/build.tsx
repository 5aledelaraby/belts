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
import { images, videos } from "../src/lib/images";
import { assets } from "../src/lib/assets";

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
    // "On the body" strip: real customers' photos (4:5)
    ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({ key: `onbody-${n}`, file: path.join(SRC, `assets/site/onbody-${n}.jpg`), widths: [360, 720] })),
    { key: "laser-poster", file: path.join(SRC, "assets/site/laser-poster.jpg"), widths: [640, 1280] },
    // Founder at work + the natural-leather hides offered for made-to-measure belts
    { key: "founder", file: path.join(SRC, "assets/site/founder.jpg"), widths: [480, 900] },
    { key: "founder-work", file: path.join(SRC, "assets/site/founder-work.jpg"), widths: [480, 900] },
    { key: "navy-belt", file: path.join(SRC, "assets/site/navy-belt.jpg"), widths: [600, 1100] },
    { key: "founder-collage", file: path.join(SRC, "assets/site/founder-collage.jpg"), widths: [800, 1400, 2000] },
    ...[1, 2, 3].map((n) => ({ key: `leather-${n}`, file: path.join(SRC, `assets/site/leather-${n}.jpg`), widths: [480, 960] })),
    ...[1, 2].map((n) => ({ key: `review-${n}`, file: path.join(SRC, `assets/site/review-${n}.jpg`), widths: [360, 720] })),
    { key: "leather-detail-poster", file: path.join(SRC, "assets/site/leather-detail-poster.jpg"), widths: [720] },
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

  // Videos are copied as-is with a content hash in the name.
  await mkdir(path.join(out, "..", "video"), { recursive: true });
  for (const f of await readdir(path.join(SRC, "assets/video"))) {
    const buf = await readFile(path.join(SRC, "assets/video", f));
    const name = f.replace(/(\.\w+)$/, `.${hash(buf)}$1`);
    await writeFile(path.join(out, "..", "video", name), buf);
    videos[f] = url(`assets/video/${name}`);
  }

  // Social share image (1200×630).
  await sharp(path.join(SRC, "assets/site/hero.jpg"))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, "assets", "og.jpg"));

  // Brand files (seal logo) — masters are generated by brand/make_logo.py.
  await mkdir(path.join(OUT, "assets", "brand"), { recursive: true });
  for (const f of await readdir(path.join(ROOT, "brand"))) {
    if (/\.(svg|png)$/.test(f)) await copyFile(path.join(ROOT, "brand", f), path.join(OUT, "assets", "brand", f));
  }
  await copyFile(path.join(ROOT, "brand", "vicuna-seal-1080.png"), path.join(OUT, "assets", "logo.png"));

  // Site icons: favicon (SVG + PNG + ICO), Apple touch icon, and web-app manifest icons.
  const mark = await readFile(path.join(ROOT, "brand", "vicuna-mark-favicon.svg"), "utf8");
  const square = mark.replace(/rx="[\d.]+"/, 'rx="0"');                       // iOS rounds the corners itself
  const inner = mark.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<rect[^>]*\/>/, "");
  const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#FFF5F3"/><g transform="translate(26 26) scale(.74)">${inner}</g></svg>`; // logo inside the 80% safe zone
  await mkdir(path.join(OUT, "assets", "icons"), { recursive: true });
  await writeFile(path.join(OUT, "favicon.svg"), mark);
  const png = (svg: string, size: number) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png({ compressionLevel: 9 });
  await png(square, 180).flatten({ background: "#FFF5F3" }).toFile(path.join(OUT, "apple-touch-icon.png"));
  for (const size of [48, 192, 512]) await png(mark, size).toFile(path.join(OUT, "assets", "icons", `icon-${size}.png`));
  await png(maskable, 512).toFile(path.join(OUT, "assets", "icons", "maskable-512.png"));
  // favicon.ico (16/32/48) for browsers and crawlers that ask for /favicon.ico
  const icoSizes = [16, 32, 48];
  const pngs = await Promise.all(icoSizes.map((sz) => png(mark, sz).toBuffer()));
  const header = Buffer.alloc(6 + 16 * icoSizes.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(icoSizes.length, 4);
  let offset = header.length;
  icoSizes.forEach((sz, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(sz, e); header.writeUInt8(sz, e + 1); header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12); offset += pngs[i].length;
  });
  await writeFile(path.join(OUT, "favicon.ico"), Buffer.concat([header, ...pngs]));
  await writeFile(path.join(OUT, "manifest.webmanifest"), JSON.stringify({
    name: `${site.brand} — أحزمة خصر بالربط`,
    short_name: site.brand,
    description: "أحزمة خصر نسائية بالربط من جلد PU مستورد، توصيل لكل مصر والدفع عند الاستلام.",
    lang: "ar", dir: "rtl",
    start_url: url(), scope: url(), display: "standalone",
    background_color: "#FFF5F3", theme_color: "#FFF5F3",
    icons: [
      { src: url("assets/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: url("assets/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: url("assets/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }, null, 2));
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

/** Meta (and Google Merchant) product feed: docs/catalog/products.csv + 1080px JPEGs.
 *  Product ids match the Pixel's content_ids, so catalog ads can show each visitor the belts she viewed. */
async function buildFeed() {
  const { productSeo } = await import("../src/data/seo-copy");
  const { styleOf, colors, textureName } = await import("../src/data/products");
  const dir = path.join(OUT, "catalog");
  await mkdir(path.join(dir, "img"), { recursive: true });
  const csv = (v: string | number) => `"${String(v).replace(/"/g, '""').replace(/\s+/g, " ").trim()}"`;
  const head = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "additional_image_link",
    "brand", "google_product_category", "fb_product_category", "product_type", "item_group_id", "color", "material", "gender", "age_group"];
  const rows = await Promise.all(products.map(async (p) => {
    const src = path.join(SRC, "assets/products", `${p.id}.jpg`);
    const img = async (name: string, input: sharp.Sharp) => {
      await input.resize(1080, 1080, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" }).jpeg({ quality: 86 }).toFile(path.join(dir, "img", name));
      return `${site.url}${url(`catalog/img/${name}`)}`;
    };
    const meta = await sharp(src).metadata();
    const w = meta.width ?? 1200;
    const main = await img(`${p.id}.jpg`, sharp(src));
    const detail = await img(`${p.id}-detail.jpg`, sharp(src).extract({ left: Math.round(w * 0.24), top: Math.round(w * 0.16), width: Math.round(w * 0.52), height: Math.round(w * 0.693) }));
    const seo = productSeo(p);
    const style = styleOf(p.style);
    return [
      p.id,
      `حزام ${p.name}`,
      seo.description.join(" ").slice(0, 5000),
      "in stock", "new", `${style.price}.00 EGP`,
      `${site.url}${url(`p/${p.id}/`)}`,
      main, detail,
      site.brand, "169", "Clothing & Accessories > Accessories > Belts", `Belts > ${style.name}`,
      p.style, colors.find((c) => c.id === p.color)?.name ?? p.color, textureName[p.texture], "female", "adult",
    ].map(csv).join(",");
  }));
  await writeFile(path.join(dir, "products.csv"), [head.join(","), ...rows].join("\n") + "\n");
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

  // Old collection URLs (merged or split styles) forward to their new home, so old links and search results still land somewhere useful.
  const moved: Record<string, string> = { "sash/": "wide-bow/", "croc-snake/": "croc/" };
  for (const [from, to] of Object.entries(moved)) {
    for (const pre of ["", "en/"]) {
      const dest = `${site.url}${url(pre + to)}`;
      const target = path.join(OUT, pre + from, "index.html");
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `<!doctype html><html><head><meta charset="utf-8"><title>Vicuna</title><link rel="canonical" href="${dest}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${dest}"><script>location.replace(${JSON.stringify(dest)}+location.hash)</script></head><body><a href="${dest}">${dest}</a></body></html>`);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  // Each URL lists its Arabic and English twin (hreflang) so Google pairs them.
  const urls = pages
    .filter((p) => !p.hidden)
    .map((p) => {
      const neutral = p.path.replace(/^en\//, "");
      const alt = (l: string, path: string) => `<xhtml:link rel="alternate" hreflang="${l}" href="${site.url}${url(path)}"/>`;
      if (p.single) return `  <url><loc>${site.url}${url(p.path)}</loc><lastmod>${today}</lastmod></url>`;
      return `  <url><loc>${site.url}${url(p.path)}</loc><lastmod>${today}</lastmod>${alt("ar", neutral)}${alt("en", "en/" + neutral)}${alt("x-default", neutral)}</url>`;
    })
    .join("\n");
  await writeFile(
    path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  );
  await buildFeed();
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
