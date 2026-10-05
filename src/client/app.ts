// Browser code: motion (GSAP + ScrollTrigger + Flip + Lenis), filtering, quick view, wishlist, cart, WhatsApp checkout.
// Everything works without the animation libraries; they only add motion when present.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { gsap?: any; ScrollTrigger?: any; Flip?: any; Lenis?: any; ttq?: any; fbq?: any; snaptr?: any }
}

interface Item { name: string; price: number; style: string; styleName: string; hex: string; texture: string; src: string; srcset: string; large: string }
interface Config { shipping: { standard: number; express: number; freeOver: number }; whatsapp: string; instapay: string; deliveryDays: number; vendor: { lenis: string; flip: string }; capi: string }

const { config, catalog, strings: S } = JSON.parse(document.getElementById("catalog")!.textContent!) as { config: Config; catalog: Record<string, Item>; strings: Record<string, string> };
const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k]));
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T | null;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)] as T[];
const html = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const { gsap, ScrollTrigger } = window;
let Flip: any = window.Flip;
/** Load a script once; resolves when it has run. */
const loaded: Record<string, Promise<void>> = {};
const loadScript = (src: string) => (loaded[src] ??= new Promise<void>((ok, fail) => {
  const s = document.createElement("script"); s.src = src; s.async = true; s.onload = () => ok(); s.onerror = fail; document.head.appendChild(s);
}));
/** Run when the browser is idle, so start-up work doesn't block taps and scrolling. */
const idle = (fn: () => void, timeout = 2000) => ("requestIdleCallback" in window ? (window as any).requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200));
const motion = !!gsap && !reduced;
const wa = (text: string) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

/* ---------- ad pixels: Meta + TikTok (no-ops until IDs are set in src/data/site.ts) ----------
   Fired at the same moments as the GA4 events, so the numbers line up across platforms. */
type PixelEvent = "ViewContent" | "AddToCart" | "RemoveFromCart" | "InitiateCheckout" | "Purchase" | "Contact" | "AddToWishlist";

/* ---------- Meta Conversions API (server side, through the Cloudflare Worker at config.capi) ----------
   Every Meta event gets an event_id; the browser Pixel and the Worker send the same id, so Meta counts it once.
   Personal details (phone, name, governorate) are SHA-256 hashed here in the browser — only hashes leave the page. */
const newEventId = (prefix: string) => `${prefix}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}`;
const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
const externalId = (() => {
  let id = store.get<string>("vicuna-xid", "");
  if (!id) { id = newEventId("x"); store.set("vicuna-xid", id); }
  return id;
})();
const sha256 = async (s: string) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
};
/** Egyptian mobile → 20XXXXXXXXXX (Meta's format: country code, digits only). */
const normPhone = (p: string) => {
  const d = p.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660)).replace(/\D/g, "");
  return d.startsWith("20") ? d : d.startsWith("0") ? "2" + d : "20" + d;
};
type Who = { phone?: string; name?: string; gov?: string };
let who: Who = {};
async function capi(event: string, eventId: string, custom: Record<string, unknown> = {}) {
  if (!config.capi) return;
  try {
    const fbclid = new URLSearchParams(location.search).get("fbclid");
    const fbc = cookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
    const ud: Record<string, unknown> = { fbp: cookie("_fbp"), fbc, external_id: [await sha256(externalId)] };
    if (who.phone) ud.ph = [await sha256(normPhone(who.phone))];
    if (who.name) {
      const [fn, ...rest] = who.name.trim().toLowerCase().split(/\s+/);
      ud.fn = [await sha256(fn)];
      if (rest.length) ud.ln = [await sha256(rest.join(" "))];
    }
    if (who.gov) ud.st = [await sha256(who.gov.trim().toLowerCase())];
    ud.country = [await sha256("eg")];
    const body = JSON.stringify({ event_name: event, event_id: eventId, event_source_url: location.href, user_data: ud, custom_data: custom });
    // sendBeacon survives the jump to WhatsApp after an order; fetch(keepalive) is the fallback.
    if (!navigator.sendBeacon?.(config.capi, new Blob([body], { type: "text/plain" }))) {
      fetch(config.capi, { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch { /* measurement must never break the shop */ }
}
// PageView: same id as the browser Pixel's PageView in <head>.
if ((window as any).__vpv) capi("PageView", (window as any).__vpv);

function track(event: PixelEvent, lines: Array<[string, number]> = [], extra: { value?: number; orderNo?: string } = {}) {
  try {
    const value = extra.value ?? lines.reduce((a, [id, q]) => a + catalog[id].price * q, 0);
    const money = lines.length || extra.value ? { value, currency: "EGP" } : {};
    // Meta Pixel + Conversions API, sharing one event id.
    // RemoveFromCart isn't a Meta standard event, so it goes out as a custom one.
    const metaData = lines.length
      ? { ...money, content_type: "product", content_ids: lines.map(([id]) => id), contents: lines.map(([id, q]) => ({ id, quantity: q })), num_items: lines.reduce((a, [, q]) => a + q, 0), ...(extra.orderNo ? { order_id: extra.orderNo } : {}) }
      : money;
    const eventId = event === "Purchase" && extra.orderNo ? `order.${extra.orderNo}` : newEventId(event);
    window.fbq?.(event === "RemoveFromCart" ? "trackCustom" : "track", event, metaData, { eventID: eventId });
    if (window.fbq) capi(event, eventId, metaData);
    // TikTok Pixel — an order sent on WhatsApp is "PlaceAnOrder" (payment comes later).
    const tt = event === "Purchase" ? "PlaceAnOrder" : event;
    window.ttq?.track?.(tt, lines.length
      ? { ...money, content_type: "product", contents: lines.map(([id, q]) => ({ content_id: id, content_name: catalog[id].name, quantity: q, price: catalog[id].price })), ...(extra.orderNo ? { order_id: extra.orderNo } : {}) }
      : money);
    // Snap Pixel — same event id as Meta (client_dedup_id), order number as transaction_id, hashed phone on orders.
    const snap = ({ ViewContent: "VIEW_CONTENT", AddToCart: "ADD_CART", InitiateCheckout: "START_CHECKOUT", Purchase: "PURCHASE", Contact: "CUSTOM_EVENT_1", AddToWishlist: "SAVE" } as Record<string, string>)[event];
    if (snap && window.snaptr) {
      const sp: Record<string, unknown> = { client_dedup_id: eventId };
      if (lines.length || extra.value) { sp.price = value; sp.currency = "EGP"; }
      if (lines.length) {
        sp.item_ids = lines.map(([id]) => id);
        sp.item_category = catalog[lines[0][0]].styleName;
        sp.number_items = lines.reduce((a, [, q]) => a + q, 0);
      }
      if (extra.orderNo) sp.transaction_id = extra.orderNo;
      if (event === "Purchase" && who.phone) {
        sha256(normPhone(who.phone)).then((h) => window.snaptr?.("track", snap, { ...sp, user_hashed_phone_number: h }), () => window.snaptr?.("track", snap, sp));
      } else window.snaptr("track", snap, sp);
    }
  } catch { /* never block ordering */ }
}

/* ---------- Google Analytics 4 events ----------
   gtag() is defined in <head> only when a Measurement ID is set in src/data/site.ts.
   Add ?ga_debug=1 to any page URL to see each event in the browser console and in GA4 DebugView. */
const gaDebug = /[?&]ga_debug=1/.test(location.search);
function ga(event: string, params: Record<string, unknown>) {
  try {
    const g = (window as any).gtag as undefined | ((...a: unknown[]) => void);
    if (gaDebug) console.info(`[GA4] ${event}`, params, g ? "→ sent" : "→ GA4 not loaded (no Measurement ID)");
    g?.("event", event, params);
  } catch { /* analytics must never break the shop */ }
}
const gaItem = (id: string, quantity = 1) => {
  const p = catalog[id];
  return { item_id: id, item_name: p.name, item_brand: "Vicuna", item_category: p.styleName, price: p.price, quantity };
};

/* ---------- toast ---------- */
const toastEl = $("[data-toast]")!;
let toastTimer = 0;
function toast(msg: string, action?: { label: string; run: () => void }, ms = 2200) {
  toastEl.textContent = "";
  const text = document.createElement("span"); text.textContent = msg; toastEl.appendChild(text);
  if (action) {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "toast-btn"; btn.textContent = action.label;
    btn.addEventListener("click", () => { toastEl.dataset.show = "false"; action.run(); });
    toastEl.appendChild(btn);
  }
  toastEl.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toastEl.dataset.show = "false"), ms);
}
/** Gently bounce the bag icon in the header to point the shopper at it. */
function nudgeBag() {
  const bag = $<HTMLElement>("[data-cart-open]");
  if (!bag) return;
  bag.classList.remove("nudge"); void bag.offsetWidth; bag.classList.add("nudge");
  setTimeout(() => bag.classList.remove("nudge"), 2000);
}

/* ---------- layout metrics for sticky offsets ---------- */
const header = $<HTMLElement>(".site-header")!;

/* ---------- smooth scroll ---------- */
let lenis: any = null;
// Phones and tablets already scroll smoothly by touch, so Lenis is only loaded for mouse/trackpad users.
if (finePointer && !reduced) idle(() => loadScript(config.vendor.lenis).then(() => {
  const Lenis = window.Lenis; if (!Lenis) return;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -(header.offsetHeight + 40) } });
  if (gsap && ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t: number) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}).catch(() => {}));
