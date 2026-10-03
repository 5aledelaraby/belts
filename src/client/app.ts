// Browser code: cart, checkout via WhatsApp, product zoom, filter chips.
// Bundled by esbuild into assets/app.<hash>.js.

interface Config {
  price: number;
  shipping: { standard: number; express: number; freeOver: number };
  whatsapp: string;
}
interface Item { name: string; thumb: string; large: string }

const data = JSON.parse(document.getElementById("catalog")!.textContent!) as {
  config: Config;
  catalog: Record<string, Item>;
};
const { config, catalog } = data;

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const waLink = (text: string) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- ad pixels (no-ops until the IDs are set in site.ts) ---------- */
type Tracker = (event: string, payload?: Record<string, unknown>) => void;
function track(event: "AddToCart" | "InitiateCheckout" | "Contact", value?: number) {
  const w = window as unknown as Record<string, { track?: Tracker } | Tracker | undefined>;
  const payload = value ? { value, currency: "EGP" } : undefined;
  try {
    (w.ttq as { track?: Tracker } | undefined)?.track?.(event, payload);
    (w.fbq as ((...a: unknown[]) => void) | undefined)?.("track", event, payload);
    const snap = { AddToCart: "ADD_CART", InitiateCheckout: "START_CHECKOUT", Contact: "CUSTOM_EVENT_1" }[event];
    (w.snaptr as ((...a: unknown[]) => void) | undefined)?.("track", snap);
  } catch { /* tracking must never break ordering */ }
}

/* ---------- cart state ---------- */
type Cart = Record<string, number>;
const STORE = "vicuna-cart";
let cart: Cart = {};
try { cart = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch { cart = {}; }
for (const id of Object.keys(cart)) if (!catalog[id] || !(cart[id] > 0)) delete cart[id];
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(cart)); } catch { /* private mode */ } };

const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
const subtotal = () => count() * config.price;
const shipMethod = () => ($<HTMLSelectElement>("f-ship").value as "standard" | "express");
function shippingCost(sub: number) {
  if (shipMethod() === "express") return config.shipping.express;
  return sub >= config.shipping.freeOver ? 0 : config.shipping.standard;
}

/* ---------- toast ---------- */
let toastTimer: number | undefined;
function toast(msg: string) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- rendering ---------- */
function markCards() {
  document.querySelectorAll<HTMLButtonElement>("[data-add]").forEach((b) => {
    const n = cart[b.dataset.add!] || 0;
    b.classList.toggle("in", n > 0);
    b.textContent = n > 0 ? `في السلة (${n}) +` : "أضيفي للسلة";
  });
}

function renderCart() {
  const n = count();
  const sub = subtotal();
  const ship = shippingCost(sub);
  $("badge").textContent = String(n);
  $("n-items").textContent = String(n);
  $("subtotal").textContent = String(sub);
  $("ship-cost").innerHTML = !n ? "—" : ship === 0 ? "<b>مجاني</b>" : `<span class="num-ltr">${ship}</span> جنيه`;
  $("grand").textContent = String(n ? sub + ship : 0);

  const lines = $("lines");
  const ids = Object.keys(cart);
  if (!ids.length) {
    lines.innerHTML = '<div class="empty">السلة فاضية. اختاري موديل واضغطي «أضيفي للسلة».</div>';
    return;
  }
  lines.innerHTML = "";
  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-direction:column;gap:12px";
  for (const id of ids) {
    const item = catalog[id];
    const row = document.createElement("div");
    row.className = "line";
    row.innerHTML = `<img src="${item.thumb}" alt="" loading="lazy">
      <div><b></b><small><span class="num-ltr">${cart[id] * config.price}</span> جنيه</small></div>
      <div class="qty"><button aria-label="زيادة">+</button><span>${cart[id]}</span><button aria-label="تقليل">−</button></div>`;
    row.querySelector("b")!.textContent = item.name;
    const [plus, minus] = row.querySelectorAll("button");
    plus.onclick = () => setQty(id, cart[id] + 1);
    minus.onclick = () => setQty(id, cart[id] - 1);
    list.appendChild(row);
  }
  lines.appendChild(list);
}

function setQty(id: string, n: number) {
  if (n <= 0) delete cart[id];
  else cart[id] = n;
  save();
  renderCart();
  markCards();
}

