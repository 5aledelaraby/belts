// Browser code: motion (GSAP + ScrollTrigger + Flip + Lenis), filtering, quick view, wishlist, cart, WhatsApp checkout.
// Everything works without the animation libraries; they only add motion when present.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { gsap?: any; ScrollTrigger?: any; Flip?: any; Lenis?: any; ttq?: any; fbq?: any; snaptr?: any }
}

interface Item { name: string; price: number; style: string; styleName: string; hex: string; texture: string; src: string; srcset: string; large: string }
interface Config { shipping: { standard: number; express: number; freeOver: number }; whatsapp: string; instapay: string; deliveryDays: number; vendor: { lenis: string; flip: string } }

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
function track(event: PixelEvent, lines: Array<[string, number]> = [], extra: { value?: number; orderNo?: string } = {}) {
  try {
    const value = extra.value ?? lines.reduce((a, [id, q]) => a + catalog[id].price * q, 0);
    const money = lines.length || extra.value ? { value, currency: "EGP" } : {};
    // Meta Pixel
    // RemoveFromCart isn't a Meta standard event, so it goes out as a custom one.
    window.fbq?.(event === "RemoveFromCart" ? "trackCustom" : "track", event, lines.length
      ? { ...money, content_type: "product", content_ids: lines.map(([id]) => id), contents: lines.map(([id, q]) => ({ id, quantity: q })), num_items: lines.reduce((a, [, q]) => a + q, 0), ...(extra.orderNo ? { order_id: extra.orderNo } : {}) }
      : money);
    // TikTok Pixel — an order sent on WhatsApp is "PlaceAnOrder" (payment comes later).
    const tt = event === "Purchase" ? "PlaceAnOrder" : event;
    window.ttq?.track?.(tt, lines.length
      ? { ...money, content_type: "product", contents: lines.map(([id, q]) => ({ content_id: id, content_name: catalog[id].name, quantity: q, price: catalog[id].price })), ...(extra.orderNo ? { order_id: extra.orderNo } : {}) }
      : money);
    const snap = ({ ViewContent: "VIEW_CONTENT", AddToCart: "ADD_CART", InitiateCheckout: "START_CHECKOUT", Purchase: "PURCHASE", Contact: "CUSTOM_EVENT_1", AddToWishlist: "SAVE" } as Record<string, string>)[event];
    if (snap) window.snaptr?.("track", snap, money);
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
function toast(msg: string) {
  toastEl.textContent = msg;
  toastEl.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toastEl.dataset.show = "false"), 2200);
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
  else { favs.add(id); track("AddToWishlist", [[id, 1]]); toast(`${S.favAdded} ${catalog[id].name}`); if (btn) burst(btn); }
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
const shippingCost = (sub: number) => (shipMethod() === "express" ? config.shipping.express : sub >= config.shipping.freeOver ? 0 : config.shipping.standard);

function renderCart() {
  const n = count(), sub = subtotal(), ship = shippingCost(sub);
  const badge = $("[data-cart-count]")!;
  badge.textContent = String(n);
  badge.hidden = n === 0;
  $("[data-n]")!.textContent = String(n);
  $("[data-sub]")!.textContent = String(sub);
  $("[data-ship]")!.innerHTML = !n ? "—" : ship === 0 ? `<b>${S.free}</b>` : `<span class="num">${ship}</span> ${S.currency}`;
  $("[data-total]")!.textContent = String(n ? sub + ship : 0);

  const lines = $("[data-lines]")!;
  const ids = Object.keys(cart);
  if (!ids.length) {
    lines.innerHTML = `<div class="py-10 text-center"><p class="text-[44px]">🛍</p><p class="font-display text-[24px] font-bold">${S.emptyTitle}</p><p class="mt-1 text-[14px] text-mauve">${S.emptyHint}</p></div>`;
    return;
  }
  const left = config.shipping.freeOver - sub;
  lines.innerHTML = `<p class="mb-4 rounded-full bg-petal px-4 py-2 text-center text-[13px] font-bold text-berry">${
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
  toast(`${S.bagAdded} ${catalog[id].name}`);
  track("AddToCart", [[id, 1]]);
  ga("add_to_cart", { currency: "EGP", value: catalog[id].price, items: [gaItem(id)] });
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
  drawer.dataset.open = "true"; drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; lockScroll(true); $<HTMLElement>("[data-cart-close]")!.focus(); }
function closeOverlays() {
  drawer.dataset.open = "false"; drawer.setAttribute("aria-hidden", "true");
  sheet.dataset.open = "false";
  scrim.hidden = true; lockScroll(false);
}
$("[data-cart-open]")!.addEventListener("click", openCart);
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
  const sub = subtotal(), ship = shippingCost(sub), pay = payMethod();
  // Short order number (e.g. V-1004-7K3P) so a WhatsApp order can be matched to its GA4 purchase.
  const d = new Date();
  const orderNo = `V-${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const msg = [
    S.orderTitle, `${S.orderNo}: ${orderNo}`, "",
    ...ids.map((id) => `• ${catalog[id].name} × ${cart[id]} = ${catalog[id].price * cart[id]} ${S.currency}`), "",
    `${S.products}: ${sub} ${S.currency}`,
    `${S.shipping} (${shipMethod() === "express" ? S.express : S.standard}): ${ship === 0 ? S.free : `${ship} ${S.currency}`}`,
    `${S.total}: ${sub + ship} ${S.currency}`,
    `${S.payment}: ${pay === "instapay" ? fill(S.payInsta, { n: config.instapay }) : S.payCod}`, "",
    `${S.name}: ${v("#f-name")}`, `${S.phone}: ${v("#f-phone")}`, `${S.gov}: ${v("#f-gov")}`, `${S.addr}: ${v("#f-addr")}`,
    ...(v("#f-note") ? [`${S.notes}: ${v("#f-note")}`] : []),
  ].join("\n");
  track("Purchase", ids.map((id) => [id, cart[id]] as [string, number]), { value: sub, orderNo });
  // The order is "placed" when it is sent on WhatsApp; payment happens later (cash on delivery / InstaPay).
  ga("purchase", {
    transaction_id: orderNo, currency: "EGP", value: sub, shipping: ship,
    payment_type: pay === "instapay" ? "InstaPay" : "Cash on delivery",
    items: ids.map((id) => gaItem(id, cart[id])),
  });
  const a = document.createElement("a");
  a.href = wa(msg); a.target = "_blank"; a.rel = "noopener"; a.dataset.noTrack = "";
  document.body.appendChild(a); a.click(); a.remove();
  toast(S.openingWa);
});

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
const NEW = new Set(Object.keys(catalog).filter((id) => $(`[data-card][data-id="${id}"] .badge`)));

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