const lockScroll = (on: boolean) => { if (lenis) on ? lenis.stop() : lenis.start(); document.body.style.overflow = on ? "hidden" : ""; };
const scrollToEl = (el: Element) => (lenis ? lenis.scrollTo(el, { offset: -(header.offsetHeight + 60) }) : el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));

/* ---------- header shadow once scrolled ---------- */
{
  const update = () => { header.dataset.scrolled = String(scrollY > 8); };
  update();
  addEventListener("scroll", update, { passive: true });
}

/* ---------- how-to-order: a one-line hint under the filter bar while browsing the belts ----------
   Shown once the shop heading scrolls away; gone for good once the shopper has something in the bag. */
{
  const full = $("[data-steps]"), mini = $("[data-steps-mini]");
  const learned = () => Object.keys(store.get<Record<string, number>>("vicuna-cart", {})).length > 0;
  if (full && mini && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { mini.dataset.show = String(!learned() && !e.isIntersecting && e.boundingClientRect.top < 0); }, { rootMargin: "-140px 0px 0px 0px" }).observe(full);
  }
  document.addEventListener("click", (e) => {
    if (mini && (e.target as Element).closest("[data-add]")) setTimeout(() => { if (learned()) mini.dataset.show = "false"; }, 600);
  });
  $("[data-cart-open-mini]")?.addEventListener("click", () => $<HTMLElement>("[data-cart-open]")!.click());
}

/* ---------- blog: load more + share ---------- */
{
  const more = document.querySelector<HTMLButtonElement>("[data-blog-more]");
  more?.addEventListener("click", () => {
    const hidden = [...document.querySelectorAll<HTMLElement>("[data-post][hidden]")];
    hidden.slice(0, Number(more.dataset.pageSize) || 6).forEach((el) => { el.hidden = false; });
    if (hidden.length <= (Number(more.dataset.pageSize) || 6)) (more.closest("[data-blog-more-wrap]") as HTMLElement).hidden = true;
  });
  const copy = async (link: string, msg: string) => {
    try { await navigator.clipboard.writeText(link); } catch { prompt("", link); return; }
    const t = document.querySelector<HTMLElement>("[data-toast]");
    if (t) { t.textContent = msg; t.dataset.show = "true"; setTimeout(() => { t.dataset.show = "false"; }, 2600); }
  };
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    const native = target.closest<HTMLElement>("[data-share-native]");
    if (native) {
      // Instagram has no web share link: use the phone's share sheet, or copy the link for a story/DM.
      const data = { title: native.dataset.title, url: native.dataset.url };
      if (navigator.share) navigator.share(data).catch(() => {});
      else copy(native.dataset.url!, document.documentElement.lang === "en" ? "Link copied — paste it in your Instagram story or DM" : "اتنسخ الرابط، الصقيه في ستوري أو رسالة إنستجرام");
      return;
    }
    const c = target.closest<HTMLElement>("[data-copy-link]");
    if (c) copy(c.dataset.copyLink!, document.documentElement.lang === "en" ? "Link copied" : "اتنسخ رابط المقالة ✓");
  });
}

/* ---------- floating WhatsApp button (after 300px; tooltip shows once for 5s) ---------- */
{
  const fab = document.querySelector<HTMLElement>("[data-wa-fab]");
  if (fab) {
    let tipped = false;
    const update = () => {
      const show = scrollY > 300;
      fab.dataset.show = String(show);
      if (show && !tipped) {
        tipped = true;
        fab.dataset.tip = "true";
        setTimeout(() => { fab.dataset.tip = "false"; }, 5000);
      }
    };
    update();
    addEventListener("scroll", update, { passive: true });
  }
}

