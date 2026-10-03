// Browser code: motion (GSAP + ScrollTrigger + Flip + Lenis), filtering, quick view, wishlist, cart, WhatsApp checkout.
// Everything works without the animation libraries; they only add motion when present.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { gsap?: any; ScrollTrigger?: any; Flip?: any; Lenis?: any; ttq?: any; fbq?: any; snaptr?: any }
}

interface Item { name: string; price: number; style: string; styleName: string; hex: string; texture: string; src: string; srcset: string; large: string }
interface Config { shipping: { standard: number; express: number; freeOver: number }; whatsapp: string; instapay: string; deliveryDays: number }

const { config, catalog } = JSON.parse(document.getElementById("catalog")!.textContent!) as { config: Config; catalog: Record<string, Item> };
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T | null;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)] as T[];
const html = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const { gsap, ScrollTrigger, Flip, Lenis } = window;
const motion = !!gsap && !reduced;
const wa = (text: string) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

/* ---------- ad pixels (no-ops until IDs are configured) ---------- */
function track(event: "AddToCart" | "InitiateCheckout" | "Contact" | "AddToWishlist", value?: number) {
  const payload = value ? { value, currency: "EGP" } : undefined;
  try {
    window.ttq?.track?.(event, payload);
    window.fbq?.("track", event, payload);
    const snap = { AddToCart: "ADD_CART", InitiateCheckout: "START_CHECKOUT", Contact: "CUSTOM_EVENT_1", AddToWishlist: "SAVE" }[event];
    window.snaptr?.("track", snap);
  } catch { /* never block ordering */ }
}

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
function setMetrics() {
  html.style.setProperty("--bar-h", "34px");
  html.style.setProperty("--header-h", `${header.offsetHeight}px`);
}
setMetrics();
addEventListener("resize", setMetrics);

/* ---------- smooth scroll ---------- */
let lenis: any = null;
if (Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -(header.offsetHeight + 40) } });
  if (gsap && ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t: number) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const lockScroll = (on: boolean) => { if (lenis) on ? lenis.stop() : lenis.start(); document.body.style.overflow = on ? "hidden" : ""; };
const scrollToEl = (el: Element) => (lenis ? lenis.scrollTo(el, { offset: -(header.offsetHeight + 60) }) : el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));

/* ---------- header: transparent over hero, solid after ---------- */
if (header.dataset.overHero === "true") {
  const update = () => { header.dataset.solid = String(scrollY > innerHeight * 0.75); };
  update();
  addEventListener("scroll", update, { passive: true });
}

