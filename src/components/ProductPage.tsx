import { site, waLink } from "../data/site";
import { products, priceOf, styleOf, productUrl, pName, sText, tName, type Product } from "../data/products";
import { useLang, useTr, useHref } from "../i18n";
import { productSeo } from "../data/seo-copy";
import { img } from "../lib/images";
import { Icon } from "./Icons";
import { ProductCard } from "./Sections";

export const ProductPage = ({ p }: { p: Product }) => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const en = lang === "en";
  const sep = en ? "›" : "‹";
  const name = pName(p, lang);
  const seo = productSeo(p);
  const style = { id: p.style, ...sText(styleOf(p.style), lang) };
  const main = img(p.id);
  const siblings = products.filter((q) => q.style === p.style);
  const related = siblings.filter((q) => q.id !== p.id).slice(0, 4);
  // "See also": same colour family in other designs first, then one belt from each remaining design.
  const seeAlso = (() => {
    const pool = products.filter((q) => q.style !== p.style);
    const sameColour = pool.filter((q) => q.color === p.color);
    const picked: Product[] = [];
    for (const q of sameColour) if (picked.length < 4 && !picked.some((x) => x.style === q.style)) picked.push(q);
    for (const q of sameColour) if (picked.length < 4 && !picked.includes(q)) picked.push(q);
    for (const q of pool) if (picked.length < 4 && !picked.some((x) => x.style === q.style)) picked.push(q);
    return picked;
  })();

  return (
    <>
      {/* product */}
      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <nav className="crumbs mb-4 text-[13px] font-semibold text-mauve" aria-label={tr("مسار الصفحة", "Breadcrumb")}>
            <a href={url()} className="hover:text-berry">{tr("الرئيسية", "Home")}</a> {sep} <a href={url(`${style.id}/`)} className="hover:text-berry">{style.name}</a> {sep} <span className="text-plum">{name}</span>
          </nav>
          <button className="relative block aspect-[3/4] w-full overflow-hidden rounded-[30px] bg-white shadow-[var(--shadow-card)]" data-lightbox="product" data-full={main.large} data-caption={name} aria-label={tr("تكبير الصورة", "Enlarge image")} data-zoom-main>
            <img src={main.src} srcSet={main.srcset} sizes="(max-width:1024px) 92vw, 45vw" width={main.width} height={main.height}
              alt={tr(seo.alt, `${name} women's waist belt by Vicuna`)} className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-transform duration-700 ease-soft hover:scale-105" fetchPriority="high" data-img />
          </button>
        </div>

        <div className="lg:pt-10">
          <span className="tag">{style.name}</span>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-tight">{name}</h1>
          <div className="mt-3 text-[30px] font-extrabold text-berry"><span className="num">{priceOf(p)}</span> <span className="text-[16px]">{tr("جنيه", "EGP")}</span></div>
          <p className="mt-4 max-w-lg leading-8 text-mauve">{style.intro}</p>

          <div className="mt-6">
            <div className="mb-3 text-[13px] font-semibold text-mauve">{tr("اللون:", "Colour:")} <span className="text-plum">{name}</span></div>
            <div className="flex flex-wrap gap-2.5">
              {siblings.map((q) => (
                <a key={q.id} href={url(productUrl(q.id))} className="swatch size-8" style={{ background: q.hex }} aria-current={q.id === p.id ? "true" : undefined} aria-label={pName(q, lang)} title={pName(q, lang)} />
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-berry btn-shine flex-1" data-add={p.id} data-magnetic>{tr("أضيفي للشنطة", "Add to bag")} 🛍</button>
            <a className="btn btn-white flex-1" href={waLink(tr(`السلام عليكم، عايزة أطلب حزام ${name} (${priceOf(p)} جنيه)`, `Hello, I would like to order the ${name} belt (${priceOf(p)} EGP)`))} target="_blank" rel="noopener"><Icon name="wa" className="size-4" /> {tr("اطلبي على واتساب", "Order on WhatsApp")}</a>
          </div>
          <button className="mt-2 inline-flex items-center gap-2 py-2.5 text-[14px] font-semibold text-mauve hover:text-berry" data-fav={p.id} aria-pressed="false">
            <Icon name="heart" className="size-5" /> {tr("أضيفي للمفضلة", "Add to favourites")}
          </button>

          <ul className="mt-7 space-y-3 rounded-3xl bg-white p-5 text-[14px] shadow-[var(--shadow-card)]">
            <li className="flex gap-3"><Icon name="check" className="size-5 shrink-0 text-berry" /> {tName(p, lang)}</li>
            <li className="flex gap-3"><Icon name="ruler" className="size-5 shrink-0 text-berry" /> {tr(`عرض ${site.size.widthCm} سم · طول ${site.size.lengthCm} سم · بيلبس لحد وزن 90 كيلو · مقاسات خاصة بالطلب`, `${site.size.widthCm} cm wide · ${site.size.lengthCm} cm long · fits up to 90 kg · custom sizes on request`)}</li>
            <li className="flex gap-3"><Icon name="truck" className="size-5 shrink-0 text-berry" /> {tr(`توصيل خلال ${site.deliveryDays} أيام عمل · مجاني فوق ${site.shipping.freeOver} جنيه`, `Delivered in ${site.deliveryDays} working days · free over ${site.shipping.freeOver} EGP`)}</li>
            <li className="flex gap-3"><Icon name="cash" className="size-5 shrink-0 text-berry" /> {tr("الدفع عند الاستلام أو InstaPay", "Cash on delivery or InstaPay")}</li>
            <li className="flex gap-3"><Icon name="return" className="size-5 shrink-0 text-berry" /> {tr(`استرجاع خلال ${site.returnDays} يوم بفلوسك كاملة`, `${site.returnDays}-day returns, full refund`)} · <a href={url("returns/")} className="underline">{tr("التفاصيل", "Details")}</a></li>
          </ul>
        </div>
      </section>

      {/* long description (Arabic copy written for search) */}
      {!en && (
        <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
          <div className="rounded-[32px] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
            <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold">عن حزام {name}</h2>
            <div className="desc-links mt-4 max-w-[75ch] space-y-4 leading-8 text-mauve">
              {seo.descriptionHtml.map((para, i) => <p key={i} dangerouslySetInnerHTML={{ __html: para }} />)}
            </div>
          </div>
        </section>
      )}

      {/* more colours */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">{tr(`ألوان تانية من ${style.name}`, `More ${style.name} colours`)}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((q, i) => <ProductCard key={q.id} p={q} index={i} paged={false} />)}
          </div>
        </section>
      )}

      {/* see also: other designs in the same colour */}
      <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">{tr("شوفي كمان", "You may also like")}</h2>
          <a href={url("#shop")} className="inline-block py-2.5 text-[14px] font-bold text-berry underline underline-offset-4">{tr("كل الموديلات", "Shop all belts")}</a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {seeAlso.map((q, i) => <ProductCard key={q.id} p={q} index={i} paged={false} />)}
        </div>
      </section>
    </>
  );
};
