import { site, url, waLink } from "../data/site";
import { colors, products, styles, looks, priceOf, styleOf, productUrl, lookFor, type Product, type Style } from "../data/products";
import { img } from "../lib/images";
import { Icon } from "./Icons";
import { Bow, Ribbon, Sparkle, Blobs, Heart } from "./Art";

const PAGE_SIZE = 12;
const first = (styleId: string) => products.find((p) => p.style === styleId)!;

/* ---------- hero (home) ---------- */
export const Hero = () => {
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
          <span className="tag">✨ توصيل لكل مصر خلال {site.deliveryDays} أيام</span>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold leading-[1.15]">
            حزام واحد<br />يغيّر <span className="relative inline-block text-berry">اللوك كله
              <Ribbon className="absolute -bottom-3 start-0 h-4 w-full text-berry/50" w={3} />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-8 text-mauve">
            أحزمة خصر بالربط من جلد PU مستورد. من <b className="text-plum">120 جنيه</b>، والدفع عند الاستلام، واسترجاع خلال {site.returnDays} يوم.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#shop" className="btn btn-berry btn-shine" data-magnetic>تسوّقي دلوقتي <Icon name="arrow" className="size-4" /></a>
            <a href="#styles" className="btn btn-white">التصميمات</a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-[13px] font-semibold text-mauve">
            <div className="flex -space-x-3 space-x-reverse">
              {["lace-black", "croc-pink", "sash-green", "ruffle-red"].map((id) => (
                <span key={id} className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-white bg-white">
                  <img src={img(id).src} alt="" className="size-full object-contain p-1 mix-blend-multiply" />
                </span>
              ))}
            </div>
            <span><b className="text-plum">{products.length}</b> موديل · 6 تصميمات</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-[88%] max-w-[520px] pb-10 lg:w-full lg:py-12 lg:pe-10">
          <figure className="arch relative aspect-[4/5] overflow-hidden border-[6px] border-white bg-white shadow-[var(--shadow-lift)]" data-tilt>
            <img data-parallax src={h.src} srcSet={h.srcset} sizes="(max-width:1024px) 85vw, 520px" width={h.width} height={h.height}
              alt="تلات مانيكان لابسين أحزمة خصر: كونياك وأبيض وكشكشة سودا" className="size-full scale-[1.18] object-cover object-[50%_60%]" fetchPriority="high" />
          </figure>
          {floaters.map((f) => (
            <img key={f.id} src={img(f.id).src} alt="" aria-hidden="true"
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
export const Stories = ({ current }: { current?: string }) => (
  <section id="styles" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-10 sm:px-6">
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:justify-center sm:gap-5">
      <a href={url("#shop")} className="story">
        <span className="story-ring"><span><Heart className="size-8 text-berry" /></span></span>
        الكل
      </a>
      {styles.map((s) => (
        <a key={s.id} href={url(`${s.id}/`)} className="story" aria-current={current === s.id ? "page" : undefined}>
          <span className="story-ring"><span><img src={img(first(s.id).id).src} alt="" loading="lazy" /></span></span>
          {s.name}
        </a>
      ))}
    </div>
  </section>
);

/* ---------- perks ---------- */
export const Perks = () => (
  <section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ["truck", `توصيل خلال ${site.deliveryDays} أيام`, "لكل محافظات مصر"],
        ["cash", "الدفع عند الاستلام", "أو InstaPay"],
        ["return", `استرجاع ${site.returnDays} يوم`, "فلوسك ترجعلك كاملة"],
        ["ruler", "مقاسات خاصة", `${site.size.widthCm}×${site.size.lengthCm} سم أو بالطلب`],
      ].map(([icon, t, d]) => (
        <div key={t} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-petal text-berry"><Icon name={icon} className="size-6" /></span>
          <div className="min-w-0"><div className="text-[14px] font-bold">{t}</div><div className="text-[12px] text-mauve">{d}</div></div>
        </div>
      ))}
    </div>
  </section>
);

/* ---------- product card ---------- */
export const ProductCard = ({ p, index, paged = true }: { p: Product; index: number; paged?: boolean }) => {
  const im = img(p.id);
  const dt = img(`${p.id}-detail`);
  const siblings = products.filter((q) => q.style === p.style);
  const href = url(productUrl(p.id));
  return (
    <article className="card" data-card data-id={p.id} data-style={p.style} data-color={p.color} data-price={priceOf(p)} data-order={index}
      hidden={paged && index >= PAGE_SIZE ? true : undefined}>
      <div className="card-media">
        <a href={href} className="absolute inset-0" aria-label={p.name}>
          <img className="img-main" src={im.src} srcSet={im.srcset} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            width={im.width} height={im.height} alt={`حزام ${p.name}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" data-img />
          <img className="img-alt" src={dt.src} srcSet={dt.srcset} sizes="(max-width:640px) 50vw, 25vw"
            width={dt.width} height={dt.height} alt={`تفاصيل عقدة ${p.name}`} loading="lazy" decoding="async" />
        </a>
        <button className="quick-add" data-add={p.id}>+ Quick Add</button>
      </div>
      {p.isNew && <span className="badge">جديد ✨</span>}
      <button className="heart" data-fav={p.id} aria-pressed="false" aria-label={`أضيفي ${p.name} للمفضلة`}>
        <Icon name="heart" className="size-[18px]" />
      </button>
      <div className="px-1.5 pt-3">
        <div className="text-[12px] font-semibold text-mauve">{styleOf(p.style).name}</div>
        <h3 className="mt-0.5 text-[15px] font-bold leading-snug sm:text-[16px]"><a href={href} className="hover:text-berry">{p.name}</a></h3>
        <div className="mt-1.5 text-[16px] font-extrabold text-berry"><span className="num">{priceOf(p)}</span> <span className="text-[12px]">جنيه</span></div>
        <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="الألوان المتاحة">
          {siblings.slice(0, 6).map((q) => (
            <a key={q.id} className="swatch" style={{ background: q.hex }} href={url(productUrl(q.id))}
              aria-current={q.id === p.id ? "true" : undefined} aria-label={q.name} title={q.name} />
          ))}
          {siblings.length > 6 && <span className="text-[11px] font-semibold text-mauve">+{siblings.length - 6}</span>}
        </div>
      </div>
    </article>
  );
};

/* ---------- editorial block that sits inside the product grid ---------- */
export const EditorialInGrid = () => {
  const look = looks[1];
  const im = img(look.image);
  return (
    <aside className="editorial col-span-full" data-editorial>
      <div className="grid items-center gap-6 overflow-hidden rounded-[30px] bg-white p-3 shadow-[var(--shadow-card)] md:grid-cols-[1.1fr_1fr] md:p-4">
        <button className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:aspect-[5/4]" data-lightbox="editorial" data-full={im.large} aria-label="تكبير الصورة">
          <img src={im.src} srcSet={im.srcset} sizes="(max-width:768px) 92vw, 50vw" width={im.width} height={im.height} loading="lazy"
            alt="مانيكان لابس حزام أخضر بطرف طويل" className="size-full object-cover transition-transform duration-[1.2s] ease-soft hover:scale-105" />
          <span className="tag absolute bottom-4 start-4">Editorial · نصيحة تنسيق</span>
        </button>
        <div className="px-3 pb-5 md:px-6">
          <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">{look.title}</h3>
          <p className="mt-3 max-w-md leading-8 text-mauve">{look.tip}</p>
          <ul className="mt-5 space-y-2 text-[14px]">
            <li>🤍 فستان أو بلوزة بلون سادة فاتح أو غامق</li>
            <li>🎀 الحزام على أضيق نقطة في الوسط</li>
            <li>👠 شنطة أو جزمة بلون قريب من الحزام بتقفل اللوك</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {look.products.map((id) => (
              <a key={id} href={url(productUrl(id))} className="btn btn-berry btn-shine">تسوّقي اللوك</a>
            ))}
            <a href={url("sash/")} className="btn btn-white">كل ألوان الطرف الطويل</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* ---------- filter bar + grid ---------- */
export const Shop = ({ only, title = "كل الموديلات" }: { only?: Style; title?: string }) => {
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
          <span className="tag"><span className="num" data-result-count>{list.length}</span> موديل</span>
        </div>
      </div>

      <div className="filter-bar sticky top-[70px] z-30 mt-5 bg-blush/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="no-scrollbar -my-2 hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2 md:flex">
            {!only && (
              <>
                <button className="pill" data-filter-style="all" aria-pressed="true">الكل</button>
                {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{s.name}</button>)}
              </>
            )}
            <button className="pill inline-flex items-center gap-1.5" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> المفضلة</button>
            <span className="mx-1 h-6 w-px shrink-0 bg-plum/15" />
            {usedColors.map((c) => (
              <button key={c.id} className="dot" style={{ background: c.hex }} data-filter-color={c.id} aria-pressed="false" aria-label={c.name} title={c.name} />
            ))}
          </div>
          <button className="pill inline-flex items-center gap-2 md:hidden" data-sheet-open>
            <Icon name="filter" className="size-4" /> فلترة <span className="num text-berry" data-active-filters></span>
          </button>
          <div className="ms-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="sort">ترتيب</label>
            <select id="sort" className="rounded-full bg-white py-2 pe-8 ps-4 text-[13px] font-semibold shadow-[0_2px_0_rgb(181_71_106/.1)] outline-none" data-sort defaultValue="featured">
              <option value="featured">المميز</option>
              <option value="new">الجديد</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
            </select>
            <div className="hidden items-center rounded-full bg-white p-1 sm:flex" role="group" aria-label="طريقة العرض">
              <button className="icon-btn size-8 aria-pressed:bg-plum aria-pressed:text-white" data-view-btn="grid" aria-pressed="true" aria-label="شبكة"><Icon name="grid" className="size-4" /></button>
              <button className="icon-btn size-8 aria-pressed:bg-plum aria-pressed:text-white" data-view-btn="list" aria-pressed="false" aria-label="قايمة"><Icon name="list" className="size-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <template data-sheet-template>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-rose" />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[26px] font-bold">فلترة</h3>
          <button className="icon-btn" data-sheet-close aria-label="إغلاق"><Icon name="close" className="size-6" /></button>
        </div>
        {!only && (
          <>
            <div className="mt-5 text-[13px] font-bold text-mauve">التصميم</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="pill" data-filter-style="all" aria-pressed="true">الكل</button>
              {styles.map((s) => <button key={s.id} className="pill" data-filter-style={s.id} aria-pressed="false">{s.name}</button>)}
            </div>
          </>
        )}
        <div className="mt-5 text-[13px] font-bold text-mauve">اللون</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {usedColors.map((c) => (
            <button key={c.id} className="pill flex items-center gap-2" data-filter-color={c.id} aria-pressed="false">
              <span className="size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(58_31_38/.15)]" style={{ background: c.hex }} /> {c.name}
            </button>
          ))}
        </div>
        <div className="mt-5 text-[13px] font-bold text-mauve">السعر</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="pill" data-filter-price="all" aria-pressed="true">كل الأسعار</button>
          {prices.map((p) => <button key={p} className="pill" data-filter-price={p} aria-pressed="false"><span className="num">{p}</span> جنيه</button>)}
        </div>
        <div className="mt-5"><button className="pill inline-flex items-center gap-2" data-filter-fav aria-pressed="false"><Icon name="heart" className="size-4" /> المفضلة بس</button></div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button className="btn btn-white" data-filter-reset>مسح الكل</button>
          <button className="btn btn-plum" data-sheet-close>عرض <span className="num" data-result-count>{list.length}</span></button>
        </div>
      </template>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="product-grid grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-grid>
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          {!only && <EditorialInGrid />}
        </div>
        <div className="py-16 text-center" data-empty hidden>
          <Bow className="mx-auto w-24 text-rose" />
          <p className="mt-4 font-bold">مافيش موديلات بالفلتر ده</p>
          <button className="mt-3 font-semibold text-berry underline" data-filter-reset>امسحي الفلتر</button>
        </div>
        <div className="mt-10 text-center" data-more-wrap hidden={list.length <= PAGE_SIZE ? true : undefined}>
          <button className="btn btn-white" data-load-more>عرض موديلات أكتر ↓</button>
        </div>
      </div>
    </section>
  );
};

/* ---------- lookbook band ---------- */
export const Lookbook = () => {
  const a = img("mood-green"), b = img("mood-bow"), c = img("mood-lace");
  return (
    <section className="px-3 pt-14 sm:px-5">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 overflow-hidden rounded-[36px] bg-plum px-6 py-14 text-white sm:px-12 lg:grid-cols-[1fr_1.3fr]">
        <Bow className="pointer-events-none absolute -top-6 start-[40%] w-56 text-white/10" w={1.2} />
        <div className="relative">
          <span className="tag bg-white/10 text-rose">Lookbook</span>
          <blockquote className="mt-5 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold leading-[1.3]">
            «حزام واحد، وكل فستان بيبقى <span className="text-rose">إطلالة جديدة</span>.»
          </blockquote>
          <p className="mt-5 max-w-sm text-white/70">لفّيه فيونكة، أو عقدة بطرف طويل، أو على جنب. نفس الحزام بيدّيكي كذا شكل.</p>
          <a href="#tie" className="btn btn-berry mt-8">اتعلمي تربطيه</a>
        </div>
        <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-5">
          {[[b, "mt-10", "-4deg"], [a, "", "0deg"], [c, "mt-16", "5deg"]].map(([im, cls, r], i) => {
            const m = im as ReturnType<typeof img>;
            return (
              <figure key={i} className={`arch overflow-hidden border-4 border-white/90 bg-white/10 transition-transform duration-500 ease-soft hover:-translate-y-2 hover:rotate-0 ${cls}`} style={{ transform: `rotate(${r})` }}>
                <img src={m.src} srcSet={m.srcset} sizes="30vw" width={m.width} height={m.height} loading="lazy" alt="حزام على مانيكان برونزي" className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-soft hover:scale-110" />
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
export const TieSteps = () => (
  <section id="tie" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-20 sm:px-6">
    <div className="flex items-center gap-3">
      <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">طريقة الربط</h2>
      <Bow className="w-16 text-berry" w={2} />
    </div>
    <ol className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        ["حطّي الحزام على الخصر", "الجزء العريض من قدّام، والشريطين من ورا."],
        ["لفّي الشريطين", "عدّيهم حوالين الوسط ورجّعيهم لقدّام فوق الحزام."],
        ["اربطي بطريقتك", "فيونكة في النص أو على جنب، أو عقدة بسيطة وسيبي الأطراف نازلة."],
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

/* ---------- faq ---------- */
export const Faq = () => (
  <section id="faq" className="mx-auto max-w-[1000px] scroll-mt-24 px-4 pt-20 sm:px-6">
    <h2 className="text-center font-display text-[clamp(2rem,5vw,3.4rem)] font-bold">أسئلة بتتسأل كتير 💬</h2>
    <div className="faq mt-8 flex flex-col gap-3">
      {[
        ["إزاي أطلب؟", "اختاري الموديل واضغطي «+» أو «أضيفي للشنطة»، وبعدين افتحي الشنطة واكتبي بياناتك واختاري طريقة الدفع. هيتفتح واتساب برسالة فيها الطلب كامل، ابعتيها ونأكد معاكي على طول."],
        ["الدفع إزاي؟", `يا إما الدفع عند الاستلام للمندوب، يا إما تحويل InstaPay على رقم ${site.instapay} وتبعتي صورة التحويل على واتساب.`],
        ["التوصيل بياخد قد إيه وبكام؟", `بنوصّل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل. الشحن العادي ${site.shipping.standard} جنيه، والسريع ${site.shipping.express} جنيه، والشحن العادي مجاني للطلبات من ${site.shipping.freeOver} جنيه.`],
        ["المقاس هيبقى مظبوط؟", `الحزام عرضه ${site.size.widthCm} سم وطوله ${site.size.lengthCm} سم، وبيتلف ويتربط فمناسب لكل الأوزان. ولو محتاجة مقاس خاص اكتبيه في الملاحظات وإحنا نعمله.`],
        ["الخامة إيه؟", "جلد PU مستورد من أنضف الأنواع، ناعم وخفيف. وفيه موديلات شمواه ودانتيل وكروكو وثعبان."],
        ["لو الحزام ما عجبنيش؟", `معاكي ${site.returnDays} يوم من الاستلام ترجّعيه وتاخدي فلوسك كاملة، أو تبدّليه. ولو فيه عيب أو وصلك غلط، الشحن كله علينا.`],
      ].map(([q, a], i) => (
        <details key={q} open={i === 0}>
          <summary>{q}</summary>
          <p className="pb-5 leading-8 text-mauve">{a}</p>
        </details>
      ))}
    </div>
  </section>
);

/* ---------- inner circle (WhatsApp) ---------- */
export const InnerCircle = () => (
  <section className="px-3 pt-20 sm:px-5">
    <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[36px] bg-gradient-to-br from-petal via-peach to-cream px-6 py-14 text-center sm:py-20">
      <Blobs />
      <Bow className="absolute -top-2 start-6 w-24 text-berry/40 sm:w-32" w={2} />
      <Bow className="absolute -bottom-4 end-6 w-28 rotate-12 text-berry/30 sm:w-36" w={2} />
      <div className="relative">
        <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-bold leading-tight">انضمي لدايرة <span className="text-berry">فيكونا</span> 💌</h2>
        <p className="mx-auto mt-4 max-w-md text-mauve">أول ما ينزل موديل جديد أو عرض، هتعرفي قبل أي حد.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a className="btn btn-berry btn-shine" data-magnetic href={waLink("السلام عليكم، عايزة أعرف الموديلات والعروض الجديدة أول بأول")} target="_blank" rel="noopener">
            <Icon name="wa" className="size-4" /> اشتركي على واتساب
          </a>
          {site.social.map((s) => (
            <a key={s.id} className="icon-btn size-12 bg-white shadow-[var(--shadow-card)]" href={s.href} target="_blank" rel="noopener" aria-label={s.label}><Icon name={s.id} /></a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- category landing ---------- */
export const StyleHero = ({ s }: { s: Style }) => {
  const list = products.filter((p) => p.style === s.id).slice(0, 3);
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-6 overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream px-6 py-10 sm:px-12 lg:grid-cols-[1.2fr_1fr]">
        <Blobs />
        <div className="relative">
          <nav className="text-[13px] font-semibold text-mauve" aria-label="مسار الصفحة">
            <a href={url()} className="hover:text-berry">الرئيسية</a> ‹ <span className="text-plum">{s.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1.15]">أحزمة <span className="text-berry">{s.name}</span></h1>
          <p className="mt-3 text-[18px] font-bold">{s.headline}</p>
          <p className="mt-2 max-w-xl leading-8 text-mauve">{s.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-white px-5 py-2.5 text-[22px] font-extrabold text-berry shadow-[var(--shadow-card)]"><span className="num">{s.price}</span> <span className="text-[14px]">جنيه</span></span>
            <a href="#shop" className="btn btn-berry btn-shine" data-magnetic>شوفي الألوان <Icon name="arrow" className="size-4" /></a>
          </div>
        </div>
        <div className="relative mx-auto h-[280px] w-full max-w-[460px] sm:h-[340px]">
          {list.map((p, i) => (
            <img key={p.id} src={img(p.id).src} srcSet={img(p.id).srcset} sizes="260px" alt={`حزام ${p.name}`}
              className={`floaty absolute w-[58%] rounded-[28px] bg-white p-3 shadow-[var(--shadow-lift)] ${["top-0 start-0", "top-[22%] end-0", "bottom-0 start-[18%]"][i]}`}
              style={{ ["--r" as string]: ["-8deg", "7deg", "-2deg"][i], ["--d" as string]: `${-i * 1.8}s` }} />
          ))}
          <Sparkle className="twinkle absolute top-2 end-[20%] size-5 text-berry" />
        </div>
      </div>
    </section>
  );
};