/* ---------- loader + entrance ---------- */
function intro() {
  const lines = $$("[data-hero-line]");
  if (!motion) { html.classList.remove("is-loading"); return; }
  const tl = gsap.timeline();
  if (html.classList.contains("is-loading")) {
    tl.from(".loader-word", { opacity: 0, y: 20, letterSpacing: "0.8em", duration: 1.1, ease: "power3.out" })
      .from(".loader-line", { scaleX: 0, duration: 0.8, ease: "power3.inOut" }, "-=.5")
      .to(".loader", { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.2, onComplete: () => html.classList.remove("is-loading") });
    try { sessionStorage.setItem("v-seen", "1"); } catch { /* ignore */ }
  }
  const media = $(".hero-media");
  if (media) tl.from(media, { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "power4.inOut" }, html.classList.contains("is-loading") ? "-=.6" : 0);
  if (lines.length) tl.from(lines, { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=.8");
}

/* ---------- scroll motion ---------- */
function scrollMotion() {
  if (!motion || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  $$("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
  );
  $$("[data-reveal-img]").forEach((el) =>
    gsap.from(el, { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
  );
  const heroImg = $("[data-parallax] img");
  if (heroImg) gsap.to(heroImg, { yPercent: 12, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
  $$("[data-parallax-img]").forEach((el) =>
    gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }),
  );
  ScrollTrigger.batch("[data-card]:not([hidden])", {
    start: "top 92%", once: true,
    onEnter: (els: Element[]) => gsap.from(els, { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" }),
  });
}

/* ---------- magnetic buttons ---------- */
if (motion && finePointer) {
  $$("[data-magnetic]").forEach((btn) => {
    const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1,.4)" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1,.4)" });
    btn.addEventListener("pointermove", (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    btn.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

/* ---------- custom cursor ---------- */
if (finePointer && !reduced) {
  const cur = $<HTMLElement>("[data-cursor-el]")!;
  html.classList.add("has-cursor");
  let x = innerWidth / 2, y = innerHeight / 2;
  if (gsap) {
    const xs = gsap.quickTo(cur, "left", { duration: 0.25, ease: "power3" });
    const ys = gsap.quickTo(cur, "top", { duration: 0.25, ease: "power3" });
    addEventListener("pointermove", (e) => { xs(e.clientX); ys(e.clientY); });
  } else {
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; cur.style.left = `${x}px`; cur.style.top = `${y}px`; });
  }
  document.addEventListener("pointerover", (e) => {
    cur.dataset.mode = (e.target as Element).closest?.('[data-cursor="view"]') ? "view" : "";
  });
  document.addEventListener("pointerleave", () => (cur.style.opacity = "0"));
  document.addEventListener("pointerenter", () => (cur.style.opacity = "1"));
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
  else { favs.add(id); track("AddToWishlist"); toast(`اتضاف للمفضلة: ${catalog[id].name}`); }
  store.set("vicuna-favs", [...favs]);
  renderFavs();
  if (btn && motion) gsap.fromTo(btn, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2,.4)" });
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
  $("[data-ship]")!.innerHTML = !n ? "—" : ship === 0 ? "<b>مجاني</b>" : `<span class="num">${ship}</span> جنيه`;
  $("[data-total]")!.textContent = String(n ? sub + ship : 0);

  const lines = $("[data-lines]")!;
  const ids = Object.keys(cart);
  if (!ids.length) {
    lines.innerHTML = `<div class="py-10 text-center"><p class="font-ar text-[24px]">الشنطة فاضية</p><p class="mt-2 text-[14px] text-stone">اختاري موديل واضغطي «أضيفي للشنطة».</p></div>`;
    return;
  }
  const left = config.shipping.freeOver - sub;
  lines.innerHTML = `<p class="mb-5 rounded-full bg-sand/70 px-4 py-2 text-center text-[12px]">${
    left > 0 ? `فاضل <b class="num">${left}</b> جنيه وتاخدي شحن مجاني` : "✓ طلبك عليه شحن مجاني"
  }</p>`;
  const list = document.createElement("ul");
  list.className = "divide-y divide-charcoal/10";
  for (const id of ids) {
    const it = catalog[id];
    const li = document.createElement("li");
    li.className = "flex items-center gap-4 py-4";
    li.innerHTML = `<img src="${it.src}" alt="" class="size-20 shrink-0 bg-white object-contain p-1.5">
      <div class="min-w-0 flex-1"><div class="font-display text-[18px] leading-tight"></div><div class="mt-1 text-[13px] text-stone"><span class="num">${it.price * cart[id]}</span> جنيه</div></div>
      <div class="flex items-center rounded-full border border-charcoal/15"><button class="size-8" aria-label="زيادة">+</button><span class="num w-5 text-center text-[14px]">${cart[id]}</span><button class="size-8" aria-label="تقليل">−</button></div>`;
    li.querySelector(".font-display")!.textContent = it.name;
    const [plus, minus] = li.querySelectorAll("button");
    plus.addEventListener("click", () => setQty(id, cart[id] + 1));
    minus.addEventListener("click", () => setQty(id, cart[id] - 1));
    list.appendChild(li);
  }
  lines.appendChild(list);
}
function setQty(id: string, n: number) {
  if (n <= 0) delete cart[id];
  else cart[id] = n;
  store.set("vicuna-cart", cart);
  renderCart();
}
function add(id: string) {
  setQty(id, (cart[id] || 0) + 1);
  toast(`اتضاف للشنطة ✓  ${catalog[id].name}`);
  track("AddToCart", catalog[id].price);
  const b = $("[data-cart-open]");
  if (b && motion) gsap.fromTo(b, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2,.4)" });
}

const drawer = $<HTMLElement>("[data-cart]")!;
const scrim = $<HTMLElement>("[data-scrim]")!;
const sheet = $<HTMLElement>("[data-sheet]")!;
function openCart() { drawer.dataset.open = "true"; drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; lockScroll(true); $<HTMLElement>("[data-cart-close]")!.focus(); }
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
  if (!ids.length) { err.textContent = "ضيفي حزام واحد على الأقل قبل ما تبعتي الطلب."; return; }
  const missing = ([["#f-name", "الاسم"], ["#f-phone", "رقم الموبايل"], ["#f-gov", "المحافظة"], ["#f-addr", "العنوان"]] as const)
    .filter(([id]) => !v(id)).map(([, label]) => label);
  if (missing.length) { err.textContent = `ناقص: ${missing.join("، ")}`; return; }
  err.textContent = "";
  const sub = subtotal(), ship = shippingCost(sub), pay = payMethod();
  const msg = [
    "طلب جديد من موقع Vicuna 🛍️", "",
    ...ids.map((id) => `• ${catalog[id].name} × ${cart[id]} = ${catalog[id].price * cart[id]} جنيه`), "",
    `المنتجات: ${sub} جنيه`,
    `الشحن (${shipMethod() === "express" ? "سريع" : "عادي"}): ${ship === 0 ? "مجاني" : `${ship} جنيه`}`,
    `الإجمالي: ${sub + ship} جنيه`,
    `الدفع: ${pay === "instapay" ? `InstaPay على ${config.instapay} (هبعت صورة التحويل)` : "عند الاستلام"}`, "",
    `الاسم: ${v("#f-name")}`, `الموبايل: ${v("#f-phone")}`, `المحافظة: ${v("#f-gov")}`, `العنوان: ${v("#f-addr")}`,
    ...(v("#f-note") ? [`ملاحظات / مقاس: ${v("#f-note")}`] : []),
  ].join("\n");
  track("InitiateCheckout", sub + ship);
  const a = document.createElement("a");
  a.href = wa(msg); a.target = "_blank"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  toast("بنفتح واتساب برسالة الطلب، ابعتيها من هناك");
});

/* ---------- quick view ---------- */
const quick = $<HTMLDialogElement>("[data-quick]")!;
let quickId = "";
function openQuick(id: string) {
  quickId = id;
  const it = catalog[id];
  const im = $<HTMLImageElement>("[data-q-img]", quick)!;
  im.src = it.large; im.srcset = it.srcset; im.sizes = "(max-width:768px) 94vw, 520px"; im.alt = `حزام ${it.name}`;
  $("[data-q-style]", quick)!.textContent = `${it.styleName} · Vicuna`;
  $("[data-q-name]", quick)!.textContent = it.name;
  $("[data-q-price]", quick)!.textContent = String(it.price);
  $("[data-q-color]", quick)!.textContent = it.name;
  $("[data-q-texture]", quick)!.textContent = it.texture;
  $<HTMLAnchorElement>("[data-q-wa]", quick)!.href = wa(`السلام عليكم، عايزة أطلب حزام ${it.name} (${it.price} جنيه)`);
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
  if (!quick.open) { quick.showModal(); lockScroll(true); if (motion) gsap.from(quick, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }); }
}
quick.addEventListener("close", () => lockScroll(false));
quick.addEventListener("click", (e) => { if (e.target === quick) quick.close(); });
$("[data-quick-close]", quick)!.addEventListener("click", () => quick.close());
$("[data-q-add]", quick)!.addEventListener("click", () => { add(quickId); quick.close(); });

/* ---------- filtering, sorting, load more ---------- */
const shop = $<HTMLElement>("[data-shop]");
const grid = $<HTMLElement>("[data-grid]");
const cards = grid ? $$<HTMLElement>("[data-card]", grid) : [];
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
function applyFilters(animate = true) {
  if (!grid) return;
  const state = animate && motion && Flip ? Flip.getState(cards) : null;
  const visible = sorted(cards.filter(matches));
  const shown = visible.slice(0, filters.limit);
  sorted(cards).forEach((c) => grid.appendChild(c));
  visible.forEach((c) => grid.appendChild(c));
  cards.forEach((c) => (c.hidden = !shown.includes(c)));
  $$("[data-result-count]").forEach((el) => (el.textContent = String(visible.length)));
  $("[data-empty]")!.hidden = visible.length > 0;
  $("[data-more-wrap]")!.hidden = visible.length <= filters.limit;
  syncControls();
  if (state) {
    Flip.from(state, {
      duration: 0.7, ease: "power3.inOut", absolute: true, scale: true, nested: true,
      onEnter: (els: Element[]) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }),
      onLeave: (els: Element[]) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.4 }),
    });
  }
}
if (shop && grid) {
  if (gsap && Flip) gsap.registerPlugin(Flip);
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
    else if (t.hasAttribute("data-load-more")) { filters.limit += PAGE; applyFilters(false); scrollMotion(); return; }
    else if (t.dataset.viewBtn) {
      shop.dataset.view = t.dataset.viewBtn;
      $$("[data-view-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      ScrollTrigger?.refresh();
      return;
    } else if (t.hasAttribute("data-sheet-open")) { sheet.dataset.open = "true"; scrim.hidden = false; lockScroll(true); return; }
    else if (t.hasAttribute("data-sheet-close")) { closeOverlays(); return; }
    filters.limit = PAGE;
    applyFilters();
  });
  $<HTMLSelectElement>("[data-sort]")?.addEventListener("change", (e) => { filters.sort = (e.target as HTMLSelectElement).value; applyFilters(); });
}