function add(id: string) {
  setQty(id, (cart[id] || 0) + 1);
  toast(`اتضاف للسلة: ${catalog[id].name}`);
  track("AddToCart", config.price);
}

/* ---------- drawer ---------- */
const drawer = $("drawer");
function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  $("shade").hidden = false;
  $("close-cart").focus();
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  $("shade").hidden = true;
}
$("open-cart").addEventListener("click", openCart);
$("close-cart").addEventListener("click", closeCart);
$("shade").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
$("f-ship").addEventListener("change", renderCart);

/* ---------- product actions (event delegation) ---------- */
const dlg = $<HTMLDialogElement>("dlg");
let zoomId = "";
document.addEventListener("click", (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-add],[data-zoom],[data-filter]");
  if (!el) return;
  if (el.dataset.add) add(el.dataset.add);
  else if (el.dataset.zoom) {
    zoomId = el.dataset.zoom;
    const item = catalog[zoomId];
    const im = $<HTMLImageElement>("dlg-img");
    im.src = item.large;
    im.alt = `حزام ${item.name}`;
    $("dlg-name").textContent = item.name;
    dlg.showModal();
  } else if (el.dataset.filter) filterBy(el.dataset.filter);
});
$("dlg-x").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
$("dlg-add").addEventListener("click", () => { add(zoomId); dlg.close(); });

/* ---------- filter chips (home page only) ---------- */
function filterBy(cat: string) {
  let shown = 0;
  document.querySelectorAll<HTMLElement>("#grid .card").forEach((c) => {
    const on = cat === "all" || c.dataset.cat === cat;
    c.hidden = !on;
    if (on) shown++;
  });
  document.querySelectorAll<HTMLElement>("[data-filter]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
  const c = document.getElementById("count");
  if (c) c.textContent = `${shown} موديل · ${config.price} جنيه للحزام`;
}

/* ---------- checkout ---------- */
$<HTMLFormElement>("order").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id: string) => ($<HTMLInputElement>(id).value || "").trim();
  const err = $("err");
  const ids = Object.keys(cart);
  if (!ids.length) { err.textContent = "ضيفي حزام واحد على الأقل للسلة قبل ما تبعتي الطلب."; return; }
  const missing = ([["f-name", "الاسم"], ["f-phone", "رقم الموبايل"], ["f-gov", "المحافظة"], ["f-addr", "العنوان"]] as const)
    .filter(([id]) => !v(id)).map(([, label]) => label);
  if (missing.length) { err.textContent = `ناقص: ${missing.join("، ")}`; return; }
  err.textContent = "";

  const sub = subtotal();
  const ship = shippingCost(sub);
  const lines = ids.map((id) => `• ${catalog[id].name} × ${cart[id]} = ${cart[id] * config.price} جنيه`).join("\n");
  const msg = [
    "طلب جديد من الموقع 🛍️", "", lines, "",
    `المنتجات: ${sub} جنيه`,
    `الشحن (${shipMethod() === "express" ? "سريع" : "عادي"}): ${ship === 0 ? "مجاني" : `${ship} جنيه`}`,
    `الإجمالي: ${sub + ship} جنيه`, "",
    `الاسم: ${v("f-name")}`, `الموبايل: ${v("f-phone")}`, `المحافظة: ${v("f-gov")}`, `العنوان: ${v("f-addr")}`,
    ...(v("f-note") ? [`ملاحظات: ${v("f-note")}`] : []),
  ].join("\n");

  track("InitiateCheckout", sub + ship);
  const a = document.createElement("a");
  a.href = waLink(msg);
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("بنفتح واتساب برسالة الطلب، ابعتيها من هناك");
});

/* ---------- copy phone ---------- */
document.getElementById("copy")?.addEventListener("click", (e) => {
  const text = (e.currentTarget as HTMLElement).dataset.copy!;
  const select = () => {
    const r = document.createRange();
    r.selectNodeContents($("phone"));
    const s = getSelection()!;
    s.removeAllRanges();
    s.addRange(r);
    toast("الرقم متحدد، انسخيه");
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast("اتنسخ الرقم"), select);
  else select();
});

document.querySelectorAll('a[href^="https://wa.me"]').forEach((a) => a.addEventListener("click", () => track("Contact")));

renderCart();
markCards();
