import { Fragment } from "react";
import { site, waLink } from "../data/site";
import { colors, products, styles, priceOf, productUrl, pName, sName, sText, cName, type Product, type Style } from "../data/products";
import { useLang, useTr, useHref } from "../i18n";
import { productSeo } from "../data/seo-copy";
import { faqItems } from "../data/faq";
import { img, videos } from "../lib/images";
import { Icon } from "./Icons";
import { Illus } from "./Illus";
import { Bow, Ribbon, Sparkle, Blobs, Heart } from "./Art";

const PAGE_SIZE = 12;
const first = (styleId: string) => products.find((p) => p.style === styleId)!;

/* ---------- hero (home) ---------- */
export const Hero = () => {
  const tr = useTr();
  const h = img("hero");
  // Six belts float around the photo; positions are relative to the photo column.
  const floaters = [
    { id: "lace-gold", cls: "top-[2%] -start-[7%] w-[30%]", r: "-10deg", d: "0s" },
    { id: "bow-gold", cls: "top-[0%] -end-[5%] w-[30%]", r: "9deg", d: "-1.5s" },
    { id: "snake-grey", cls: "top-[36%] -start-[10%] w-[28%]", r: "6deg", d: "-3s" },
    { id: "classic-camel-suede", cls: "top-[40%] -end-[9%] w-[28%]", r: "-7deg", d: "-4.5s" },
    { id: "lace-red", cls: "bottom-[4%] -start-[6%] w-[30%]", r: "-5deg", d: "-2.2s" },
    { id: "classic-sky-blue", cls: "bottom-[1%] -end-[6%] w-[30%]", r: "8deg", d: "-3.7s" },
  ];
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="hero-box relative mx-auto grid max-w-[1400px] items-center overflow-hidden rounded-[36px] lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 col-span-full flex justify-center px-4 pt-7 sm:pt-9">
          <span className="ship-pill">
            <Sparkle className="ship-spark -start-5 top-0 size-3.5" />
            <Sparkle className="ship-spark -end-4 -bottom-1 size-3 [--d:-1.1s]" />
            <Sparkle className="ship-spark -top-3 end-6 size-2.5 [--d:-2s]" />
            <Illus name="plane" className="size-[22px] [--il-fill:rgb(255_255_255/.25)]" />
            {tr(`توصيل لكل مصر خلال ${site.deliveryDays} أيام`, `Delivery across Egypt in ${site.deliveryDays} days`)}
          </span>
        </div>

        <div className="relative z-10 px-6 pb-10 pt-6 sm:px-12 sm:pb-16 sm:pt-8">
          <p className="hero-tagline" lang="en" dir="ltr">The wrap belt that accentuates your waist</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold leading-[1.15]">
            {tr("حزام واحد", "One belt")}<br />{tr("يغيّر", "changes")} <span className="relative inline-block text-berry">{tr("اللوك كله", "the whole look")}
              <Ribbon className="absolute -bottom-3 start-0 h-4 w-full text-berry/40" w={3} />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-8 text-mauve">
            {tr("أحزمة خصر بالربط من جلد PU مستورد. من", "Tie waist belts in imported PU leather. From")} <b className="text-plum">{tr("120 جنيه", "120 EGP")}</b>{tr(`، والدفع عند الاستلام، واسترجاع خلال ${site.returnDays} يوم.`, `, cash on delivery, and ${site.returnDays}-day returns.`)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#shop" className="btn btn-berry btn-shine" data-magnetic>{tr("تسوّقي دلوقتي", "Shop now")} <Icon name="arrow" className="size-4" /></a>
            <a href="#styles" className="btn btn-white">{tr("التصميمات", "Styles")}</a>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-[78%] max-w-[480px] pb-12 pt-4 lg:w-full lg:py-12">
          <figure className="arch relative aspect-[4/5] overflow-hidden border-[6px] border-white bg-white shadow-[var(--shadow-lift)]" data-tilt>
            <img data-parallax src={h.src} srcSet={h.srcset} sizes="(max-width:1024px) 78vw, 480px" width={h.width} height={h.height}
              alt={tr("تلات مانيكان لابسين أحزمة خصر: كونياك وأبيض وكشكشة سودا", "Three mannequins wearing waist belts: cognac, white and a black ruffle")} className="size-full scale-[1.18] object-cover object-[50%_60%]" fetchPriority="high" />
          </figure>
          {floaters.map((f) => (
            <img key={f.id} src={img(f.id).src} width={img(f.id).width} height={img(f.id).height} alt="" aria-hidden="true" decoding="async" fetchPriority="low"
              className={`floaty pointer-events-none absolute rounded-[22px] bg-white p-1.5 shadow-[var(--shadow-lift)] ${f.cls}`}
              style={{ ["--r" as string]: f.r, ["--d" as string]: f.d }} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- story circles ---------- */
export const Stories = ({ current }: { current?: string }) => {
  const lang = useLang(); const url = useHref();
  return (
  <section id="styles" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-10 sm:px-6">
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:justify-center sm:gap-5">
      <a href={url("#shop")} className="story">
        <span className="story-ring"><span><Heart className="size-8 text-berry" /></span></span>
        {lang === "en" ? "All" : "الكل"}
      </a>
      {styles.map((s) => (
        <a key={s.id} href={url(`${s.id}/`)} className="story" aria-current={current === s.id ? "page" : undefined}>
          <span className="story-ring"><span><img src={img(first(s.id).id).src} width={img(first(s.id).id).width} height={img(first(s.id).id).height} alt="" loading="lazy" decoding="async" /></span></span>
          {sText(s, lang).name}
        </a>
      ))}
    </div>
  </section>
  );
};

/* ---------- perks ---------- */
export const Perks = () => {
  const tr = useTr();
  return (
  <section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ["plane", tr(`توصيل خلال ${site.deliveryDays} أيام`, `Delivery in ${site.deliveryDays} days`), tr("لكل محافظات مصر", "To every governorate")],
        ["cash", tr("الدفع عند الاستلام", "Cash on delivery"), tr("أو InstaPay", "or InstaPay")],
        ["return", tr(`استرجاع ${site.returnDays} يوم`, `${site.returnDays}-day returns`), tr("فلوسك ترجعلك كاملة", "Full refund")],
        ["tape", tr("بيلبس لحد 90 كيلو", "Fits up to 90 kg"), tr("ومقاسات خاصة بالطلب", "Custom sizes on request")],
      ].map(([icon, t, d], i) => (
        <div key={t} className="perk flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1" data-reveal style={{ ["--i" as string]: i }}>
          <Illus name={icon} className="size-12 shrink-0 text-berry" />
          <div className="min-w-0"><div className="text-[14px] font-bold">{t}</div><div className="text-[12px] text-mauve">{d}</div></div>
        </div>
      ))}
    </div>
  </section>
  );
};

/* ---------- product card ---------- */
export const ProductCard = ({ p, index, paged = true }: { p: Product; index: number; paged?: boolean }) => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const name = pName(p, lang);
  const im = img(p.id);
  const dt = img(`${p.id}-detail`);
  const siblings = products.filter((q) => q.style === p.style);
  const href = url(productUrl(p.id));
  return (
    <article className="card" data-card data-id={p.id} data-style={p.style} data-color={p.color} data-price={priceOf(p)} data-order={index}
      hidden={paged && index >= PAGE_SIZE ? true : undefined}>
      <div className="card-media">
        <a href={href} className="absolute inset-0" aria-label={name}>
          <img className="img-main" src={im.src} srcSet={im.srcset} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            width={im.width} height={im.height} alt={tr(productSeo(p).alt, `${name} women's waist belt by Vicuna`)} loading={index < 4 ? "eager" : "lazy"} fetchPriority={index < 4 ? "low" : undefined} decoding="async" data-img />
          <img className="img-alt" src={dt.src} srcSet={dt.srcset} sizes="(max-width:640px) 50vw, 25vw"
            width={dt.width} height={dt.height} alt={tr(productSeo(p).altDetail, `${name} belt knot detail`)} loading="lazy" decoding="async" />
        </a>
        <button className="quick-add" data-add={p.id} aria-label={tr(`أضيفي ${name} للشنطة`, `Add ${name} to bag`)}>{tr("أضيفي للشنطة 🛍", "Add to bag 🛍")}</button>
      </div>
      <button className="heart" data-fav={p.id} aria-pressed="false" aria-label={tr(`أضيفي ${name} للمفضلة`, `Add ${name} to favourites`)}>
        <Icon name="heart" className="size-[18px]" />
      </button>
      <div className="px-1.5 pt-3">
        <div className="text-[12px] font-semibold text-mauve">{sName(p.style, lang)}</div>
        <h3 className="text-[15px] font-bold leading-snug sm:text-[16px]"><a href={href} className="block py-1 hover:text-berry">{name}</a></h3>
        <div className="mt-1.5 text-[16px] font-extrabold text-berry"><span className="num">{priceOf(p)}</span> <span className="text-[12px]">{tr("جنيه", "EGP")}</span></div>
        <div className="mt-2 flex flex-wrap items-center gap-2" aria-label={tr("الألوان المتاحة", "Available colours")}>
          {siblings.slice(0, 3).map((q) => (
            <a key={q.id} className="swatch" style={{ background: q.hex }} href={url(productUrl(q.id))}
              aria-current={q.id === p.id ? "true" : undefined} aria-label={pName(q, lang)} title={pName(q, lang)} />
          ))}
          {siblings.length > 3 && <a href={url(`${p.style}/`)} dir="ltr" className="grid h-6 min-w-6 place-items-center px-1 text-[12px] font-semibold text-mauve hover:text-berry" aria-label={tr(`${siblings.length - 3} ألوان تانية`, `${siblings.length - 3} more colours`)}>+{siblings.length - 3}</a>}
        </div>
      </div>
    </article>
  );
};

/* ---------- how to order: the slim hint in the sticky filter bar ---------- */
const orderSteps = (tr: (a: string, e: string) => string) => [
  { icon: "🛍", title: tr("اختاري الحزام اللي يعجبك", "Pick the belt you love"), hint: tr("اضغطي على الصورة أو الاسم", "Tap its photo or name"), short: tr("اختاري الحزام", "Pick a belt") },
  { icon: "➕", title: tr("أضيفيه للشنطة", "Add it to your bag"), hint: tr("دوسي على «أضيفي للشنطة»", "Tap “Add to bag”"), short: tr("أضيفيه للشنطة", "Add to bag") },
  { icon: "📱", title: tr("ابعتي الطلب", "Send your order"), hint: tr("افتحي الشنطة وابعتي على واتساب", "Open your bag and send it on WhatsApp"), short: tr("ابعتي على واتساب", "Send on WhatsApp") },
];

/** Appears once the shop heading has scrolled away, and never again after the first add to bag. */
const OrderStepsMini = () => {
  const tr = useTr();
  const steps = orderSteps(tr);
  return (
    <div className="steps-mini" data-steps-mini data-show="false" aria-label={tr("إزاي تطلبي في 3 خطوات؟", "How to order in 3 steps")}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-1.5 px-4 text-[12.5px] font-semibold text-plum sm:gap-3 sm:px-6 sm:text-[13px]">
        {steps.map((st, i) => (
          <Fragment key={st.short}>
            {i === 2
              ? <button type="button" className="steps-mini-item underline decoration-rose underline-offset-4" data-cart-open-mini><span className="steps-mini-num num">{i + 1}</span>{st.short}</button>
              : <span className="steps-mini-item"><span className="steps-mini-num num">{i + 1}</span>{st.short}</span>}
            {i < steps.length - 1 && <span className="steps-arrow inline-block text-rose" aria-hidden="true">→</span>}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

/* ---------- multi-belt offer: 2nd belt −25%, 3rd −35% (applied to the cheaper belts in the bag) ---------- */
export const OfferStrip = () => {
  const tr = useTr(); const url = useHref();
  return (
    <div className="offer-strip" data-reveal>
      <Illus name="tag" className="size-12 shrink-0 text-white [--il-fill:rgb(255_255_255/.22)]" />
      <div className="min-w-0">
        <div className="text-[16px] font-extrabold leading-snug sm:text-[18px]">{tr("الحزام التاني بخصم 25%، والتالت بخصم 35% 🎁", "2nd belt 25% off, 3rd belt 35% off 🎁")}</div>
        <div className="mt-0.5 text-[12.5px] text-white/85">{tr("الخصم بيتحسب لوحده في الشنطة · كل ما تزوّدي، توفّري أكتر", "Applied automatically in your bag · the more you add, the more you save")} · <a href={url("terms/#offers")} className="underline underline-offset-2">{tr("الشروط", "Terms")}</a></div>
      </div>
    </div>
  );
};

/* ---------- filter bar + grid ---------- */
export const Shop = ({ only, title }: { only?: Style; title?: string }) => {
  const lang = useLang(); const tr = useTr();
  title ??= tr("كل الموديلات", "All belts");
  const list = only ? products.filter((p) => p.style === only.id) : products;
  const usedColors = colors.filter((c) => list.some((p) => p.color === c.id));
  const prices = [...new Set(list.map(priceOf))].sort((a, b) => a - b);
  return (
    <section id="shop" className="scroll-mt-20" data-shop data-view="grid">
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6"><OfferStrip /></div>
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6" data-steps>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">
            {title} <Sparkle className="inline size-6 text-berry" />
          </h2>
          <span className="tag"><span className="num" data-result-count>{list.length}</span> {tr("موديل", "belts")}</span>
        </div>
      </div>

      <div className="filter-bar sticky top-[70px] z-30 mt-5 bg-blush/90 backdrop-blur-xl">
        <OrderStepsMini />
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="no-scrollbar -my-2 hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2 md:flex">
            {!only && (
              <>
                <button className="pill" data-filter-style="all" aria-pressed="true">{tr("الكل", "All")}</button>
                {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{sText(s, lang).name}</button>)}
              </>
            )}
            <button className="pill inline-flex items-center gap-1.5" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> {tr("المفضلة", "Favourites")}</button>
            <span className="mx-1 h-6 w-px shrink-0 bg-plum/15" />
            {usedColors.map((c) => (
              <button key={c.id} className="dot" style={{ background: c.hex }} data-filter-color={c.id} aria-pressed="false" aria-label={cName(c, lang)} title={cName(c, lang)} />
            ))}
          </div>
          <button className="pill inline-flex items-center gap-2 md:hidden" data-sheet-open>
            <Icon name="filter" className="size-4" /> {tr("فلترة", "Filter")} <span className="num text-berry" data-active-filters></span>
          </button>
          <div className="ms-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="sort">{tr("ترتيب", "Sort")}</label>
            <select id="sort" className="rounded-full bg-white py-2 pe-8 ps-4 text-[13px] font-semibold shadow-[0_2px_0_rgb(0_0_0/.1)] outline-none" data-sort defaultValue="featured">
              <option value="featured">{tr("المميز", "Featured")}</option>
              <option value="price-asc">{tr("السعر: من الأقل", "Price: low to high")}</option>
              <option value="price-desc">{tr("السعر: من الأعلى", "Price: high to low")}</option>
            </select>
            <div className="hidden items-center rounded-full bg-white p-1 sm:flex" role="group" aria-label={tr("طريقة العرض", "View")}>
              <button className="icon-btn size-8 aria-pressed:bg-plum aria-pressed:text-white" data-view-btn="grid" aria-pressed="true" aria-label={tr("شبكة", "Grid")}><Icon name="grid" className="size-4" /></button>
              <button className="icon-btn size-8 aria-pressed:bg-plum aria-pressed:text-white" data-view-btn="list" aria-pressed="false" aria-label={tr("قايمة", "List")}><Icon name="list" className="size-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <template data-sheet-template>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-rose" />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[26px] font-bold">{tr("فلترة", "Filter")}</h3>
          <button className="icon-btn" data-sheet-close aria-label={tr("إغلاق", "Close")}><Icon name="close" className="size-6" /></button>
        </div>
        {!only && (
          <>
            <div className="mt-5 text-[13px] font-bold text-mauve">{tr("التصميم", "Style")}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="pill" data-filter-style="all" aria-pressed="true">{tr("الكل", "All")}</button>
              {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{sText(s, lang).name}</button>)}
            </div>
          </>
        )}
        <div className="mt-5 text-[13px] font-bold text-mauve">{tr("اللون", "Colour")}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {usedColors.map((c) => (
            <button key={c.id} className="pill flex items-center gap-2" data-filter-color={c.id} aria-pressed="false">
              <span className="size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/.15)]" style={{ background: c.hex }} /> {cName(c, lang)}
            </button>
          ))}
        </div>
        <div className="mt-5 text-[13px] font-bold text-mauve">{tr("السعر", "Price")}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="pill" data-filter-price="all" aria-pressed="true">{tr("كل الأسعار", "All prices")}</button>
          {prices.map((p) => <button key={p} className="pill" data-filter-price={p} aria-pressed="false"><span className="num">{p}</span> {tr("جنيه", "EGP")}</button>)}
        </div>
        <div className="mt-5"><button className="pill inline-flex items-center gap-2" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> {tr("المفضلة بس", "Favourites only")}</button></div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button className="btn btn-white" data-filter-reset>{tr("مسح الكل", "Clear all")}</button>
          <button className="btn btn-plum" data-sheet-close>{tr("عرض", "Show")} <span className="num" data-result-count>{list.length}</span></button>
        </div>
      </template>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="product-grid grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-grid>
          {list.slice(0, PAGE_SIZE).map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          {/* Cards past the first page wait in an inert <template> (no parsing/layout cost) until the shopper filters or taps "show more". */}
          {list.length > PAGE_SIZE && (
            <template data-more-cards>
              {list.slice(PAGE_SIZE).map((p, i) => <ProductCard key={p.id} p={p} index={i + PAGE_SIZE} />)}
            </template>
          )}
        </div>
        <div className="py-16 text-center" data-empty hidden>
          <Bow className="mx-auto w-24 text-rose" />
          <p className="mt-4 font-bold">{tr("مافيش موديلات بالفلتر ده", "No belts match this filter")}</p>
          <button className="mt-3 font-semibold text-berry underline" data-filter-reset>{tr("امسحي الفلتر", "Clear filter")}</button>
        </div>
        <div className="mt-10 text-center" data-more-wrap hidden={list.length <= PAGE_SIZE ? true : undefined}>
          <button className="btn btn-white" data-load-more>{tr("عرض موديلات أكتر", "Show more belts")} ↓</button>
        </div>
      </div>
    </section>
  );
};

/* ---------- shop by design (home) ---------- */
export const ShopByStyle = () => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const cover: Record<string, string> = { lace: "lace-black", "wide-bow": "bow-white", "thin-tie": "classic-royal-blue", croc: "croc-cognac", snake: "snake-grey", ruffle: "ruffle-red" };
  return (
    <section id="designs" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">{tr("تسوقي حسب التصميم", "Shop by design")} <Sparkle className="inline size-6 text-berry" /></h2>
        <p className="max-w-md text-mauve">{tr("6 تصميمات، كل واحد بشخصية. اختاري التصميم وشوفي كل ألوانه.", "Six designs, each with its own character. Pick one and see every colour.")}</p>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {styles.map((s) => {
          const st = sText(s, lang);
          const count = products.filter((p) => p.style === s.id).length;
          const im = img(cover[s.id] ?? first(s.id).id);
          return (
            <a key={s.id} href={url(`${s.id}/`)} data-reveal style={{ ["--i" as string]: styles.indexOf(s) % 3 }} className="group relative flex flex-col overflow-hidden rounded-[30px] bg-white p-3 shadow-[var(--shadow-card)] transition-transform duration-500 ease-soft hover:-translate-y-1.5">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[22px] bg-gradient-to-br from-petal/70 to-cream">
                <img src={im.src} srcSet={im.srcset} sizes="(max-width:1024px) 46vw, 30vw" width={im.width} height={im.height} loading="lazy"
                  alt={tr(`أحزمة ${st.name} من Vicuna`, `${st.name} belts by Vicuna`)}
                  className="absolute inset-0 size-full object-contain p-[9%] mix-blend-multiply transition-transform duration-700 ease-soft group-hover:scale-110 group-hover:-rotate-2" />
                <span className="tag absolute top-3 start-3"><span className="num">{count}</span> {tr("لون", count === 1 ? "colour" : "colours")}</span>
              </span>
              <span className="flex items-start justify-between gap-2 px-2 pb-1 pt-4">
                <span>
                  <span className="block font-display text-[clamp(1.25rem,2.4vw,1.7rem)] font-bold leading-tight group-hover:text-berry">{tr(`أحزمة ${st.name}`, `${st.name} belts`)}</span>
                  <span className="mt-1 hidden text-[13px] leading-6 text-mauve sm:block">{st.headline}</span>
                </span>
                <span className="shrink-0 rounded-full bg-petal px-3 py-1 text-[13px] font-extrabold text-berry"><span className="num">{s.price}</span> {tr("ج", "EGP")}</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

/* ---------- tie steps ---------- */
export const TieSteps = () => {
  const tr = useTr();
  return (
  <section id="tie" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-20 sm:px-6">
    <div className="flex items-center gap-3">
      <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">{tr("طريقة الربط", "How to tie")}</h2>
      <Bow className="w-16 text-berry" w={2} />
    </div>
    <ol className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        [tr("حطّي الحزام على الخصر", "Place it on your waist"), tr("الجزء العريض من قدّام، والشريطين من ورا.", "The wide part at the front, the two straps behind.")],
        [tr("لفّي الشريطين", "Wrap the straps"), tr("عدّيهم حوالين الوسط ورجّعيهم لقدّام فوق الحزام.", "Cross them around your waist and bring them back to the front over the belt.")],
        [tr("اربطي بطريقتك", "Tie it your way"), tr("فيونكة في النص أو على جنب، أو عقدة بسيطة وسيبي الأطراف نازلة.", "A bow at the centre or to the side, or a simple knot with the ends falling.")],
      ].map(([t, d], i) => (
        <li key={t} data-reveal style={{ ["--i" as string]: i }} className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1">
          <span className="grid size-12 place-items-center rounded-2xl bg-berry text-[22px] font-extrabold text-white num">{i + 1}</span>
          <h3 className="mt-4 text-[19px] font-bold">{t}</h3>
          <p className="mt-1.5 text-mauve">{d}</p>
          <Bow className="absolute -bottom-3 -end-3 w-24 text-petal" w={2} />
        </li>
      ))}
    </ol>
  </section>
  );
};

/* ---------- real photos: the founder at work, a finished belt, then the laser clip (home, just above "on the body") ---------- */
export const MadeByHand = () => {
  const tr = useTr();
  const poster = img("laser-poster"), f = img("founder"), nb = img("navy-belt"), col = img("founder-collage");
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6">
      <div className="max-w-2xl" data-reveal>
        <span className="eyebrow text-berry">{tr("من غير فلاتر ولا مونتاج", "No filters, no staging")}</span>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-tight">{tr("كل الصور هنا", "Every photo here is")} <span className="text-berry">{tr("حقيقية", "real")}</span> {tr("ومن ورشتنا", "— from our workshop")}</h2>
        <p className="mt-3 leading-8 text-mauve">{tr("اللي بتشوفيه هو اللي هيوصلك بالظبط: نفس الحزام، نفس الخامة، ونفس الإيد اللي فصّلته وراجعته قبل ما يتشحن.", "What you see is exactly what you get: the same belt, the same material, and the same hands that made it and checked it before shipping.")}</p>
      </div>

      <figure className="real-collage mt-8" data-reveal>
        <img src={col.src} srcSet={col.srcset} sizes="(max-width:1400px) 94vw, 1350px" width={col.width} height={col.height} loading="lazy" decoding="async"
          alt={tr("خالد العربي بيفصّل ويظبط حزام فيونكة كحلي على المانيكان", "Khaled Elaraby making and fitting a navy bow belt on the mannequin")} />
      </figure>
      <figure className="real-belt mt-3" data-reveal>
        <img src={nb.src} srcSet={nb.srcset} sizes="(max-width:768px) 80vw, 460px" width={nb.width} height={nb.height} loading="lazy" decoding="async"
          alt={tr("حزام فيونكة كحلي بعد التفصيل", "The finished navy bow belt")} />
      </figure>

      <figure className="founder-note mt-5" data-reveal>
        <img src={f.src} srcSet={f.srcset} sizes="72px" width={f.width} height={f.height} loading="lazy" decoding="async" alt="" />
        <figcaption>
          <span className="block text-[15px] font-extrabold">{tr("خالد العربي", "Khaled Elaraby")}</span>
          <span className="block text-[13px] text-mauve">{tr("مؤسس فيكونا، وبيراجع كل حزام بنفسه قبل ما يتشحن", "Founder of Vicuna — checks every belt himself before it ships")}</span>
        </figcaption>
      </figure>

      <div className="mt-8 grid items-center gap-6 overflow-hidden rounded-[30px] bg-cream p-3 sm:p-4 lg:grid-cols-[1.4fr_1fr]" data-reveal>
        <div className="relative aspect-video overflow-hidden rounded-[22px] bg-plum">
          <video className="absolute inset-0 size-full object-cover" data-lazy-video={videos["laser.mp4"]} poster={poster.large}
            muted loop playsInline preload="none" aria-label={tr("فيديو قص حزام بالليزر", "A belt being laser-cut")} />
        </div>
        <div className="px-3 pb-5 lg:px-4 lg:pb-0">
          <span className="eyebrow text-berry">{tr("مصنوع بإيدينا", "Made by hand")}</span>
          <h3 className="mt-2 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-tight">{tr("كل حزام بيتقص بالليزر، وبيتخيّط بإيد", "Every belt is laser-cut, then sewn by hand")}</h3>
          <p className="mt-2 leading-8 text-mauve">{tr("القص بالليزر بيخلّي الحواف نضيفة ومظبوطة، وبعدها الخياطة والتشطيب بالإيد، وكل حزام بيتجرب على المانيكان قبل الشحن.", "Laser cutting keeps every edge clean and precise; then it's sewn and finished by hand, and tried on the mannequin before it ships.")}</p>
        </div>
      </div>
    </section>
  );
};

/* ---------- made to measure in natural leather (home) ---------- */
export const Bespoke = () => {
  const tr = useTr();
  const shots = [img("leather-1"), img("leather-3"), img("leather-2")];
  const dp = img("leather-detail-poster");
  const steps = [
    [tr("ابعتيلنا إنك مهتمة", "Tell us you're interested"), tr("رسالة واحدة على واتساب، وإحنا نرتّب معاكي معاد يناسبك.", "One WhatsApp message and we'll arrange a time that suits you.")],
    [tr("بنبعتلك موظفة من عندنا", "We send one of our team to you"), tr("في القاهرة والجيزة: بتاخد مقاساتك، وتوريكي خامات الجلد على الطبيعة، وتتفق معاكي على التفاصيل والسعر.", "In Cairo and Giza: she takes your measurements, shows you the leathers in person, and agrees the details and price with you.")],
    [tr("بنفصّله ونبعتهولك ❤️", "We make it and send it to you ❤️"), tr("بيتفصّل على مقاسك بالظبط، ويوصلك لحد البيت.", "Made exactly to your size and delivered to your door.")],
  ];
  return (
    <section id="bespoke" className="px-3 pt-20 sm:px-5">
      <div className="bespoke mx-auto max-w-[1400px] overflow-hidden rounded-[36px]">
        <div className="grid gap-8 p-5 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div data-reveal>
            <span className="eyebrow text-[#F6D7A7]">{tr("خدمة التفصيل", "Made to measure")}</span>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-tight text-white">{tr("حزام جلد طبيعي،", "A natural leather belt,")} <span className="text-[#F6D7A7]">{tr("متفصّل على مقاسك بالظبط", "made exactly to your size")}</span></h2>
            <p className="mt-3 max-w-lg leading-8 text-white/85">{tr("لو عايزة حاجة مختلفة ليكي إنتي بس: اختاري من خامات الجلد الطبيعي عندنا، وإحنا نفصّلك الحزام بالمقاس والعرض والشكل اللي تحبيه. حتة واحدة معمولة عشانك.", "Want something that's yours alone? Pick from our natural leathers and we'll make your belt to the size, width and shape you love — one piece, made for you.")}</p>
            <ol className="mt-6 space-y-3">
              {steps.map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F6D7A7] text-[14px] font-extrabold text-[#5A2A12] num">{i + 1}</span>
                  <span><b className="block text-[15px] text-white">{t}</b><span className="text-[13.5px] leading-6 text-white/80">{d}</span></span>
                </li>
              ))}
            </ol>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a className="btn btn-berry btn-shine" target="_blank" rel="noopener" href={waLink(tr("السلام عليكم، عايزة أفصّل حزام جلد طبيعي على مقاسي ✂️", "Hello, I'd like a natural leather belt made to my size ✂️"))}>
                <Icon name="wa" className="size-4" /> {tr("اطلبي تفصيلك", "Request yours")}
              </a>
              <span className="text-[12.5px] text-white/70">{tr("📍 متاحة في القاهرة والجيزة بس · السعر بتتفقي عليه مع الموظفة قبل التفصيل", "📍 Cairo and Giza only · you agree the price with our team before we start")}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3" data-reveal>
            <div className="relative row-span-2 overflow-hidden rounded-[22px] bg-[#3a1a0b]">
              <video className="absolute inset-0 size-full object-cover" data-lazy-video={videos["leather-detail.mp4"]} poster={dp.src}
                muted loop playsInline preload="none" aria-label={tr("تفاصيل حزام جلد طبيعي متفصّل على المقاس", "Details of a made-to-measure natural leather belt")} />
              <span className="tag absolute bottom-3 start-3">{tr("من شغلنا", "Our work")} ✂️</span>
            </div>
            {shots.slice(0, 2).map((im, i) => (
              <img key={i} src={im.src} srcSet={im.srcset} sizes="(max-width:1024px) 46vw, 340px" width={im.width} height={im.height} loading="lazy" decoding="async"
                alt={tr("خامات جلد طبيعي بألوان ونقشات مختلفة", "Natural leathers in different colours and textures")}
                className="aspect-[4/5] size-full rounded-[22px] object-cover" />
            ))}
            <img src={shots[2].src} srcSet={shots[2].srcset} sizes="(max-width:1024px) 92vw, 680px" width={shots[2].width} height={shots[2].height} loading="lazy" decoding="async"
              alt={tr("خامات جلد طبيعي متعلقة بألوانها", "Natural leathers hanging in many colours")} className="col-span-2 aspect-[16/7] w-full rounded-[22px] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- on the body: real photos, home only ---------- */
export const OnBody = () => {
  const tr = useTr();
  return (
    <section className="pt-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">{tr("على الطبيعة", "On the body")} <span className="text-berry">♡</span></h2>
        <p className="mt-2 text-mauve">{tr("بنات حقيقيين لابسين أحزمتنا، من غير فلاتر ولا تعديل في الشكل.", "Real women wearing our belts — no filters, no retouching of the look.")}</p>
      </div>
      <div className="onbody no-scrollbar mt-6" data-lenis-prevent data-reveal>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const im = img(`onbody-${n}`);
          return <img key={n} src={im.src} srcSet={im.srcset} sizes="(max-width:640px) 62vw, 300px" width={im.width} height={im.height} loading="lazy" decoding="async"
            alt={tr("بنت لابسة حزام خصر من Vicuna", "A woman wearing a Vicuna waist belt")} />;
        })}
      </div>
    </section>
  );
};

/* ---------- faq ---------- */
export const Faq = () => {
  const lang = useLang();
  const items = faqItems(lang);
  return (
  <section id="faq" className="mx-auto max-w-[1000px] scroll-mt-24 px-4 pt-20 sm:px-6">
    <h2 className="text-center font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">{lang === "en" ? "Questions you ask a lot" : "أسئلة بتتسأل كتير"} 💬</h2>
    <div className="faq mt-8 flex flex-col gap-3">
      {items.map(([q, a]) => (
        <details key={q} data-reveal>
          <summary>{q}</summary>
          <p className="whitespace-pre-line pb-5 leading-8 text-mauve">{a}</p>
        </details>
      ))}
    </div>
  </section>
  );
};

/* ---------- category landing ---------- */
export const StyleHero = ({ s }: { s: Style }) => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const st = sText(s, lang);
  const list = products.filter((p) => p.style === s.id).slice(0, 3);
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-6 overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream px-6 py-10 sm:px-12 lg:grid-cols-[1.2fr_1fr]">
        <Blobs />
        <div className="relative">
          <nav className="crumbs text-[13px] font-semibold text-mauve" aria-label={tr("مسار الصفحة", "Breadcrumb")}>
            <a href={url()} className="hover:text-berry">{tr("الرئيسية", "Home")}</a> {lang === "en" ? "›" : "‹"} <span className="text-plum">{st.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1.15]">{lang === "en" ? <><span className="text-berry">{st.name}</span> belts</> : <>أحزمة <span className="text-berry">{st.name}</span></>}</h1>
          <p className="mt-3 text-[18px] font-bold">{st.headline}</p>
          <p className="mt-2 max-w-xl leading-8 text-mauve">{st.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-white px-5 py-2.5 text-[22px] font-extrabold text-berry shadow-[var(--shadow-card)]"><span className="num">{s.price}</span> <span className="text-[14px]">{tr("جنيه", "EGP")}</span></span>
            <a href="#shop" className="btn btn-berry btn-shine" data-magnetic>{tr("شوفي الألوان", "See the colours")} <Icon name="arrow" className="size-4" /></a>
          </div>
        </div>
        <div className="relative mx-auto h-[280px] w-full max-w-[460px] sm:h-[340px]">
          {list.map((p, i) => (
            <img key={p.id} src={img(p.id).src} srcSet={img(p.id).srcset} sizes="260px" width={img(p.id).width} height={img(p.id).height} decoding="async" alt={tr(`حزام ${pName(p, lang)}`, `${pName(p, lang)} belt`)}
              className={`floaty absolute w-[58%] rounded-[28px] bg-white p-3 shadow-[var(--shadow-lift)] ${["top-0 start-0", "top-[22%] end-0", "bottom-0 start-[18%]"][i]}`}
              style={{ ["--r" as string]: ["-8deg", "7deg", "-2deg"][i], ["--d" as string]: `${-i * 1.8}s` }} />
          ))}
          <Sparkle className="twinkle absolute top-2 end-[20%] size-5 text-berry" />
        </div>
      </div>
    </section>
  );
};
