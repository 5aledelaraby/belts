import type { ReactNode } from "react";
import { site, waLink, governorates, governoratesEn } from "../data/site";
import { products, styles, priceOf, pName, sName, sText, tName } from "../data/products";
import { useLang, useTr, hrefFor, clientStrings } from "../i18n";
import { schemaFor, keywords } from "../seo";
import { posts } from "../blog";
import { assets } from "../lib/assets";
import { img } from "../lib/images";
import { IconSprite, Icon } from "./Icons";
import { Logo } from "./Logo";
import { Bow, Sparkle } from "./Art";

interface Props {
  title: string;
  description: string;
  /** Path of this page relative to the site root, e.g. "lace/". */
  path: string;
  /** False for pages that exist in one language only (the blog): no hreflang, and the switch goes to the other home page. */
  hasTwin?: boolean;
  /** JSON-LD blocks that replace the automatic ones. */
  schema?: object[];
  children: ReactNode;
}

const fonts =
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=El+Messiri:wght@700&family=Marcellus&display=swap";

const marqueeFor = (en: boolean) => en ? [
  `Free shipping over ${site.shipping.freeOver} EGP`,
  `Delivery across Egypt in ${site.deliveryDays} working days`,
  "Cash on delivery or InstaPay",
  `${site.returnDays}-day returns with a full refund`,
  "Custom sizes on request",
] : [
  `شحن مجاني فوق ${site.shipping.freeOver} جنيه`,
  `توصيل خلال ${site.deliveryDays} أيام عمل لكل مصر`,
  "الدفع عند الاستلام أو InstaPay",
  `استرجاع خلال ${site.returnDays} يوم بفلوسك كاملة`,
  "مقاسات خاصة حسب الطلب",
];