/* ---------- soft UI sounds, synthesised with Web Audio (no files to download); a toggle in the bag mutes them ---------- */
let audio: AudioContext | null = null;
let soundOn = store.get<boolean>("vicuna-sound", true);
function sound(kind: "add" | "fav" | "open" | "thanks") {
  if (!soundOn) return;
  try {
    audio ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    const notes: Record<typeof kind, Array<[number, number]>> = {   // [frequency Hz, start s]
      add: [[880, 0], [1318.5, 0.07]],
      fav: [[1046.5, 0], [1568, 0.06]],
      open: [[659.3, 0]],
      thanks: [[784, 0], [987.8, 0.09], [1174.7, 0.18], [1568, 0.29]],
    };
    const t0 = audio.currentTime;
    for (const [f, at] of notes[kind]) {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(kind === "open" ? 0.025 : 0.045, t0 + at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + (kind === "thanks" ? 0.6 : 0.32));
      o.connect(g).connect(audio.destination);
      o.start(t0 + at); o.stop(t0 + at + 0.7);
    }
  } catch { /* no audio: stay silent */ }
}
{
  const t = $("[data-sound-toggle]");
  const paint = () => t?.setAttribute("aria-pressed", String(soundOn));
  paint();
  t?.addEventListener("click", () => { soundOn = !soundOn; store.set("vicuna-sound", soundOn); paint(); if (soundOn) sound("fav"); });
}

/* ---------- confetti (thank-you): small ribbons and hearts in the brand colours ---------- */
function confetti() {
  if (reduced) return;
  const colors = ["#C8102E", "#EDA0A8", "#FBE8EA", "#161616", "#E2354F"];
  for (let i = 0; i < 46; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[i % colors.length];
    c.style.setProperty("--dx", `${(Math.random() - 0.5) * 160}px`);
    c.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    c.style.animationDelay = `${Math.random() * 0.35}s`;
    c.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    if (i % 4 === 0) { c.style.width = "8px"; c.style.height = "8px"; c.style.borderRadius = "50%"; }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3400);
  }
}

/* ---------- birthday gift card: slides in shortly after the first visit, never again once closed ---------- */
{
  const card = $("[data-bday]");
  if (card && !store.get<boolean>("vicuna-bday-closed", false)) {
    const close = () => { card.dataset.show = "false"; store.set("vicuna-bday-closed", true); };
    setTimeout(() => { if (!document.body.style.overflow) card.dataset.show = "true"; }, 2200);
    $("[data-bday-close]", card)!.addEventListener("click", close);
    $("[data-bday-go]", card)!.addEventListener("click", () => setTimeout(close, 300));
  }
}

/* ---------- scroll reveal: blocks below the fold rise in gently as they arrive ---------- */
if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { (e.target as HTMLElement).classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  for (const el of $$("[data-reveal]")) if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("reveal"); io.observe(el); }
}

/* ---------- press ripple on buttons ---------- */
document.addEventListener("pointerdown", (e) => {
  if (reduced) return;
  const b = (e.target as Element).closest<HTMLElement>(".btn, .quick-add, .up-add");
  if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const w = document.createElement("span");
  w.className = "ripple";
  w.style.width = w.style.height = `${d}px`;
  w.style.left = `${e.clientX - r.left - d / 2}px`; w.style.top = `${e.clientY - r.top - d / 2}px`;
  b.appendChild(w);
  setTimeout(() => w.remove(), 650);
}, { passive: true });

/* ---------- WhatsApp help bubble: once per visitor, after 30s idle, for 8s ---------- */
{
  const bub = $("[data-wa-help]");
  if (bub && !store.get<boolean>("vicuna-help-shown", false) && innerWidth >= 360) {
    let idle = 0;
    const busy = () => !!document.querySelector('.drawer[data-open="true"], .sheet[data-open="true"], dialog[open], .upsell[data-show="true"], .bday[data-show="true"]');
    const arm = () => { clearTimeout(idle); idle = window.setTimeout(show, 30000); };
    const show = () => {
      if (busy()) return arm();
      store.set("vicuna-help-shown", true);
      bub.dataset.show = "true";
      setTimeout(() => (bub.dataset.show = "false"), 8000);
      for (const ev of ["pointerdown", "scroll", "keydown"]) removeEventListener(ev, arm);
    };
    for (const ev of ["pointerdown", "scroll", "keydown"]) addEventListener(ev, arm, { passive: true });
    arm();
  }
}

/* ---------- back-to-top arrow (after one screen of scrolling) ---------- */
{
  const btn = document.querySelector<HTMLElement>("[data-to-top]");
  if (btn) {
    const update = () => { btn.dataset.show = String(scrollY > innerHeight * 0.9); };
    update();
    addEventListener("scroll", update, { passive: true });
    btn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
  }
}

/* ---------- lazy muted loop video: loads only when near the screen, pauses when away ---------- */
for (const v of $$<HTMLVideoElement>("video[data-lazy-video]")) {
  if (!("IntersectionObserver" in window)) { v.src = v.dataset.lazyVideo!; continue; }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!v.src) { v.src = v.dataset.lazyVideo!; }
      if (!reduced) v.play().catch(() => {});
      else v.controls = true;
    } else if (!v.paused) v.pause();
  }, { rootMargin: "200px 0px" }).observe(v);
}