/* favourites link in the header */
$("[data-show-favs]")?.addEventListener("click", (e) => {
  if (!grid || $("[data-shop]")?.querySelector("[data-filter-style]") === null) return; // style pages: go to home
  e.preventDefault();
  Object.assign(filters, { style: "all", color: "", price: "all", fav: true, limit: 99 });
  applyFilters();
  scrollToEl(shop!);
  if (!favs.size) toast("لسه ما ضفتيش حاجة للمفضلة ♡");
});
if (location.hash === "#favorites" && grid) { filters.fav = true; filters.limit = 99; }

/* ---------- delegated product actions ---------- */
document.addEventListener("click", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-add],[data-fav],[data-quick-open]");
  if (!t) return;
  if (t.dataset.add) add(t.dataset.add);
  else if (t.dataset.fav) toggleFav(t.dataset.fav, t);
  else if (t.dataset.quickOpen) openQuick(t.dataset.quickOpen);
});
$$('a[href^="https://wa.me"]').forEach((a) => a.addEventListener("click", () => track("Contact")));

/* same-page anchors go through Lenis */
$$<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href")!.replace(/^\/?#/, "");
  const el = id && document.getElementById(id);
  if (el) { e.preventDefault(); scrollToEl(el); history.replaceState(null, "", `#${id}`); }
}));

/* ---------- boot ---------- */
renderFavs();
renderCart();
if (grid) applyFilters(false);
const start = () => { intro(); scrollMotion(); };
if (document.fonts?.ready) document.fonts.ready.then(start); else start();
setTimeout(() => html.classList.remove("is-loading"), 3500);

export {};