export const Layout = ({ title, description, path, children, hasTwin = true, schema }: Props) => {
  const lang = useLang();
  const en = lang === "en";
  const tr = useTr();
  const url = (p = "") => hrefFor(lang, p);
  const marquee = marqueeFor(en);
  const other = en ? "ar" : "en";
  const isPage = hasTwin && !path.endsWith(".html");
  const canonical = site.url + url(path);
  const ogImage = site.url + hrefFor("ar", "assets/og.jpg");
  const catalog = Object.fromEntries(
    products.map((p) => {
      const im = img(p.id);
      return [p.id, {
        name: pName(p, lang), price: priceOf(p), style: p.style, styleName: sName(p.style, lang), hex: p.hex,
        texture: tName(p, lang), src: im.src, srcset: im.srcset, large: im.large,
      }];
    }),
  );
  // gsap + ScrollTrigger load with the page; Lenis (desktop smooth scroll) and Flip (filter animation) load on demand.
  const lazyVendor = (name: string) => hrefFor("ar", assets.vendor.find((v) => v.includes(`/${name}.`))!);
  const config = {
    shipping: site.shipping, whatsapp: site.whatsapp.international, instapay: site.instapay, deliveryDays: site.deliveryDays,
    vendor: { lenis: lazyVendor("lenis"), flip: lazyVendor("Flip") },
    capi: site.pixels.meta ? site.capi : "",
  };

  return (
    <html lang={lang} dir={en ? "ltr" : "rtl"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords[lang]} />
        <meta name="robots" content={path.endsWith(".html") ? "noindex, follow" : "index, follow, max-image-preview:large"} />
        <meta name="theme-color" content="#FFF5F3" />
        <link rel="canonical" href={canonical} />
        {isPage && <link rel="alternate" hrefLang="ar" href={site.url + hrefFor("ar", path)} />}
        {isPage && <link rel="alternate" hrefLang="en" href={site.url + hrefFor("en", path)} />}
        {isPage && <link rel="alternate" hrefLang="x-default" href={site.url + hrefFor("ar", path)} />}
        <link rel="icon" href={hrefFor("ar", "favicon.svg")} type="image/svg+xml" />
        <link rel="icon" href={hrefFor("ar", "assets/icons/icon-48.png")} sizes="48x48" type="image/png" />
        <link rel="apple-touch-icon" href={hrefFor("ar", "apple-touch-icon.png")} sizes="180x180" />
        <link rel="manifest" href={hrefFor("ar", "manifest.webmanifest")} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.brand} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={tr("أحزمة خصر Vicuna بالربط: دانتيل وفيونكة وطرف طويل على مانيكان", "Vicuna tie waist belts — lace, bow and long sash on mannequins")} />
        <meta property="og:locale" content={en ? "en_US" : "ar_EG"} />
        <meta property="og:locale:alternate" content={en ? "ar_EG" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={tr("أحزمة خصر Vicuna بالربط", "Vicuna tie waist belts")} />
        {site.twitter && <meta name="twitter:site" content={site.twitter} />}
        {site.ga4 && (
          <>
            {/* Google Analytics 4 — async, so it never blocks the page from showing */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4}`}></script>
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${site.ga4}",{page_language:"${lang}",debug_mode:/[?&]ga_debug=1/.test(location.search)||undefined});` }} />
          </>
        )}
        {/* The main (LCP) image of each page is preloaded by React from its fetchPriority="high" <img>. */}
        {site.pixels.meta && (
          /* Meta Pixel — the base code loads fbevents.js asynchronously */
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${site.pixels.meta}');window.__vpv='PageView.'+Date.now().toString(36)+'.'+Math.random().toString(36).slice(2,8);fbq('track','PageView',{},{eventID:window.__vpv});` }} />
        )}
        {site.pixels.tiktok && (
          /* TikTok Pixel — the base code loads events.js asynchronously */
          <script dangerouslySetInnerHTML={{ __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${site.pixels.tiktok}');ttq.page()}(window,document,'ttq');` }} />
        )}
        {/* WhatsApp is only opened on a tap, so a cheap DNS lookup is enough (a full preconnect would be wasted on most visits) */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Fonts: fetched early but applied without blocking the first paint (text shows in a system font, then swaps). */}
        <link rel="preload" as="style" href={fonts} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var l=document.createElement("link");l.rel="stylesheet";l.href=${JSON.stringify(fonts)};document.head.appendChild(l)})()` }} />
        <noscript><link rel="stylesheet" href={fonts} /></noscript>
        <link rel="stylesheet" href={hrefFor("ar", assets.css)} />
        {(schema ?? schemaFor(lang, path, title)).map((json, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />
        ))}
      </head>
      <body data-page={path || "home"} data-lang={lang}>
        {site.pixels.meta && (
          <noscript><img height={1} width={1} style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${site.pixels.meta}&ev=PageView&noscript=1`} /></noscript>
        )}
        <IconSprite />

        {/* announcement marquee */}
        <div className="marquee overflow-hidden bg-berry py-2 text-white" aria-label={tr("عروض", "Offers")}>
          <div className="marquee-track text-[13px] font-semibold">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-10" aria-hidden={i >= marquee.length ? "true" : undefined}>
                {m}
                <Sparkle className="size-3 text-petal" />
              </span>
            ))}
          </div>
        </div>

        <header className="site-header" data-scrolled="false">
          <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
              <button className="icon-btn lg:hidden" data-menu-open aria-label={tr("القايمة", "Menu")}>
                <Icon name="menu" className="size-6" />
              </button>
              <a href={url()} aria-label={`${site.brand} — ${tr("الصفحة الرئيسية", "Home")}`}><Logo /></a>
            </div>
            <nav className="no-scrollbar hidden items-center gap-2 overflow-x-auto lg:flex" aria-label={tr("الأقسام", "Collections")}>
              <a className="nav-pill" href={url("#shop")}>{tr("كل الموديلات", "Shop all")}</a>
              {styles.map((s) => (
                <a key={s.id} className="nav-pill" href={url(`${s.id}/`)} aria-current={path === `${s.id}/` ? "page" : undefined}>{sText(s, lang).name}</a>
              ))}
              {!en && <a className="nav-pill" href={url("blog/")} aria-current={path.startsWith("blog/") ? "page" : undefined}>المدونة</a>}
            </nav>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <a className="lang-switch" href={hrefFor(other, isPage ? path : "")} hrefLang={other} lang={other} data-lang-switch aria-label={tr("Switch to English", "التحويل للعربي")}>
                {en ? "عربي" : "EN"}
              </a>
              <a className="icon-btn" href={url("#shop")} data-show-favs aria-label={tr("المفضلة", "Favourites")}>
                <Icon name="heart" className="size-[22px]" />
                <span className="count-badge" data-fav-count hidden>0</span>
              </a>
              <button className="icon-btn" data-cart-open aria-label={tr("الشنطة", "Bag")}>
                <Icon name="bag" className="size-[22px]" />
                <span className="count-badge" data-cart-count hidden>0</span>
              </button>
            </div>
          </div>
        </header>

        {/* full-screen mobile menu */}
        <div className="menu-overlay" data-menu data-open="false" role="dialog" aria-modal="true" aria-label={tr("القايمة", "Menu")}>
          <div className="flex items-center justify-between">
            <Logo />
            <button className="icon-btn" data-menu-close aria-label={tr("إغلاق القايمة", "Close menu")}><Icon name="close" className="size-7" /></button>
          </div>
          <nav className="mt-10 flex flex-col">
            <a className="big" href={url("#shop")}>{tr("كل الموديلات", "Shop all")}</a>
            {styles.map((s) => <a key={s.id} className="big" href={url(`${s.id}/`)}>{sText(s, lang).name}</a>)}
            {!en && <a className="big" href={url("blog/")}>المدونة</a>}
          </nav>
          <Bow className="pointer-events-none absolute bottom-24 start-6 w-40 text-berry/30" />
          <div className="mt-auto flex flex-col gap-3 text-[15px] font-semibold">
            <a href={hrefFor(other, isPage ? path : "")} hrefLang={other} lang={other}>{en ? "عربي" : "English"} ⇄</a>
            <a href={url("returns/")}>{tr("الشحن والاسترجاع", "Shipping & returns")}</a>
            <a href={waLink(tr("السلام عليكم، عندي استفسار عن الأحزمة", "Hello, I have a question about the belts"))} target="_blank" rel="noopener">{tr("واتساب", "WhatsApp")} <span className="num">{site.whatsapp.display}</span></a>
            <div className="flex gap-2 pt-2">
              {site.social.map((s) => (
                <a key={s.id} className="icon-btn bg-white" href={s.href} target="_blank" rel="noopener" aria-label={en ? s.labelEn : s.label}><Icon name={s.id} /></a>
              ))}
            </div>
          </div>
        </div>

        <main>{children}</main>

        <Footer en={en} />

        {/* quick view */}
        <dialog className="quick" data-quick aria-label={tr("تفاصيل الحزام", "Belt details")}>
          <div className="grid md:grid-cols-[1.05fr_1fr]">
            <div className="relative m-3 aspect-square overflow-hidden rounded-[22px] bg-white">
              <div className="absolute inset-[15%] rounded-full bg-petal/70 blur-2xl" />
              <img data-q-img alt="" className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply" />
            </div>
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="tag" data-q-style></span>
                  <h2 className="mt-3 font-display text-[32px] font-bold leading-tight" data-q-name></h2>
                </div>
                <button className="icon-btn -me-2 -mt-2" data-quick-close aria-label={tr("إغلاق", "Close")}><Icon name="close" className="size-6" /></button>
              </div>
              <div className="text-[28px] font-extrabold text-berry"><span className="num" data-q-price></span> <span className="text-[16px]">{tr("جنيه", "EGP")}</span></div>
              <div>
                <div className="mb-3 text-[13px] font-semibold text-mauve">{tr("اللون:", "Colour:")} <span className="text-plum" data-q-color></span></div>
                <div className="flex flex-wrap gap-2.5" data-q-swatches></div>
              </div>
              <ul className="space-y-2.5 rounded-2xl bg-white p-4 text-[14px]">
                <li className="flex gap-3"><Icon name="ruler" className="size-5 shrink-0 text-berry" /> {tr(`عرض ${site.size.widthCm} سم · طول ${site.size.lengthCm} سم · مناسب لكل الأوزان`, `${site.size.widthCm} cm wide · ${site.size.lengthCm} cm long · fits every size`)}</li>
                <li className="flex gap-3"><Icon name="check" className="size-5 shrink-0 text-berry" /> <span data-q-texture></span></li>
                <li className="flex gap-3"><Icon name="truck" className="size-5 shrink-0 text-berry" /> {tr(`توصيل خلال ${site.deliveryDays} أيام عمل · مقاسات خاصة بالطلب`, `Delivered in ${site.deliveryDays} working days · custom sizes on request`)}</li>
              </ul>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <button className="btn btn-berry btn-shine flex-1" data-q-add>{tr("أضيفي للشنطة", "Add to bag")}</button>
                <a className="btn btn-white flex-1" data-q-wa target="_blank" rel="noopener"><Icon name="wa" className="size-4" /> {tr("اطلبي على واتساب", "Order on WhatsApp")}</a>
              </div>
            </div>
          </div>
        </dialog>

        {/* cart */}
        <div className="scrim" data-scrim hidden></div>
        <aside className="drawer" data-cart data-open="false" aria-label={tr("الشنطة", "Bag")} aria-hidden="true" data-lenis-prevent>
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-display text-[28px] font-bold">{tr("الشنطة", "Your bag")} 🛍</h2>
            <button className="icon-btn" data-cart-close aria-label={tr("إغلاق الشنطة", "Close bag")}><Icon name="close" className="size-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div data-lines></div>
            <form id="order" className="mt-6 flex flex-col gap-4" noValidate>
              <div className="font-display text-[20px] font-bold">{tr("بيانات التوصيل", "Delivery details")}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field"><label htmlFor="f-name">{tr("الاسم", "Name")}</label><input id="f-name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="f-phone">{tr("رقم الموبايل", "Mobile number")}</label><input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required /></div>
              </div>
              <div className="field">
                <label htmlFor="f-gov">{tr("المحافظة", "Governorate")}</label>
                <select id="f-gov" required defaultValue="">
                  <option value="">{tr("اختاري المحافظة", "Choose your governorate")}</option>
                  {(en ? governoratesEn : governorates).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="f-addr">{tr("العنوان بالتفصيل", "Full address")}</label><textarea id="f-addr" placeholder={tr("المنطقة، الشارع، رقم العمارة، الدور", "Area, street, building number, floor")} required></textarea></div>
              <div className="field"><label htmlFor="f-note">{tr("ملاحظات أو مقاس خاص (اختياري)", "Notes or custom size (optional)")}</label><input id="f-note" /></div>

              <div className="mt-2 font-display text-[20px] font-bold">{tr("طريقة الدفع", "Payment method")}</div>
              <label className="radio-card">
                <input type="radio" name="pay" value="cod" defaultChecked className="mt-1.5 accent-berry" />
                <span><b>{tr("الدفع عند الاستلام", "Cash on delivery")}</b><br /><span className="text-[13px] text-mauve">{tr("ادفعي للمندوب لما الطلب يوصلك", "Pay the courier when your order arrives")}</span></span>
              </label>
              <label className="radio-card">
                <input type="radio" name="pay" value="instapay" className="mt-1.5 accent-berry" />
                <span><b>InstaPay</b><br /><span className="text-[13px] text-mauve">{tr("حوّلي على", "Transfer to")} <b className="num text-plum">{site.instapay}</b> {tr("وابعتي صورة التحويل على واتساب", "and send the screenshot on WhatsApp")}</span></span>
              </label>
              <div className="field">
                <label htmlFor="f-ship">{tr("الشحن", "Shipping")}</label>
                <select id="f-ship" defaultValue="standard">
                  <option value="standard">{tr(`عادي — ${site.shipping.standard} جنيه (مجاني فوق ${site.shipping.freeOver})`, `Standard — ${site.shipping.standard} EGP (free over ${site.shipping.freeOver})`)}</option>
                  <option value="express">{tr(`سريع — ${site.shipping.express} جنيه`, `Express — ${site.shipping.express} EGP`)}</option>
                </select>
              </div>
              <div className="min-h-5 text-[13px] font-semibold text-red-700" data-err role="alert"></div>
            </form>
          </div>
          <div className="space-y-2 rounded-t-[24px] bg-white px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-10px_30px_-20px_rgb(58_31_38/.3)]">
            <div className="flex justify-between text-[14px]"><span>{tr("المنتجات", "Items")} (<span className="num" data-n>0</span>)</span><span><span className="num" data-sub>0</span> {tr("جنيه", "EGP")}</span></div>
            <div className="flex justify-between text-[14px]"><span>{tr("الشحن", "Shipping")}</span><span data-ship>—</span></div>
            <div className="flex justify-between text-[20px] font-extrabold"><span>{tr("الإجمالي", "Total")}</span><span className="text-berry"><span className="num" data-total>0</span> {tr("جنيه", "EGP")}</span></div>
            <button type="submit" form="order" className="btn btn-wa w-full"><Icon name="wa" className="size-4" /> {tr("إرسال الطلب على واتساب", "Send order on WhatsApp")}</button>
            <p className="text-center text-[12px] text-mauve">{tr(`توصيل خلال ${site.deliveryDays} أيام عمل · استرجاع خلال ${site.returnDays} يوم`, `Delivery in ${site.deliveryDays} working days · ${site.returnDays}-day returns`)} · <a className="underline" href={url("returns/")}>{tr("التفاصيل", "Details")}</a></p>
          </div>
        </aside>

        {/* lightbox */}
        <dialog className="lightbox" data-lightbox-dialog aria-label={tr("عرض الصورة", "Image viewer")}>
          <figure className="m-0 flex max-h-[92svh] w-full max-w-[1100px] flex-col items-center gap-4 px-4">
            <img data-lb-img alt="" className="max-h-[80svh] w-auto max-w-full rounded-[24px] bg-white object-contain shadow-2xl" />
            <figcaption className="text-[15px] font-semibold" data-lb-caption></figcaption>
          </figure>
          <button className="lb-btn top-4 end-4" data-lb-close aria-label={tr("إغلاق", "Close")}><Icon name="close" className="size-6" /></button>
          <button className="lb-btn start-3 top-1/2 -translate-y-1/2" data-lb-prev aria-label={tr("الصورة اللي قبلها", "Previous image")}>{en ? "‹" : "›"}</button>
          <button className="lb-btn end-3 top-1/2 -translate-y-1/2" data-lb-next aria-label={tr("الصورة اللي بعدها", "Next image")}>{en ? "›" : "‹"}</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/70 num" data-lb-count></div>
        </dialog>

        <div className="sheet" data-sheet data-open="false" role="dialog" aria-modal="true" aria-label={tr("فلترة", "Filter")} data-lenis-prevent></div>
        <div className="toast" data-toast role="status"></div>

        {/* floating WhatsApp button: fades in after 300px of scrolling */}
        <a className="wa-fab" data-wa-fab data-show="false" data-tip="false" target="_blank" rel="noopener"
          href={waLink(tr("مرحبا، عايزة أستفسر عن أحزمة Vicuna", "Hello, I have a question about Vicuna belts"))}
          aria-label={tr("كلمينا على واتساب", "Chat with us on WhatsApp")}>
          <Icon name="wa" className="size-[30px]" />
          <span className="wa-tip" aria-hidden="true">{tr("كلمينا على واتساب", "Chat with us on WhatsApp")}</span>
        </a>

        <script id="catalog" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ config, catalog, strings: clientStrings[lang] }) }} />
        {assets.vendor.filter((v) => /\/(gsap|ScrollTrigger)\./.test(v)).map((v) => <script key={v} src={hrefFor("ar", v)} defer></script>)}
        <script src={hrefFor("ar", assets.js)} defer></script>
      </body>
    </html>
  );
};