/* ---------- visual effects (images, cards, buttons — never text) ---------- */
function effects() {
  if (!motion) return;
  // hero photo leans gently toward the pointer
  const tilt = $<HTMLElement>("[data-tilt]");
  if (tilt && finePointer) {
    const rx = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
    gsap.set(tilt, { transformPerspective: 900 });
    tilt.parentElement!.addEventListener("pointermove", (e: PointerEvent) => {
      const r = tilt.getBoundingClientRect();
      rx(((e.clientX - r.left) / r.width - 0.5) * 8);
      ry(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    tilt.parentElement!.addEventListener("pointerleave", () => { rx(0); ry(0); });
  }
  // hero background photo drifts slower than the page (parallax); images only, text never moves
  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-parallax]").forEach((el) =>
      gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true } }),
    );
    $$("[data-parallax-img]").forEach((el) =>
      gsap.fromTo(el, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }),
    );
  }
  // product photos pop in (the photo only; names and prices stay put)
  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch("[data-card]:not([hidden]) .card-media", {
      start: "top 95%", once: true,
      onEnter: (els: Element[]) => gsap.from(els, { scale: 0.6, rotation: -8, opacity: 0, duration: 0.9, stagger: 0.06, ease: "back.out(1.7)", clearProps: "transform,opacity" }),
    });
  }
  // product photos tilt toward the pointer
  if (finePointer) {
    document.addEventListener("pointermove", (e) => {
      const m = (e.target as Element).closest?.<HTMLElement>(".card-media");
      if (!m) return;
      const r = m.getBoundingClientRect();
      m.style.setProperty("--ty", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
      m.style.setProperty("--tx", `${-((e.clientY - r.top) / r.height - 0.5) * 16}deg`);
    });
    document.addEventListener("pointerout", (e) => {
      const m = (e.target as Element).closest?.<HTMLElement>(".card-media");
      if (m && !m.contains(e.relatedTarget as Node)) { m.style.setProperty("--tx", "0deg"); m.style.setProperty("--ty", "0deg"); }
    });
    // buttons lean toward the pointer
    $$("[data-magnetic]").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1,.4)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1,.4)" });
      btn.addEventListener("pointermove", (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      btn.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }
}

/* little hearts burst out of the heart button */
function burst(from: Element) {
  if (reduced) return;
  const r = from.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    h.setAttribute("viewBox", "0 0 24 24");
    h.setAttribute("class", "burst-heart");
    h.innerHTML = '<path fill="currentColor" d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 6.1-8 11-8 11Z"/>';
    const a = (Math.PI * 2 * i) / 7 + Math.random() * 0.5;
    const d = 28 + Math.random() * 22;
    h.style.left = `${r.left + r.width / 2 - 8}px`;
    h.style.top = `${r.top + r.height / 2 - 8}px`;
    h.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    h.style.setProperty("--dy", `${Math.sin(a) * d}px`);
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 850);
  }
}

