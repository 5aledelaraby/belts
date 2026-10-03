import { site, url, waLink } from "../data/site";
import { colors, products, styles, priceOf, styleOf, type Product, type Style } from "../data/products";
import { img } from "../lib/images";
import { Icon } from "./Icons";

const PAGE_SIZE = 12;

/* ---------- hero (home) ---------- */
export const Hero = () => {
  const h = img("hero");
  return (
    <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-charcoal text-bone" data-hero>
      <div className="hero-media absolute inset-0" data-parallax>
        <img src={h.src} srcSet={h.srcset} sizes="100vw" width={h.width} height={h.height}
          alt="تلات مانيكان لابسين أحزمة خصر: كونياك وأبيض وكشكشة سودا" className="size-full scale-110 object-cover object-[50%_60%]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-charcoal/40" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="eyebrow text-bone/80" data-hero-line>THE EDIT — VOL. 01 · مجموعة 2026</div>
        <h1 className="mt-4 font-ar text-[clamp(3.6rem,12vw,11rem)] leading-[1.05]" data-hero-line>أحزمة الخصر</h1>
        <div className="font-accent text-[clamp(1.6rem,4.2vw,3.6rem)] tracking-[.12em] text-sand" style={{ direction: "ltr", textAlign: "right" }} data-hero-line>Waist Belts</div>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-display text-[clamp(1.25rem,2vw,1.6rem)] italic leading-relaxed text-bone/85" data-hero-line>
            اللمسة الأخيرة اللي بترسم الوسط، وبتخلّي نفس الفستان إطلالة جديدة.
          </p>
          <a href="#shop" className="btn btn-light self-start" data-magnetic data-hero-line>
            اكتشفي المجموعة <Icon name="arrow" className="arrow size-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---------- editorial intro ---------- */
export const EditorialIntro = () => {
  const a = img("mood-lace"), b = img("mood-bow"), c = img("mood-green");
  return (
    <section className="mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:py-36">
      <div className="flex flex-col justify-center" data-reveal>
        <div className="eyebrow text-sienna">الحرفة · The Craft</div>
        <p className="mt-8 font-ar text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.55]">
          كل حزام بيتقص من جلد PU مستورد من أنضف الأنواع، بعرض {site.size.widthCm} سم وطول {site.size.lengthCm} سم.
          بيتلف حوالين الخصر ويتربط بالطريقة اللي تحبيها، فيناسب كل الأوزان من غير توكة ولا خرم.
        </p>
        <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-charcoal/10 pt-8">
          {[
            [`${site.size.widthCm}`, "سم عرض"],
            [`${site.size.lengthCm}`, "سم طول"],
            [`${products.length}`, "موديل"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none num">{n}</dt>
              <dd className="eyebrow mt-3 text-stone">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative grid grid-cols-6 grid-rows-6 gap-4 [aspect-ratio:1/1.05]">
        <figure className="reveal-img col-span-4 row-span-4 overflow-hidden" data-reveal-img>
          <img src={c.src} srcSet={c.srcset} sizes="(max-width:1024px) 60vw, 30vw" width={c.width} height={c.height} loading="lazy" alt="حزام أخضر طرف طويل على مانيكان برونزي" className="size-full object-cover" />
        </figure>
        <figure className="reveal-img col-span-2 col-start-5 row-span-3 row-start-2 overflow-hidden" data-reveal-img>
          <img src={b.src} srcSet={b.srcset} sizes="20vw" width={b.width} height={b.height} loading="lazy" alt="حزام فيونكة وردي على مانيكان" className="size-full object-cover" />
        </figure>
        <figure className="reveal-img col-span-3 col-start-3 row-span-2 row-start-5 overflow-hidden" data-reveal-img>
          <img src={a.src} srcSet={a.srcset} sizes="25vw" width={a.width} height={a.height} loading="lazy" alt="حزام دانتيل أسود على مانيكان" className="size-full object-cover object-[50%_55%]" />
        </figure>
      </div>
    </section>
  );
};

/* ---------- product card ---------- */
const ProductCard = ({ p, index }: { p: Product; index: number }) => {
  const im = img(p.id);
  const siblings = products.filter((q) => q.style === p.style);
  return (
    <article className="card" data-card data-id={p.id} data-style={p.style} data-color={p.color} data-price={priceOf(p)} data-order={index}
      hidden={index >= PAGE_SIZE ? true : undefined}>
      <div className="relative">
        <button className="card-media w-full" data-quick-open={p.id} data-cursor="view" aria-label={`تفاصيل ${p.name}`}>
          <img src={im.src} srcSet={im.srcset} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            width={im.width} height={im.height} alt={`حزام ${p.name}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
        </button>
        {p.isNew && <span className="badge">جديد</span>}
        <button className="heart" data-fav={p.id} aria-pressed="false" aria-label={`أضيفي ${p.name} للمفضلة`}>
          <Icon name="heart" className="size-[18px]" />
        </button>
        <button className="quick-add" data-add={p.id}>+ أضيفي للشنطة</button>
      </div>
      <div className="pt-4">
        <div className="eyebrow text-[10px] text-stone">{styleOf(p.style).name}</div>
        <h3 className="mt-1.5 font-display text-[19px] leading-snug">{p.name}</h3>
        <div className="mt-1 text-[14px]"><span className="num">{priceOf(p)}</span> جنيه</div>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="الألوان المتاحة">
          {siblings.slice(0, 7).map((q) => (
            <button key={q.id} className="swatch" style={{ background: q.hex }} data-quick-open={q.id}
              aria-current={q.id === p.id ? "true" : undefined} aria-label={q.name} title={q.name} />
          ))}
          {siblings.length > 7 && <span className="text-[11px] text-stone">+{siblings.length - 7}</span>}
        </div>
      </div>
    </article>
  );
};

/* ---------- filter bar + grid ---------- */
export const Shop = ({ only, title = "المجموعة" }: { only?: Style; title?: string }) => {
  const list = only ? products.filter((p) => p.style === only.id) : products;
  const usedColors = colors.filter((c) => list.some((p) => p.color === c.id));
  const prices = [...new Set(list.map(priceOf))].sort((a, b) => a - b);
  return (
    <section id="shop" className="scroll-mt-28" data-shop data-view="grid">
      <div className="mx-auto max-w-[1500px] px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div>
            <div className="eyebrow text-sienna">{only ? `Vicuna · ${only.name}` : "The Collection"}</div>
            <h2 className="mt-3 font-ar text-[clamp(2.6rem,6vw,5rem)] leading-none">{title}</h2>
          </div>
          <div className="eyebrow text-stone"><span className="num" data-result-count>{list.length}</span> موديل</div>
        </div>
      </div>

      {/* sticky filter bar */}
      <div className="filter-bar sticky z-30 mt-10 border-y border-charcoal/10 bg-bone/90 backdrop-blur-xl" style={{ top: "calc(var(--bar-h,34px) + var(--header-h,80px))" }}>
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-3 sm:px-8">
          <div className="no-scrollbar -mx-1 hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 md:flex">
            {!only && (
              <>
                <button className="pill" data-filter-style="all" aria-pressed="true">الكل</button>
                {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{s.name}</button>)}
              </>
            )}
            <button className="pill inline-flex items-center gap-2" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> المفضلة</button>
            <span className="mx-2 h-6 w-px bg-charcoal/15" />
            {usedColors.map((c) => (
              <button key={c.id} className="dot shrink-0" style={{ background: c.hex }} data-filter-color={c.id} aria-pressed="false" aria-label={c.name} title={c.name} />
            ))}
          </div>
          <button className="pill inline-flex items-center gap-2 md:hidden" data-sheet-open>
            <Icon name="filter" className="size-4" /> فلترة <span className="num text-sienna" data-active-filters></span>
          </button>
          <div className="ms-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="sort">ترتيب</label>
            <select id="sort" className="rounded-full border border-charcoal/15 bg-transparent py-2 pe-8 ps-4 text-[13px] outline-none" data-sort defaultValue="featured">
              <option value="featured">المميز</option>
              <option value="new">الجديد</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
            </select>
            <div className="hidden items-center rounded-full border border-charcoal/15 p-0.5 sm:flex" role="group" aria-label="طريقة العرض">
              <button className="icon-btn size-8 aria-pressed:bg-charcoal aria-pressed:text-bone" data-view-btn="grid" aria-pressed="true" aria-label="شبكة"><Icon name="grid" className="size-4" /></button>
              <button className="icon-btn size-8 aria-pressed:bg-charcoal aria-pressed:text-bone" data-view-btn="list" aria-pressed="false" aria-label="قايمة"><Icon name="list" className="size-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* template for the mobile filter sheet */}
      <template data-sheet-template>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-charcoal/20" />
        <div className="flex items-center justify-between">
          <h3 className="font-ar text-[26px]">فلترة</h3>
          <button className="icon-btn" data-sheet-close aria-label="إغلاق"><Icon name="close" className="size-6" /></button>
        </div>
        {!only && (
          <>
            <div className="eyebrow mt-6 text-stone">التصميم</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="pill" data-filter-style="all" aria-pressed="true">الكل</button>
              {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{s.name}</button>)}
            </div>
          </>
        )}
        <div className="eyebrow mt-6 text-stone">اللون</div>
        <div className="mt-3 flex flex-wrap gap-3">
          {usedColors.map((c) => (
            <button key={c.id} className="flex items-center gap-2 text-[13px]" data-filter-color={c.id} aria-pressed="false">
              <span className="dot" style={{ background: c.hex }} /> {c.name}
            </button>
          ))}
        </div>
        <div className="eyebrow mt-6 text-stone">السعر</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="pill" data-filter-price="all" aria-pressed="true">كل الأسعار</button>
          {prices.map((p) => <button key={p} className="pill" data-filter-price={p} aria-pressed="false"><span className="num">{p}</span> جنيه</button>)}
        </div>
        <div className="mt-6"><button className="pill inline-flex items-center gap-2" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> المفضلة بس</button></div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button className="btn btn-line" data-filter-reset>مسح الكل</button>
          <button className="btn btn-dark" data-sheet-close>عرض <span className="num" data-result-count>{list.length}</span></button>
        </div>
      </template>

      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8">
        <div className="product-grid grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4" data-grid>
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
        <p className="py-16 text-center text-stone" data-empty hidden>
          مافيش موديلات بالفلتر ده. <button className="underline" data-filter-reset>امسحي الفلتر</button>
        </p>
        <div className="mt-16 text-center" data-more-wrap hidden={list.length <= PAGE_SIZE ? true : undefined}>
          <button className="link-line" data-load-more>عرض المزيد</button>
        </div>
      </div>
    </section>
  );
};

/* ---------- editorial break ---------- */
export const EditorialBreak = () => {
  const m = img("mood-green");
  return (
    <section className="relative mt-16 h-[85svh] min-h-[520px] overflow-hidden bg-charcoal text-bone">
      <img src={m.src} srcSet={m.srcset} sizes="100vw" width={m.width} height={m.height} loading="lazy" alt="" className="absolute inset-0 size-full scale-110 object-cover" data-parallax-img />
      <div className="absolute inset-0 bg-charcoal/35" />
      <figure className="relative mx-auto flex h-full max-w-[1100px] flex-col items-center justify-center px-6 text-center" data-reveal>
        <blockquote className="font-display text-[clamp(2.2rem,6vw,5.2rem)] italic leading-[1.25]">
          «حزام واحد، وكل فستان بيبقى إطلالة جديدة.»
        </blockquote>
        <figcaption className="eyebrow mt-8 text-bone/70">Vicuna · Cairo</figcaption>
      </figure>
    </section>
  );
};

/* ---------- tie steps ---------- */
export const TieSteps = () => (
  <section id="tie" className="mx-auto max-w-[1500px] scroll-mt-28 px-5 py-24 sm:px-8 lg:py-32">
    <div className="eyebrow text-sienna" data-reveal>How to tie</div>
    <h2 className="mt-3 font-ar text-[clamp(2.4rem,5vw,4.2rem)]" data-reveal>طريقة الربط</h2>
    <ol className="mt-14 grid gap-10 md:grid-cols-3">
      {[
        ["حطّي الحزام على الخصر", "الجزء العريض من قدّام، والشريطين من ورا."],
        ["لفّي الشريطين", "عدّيهم حوالين الوسط ورجّعيهم لقدّام فوق الحزام."],
        ["اربطي بطريقتك", "فيونكة في النص أو على جنب، أو عقدة بسيطة وسيبي الأطراف نازلة."],
      ].map(([t, d], i) => (
        <li key={t} className="border-t border-charcoal pt-6" data-reveal>
          <div className="font-display text-[56px] leading-none text-sienna num">0{i + 1}</div>
          <h3 className="mt-4 font-ar text-[26px]">{t}</h3>
          <p className="mt-2 max-w-sm text-charcoal/70">{d}</p>
        </li>
      ))}
    </ol>
  </section>
);

/* ---------- faq ---------- */
export const Faq = () => (
  <section id="faq" className="scroll-mt-28 bg-sand/50">
    <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-32">
      <div data-reveal>
        <div className="eyebrow text-sienna">FAQ</div>
        <h2 className="mt-3 font-ar text-[clamp(2.4rem,5vw,4.2rem)] leading-tight">أسئلة بتتسأل كتير</h2>
      </div>
      <div className="faq divide-y divide-charcoal/15 border-y border-charcoal/15">
        {[
          ["إزاي أطلب؟", "اختاري الموديل واضغطي «أضيفي للشنطة»، وبعدين افتحي الشنطة واكتبي بياناتك واختاري طريقة الدفع. هيتفتح واتساب برسالة فيها الطلب كامل، ابعتيها ونأكد معاكي على طول."],
          ["الدفع إزاي؟", `يا إما الدفع عند الاستلام للمندوب، يا إما تحويل InstaPay على رقم ${site.instapay} وتبعتي صورة التحويل على واتساب.`],
          ["التوصيل بياخد قد إيه وبكام؟", `بنوصّل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل. الشحن العادي ${site.shipping.standard} جنيه، والسريع ${site.shipping.express} جنيه، والشحن العادي مجاني للطلبات من ${site.shipping.freeOver} جنيه.`],
          ["المقاس هيبقى مظبوط؟", `الحزام عرضه ${site.size.widthCm} سم وطوله ${site.size.lengthCm} سم، وبيتلف ويتربط فمناسب لكل الأوزان. ولو محتاجة مقاس خاص اكتبيه في الملاحظات وإحنا نعمله.`],
          ["الخامة إيه؟", "جلد PU مستورد من أنضف الأنواع، ناعم وخفيف ومش بيتقشر بسهولة. وفيه موديلات شمواه ودانتيل وكروكو وثعبان."],
          ["لو الحزام ما عجبنيش؟", `معاكي ${site.returnDays} يوم من الاستلام ترجّعيه وتاخدي فلوسك كاملة، أو تبدّليه. ولو فيه عيب أو وصلك غلط، الشحن كله علينا.`],
        ].map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p className="max-w-[60ch] pb-6 text-charcoal/75">{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- inner circle (WhatsApp) ---------- */
export const InnerCircle = () => (
  <section className="mx-auto max-w-[900px] px-5 py-28 text-center sm:py-36" data-reveal>
    <div className="eyebrow text-sienna">The Inner Circle</div>
    <h2 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.5rem)] italic leading-[1.1]">انضمي لدايرة فيكونا</h2>
    <p className="mx-auto mt-6 max-w-lg text-charcoal/70">أول ما ينزل موديل جديد أو عرض، هتعرفي قبل أي حد. ابعتيلنا على واتساب، أو تابعينا.</p>
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <a className="btn btn-dark" data-magnetic href={waLink("السلام عليكم، عايزة أعرف الموديلات والعروض الجديدة أول بأول")} target="_blank" rel="noopener">
        <Icon name="wa" className="size-4" /> اشتركي على واتساب
      </a>
      {site.social.map((s) => (
        <a key={s.id} className="icon-btn border border-charcoal/15" href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
          <Icon name={s.id} />
        </a>
      ))}
    </div>
  </section>
);

/* ---------- category landing ---------- */
export const StyleHero = ({ s }: { s: Style }) => {
  const first = products.find((p) => p.style === s.id)!;
  const im = img(first.id);
  return (
    <section className="mx-auto grid max-w-[1500px] items-end gap-10 px-5 pb-8 pt-[calc(34px+7rem)] sm:px-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <nav className="eyebrow flex gap-3 text-stone" aria-label="مسار الصفحة">
          <a href={url()} className="hover:text-charcoal">Vicuna</a><span>/</span><span className="text-charcoal">{s.name}</span>
        </nav>
        <h1 className="mt-6 font-ar text-[clamp(3.2rem,10vw,8.5rem)] leading-[1.05]" data-hero-line>{s.name}</h1>
        <p className="mt-6 max-w-xl font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-relaxed text-charcoal/80" data-hero-line>{s.headline}</p>
        <p className="mt-4 max-w-xl text-charcoal/70" data-hero-line>{s.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6" data-hero-line>
          <div className="font-display text-[34px]"><span className="num">{s.price}</span> <span className="text-[16px] text-stone">جنيه للحزام</span></div>
          <a href="#shop" className="btn btn-dark" data-magnetic>شوفي الألوان <Icon name="arrow" className="arrow size-4" /></a>
        </div>
      </div>
      <figure className="reveal-img relative aspect-[4/5] overflow-hidden bg-white" data-reveal-img>
        <img src={im.src} srcSet={im.srcset} sizes="(max-width:1024px) 90vw, 40vw" width={im.width} height={im.height} alt={`حزام ${first.name}`} className="absolute inset-0 size-full object-contain p-[8%]" fetchPriority="high" />
      </figure>
    </section>
  );
};

export const MoreStyles = ({ except }: { except?: string }) => (
  <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8">
    <div className="eyebrow text-sienna" data-reveal>Shop by style</div>
    <h2 className="mt-3 font-ar text-[clamp(2.2rem,4.5vw,3.6rem)]" data-reveal>{except ? "تصميمات تانية" : "تسوّقي حسب التصميم"}</h2>
    <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      {styles.filter((s) => s.id !== except).map((s) => {
        const first = products.find((p) => p.style === s.id)!;
        const im = img(first.id);
        return (
          <a key={s.id} href={url(`${s.id}/`)} className="group" data-reveal data-cursor="view">
            <div className="aspect-[3/4] overflow-hidden bg-white">
              <img src={im.src} width={im.width} height={im.height} loading="lazy" alt="" className="size-full object-contain p-[10%] transition-transform duration-[1.2s] ease-luxe group-hover:scale-105" />
            </div>
            <div className="mt-4 font-display text-[21px]">{s.name}</div>
            <div className="text-[13px] text-stone"><span className="num">{s.price}</span> جنيه</div>
          </a>
        );
      })}
    </div>
  </section>
);

export const Perks = () => (
  <section className="border-y border-charcoal/10">
    <div className="mx-auto grid max-w-[1500px] grid-cols-2 lg:grid-cols-4">
      {[
        ["truck", `توصيل خلال ${site.deliveryDays} أيام عمل`, "لكل محافظات مصر"],
        ["return", `استرجاع خلال ${site.returnDays} يوم`, "فلوسك ترجعلك كاملة"],
        ["cash", "الدفع عند الاستلام", "أو InstaPay"],
        ["ruffle", "مقاسات خاصة", "حسب الطلب"],
      ].map(([icon, t, d], i) => (
        <div key={t} className={`flex items-start gap-4 px-5 py-8 sm:px-8 ${i % 2 ? "border-s border-charcoal/10" : ""} ${i > 1 ? "border-t border-charcoal/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-s" : ""}`}>
          <Icon name={icon === "ruffle" ? "ruler" : icon} className="mt-0.5 size-6 shrink-0 text-sienna" />
          <div><div className="text-[14px] font-medium">{t}</div><div className="text-[13px] text-stone">{d}</div></div>
        </div>
      ))}
    </div>
  </section>
);
