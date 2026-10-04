// Screenshots for the "How to order" section, with an arrow and a ring drawn on the step.
// Run after a build:  NODE_PATH=$(npm root -g) node scripts/how-to-shots.cjs
// Writes src/assets/site/how-{ar,en}-{1,2,3}.jpg (the build turns them into responsive WebP).
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(ROOT, "src/assets/site");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg" };

const W = 390, H = 844, DPR = 2;          // phone viewport
const CROP_W = 390, CROP_H = 488;          // 4:5 crop (full phone width) around the step, in CSS px
const ARROW = "#E0245E";

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  fs.readFile(path.join(DOCS, p), (err, buf) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" }); res.end(buf);
  });
});

/** Crop around a target box and draw a ring on it plus an arrow coming from below. */
async function annotate(png, box, file) {
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const left = Math.round(Math.min(Math.max(cx - CROP_W / 2, 0), W - CROP_W));
  const top = Math.round(Math.min(Math.max(cy - CROP_H * 0.42, 0), H - CROP_H));
  const bx = box.x - left, by = box.y - top;
  const pad = 6;
  // arrow from the lower part of the frame up to just under the target
  const tipX = bx + box.width * 0.5, tipY = by + box.height + pad + 6;
  const tailX = tipX + (tipX > CROP_W / 2 ? -70 : 70), tailY = Math.min(tipY + 105, CROP_H - 14);
  const ang = Math.atan2(tipY - tailY, tipX - tailX), hl = 16;
  const h1 = [tipX - hl * Math.cos(ang - 0.5), tipY - hl * Math.sin(ang - 0.5)];
  const h2 = [tipX - hl * Math.cos(ang + 0.5), tipY - hl * Math.sin(ang + 0.5)];
  const midX = (tipX + tailX) / 2 + (tailY - tipY) * 0.25, midY = (tipY + tailY) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CROP_W * DPR}" height="${CROP_H * DPR}" viewBox="0 0 ${CROP_W} ${CROP_H}">
    <rect x="${bx - pad}" y="${by - pad}" width="${box.width + pad * 2}" height="${box.height + pad * 2}" rx="${Math.min(22, (box.height + pad * 2) / 2)}" fill="none" stroke="${ARROW}" stroke-width="3.5"/>
    <path d="M${tailX} ${tailY} Q${midX} ${midY} ${tipX} ${tipY}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
    <path d="M${h1[0]} ${h1[1]} L${tipX} ${tipY} L${h2[0]} ${h2[1]}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${tailX} ${tailY} Q${midX} ${midY} ${tipX} ${tipY}" fill="none" stroke="${ARROW}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M${h1[0]} ${h1[1]} L${tipX} ${tipY} L${h2[0]} ${h2[1]}" fill="none" stroke="${ARROW}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  await sharp(png)
    .extract({ left: left * DPR, top: top * DPR, width: CROP_W * DPR, height: CROP_H * DPR })
    .composite([{ input: Buffer.from(svg) }])
    .jpeg({ quality: 86 })
    .toFile(file);
}

(async () => {
  await new Promise((ok) => server.listen(8799, ok));
  const browser = await chromium.launch();
  for (const lang of ["ar", "en"]) {
    const base = `http://localhost:8799${lang === "en" ? "/en" : ""}`;
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    await ctx.route(/fonts\.g|facebook|tiktok|googletag/, (r) => r.abort());
    const pg = await ctx.newPage();
    await pg.addStyleTag({ content: "" }).catch(() => {});
    const hideFloating = () => pg.addStyleTag({ content: ".wa-fab,.toast,.site-header{visibility:hidden!important} .steps-mini{display:none!important}" });

    // 1) the grid — ring on the first card's photo
    await pg.goto(base + "/"); await pg.waitForTimeout(800); await hideFloating();
    await pg.evaluate(() => { const c = document.querySelector("[data-grid] [data-card]"); window.scrollTo(0, c.getBoundingClientRect().top + scrollY - 150); });
    await pg.waitForTimeout(1200);
    let box = await pg.$eval("[data-grid] [data-card] .card-media", (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await annotate(await pg.screenshot(), box, path.join(OUT, `how-${lang}-1.jpg`));

    // 2) the "Add to bag" button on the same card
    box = await pg.$eval("[data-grid] [data-card] .quick-add", (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await annotate(await pg.screenshot(), box, path.join(OUT, `how-${lang}-2.jpg`));

    // 3) the bag with one belt — ring on "Send order on WhatsApp"
    await pg.evaluate(() => { localStorage.setItem("vicuna-cart", JSON.stringify({ "lace-black": 1 })); });
    await pg.goto(base + "/"); await pg.waitForTimeout(800); await hideFloating();
    await pg.evaluate(() => document.querySelector("[data-cart-open]").click()); await pg.waitForTimeout(900);
    box = await pg.$eval('button[form="order"]', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await annotate(await pg.screenshot(), box, path.join(OUT, `how-${lang}-3.jpg`));
    await ctx.close();
    console.log(`how-to shots: ${lang} done`);
  }
  await browser.close(); server.close();
})();