/* fly a copy of the product photo into the bag */
function flyToBag(id: string, from?: Element | null) {
  const bag = $("[data-cart-open]");
  const src = (from?.closest("[data-card]")?.querySelector("[data-img]") as HTMLImageElement | null) ?? (from?.closest("[data-quick]")?.querySelector("[data-q-img]") as HTMLImageElement | null);
  if (!motion || !bag || !src) return;
  const a = src.getBoundingClientRect(), b = bag.getBoundingClientRect();
  const size = Math.min(a.width, 140);
  const f = document.createElement("img");
  f.src = catalog[id].src; f.className = "fly"; f.alt = "";
  Object.assign(f.style, { width: `${size}px`, height: `${size}px`, left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px` });
  document.body.appendChild(f);
  gsap.to(f, {
    left: b.left + b.width / 2 - size / 2, top: b.top + b.height / 2 - size / 2, scale: 0.18, rotation: 30, duration: 0.8, ease: "power2.in",
    onComplete: () => { f.remove(); gsap.fromTo(bag, { scale: 0.75 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2,.4)" }); },
  });
}

/* ---------- lightbox ---------- */
const lb = $<HTMLDialogElement>("[data-lightbox-dialog]")!;
let lbItems: HTMLElement[] = [];
let lbIndex = 0;
function lbShow(i: number) {
  lbIndex = (i + lbItems.length) % lbItems.length;
  const el = lbItems[lbIndex];
  const im = $<HTMLImageElement>("[data-lb-img]", lb)!;
  im.src = el.dataset.full!;
  im.alt = el.dataset.caption || el.getAttribute("aria-label") || "";
  $("[data-lb-caption]", lb)!.textContent = el.dataset.caption || "";
  $("[data-lb-count]", lb)!.textContent = lbItems.length > 1 ? `${lbIndex + 1} / ${lbItems.length}` : "";
  $$("[data-lb-prev],[data-lb-next]", lb).forEach((b) => (b.hidden = lbItems.length < 2));
  if (motion) gsap.fromTo(im, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
}
document.addEventListener("click", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-lightbox]");
  if (!t || !t.dataset.full) return;
  e.preventDefault();
  lbItems = $$(`[data-lightbox="${t.dataset.lightbox}"]`).filter((x) => x.dataset.full);
  if (!lb.open) { lb.showModal(); lockScroll(true); }
  lbShow(lbItems.indexOf(t));
});
$("[data-lb-close]", lb)!.addEventListener("click", () => lb.close());
$("[data-lb-next]", lb)!.addEventListener("click", () => lbShow(lbIndex + 1));
$("[data-lb-prev]", lb)!.addEventListener("click", () => lbShow(lbIndex - 1));
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener("close", () => lockScroll(false));
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") lbShow(lbIndex + 1);
  if (e.key === "ArrowRight") lbShow(lbIndex - 1);
});
{
  let x0 = 0;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) lbShow(lbIndex + (dx > 0 ? 1 : -1)); });
}

/* ---------- mobile menu ---------- */
const menu = $<HTMLElement>("[data-menu]")!;
const setMenu = (open: boolean) => { menu.dataset.open = String(open); lockScroll(open); };
$("[data-menu-open]")?.addEventListener("click", () => setMenu(true));
$("[data-menu-close]")?.addEventListener("click", () => setMenu(false));
$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- wishlist ---------- */
let favs = new Set<string>(store.get<string[]>("vicuna-favs", []).filter((id) => catalog[id]));
function renderFavs() {
  $$("[data-fav]").forEach((b) => b.setAttribute("aria-pressed", String(favs.has(b.dataset.fav!))));
  const c = $("[data-fav-count]")!;
  c.textContent = String(favs.size);
  c.hidden = favs.size === 0;
}
function toggleFav(id: string, btn?: HTMLElement) {
  if (favs.has(id)) favs.delete(id);
  else { favs.add(id); track("AddToWishlist", [[id, 1]]); toast(`${S.favAdded} ${catalog[id].name}`); sound("fav"); if (btn) burst(btn); }
  store.set("vicuna-favs", [...favs]);
  renderFavs();
  if (btn) { btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }
  if (filters.fav) applyFilters();
}

/* ---------- cart ---------- */
type Cart = Record<string, number>;
let cart: Cart = store.get<Cart>("vicuna-cart", {});
for (const id of Object.keys(cart)) if (!catalog[id] || !(cart[id] > 0)) delete cart[id];
const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
const subtotal = () => Object.entries(cart).reduce((s, [id, n]) => s + catalog[id].price * n, 0);
const shipMethod = () => ($<HTMLSelectElement>("#f-ship")!.value as "standard" | "express");
const payMethod = () => ($<HTMLInputElement>('input[name="pay"]:checked')?.value ?? "cod");
/** Multi-belt offer: in every group of three belts, the 2nd is 25% off and the 3rd 35% off.
 *  Units are sorted from dearest to cheapest, so the discounts always land on the cheaper belts. */
const RATES = [0, 0.25, 0.35];
const discount = () => {
  const units = Object.entries(cart).flatMap(([id, n]) => Array<number>(n).fill(catalog[id].price)).sort((a, b) => b - a);
  return units.reduce((d, price, i) => d + Math.round(price * RATES[i % 3]), 0);
};
const shippingCost = (sub: number) => (shipMethod() === "express" ? config.shipping.express : sub >= config.shipping.freeOver ? 0 : config.shipping.standard);

function renderCart() {
  const n = count(), disc = discount(), sub = subtotal(), net = sub - disc, ship = shippingCost(net);
  const badge = $("[data-cart-count]")!;
  badge.textContent = String(n);
  badge.hidden = n === 0;
  $("[data-n]")!.textContent = String(n);
  $("[data-sub]")!.textContent = String(sub);
  $("[data-ship]")!.innerHTML = !n ? "—" : ship === 0 ? `<b>${S.free}</b>` : `<span class="num">${ship}</span> ${S.currency}`;
  $("[data-total]")!.textContent = String(n ? net + ship : 0);
  $("[data-disc]")!.textContent = String(disc);
  $("[data-disc-row]")!.hidden = disc === 0;

  const lines = $("[data-lines]")!;
  const ids = Object.keys(cart);
  if (!ids.length) {
    lines.innerHTML = `<div class="py-10 text-center"><p class="font-display text-[24px] font-bold">${S.emptyTitle}</p><p class="mx-auto mt-2 max-w-[30ch] text-[14px] leading-7 text-mauve">${S.emptyHint}</p><button type="button" class="btn btn-berry mt-5" data-empty-cta>${S.emptyCta}</button></div>`;
    return;
  }
  const left = config.shipping.freeOver - net;
  lines.innerHTML = `<p class="offer-nudge">${[S.offer3, S.offer1, S.offer2][n % 3]}</p><p class="mb-4 mt-2 text-center text-[12.5px] font-semibold text-mauve">${
    left > 0 ? fill(S.leftForFree, { n: `<b class="num">${left}</b>` }) : S.gotFree
  }</p>`;
  const list = document.createElement("ul");
  list.className = "flex flex-col gap-3";
  for (const id of ids) {
    const it = catalog[id];
    const li = document.createElement("li");
    li.className = "flex items-center gap-3 rounded-3xl bg-white p-2.5";
    li.innerHTML = `<img src="${it.src}" alt="" class="size-20 shrink-0 rounded-2xl bg-blush object-contain p-1.5">
      <div class="min-w-0 flex-1"><div class="text-[15px] font-bold leading-tight" data-line-name></div><div class="mt-1 text-[14px] font-black text-berry"><span class="num">${it.price * cart[id]}</span> ${S.currency}</div></div>
      <div class="flex items-center rounded-full bg-blush"><button class="size-8 font-bold" aria-label="${S.inc}">+</button><span class="num w-5 text-center text-[14px]">${cart[id]}</span><button class="size-8 font-bold" aria-label="${S.dec}">−</button></div>`;
    li.querySelector("[data-line-name]")!.textContent = it.name;
    const [plus, minus] = li.querySelectorAll("button");
    plus.addEventListener("click", () => setQty(id, cart[id] + 1));
    minus.addEventListener("click", () => setQty(id, cart[id] - 1));
    list.appendChild(li);
  }
  lines.appendChild(list);
}
function setQty(id: string, n: number) {
  const removed = (cart[id] || 0) - Math.max(n, 0);
  if (removed > 0) {
    ga("remove_from_cart", { currency: "EGP", value: catalog[id].price * removed, items: [gaItem(id, removed)] });
    track("RemoveFromCart", [[id, removed]]);
  }
  if (n <= 0) delete cart[id];
  else cart[id] = n;
  store.set("vicuna-cart", cart);
  renderCart();
  const b = $("[data-cart-count]");
  if (b) { b.classList.remove("bump"); void (b as HTMLElement).offsetWidth; b.classList.add("bump"); }
}
function add(id: string, from?: Element | null) {
  flyToBag(id, from);                       // instant visual feedback
  afterPaint(() => addNow(id));             // cart update, toast and tracking right after
}
function addNow(id: string) {
  setQty(id, (cart[id] || 0) + 1);
  sound("add");
  const n = count();
  const msg = n === 1 ? S.addedNext1 : [S.addedNext3, S.addedNext1, S.addedNext2][n % 3];
  if (!showUpsell(id)) toast(n > 1 || store.get<boolean>("vicuna-upsold", false) ? msg : S.bagAdded, { label: S.openBag, run: () => $<HTMLElement>("[data-cart-open]")!.click() }, 4000);
  nudgeBag();
  track("AddToCart", [[id, 1]]);
  ga("add_to_cart", { currency: "EGP", value: catalog[id].price, items: [gaItem(id)] });
}

/* ---------- after the first add to bag: three belts from other designs, once per visitor ---------- */
const upsell = $<HTMLElement>("[data-upsell]");
let upTimer = 0, upY = 0, upShown: string[] = [];
function hideUpsell() { if (upsell) upsell.dataset.show = "false"; clearTimeout(upTimer); }
function upsellPick(baseId: string, n: number) {
  const base = catalog[baseId];
  const ids = Object.keys(catalog).filter((id) => !cart[id] && !upShown.includes(id) && catalog[id].style !== base.style);
  const picked: string[] = [];
  // same colour family first (looks good together), one per design, then any other design
  for (const id of ids) if (picked.length < n && catalog[id].hex === base.hex && !picked.some((x) => catalog[x].style === catalog[id].style)) picked.push(id);
  const shuffled = ids.map((id) => [Math.random(), id] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  for (const id of shuffled) if (picked.length < n && !picked.includes(id) && !picked.some((x) => catalog[x].style === catalog[id].style)) picked.push(id);
  for (const id of shuffled) if (picked.length < n && !picked.includes(id)) picked.push(id);
  upShown.push(...picked);
  return picked;
}
function upsellItem(id: string) {
  const it = catalog[id];
  const href = (document.documentElement.lang === "en" ? "/en/p/" : "/p/") + id + "/";
  const el = document.createElement("div");
  el.className = "up-item";
  el.innerHTML = `<a href="${href}" tabindex="-1" aria-hidden="true" style="padding:0"><img alt="" src="${it.src}" loading="lazy" decoding="async"></a>`
    + `<a href="${href}"></a><span><span class="num">${it.price}</span> <span style="font-size:11px">${S.currency}</span></span>`
    + `<button type="button" class="up-add" data-up-add="${id}">+</button>`;
  el.querySelectorAll("a")[1].textContent = it.name;
  el.querySelector("button")!.setAttribute("aria-label", `${S.openBag === "Open bag" ? "Add" : "أضيفي"} ${it.name}`);
  return el;
}
function showUpsell(id: string) {
  if (!upsell || store.get<boolean>("vicuna-upsold", false)) return false;
  store.set("vicuna-upsold", true);
  upShown = [id];
  const box = $("[data-upsell-items]", upsell)!;
  box.replaceChildren(...upsellPick(id, 3).map(upsellItem));
  upsell.dataset.show = "true";
  upY = scrollY;
  clearTimeout(upTimer);
  upTimer = window.setTimeout(hideUpsell, 12000);
  return true;
}
if (upsell) {
  addEventListener("scroll", () => { if (upsell.dataset.show === "true" && Math.abs(scrollY - upY) > 160) hideUpsell(); }, { passive: true });
  upsell.addEventListener("click", (e) => {
    const t = e.target as Element;
    const plus = t.closest<HTMLElement>("[data-up-add]");
    if (plus) {
      const id = plus.dataset.upAdd!;
      setQty(id, (cart[id] || 0) + 1);
      sound("add");
      burst(plus);
      nudgeBag();
      track("AddToCart", [[id, 1]]);
      ga("add_to_cart", { currency: "EGP", value: catalog[id].price, items: [gaItem(id)] });
      const next = upsellPick(id, 1)[0];
      const card = plus.closest(".up-item")!;
      if (next) card.replaceWith(upsellItem(next)); else card.remove();
      clearTimeout(upTimer);
      upTimer = window.setTimeout(hideUpsell, 12000);
      return;
    }
    if (t.closest("[data-upsell-close]")) hideUpsell();
    if (t.closest("[data-upsell-bag]")) { hideUpsell(); $<HTMLElement>("[data-cart-open]")!.click(); }
  });
}

const drawer = $<HTMLElement>("[data-cart]")!;
const scrim = $<HTMLElement>("[data-scrim]")!;
const sheet = $<HTMLElement>("[data-sheet]")!;
let checkoutSent = false;
function openCart() {
  const ids = Object.keys(cart);
  if (ids.length && !checkoutSent) {
    checkoutSent = true;
    ga("begin_checkout", { currency: "EGP", value: subtotal(), items: ids.map((id) => gaItem(id, cart[id])) });
    track("InitiateCheckout", ids.map((id) => [id, cart[id]] as [string, number]));
  }
  drawer.dataset.open = "true"; drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; lockScroll(true); sound("open"); $<HTMLElement>("[data-cart-close]")!.focus(); }
function closeOverlays() {
  drawer.dataset.open = "false"; drawer.setAttribute("aria-hidden", "true");
  sheet.dataset.open = "false";
  scrim.hidden = true; lockScroll(false);
}
$("[data-cart-open]")!.addEventListener("click", openCart);
// Empty bag → back to the belts (on this page if it has the grid, otherwise the home page's grid).
document.addEventListener("click", (e) => {
  if (!(e.target as Element).closest("[data-empty-cta]")) return;
  closeOverlays();
  const shopEl = $("#shop");
  if (shopEl) setTimeout(() => scrollToEl(shopEl), 350);
  else location.href = (html.lang === "en" ? "/en/" : "/") + "#shop";
});
$("[data-cart-close]")!.addEventListener("click", closeOverlays);
scrim.addEventListener("click", closeOverlays);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeOverlays(); setMenu(false); } });
$("#f-ship")!.addEventListener("change", renderCart);

$<HTMLFormElement>("#order")!.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id: string) => ($<HTMLInputElement>(id)!.value || "").trim();
  const err = $("[data-err]")!;
  const ids = Object.keys(cart);
  if (!ids.length) { err.textContent = S.needItem; return; }
  const missing = ([["#f-name", S.fName], ["#f-phone", S.fPhone], ["#f-gov", S.fGov], ["#f-addr", S.fAddr]] as const)
    .filter(([id]) => !v(id)).map(([, label]) => label);
  if (missing.length) { err.textContent = S.missing + missing.join(S.sep); return; }
  err.textContent = "";
  const sub = subtotal(), disc = discount(), net = sub - disc, ship = shippingCost(net), pay = payMethod();
  // Short order number (e.g. V-1004-7K3P) so a WhatsApp order can be matched to its GA4 purchase.
  const d = new Date();
  const orderNo = `V-${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const msg = [
    S.orderTitle, `${S.orderNo}: ${orderNo}`, "",
    ...ids.map((id) => `• ${catalog[id].name} × ${cart[id]} = ${catalog[id].price * cart[id]} ${S.currency}`), "",
    `${S.products}: ${sub} ${S.currency}`,
    ...(disc ? [`${S.disc}: -${disc} ${S.currency}`] : []),
    `${S.shipping} (${shipMethod() === "express" ? S.express : S.standard}): ${ship === 0 ? S.free : `${ship} ${S.currency}`}`,
    `${S.total}: ${net + ship} ${S.currency}`,
    `${S.payment}: ${pay === "instapay" ? fill(S.payInsta, { n: config.instapay }) : S.payCod}`, "",
    `${S.name}: ${v("#f-name")}`, `${S.phone}: ${v("#f-phone")}`, `${S.gov}: ${v("#f-gov")}`, `${S.addr}: ${v("#f-addr")}`,
    ...(v("#f-note") ? [`${S.notes}: ${v("#f-note")}`] : []),
  ].join("\n");
  who = { phone: v("#f-phone"), name: v("#f-name"), gov: v("#f-gov") };
  track("Purchase", ids.map((id) => [id, cart[id]] as [string, number]), { value: net, orderNo });
  // The order is "placed" when it is sent on WhatsApp; payment happens later (cash on delivery / InstaPay).
  ga("purchase", {
    transaction_id: orderNo, currency: "EGP", value: net, shipping: ship, ...(disc ? { coupon: "MULTI-BELT" } : {}),
    payment_type: pay === "instapay" ? "InstaPay" : "Cash on delivery",
    items: ids.map((id) => gaItem(id, cart[id])),
  });
  const openWa = () => {
    const a = document.createElement("a");
    a.href = wa(msg); a.target = "_blank"; a.rel = "noopener"; a.dataset.noTrack = "";
    document.body.appendChild(a); a.click(); a.remove();
  };
  openWa();
  showThanks(v("#f-name").split(/\s+/)[0], orderNo, openWa);
});

/* ---------- thank-you card after the order goes to WhatsApp ---------- */
const thanks = $<HTMLDialogElement>("[data-thanks]");
let retryWa = () => {};
function showThanks(name: string, orderNo: string, again: () => void) {
  if (!thanks) return toast(S.openingWa);
  retryWa = again;
  $("[data-thanks-name]", thanks)!.textContent = !name ? "" : document.documentElement.lang === "en" ? name : `يا ${name}`;
  $("[data-thanks-no]", thanks)!.textContent = orderNo;
  closeOverlays();
  // WhatsApp opens in a new tab; the card is waiting when she comes back.
  setTimeout(() => { thanks.showModal(); lockScroll(true); sound("thanks"); confetti(); }, 350);
}
if (thanks) {
  thanks.addEventListener("close", () => lockScroll(false));
  $("[data-thanks-retry]", thanks)!.addEventListener("click", () => retryWa());
  $("[data-thanks-done]", thanks)!.addEventListener("click", () => {
    for (const id of Object.keys(cart)) delete cart[id];
    store.set("vicuna-cart", cart);
    renderCart();
    thanks.close();
  });
}

/* ---------- quick view ---------- */
const quick = $<HTMLDialogElement>("[data-quick]")!;
let quickId = "";
function openQuick(id: string) {
  quickId = id;
  const it = catalog[id];
  const im = $<HTMLImageElement>("[data-q-img]", quick)!;
  im.src = it.large; im.srcset = it.srcset; im.sizes = "(max-width:768px) 94vw, 520px"; im.alt = `${S.beltAlt} ${it.name}`;
  $("[data-q-style]", quick)!.textContent = `${it.styleName} · Vicuna`;
  $("[data-q-name]", quick)!.textContent = it.name;
  $("[data-q-price]", quick)!.textContent = String(it.price);
  $("[data-q-color]", quick)!.textContent = it.name;
  $("[data-q-texture]", quick)!.textContent = it.texture;
  $<HTMLAnchorElement>("[data-q-wa]", quick)!.href = wa(fill(S.orderOne, { name: it.name, price: it.price }));
  const sw = $("[data-q-swatches]", quick)!;
  sw.innerHTML = "";
  Object.entries(catalog).filter(([, q]) => q.style === it.style).forEach(([qid, q]) => {
    const b = document.createElement("button");
    b.className = "swatch size-7";
    b.style.background = q.hex;
    b.title = q.name; b.setAttribute("aria-label", q.name);
    if (qid === id) b.setAttribute("aria-current", "true");
    b.addEventListener("click", () => openQuick(qid));
    sw.appendChild(b);
  });
  if (!quick.open) { quick.showModal(); lockScroll(true); if (motion) gsap.from(quick, { scale: 0.92, opacity: 0, duration: 0.5, ease: "back.out(1.6)" }); }
  else if (motion) gsap.fromTo(im, { scale: 0.85, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.8)" });
}
quick.addEventListener("close", () => lockScroll(false));
quick.addEventListener("click", (e) => { if (e.target === quick) quick.close(); });
$("[data-quick-close]", quick)!.addEventListener("click", () => quick.close());
$("[data-q-add]", quick)!.addEventListener("click", (e) => { add(quickId, e.currentTarget as Element); quick.close(); });

/* ---------- filtering, sorting, load more ---------- */
const shop = $<HTMLElement>("[data-shop]");
const grid = $<HTMLElement>("[data-grid]");
const cards = grid ? $$<HTMLElement>("[data-card]", grid) : [];
/** Move the cards waiting in <template data-more-cards> into the grid.
    After load they trickle in a few at a time while the browser is idle; a filter/sort/"show more" finishes the job at once. */
let hydrated = false;
const moreTpl = grid ? $<HTMLTemplateElement>("template[data-more-cards]", grid) : null;
function hydrateCards(batch = Infinity) {
  if (hydrated || !grid) return;
  if (!moreTpl) { hydrated = true; return; }
  const next = $$<HTMLElement>("[data-card]", moreTpl.content).slice(0, batch);
  for (const c of next) { grid.appendChild(c); cards.push(c); }
  if (!moreTpl.content.querySelector("[data-card]")) { moreTpl.remove(); hydrated = true; }
  renderFavs();
}
if (moreTpl) {
  const step = () => { hydrateCards(6); if (!hydrated) idle(step, 3000); };
  addEventListener("load", () => setTimeout(() => idle(step, 3000), 1500), { once: true });
}
/** Run heavy work after the browser has painted the response to a tap (keeps INP low). */
const afterPaint = (fn: () => void) => requestAnimationFrame(() => setTimeout(fn, 0));
const PAGE = 12;
const filters = { style: "all", color: "", price: "all", fav: false, sort: "featured", limit: PAGE };
const NEW = new Set<string>();

function matches(c: HTMLElement) {
  return (filters.style === "all" || c.dataset.style === filters.style)
    && (!filters.color || c.dataset.color === filters.color)
    && (filters.price === "all" || c.dataset.price === filters.price)
    && (!filters.fav || favs.has(c.dataset.id!));
}
function sorted(list: HTMLElement[]) {
  const by = (fn: (c: HTMLElement) => number) => [...list].sort((a, b) => fn(a) - fn(b));
  switch (filters.sort) {
    case "price-asc": return by((c) => +c.dataset.price! * 1000 + +c.dataset.order!);
    case "price-desc": return by((c) => -+c.dataset.price! * 1000 + +c.dataset.order!);
    case "new": return by((c) => (NEW.has(c.dataset.id!) ? 0 : 1000) + +c.dataset.order!);
    default: return by((c) => +c.dataset.order!);
  }
}
function syncControls() {
  $$("[data-filter-style]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterStyle === filters.style)));
  $$("[data-filter-color]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterColor === filters.color)));
  $$("[data-filter-price]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterPrice === filters.price)));
  $$("[data-filter-fav]").forEach((b) => b.setAttribute("aria-pressed", String(filters.fav)));
  const active = (filters.style !== "all" ? 1 : 0) + (filters.color ? 1 : 0) + (filters.price !== "all" ? 1 : 0) + (filters.fav ? 1 : 0);
  const a = $("[data-active-filters]"); if (a) a.textContent = active ? `(${active})` : "";
}
function applyFilters(animate = true, hydrate = true) {
  if (!grid) return;
  if (hydrate) hydrateCards();
  // Only cards on screen can be measured, so Flip records just those (much cheaper than all 38).
  const state = animate && motion && Flip ? Flip.getState(cards.filter((c) => !c.hidden)) : null;
  const visible = sorted(cards.filter(matches));
  const shown = visible.slice(0, filters.limit);
  sorted(cards).forEach((c) => grid.appendChild(c));
  visible.forEach((c) => grid.appendChild(c));
  cards.forEach((c) => (c.hidden = !shown.includes(c)));
  // the editorial block sits after the 8th card, and only on the unfiltered grid
  const ed = $<HTMLElement>("[data-editorial]", grid);
  if (ed) {
    const plain = filters.style === "all" && !filters.color && filters.price === "all" && !filters.fav;
    const anchor = shown[7];
    ed.hidden = !plain || !anchor;
    if (anchor) anchor.after(ed); else grid.appendChild(ed);
  }
  // While some cards are still waiting in the template, keep the server-rendered count and "show more" button.
  if (hydrated) {
    $$("[data-result-count]").forEach((el) => (el.textContent = String(visible.length)));
    $("[data-empty]")!.hidden = visible.length > 0;
    $("[data-more-wrap]")!.hidden = visible.length <= filters.limit;
  }
  syncControls();
  if (state) {
    Flip.from(state, {
      targets: cards.filter((c) => !c.hidden),
      duration: 0.7, ease: "power3.inOut", absolute: true, scale: true, nested: true,
      onEnter: (els: Element[]) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }),
      onLeave: (els: Element[]) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.4 }),
    });
  }
}
if (shop && grid) {
  // Flip (the re-ordering animation) is fetched once the page is idle; filtering works without it meanwhile.
  if (gsap && motion) idle(() => loadScript(config.vendor.flip).then(() => { Flip = window.Flip; if (Flip) gsap.registerPlugin(Flip); }).catch(() => {}), 4000);
  // the mobile filter sheet reuses the same controls
  const tpl = $<HTMLTemplateElement>("[data-sheet-template]", shop);
  if (tpl) sheet.appendChild(tpl.content.cloneNode(true));
  document.addEventListener("click", (e) => {
    const t = (e.target as Element).closest<HTMLElement>("[data-filter-style],[data-filter-color],[data-filter-price],[data-filter-fav],[data-filter-reset],[data-load-more],[data-view-btn],[data-sheet-open],[data-sheet-close]");
    if (!t) return;
    if (t.dataset.filterStyle) filters.style = t.dataset.filterStyle;
    else if (t.dataset.filterColor) filters.color = filters.color === t.dataset.filterColor ? "" : t.dataset.filterColor;
    else if (t.dataset.filterPrice) filters.price = t.dataset.filterPrice;
    else if (t.hasAttribute("data-filter-fav")) filters.fav = !filters.fav;
    else if (t.hasAttribute("data-filter-reset")) Object.assign(filters, { style: "all", color: "", price: "all", fav: false });
    else if (t.hasAttribute("data-load-more")) { filters.limit += PAGE; afterPaint(() => { applyFilters(false); ScrollTrigger?.refresh(); }); return; }
    else if (t.dataset.viewBtn) {
      shop.dataset.view = t.dataset.viewBtn;
      $$("[data-view-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      ScrollTrigger?.refresh();
      return;
    } else if (t.hasAttribute("data-sheet-open")) { sheet.dataset.open = "true"; scrim.hidden = false; lockScroll(true); return; }
    else if (t.hasAttribute("data-sheet-close")) { closeOverlays(); return; }
    filters.limit = PAGE;
    syncControls();            // pressed state shows immediately…
    afterPaint(() => applyFilters()); // …the grid updates right after
  });
  $<HTMLSelectElement>("[data-sort]")?.addEventListener("change", (e) => { filters.sort = (e.target as HTMLSelectElement).value; afterPaint(() => applyFilters()); });
}

/* favourites link in the header */
$("[data-show-favs]")?.addEventListener("click", (e) => {
  if (!grid || $("[data-shop]")?.querySelector("[data-filter-style]") === null) return; // style pages: go to home
  e.preventDefault();
  Object.assign(filters, { style: "all", color: "", price: "all", fav: true, limit: 99 });
  applyFilters();
  scrollToEl(shop!);
  if (!favs.size) toast(S.noFavs);
});
if (location.hash === "#favorites" && grid) { filters.fav = true; filters.limit = 99; }

/* ---------- delegated product actions ---------- */
document.addEventListener("click", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-add],[data-fav],[data-quick-open]");
  if (!t) return;
  if (t.dataset.add) add(t.dataset.add, t);
  else if (t.dataset.fav) toggleFav(t.dataset.fav, t);
  else if (t.dataset.quickOpen) openQuick(t.dataset.quickOpen);
});

/* same-page anchors go through Lenis */
$$<HTMLAnchorElement>('a[href*="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const u = new URL(a.href);
  if (u.pathname !== location.pathname) return;
  const id = u.hash.slice(1);
  const el = id && document.getElementById(id);
  if (el) { e.preventDefault(); scrollToEl(el); history.replaceState(null, "", `#${id}`); }
}));

/* ---------- boot ---------- */
renderFavs();
renderCart();
// Initial state: no need to pull in the waiting cards unless a favourites view was asked for.
if (grid) applyFilters(false, filters.fav);
idle(effects, 1200);

export {};

/* ---------- GA4: view_item on product pages, contact on WhatsApp links ---------- */
{
  const m = (document.body.dataset.page || "").match(/^p\/([^/]+)\/$/);
  if (m && catalog[m[1]]) {
    ga("view_item", { currency: "EGP", value: catalog[m[1]].price, items: [gaItem(m[1])] });
    track("ViewContent", [[m[1], 1]]);
  }

  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="wa.me/20"]');
    if (!a || "noTrack" in a.dataset) return;
    const where = a.closest("[data-wa-fab]") ? "floating_button" : a.closest("footer") ? "footer" : a.closest("[data-quick]") ? "quick_view" : a.closest(".post-body, article") ? "page_content" : "page";
    ga("contact", { method: "whatsapp", location: where, page: location.pathname });
    track("Contact");
  });
}
