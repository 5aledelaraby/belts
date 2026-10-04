// Blog posts: Markdown files in src/content/blog/*.md with a simple frontmatter block.
// Images use `![alt](img:KEY)` (KEY = a lifestyle photo or a product id) and become responsive <figure>s.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import { img } from "./lib/images";

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover: string;
  coverAlt: string;
  keyword: string;
  products: string[];
  html: string;
  words: number;
  minutes: number;
}

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "content/blog");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const marked = new Marked({
  renderer: {
    image({ href, text }) {
      if (!href.startsWith("img:")) return `<img src="${esc(href)}" alt="${esc(text)}" loading="lazy">`;
      const im = img(href.slice(4));
      const product = !/^(hero|mood-)/.test(href.slice(4));
      return `<figure class="post-figure${product ? " is-product" : ""}"><img src="${im.src}" srcset="${im.srcset}" sizes="(max-width:800px) 92vw, 720px" width="${im.width}" height="${im.height}" alt="${esc(text)}" loading="lazy" decoding="async"><figcaption>${esc(text)}</figcaption></figure>`;
    },
    link({ href, text }) {
      const external = /^https?:/.test(href);
      return `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
    },
    // Images sit on their own line; keep them out of <p> wrappers.
    paragraph({ tokens, text }) {
      if (tokens.length === 1 && tokens[0].type === "image") return this.parser.parseInline(tokens);
      return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
    table(token) {
      const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
      const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
      return `<div class="post-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    },
  },
});

const parse = (file: string): Post => {
  const raw = readFileSync(path.join(DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Missing frontmatter in ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = m[2].trim();
  const words = body.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\]\([^)]*\)/g, "]").split(/\s+/).filter(Boolean).length;
  for (const k of ["title", "slug", "description", "date", "cover", "coverAlt"]) if (!meta[k]) throw new Error(`${file}: missing ${k}`);
  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    cover: meta.cover,
    coverAlt: meta.coverAlt,
    keyword: meta.keyword ?? "",
    products: (meta.products ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    html: marked.parse(body) as string,
    words,
    // Arabic reading speed ≈ 180 words a minute.
    minutes: Math.max(1, Math.round(words / 180)),
  };
};

/** Display order on the blog page (newest first). Files not listed go at the end. */
const ORDER = [
  "dress-belt-styling-ideas",
  "evening-dress-belt",
  "belt-for-body-shape",
  "lace-belts-90s-trend",
  "waist-belt-size-material-guide",
];

let cache: Post[] | undefined;
export const posts = (): Post[] => {
  if (!cache) {
    cache = readdirSync(DIR).filter((f) => f.endsWith(".md")).map(parse)
      .sort((a, b) => b.date.localeCompare(a.date) || (ORDER.indexOf(a.slug) + 99) % 99 - (ORDER.indexOf(b.slug) + 99) % 99);
  }
  return cache;
};

/** Up to `n` other posts, preferring ones that share products with this one. */
export const relatedPosts = (p: Post, n = 3) =>
  posts()
    .filter((q) => q.slug !== p.slug)
    .map((q) => ({ q, score: q.products.filter((id) => p.products.includes(id)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.q);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00Z"));