/** Short labels for blog posts in the footer. */
const footerPostLabel: Record<string, string> = {
  "dress-belt-styling-ideas": "طرق تنسيق حزام الفستان",
  "evening-dress-belt": "حزام الفستان السواريه",
  "belt-for-body-shape": "الحزام المناسب لشكل جسمك",
  "lace-belts-90s-trend": "أحزمة الدانتيل وموضة التسعينات",
  "waist-belt-size-material-guide": "دليل مقاسات وخامات الأحزمة",
};

const Footer = ({ en }: { en: boolean }) => {
  const tr = (a: string, e: string) => (en ? e : a);
  const url = (p = "") => hrefFor(en ? "en" : "ar", p);
  return (
  <footer className="relative mt-10 overflow-hidden rounded-t-[40px] bg-plum text-white">
    <Bow className="pointer-events-none absolute -top-4 end-6 w-48 text-white/10 sm:w-72" w={1.2} />
    <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr_1fr]">
      <div>
        <div className="[--ink:white] [--accent:var(--color-rose)] [--accent-deep:var(--color-petal)]"><Logo /></div>
        <p className="mt-5 max-w-sm text-[14px] leading-7 text-white/70">{tr("أحزمة خصر بالربط من جلد PU مستورد، بتتصمم في القاهرة وبتوصل لكل محافظات مصر.", "Tie waist belts in imported PU leather — designed in Cairo, delivered to every governorate in Egypt.")}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold">
          <span className="rounded-full bg-white/10 px-3 py-1.5">💵 {tr("الدفع عند الاستلام", "Cash on delivery")}</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5" style={{ direction: "ltr" }}>InstaPay</span>
        </div>
        <div className="mt-6 flex gap-2" aria-label={tr("تابعينا", "Follow us")}>
          {site.social.map((s) => (
            <a key={s.id} className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20" href={s.href} target="_blank" rel="noopener" aria-label={en ? s.labelEn : s.label}><Icon name={s.id} className="size-[18px]" /></a>
          ))}
        </div>
      </div>
      <nav aria-label={tr("التصميمات", "Designs")}>
        <div className="font-display text-[18px] font-bold text-rose">{tr("تسوّقي", "Shop")}</div>
        <ul className="mt-3 space-y-0.5 text-[14px]">
          <li><a className="hover:text-rose" href={url("#shop")}>{tr("كل الموديلات", "All belts")}</a></li>
          {styles.map((s) => <li key={s.id}><a className="hover:text-rose" href={url(`${s.id}/`)}>{tr(`أحزمة ${sText(s, "ar").name}`, `${sText(s, "en").name} belts`)}</a></li>)}
        </ul>
      </nav>
      <nav aria-label={tr("وصل حديثاً", "New in")}>
        <div className="font-display text-[18px] font-bold text-rose">{tr("وصل حديثاً", "New in")}</div>
        <ul className="mt-3 space-y-0.5 text-[14px]">
          {products.filter((p) => p.isNew).slice(0, 7).map((p) => (
            <li key={p.id}><a className="hover:text-rose" href={url(`p/${p.id}/`)}>{tr(`حزام ${p.name}`, `${pName(p, "en")} belt`)}</a></li>
          ))}
        </ul>
      </nav>
      <nav aria-label={tr("المدونة", "Blog")}>
        <div className="font-display text-[18px] font-bold text-rose">{tr("المدونة", "Blog (Arabic)")}</div>
        <ul className="mt-3 space-y-0.5 text-[14px]" lang="ar">
          <li><a className="font-semibold hover:text-rose" href={hrefFor("ar", "blog/")}>{en ? "All articles" : "كل المقالات"}</a></li>
          {posts().map((p) => <li key={p.slug}><a className="hover:text-rose" href={hrefFor("ar", `blog/${p.slug}/`)}>{footerPostLabel[p.slug] ?? p.title}</a></li>)}
        </ul>
      </nav>
      <nav aria-label={tr("مساعدة", "Help")}>
        <div className="font-display text-[18px] font-bold text-rose">{tr("مساعدة", "Help")}</div>
        <ul className="mt-3 space-y-0.5 text-[14px]">
          <li><a className="hover:text-rose" href={url("about/")}>{tr("من نحن", "About us")}</a></li>
          <li><a className="hover:text-rose" href={url("returns/")}>{tr("الشحن والاسترجاع", "Shipping & returns")}</a></li>
          <li><a className="hover:text-rose" href={url("#tie")}>{tr("طريقة الربط", "How to tie")}</a></li>
          <li><a className="hover:text-rose" href={url("#faq")}>{tr("أسئلة شائعة", "FAQ")}</a></li>
          <li><a className="hover:text-rose" href={url("privacy/")}>{tr("سياسة الخصوصية", "Privacy policy")}</a></li>
          <li><a className="hover:text-rose" href={url("terms/")}>{tr("الشروط والأحكام", "Terms & conditions")}</a></li>
          <li><a className="hover:text-rose" href={waLink(tr("السلام عليكم، عندي استفسار", "Hello, I have a question"))} target="_blank" rel="noopener">{tr("واتساب", "WhatsApp")} <span className="num">{site.whatsapp.display}</span></a></li>
          <li><a className="hover:text-rose" href={`mailto:${site.email}`} dir="ltr">{site.email}</a></li>
        </ul>
      </nav>
    </div>
    <div className="relative border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-[12px] leading-6 text-white/50 sm:px-8 lg:flex-row lg:justify-between">
        <div>
          {en ? <>{site.legalNameEn} · <span lang="ar" style={{ unicodeBidi: "isolate" }}>{site.legalNameAr}</span> · {site.legalFormEn} · Commercial Register No. <span className="num">{site.commercialRegister}</span>
          <br />{site.headOfficeEn}</> : <>{site.legalNameAr} · <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{site.legalNameEn}</span> · {site.legalForm} · سجل تجاري رقم <span className="num">{site.commercialRegister}</span>
          <br />{site.headOffice}</>}
        </div>
        <div>© 2026 {site.brand} · {tr("اتعمل بحب في القاهرة ♡", "Made with love in Cairo ♡")}</div>
      </div>
    </div>
  </footer>
  );
};
