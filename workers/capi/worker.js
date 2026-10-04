// Meta Conversions API relay for vicuna-eg.com — runs as a Cloudflare Worker on the route vicuna-eg.com/capi.
//
// The site's browser code sends each Meta event here as well as to the Pixel, with the same event_id,
// so Meta de-duplicates them. Personal details arrive already SHA-256 hashed from the browser;
// this Worker only adds the visitor's IP and user agent (which Meta needs for matching) and
// forwards the event to the Graph API with the access token, which never reaches the browser.
//
// Settings (Cloudflare → Workers → this worker → Settings → Variables and secrets):
//   META_TOKEN      Secret  — the Conversions API access token from Events Manager. Never put it in code.
//   PIXEL_ID        Text    — 2311877842998870
//   TEST_CODE       Text    — optional, e.g. TEST51700 while testing in "Test events"; delete it afterwards.
//   GRAPH_VERSION   Text    — optional, defaults to v23.0.

const SITE = "vicuna-eg.com";
const EVENTS = new Set(["PageView", "ViewContent", "AddToCart", "RemoveFromCart", "InitiateCheckout", "Purchase", "Contact", "AddToWishlist"]);
const HASHED = ["ph", "fn", "ln", "st", "country", "external_id"];
const isHash = (v) => typeof v === "string" && /^[0-9a-f]{64}$/.test(v);
const short = (v, n = 300) => (typeof v === "string" && v.length <= n ? v : undefined);

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response(null, { status: 405 });

    // Only accept events from our own pages.
    const origin = request.headers.get("Origin") || request.headers.get("Referer") || "";
    let host = "";
    try { host = new URL(origin).hostname; } catch {}
    if (host !== SITE && host !== "www." + SITE) return new Response(null, { status: 403 });

    const text = await request.text();
    if (text.length > 8000) return new Response(null, { status: 413 });
    let e;
    try { e = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
    if (!EVENTS.has(e.event_name) || !short(e.event_id, 100)) return new Response(null, { status: 400 });

    let url = "";
    try { const u = new URL(e.event_source_url); if (u.hostname === SITE || u.hostname === "www." + SITE) url = u.href; } catch {}
    if (!url) return new Response(null, { status: 400 });

    const inUd = e.user_data || {};
    const ud = {
      client_ip_address: request.headers.get("CF-Connecting-IP") || undefined,
      client_user_agent: short(request.headers.get("User-Agent"), 1000),
      fbp: short(inUd.fbp),
      fbc: short(inUd.fbc, 600),
    };
    for (const k of HASHED) {
      const list = Array.isArray(inUd[k]) ? inUd[k].filter(isHash).slice(0, 3) : [];
      if (list.length) ud[k] = list;
    }

    const cd = e.custom_data && typeof e.custom_data === "object" ? e.custom_data : {};
    const custom = {};
    if (typeof cd.value === "number" && cd.value >= 0 && cd.value < 1e6) { custom.value = cd.value; custom.currency = "EGP"; }
    if (cd.content_type === "product") custom.content_type = "product";
    if (Array.isArray(cd.content_ids)) custom.content_ids = cd.content_ids.map((x) => short(x, 80)).filter(Boolean).slice(0, 50);
    if (Array.isArray(cd.contents)) custom.contents = cd.contents.slice(0, 50).map((c) => ({ id: short(c && c.id, 80), quantity: Math.max(1, Math.min(99, Number(c && c.quantity) || 1)) })).filter((c) => c.id);
    if (Number.isInteger(cd.num_items)) custom.num_items = Math.max(0, Math.min(999, cd.num_items));
    if (short(cd.order_id, 40)) custom.order_id = cd.order_id;

    const payload = {
      data: [{
        event_name: e.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.event_id,
        event_source_url: url,
        action_source: "website",
        user_data: ud,
        custom_data: custom,
      }],
      ...(env.TEST_CODE ? { test_event_code: env.TEST_CODE } : {}),
    };

    // Answer the browser straight away; the call to Meta finishes in the background.
    const version = env.GRAPH_VERSION || "v23.0";
    ctx.waitUntil(
      fetch(`https://graph.facebook.com/${version}/${env.PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_TOKEN)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (r) => { if (!r.ok) console.log("Meta CAPI error", r.status, await r.text()); })
        .catch((err) => console.log("Meta CAPI fetch failed", String(err))),
    );
    return new Response(null, { status: 204 });
  },
};
