import { Fragment } from "react";
import { site, waLink } from "../data/site";
import { colors, products, styles, looks, priceOf, productUrl, pName, sName, sText, cName, lookText, type Product, type Style } from "../data/products";
import { useLang, useTr, useHref } from "../i18n";
import { productSeo } from "../data/seo-copy";
import { faqItems } from "../data/faq";
import { img } from "../lib/images";
import { Icon } from "./Icons";
import { Bow, Ribbon, Sparkle, Blobs, Heart } from "./Art";

const PAGE_SIZE = 12;
const first = (styleId: string) => products.find((p) => p.style === styleId)!;

/* ---------- hero (home) ---------- */
export const Hero = () => {
  const tr = useTr();
  const h = img("hero");
  const floaters = [
    { id: "lace-red", cls: "top-[4%] -start-[6%] w-[34%]", r: "-12deg", d: "0s" },
    { id: "bow-mustard", cls: "bottom-[2%] -start-[10%] w-[38%]", r: "8deg", d: "-2s" },
    { id: "classic-sky-blue", cls: "-top-[2%] end-[2%] w-[30%]", r: "10deg", d: "-4s" },
  ];
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative mx-auto grid max-w-[1400px] items-center overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream lg:grid-cols-[1.05fr_1fr]">
        <Blobs />
        <Sparkle className="twinkle absolute top-10 start-[46%] size-5 text-berry" />
        <Sparkle className="twinkle absolute bottom-16 start-[8%] size-4 text-white [--d:-1.2s]" />
        <Sparkle className="twinkle absolute top-1/2 start-[52%] size-3 text-berry/60 [--d:-2s]" />

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16">
          <span className="tag">✨ {tr(`توصيل لكل مصر خلال ${site.deliveryDays} أيام`, `Delivery across Egypt in ${site.deliveryDays} days`)}</span>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold leading-[1.15]">
            {tr("حزام واحد", "One belt")}<br />{tr("يغيّر", "changes")} <span className="relative inline-block text-berry">{tr("اللوك كله", "the whole look")}
              <Ribbon className="absolute -bottom-3 start-0 h-4 w-full text-berry/50" w={3} />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-8 text-mauve">
            {tr("أحزمة خصر بالربط من جلد PU مستورد. من", "Tie waist belts in imported PU leather. From")} <b className="text-plum">{tr("120 جنيه", "120 EGP")}</b>{tr(`، والدفع عند الاستلام، واسترجاع خلال ${site.returnDays} يوم.`, `, cash on delivery, and ${site.returnDays}-day returns.`)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#shop" className="btn btn-berry btn-shine" data-magnetic>{tr("تسوّقي دلوقتي", "Shop now")} <Icon name="arrow" className="size-4" /></a>
            <a href="#styles" className="btn btn-white">{tr("التصميمات", "Styles")}</a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-[13px] font-semibold text-mauve">
            <div className="flex -space-x-3 space-x-reverse">
              {["lace-black", "croc-pink", "sash-green", "ruffle-red"].map((id) => (
                <span key={id} className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-white bg-white">
                  <img src={img(id).src} width={img(id).width} height={img(id).height} alt="" decoding="async" fetchPriority="low" className="size-full object-contain p-1 mix-blend-multiply" />
                </span>
              ))}
            </div>
            <span><b className="text-plum">{products.length}</b> {tr("موديل · 6 تصميمات", "belts · 6 styles")}</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-[88%] max-w-[520px] pb-10 lg:w-full lg:py-12 lg:pe-10">
          <figure className="arch relative aspect-[4/5] overflow-hidden border-[6px] border-white bg-white shadow-[var(--shadow-lift)]" data-tilt>
            <img data-parallax src={h.src} srcSet={h.srcset} sizes="(max-width:1024px) 85vw, 520px" width={h.width} height={h.height}
              alt={tr("تلات مانيكان لابسين أحزمة خصر: كونياك وأبيض وكشكشة سودا", "Three mannequins wearing waist belts: cognac, white and a black ruffle")} className="size-full scale-[1.18] object-cover object-[50%_60%]" fetchPriority="high" />
          </figure>
          {floaters.map((f) => (
            <img key={f.id} src={img(f.id).src} width={img(f.id).width} height={img(f.id).height} alt="" aria-hidden="true" decoding="async" fetchPriority="low"
              className={`floaty pointer-events-none absolute rounded-[28px] bg-white p-2 shadow-[var(--shadow-lift)] ${f.cls}`}
              style={{ ["--r" as string]: f.r, ["--d" as string]: f.d }} />
          ))}
          <Bow className="absolute -bottom-2 end-[6%] w-28 text-berry" w={2} />
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
        ["truck", tr(`توصيل خلال ${site.deliveryDays} أيام`, `Delivery in ${site.deliveryDays} days`), tr("لكل محافظات مصر", "To every governorate")],
        ["cash", tr("الدفع عند الاستلام", "Cash on delivery"), tr("أو InstaPay", "or InstaPay")],
        ["return", tr(`استرجاع ${site.returnDays} يوم`, `${site.returnDays}-day returns`), tr("فلوسك ترجعلك كاملة", "Full refund")],
        ["ruler", tr("مقاسات خاصة", "Custom sizes"), tr(`${site.size.widthCm}×${site.size.lengthCm} سم أو بالطلب`, `${site.size.widthCm}×${site.size.lengthCm} cm or made to order`)],
      ].map(([icon, t, d]) => (
        <div key={t} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-petal text-berry"><Icon name={icon} className="size-6" /></span>
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
      {p.isNew && <span className="badge">{tr("جديد ✨", "New ✨")}</span>}
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

/* ---------- editorial block that sits inside the product grid ---------- */
export const EditorialInGrid = () => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const look = looks[1];
  const lt = lookText(look, lang);
  const im = img(look.image);
  return (
    <aside className="editorial col-span-full" data-editorial>
      <div className="grid items-center gap-6 overflow-hidden rounded-[30px] bg-white p-3 shadow-[var(--shadow-card)] md:grid-cols-[1.1fr_1fr] md:p-4">
        <button className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:aspect-[5/4]" data-lightbox="editorial" data-full={im.large} data-caption={lt.title} aria-label={tr("تكبير الصورة", "Enlarge image")}>
          <img src={im.src} srcSet={im.srcset} sizes="(max-width:768px) 92vw, 50vw" width={im.width} height={im.height} loading="lazy"
            alt={tr("مانيكان لابس حزام أخضر بطرف طويل", "Mannequin wearing a green long-sash belt")} className="size-full object-cover transition-transform duration-[1.2s] ease-soft hover:scale-105" />
          <span className="tag absolute bottom-4 start-4">Editorial · {tr("نصيحة تنسيق", "Styling tip")}</span>
        </button>
        <div className="px-3 pb-5 md:px-6">
          <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">{lt.title}</h3>
          <p className="mt-3 max-w-md leading-8 text-mauve">{lt.tip}</p>
          <ul className="mt-5 space-y-2 text-[14px]">
            <li>🤍 {tr("فستان أو بلوزة بلون سادة فاتح أو غامق", "A plain dress or blouse, light or dark")}</li>
            <li>🎀 {tr("الحزام على أضيق نقطة في الوسط", "Wear the belt at the narrowest point of your waist")}</li>
            <li>👠 {tr("شنطة أو جزمة بلون قريب من الحزام بتقفل اللوك", "A bag or shoes close to the belt colour finishes the look")}</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {look.products.map((id) => (
              <a key={id} href={url(productUrl(id))} className="btn btn-berry btn-shine">{tr("تسوّقي اللوك", "Shop the look")}</a>
            ))}
            <a href={url("sash/")} className="btn btn-white">{tr("كل ألوان الطرف الطويل", "All long-sash colours")}</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* ---------- how to order: 3 steps above the grid ---------- */
const orderSteps = (tr: (a: string, e: string) => string) => [
  { icon: "🛍", title: tr("اختاري الحزام اللي يعجبك", "Pick the belt you love"), hint: tr("اضغطي على الصورة أو الاسم", "Tap its photo or name"), short: tr("اختاري الحزام", "Pick a belt") },
  { icon: "➕", title: tr("أضيفيه للشنطة", "Add it to your bag"), hint: tr("دوسي على «أضيفي للشنطة»", "Tap “Add to bag”"), short: tr("أضيفيه للشنطة", "Add to bag") },
  { icon: "📱", title: tr("ابعتي الطلب", "Send your order"), hint: tr("افتحي الشنطة وابعتي على واتساب", "Open your bag and send it on WhatsApp"), short: tr("ابعتي على واتساب", "Send on WhatsApp") },
];

export const OrderSteps = () => {
  const tr = useTr();
  const steps = orderSteps(tr);
  return (
    <div className="mx-auto mt-5 max-w-[1400px] px-4 sm:px-6" data-steps>
      <div className="rounded-[26px] border border-rose/40 bg-white/70 p-4 sm:p-5">
        <div className="text-[14px] font-bold text-berry">{tr("إزاي تطلبي في 3 خطوات؟", "How to order in 3 steps")}</div>
        <ol className="mt-3 grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-3">
          {steps.map((st, i) => (
            <Fragment key={st.title}>
              <li className="flex items-center gap-3 rounded-2xl bg-blush px-3 py-2 lg:px-3.5 lg:py-3.5">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white text-[18px] shadow-[var(--shadow-card)] lg:size-12 lg:text-[22px]" aria-hidden="true">
                  {st.icon}
                  <span className="absolute -top-1 -end-1 grid size-5 place-items-center rounded-full bg-berry text-[12px] font-extrabold text-white num">{i + 1}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold leading-snug">{st.title}</span>
                  <span className="block text-[13px] leading-snug text-mauve">{st.hint}</span>
                </span>
              </li>
              {i < steps.length - 1 && <span className="steps-arrow hidden text-[22px] font-bold text-rose lg:block" aria-hidden="true">→</span>}
            </Fragment>
          ))}
        </ol>
      </div>
    </div>
  );
};

/** One-line version inside the sticky filter bar; it appears once the full steps have scrolled away. */
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

/* ---------- filter bar + grid ---------- */
export const Shop = ({ only, title }: { only?: Style; title?: string }) => {
  const lang = useLang(); const tr = useTr();
  title ??= tr("كل الموديلات", "All belts");
  const list = only ? products.filter((p) => p.style === only.id) : products;
  const usedColors = colors.filter((c) => list.some((p) => p.color === c.id));
  const prices = [...new Set(list.map(priceOf))].sort((a, b) => a - b);
  return (
    <section id="shop" className="scroll-mt-20" data-shop data-view="grid">
      <div className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">
            {title} <Sparkle className="inline size-6 text-berry" />
          </h2>
          <span className="tag"><span className="num" data-result-count>{list.length}</span> {tr("موديل", "belts")}</span>
        </div>
      </div>
      <OrderSteps />

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
            <select id="sort" className="rounded-full bg-white py-2 pe-8 ps-4 text-[13px] font-semibold shadow-[0_2px_0_rgb(181_71_106/.1)] outline-none" data-sort defaultValue="featured">
              <option value="featured">{tr("المميز", "Featured")}</option>
              <option value="new">{tr("الجديد", "Newest")}</option>
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
              <span className="size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(58_31_38/.15)]" style={{ background: c.hex }} /> {cName(c, lang)}
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
          {!only && <EditorialInGrid />}
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
  const cover: Record<string, string> = { lace: "lace-black", "wide-bow": "bow-white", sash: "sash-green", "thin-tie": "classic-royal-blue", "croc-snake": "croc-cognac", ruffle: "ruffle-red" };
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
            <a key={s.id} href={url(`${s.id}/`)} className="group relative flex flex-col overflow-hidden rounded-[30px] bg-white p-3 shadow-[var(--shadow-card)] transition-transform duration-500 ease-soft hover:-translate-y-1.5">
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

/* ---------- lookbook band ---------- */
export const Lookbook = () => {
  const tr = useTr();
  const a = img("mood-green"), b = img("mood-bow"), c = img("mood-lace");
  return (
    <section className="px-3 pt-14 sm:px-5">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 overflow-hidden rounded-[36px] bg-plum px-6 py-14 text-white sm:px-12 lg:grid-cols-[1fr_1.3fr]">
        <Bow className="pointer-events-none absolute -top-6 start-[40%] w-56 text-white/10" w={1.2} />
        <div className="relative">
          <span className="tag bg-white/10 text-rose">Lookbook</span>
          <blockquote className="mt-5 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold leading-[1.3]">
            {tr("«حزام واحد، وكل فستان بيبقى", "“One belt, and every dress becomes")} <span className="text-rose">{tr("إطلالة جديدة", "a new look")}</span>{tr(".»", ".”")}
          </blockquote>
          <p className="mt-5 max-w-sm text-white/70">{tr("لفّيه فيونكة، أو عقدة بطرف طويل، أو على جنب. نفس الحزام بيدّيكي كذا شكل.", "Tie it in a bow, a knot with a long tail, or to the side. One belt, many looks.")}</p>
          <a href="#tie" className="btn btn-berry mt-8">{tr("اتعلمي تربطيه", "Learn to tie it")}</a>
        </div>
        <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-5">
          {[[b, "mt-10", "-4deg"], [a, "", "0deg"], [c, "mt-16", "5deg"]].map(([im, cls, r], i) => {
            const m = im as ReturnType<typeof img>;
            return (
              <figure key={i} className={`arch overflow-hidden border-4 border-white/90 bg-white/10 transition-transform duration-500 ease-soft hover:-translate-y-2 hover:rotate-0 ${cls}`} style={{ transform: `rotate(${r})` }}>
                <img src={m.src} srcSet={m.srcset} sizes="30vw" width={m.width} height={m.height} loading="lazy" alt={tr("حزام على مانيكان برونزي", "Belt on a bronze mannequin")} className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-soft hover:scale-110" />
              </figure>
            );
          })}
          <Sparkle className="twinkle absolute -top-4 start-1/3 size-6 text-rose" />
          <Sparkle className="twinkle absolute bottom-6 -start-3 size-4 text-white [--d:-1.5s]" />
        </div>
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
        <li key={t} className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1">
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

/* ---------- faq ---------- */
export const Faq = () => {
  const lang = useLang();
  const items = faqItems(lang);
  return (
  <section id="faq" className="mx-auto max-w-[1000px] scroll-mt-24 px-4 pt-20 sm:px-6">
    <h2 className="text-center font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">{lang === "en" ? "Questions you ask a lot" : "أسئلة بتتسأل كتير"} 💬</h2>
    <div className="faq mt-8 flex flex-col gap-3">
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0}>
          <summary>{q}</summary>
          <p className="pb-5 leading-8 text-mauve">{a}</p>
        </details>
      ))}
    </div>
  </section>
  );
};

/* ---------- inner circle (WhatsApp) ---------- */
export const InnerCircle = () => {
  const lang = useLang(); const tr = useTr();
  return (
  <section className="inner-circle px-3 pt-20 sm:px-5">
    <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[36px] bg-gradient-to-br from-petal via-peach to-cream px-6 py-14 text-center sm:py-20">
      <Blobs />
      <Bow className="absolute -top-2 start-6 w-24 text-berry/40 sm:w-32" w={2} />
      <Bow className="absolute -bottom-4 end-6 w-28 rotate-12 text-berry/30 sm:w-36" w={2} />
      <div className="relative">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-bold leading-tight">{tr("انضمي لدايرة", "Join the")} <span className="text-berry">{tr("فيكونا", "Vicuna")}</span>{tr("", " circle")} 💌</h2>
        <p className="mx-auto mt-4 max-w-md text-mauve">{tr("أول ما ينزل موديل جديد أو عرض، هتعرفي قبل أي حد.", "Be the first to hear about new belts and offers.")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a className="btn btn-berry btn-shine" data-magnetic href={waLink(tr("السلام عليكم، عايزة أعرف الموديلات والعروض الجديدة أول بأول", "Hello, I would like to hear about new belts and offers"))} target="_blank" rel="noopener">
            <Icon name="wa" className="size-4" /> {tr("اشتركي على واتساب", "Join on WhatsApp")}
          </a>
          {site.social.map((s) => (
            <a key={s.id} className="icon-btn size-12 bg-white shadow-[var(--shadow-card)]" href={s.href} target="_blank" rel="noopener" aria-label={lang === "en" ? s.labelEn : s.label}><Icon name={s.id} /></a>
          ))}
        </div>
      </div>
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
