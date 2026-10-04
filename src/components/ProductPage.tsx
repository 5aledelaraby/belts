import { site, waLink } from "../data/site";
import { products, priceOf, styleOf, productUrl, lookFor, pName, sText, tName, lookText, type Product } from "../data/products";
import { useLang, useTr, useHref } from "../i18n";
import { productSeo } from "../data/seo-copy";
import { img } from "../lib/images";
import { Icon } from "./Icons";
import { Bow, Sparkle, Blobs } from "./Art";
import { ProductCard } from "./Sections";

export const ProductPage = ({ p }: { p: Product }) => {
  const lang = useLang(); const tr = useTr(); const url = useHref();
  const en = lang === "en";
  const sep = en ? "›" : "‹";
  const name = pName(p, lang);
  const seo = productSeo(p);
  const style = { id: p.style, ...sText(styleOf(p.style), lang) };
  const main = img(p.id), detail = img(`${p.id}-detail`);
  const siblings = products.filter((q) => q.style === p.style);
  const related = siblings.filter((q) => q.id !== p.id).slice(0, 4);
  const look = lookFor(p.id);
  const lookImg = img(look.image);
  const lt = lookText(look, lang);
  const inLook = look.products.map((id) => products.find((q) => q.id === id)!);

  const gallery = [
    { im: main, alt: tr(seo.alt, `${name} women's waist belt by Vicuna`), contain: true },
    { im: detail, alt: tr(seo.altDetail, `${name} belt knot detail`), contain: false },
    { im: lookImg, alt: lt.title, contain: false },
  ];

  return (
    <>
      {/* product */}
      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <nav className="mb-4 text-[13px] font-semibold text-mauve" aria-label={tr("مسار الصفحة", "Breadcrumb")}>
            <a href={url()} className="hover:text-berry">{tr("الرئيسية", "Home")}</a> {sep} <a href={url(`${style.id}/`)} className="hover:text-berry">{style.name}</a> {sep} <span className="text-plum">{name}</span>
          </nav>
          <div className="grid grid-cols-[1fr_76px] gap-3 sm:grid-cols-[1fr_96px]">
            <button className="relative aspect-[3/4] overflow-hidden rounded-[30px] bg-white shadow-[var(--shadow-card)]" data-lightbox="product" data-full={main.large} data-caption={name} aria-label={tr("تكبير الصورة", "Enlarge image")} data-zoom-main>
              <span className="absolute inset-[18%] rounded-full bg-petal/70 blur-3xl" />
              <img src={main.src} srcSet={main.srcset} sizes="(max-width:1024px) 80vw, 45vw" width={main.width} height={main.height}
                alt={tr(seo.alt, `${name} women's waist belt by Vicuna`)} className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-transform duration-700 ease-soft hover:scale-105" fetchPriority="high" data-img />
              {p.isNew && <span className="badge">{tr("جديد ✨", "New ✨")}</span>}
            </button>
            <div className="flex flex-col gap-3">
              {gallery.slice(1).map((g, i) => (
                <button key={i} className="aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1" data-lightbox="product" data-full={g.im.large} data-caption={g.alt} aria-label={`${tr("تكبير", "Enlarge")}: ${g.alt}`}>
                  <img src={g.im.src} alt={g.alt} loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
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
          <button className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-mauve hover:text-berry" data-fav={p.id} aria-pressed="false">
            <Icon name="heart" className="size-5" /> {tr("أضيفي للمفضلة", "Add to favourites")}
          </button>

          <ul className="mt-7 space-y-3 rounded-3xl bg-white p-5 text-[14px] shadow-[var(--shadow-card)]">
            <li className="flex gap-3"><Icon name="check" className="size-5 shrink-0 text-berry" /> {tName(p, lang)}</li>
            <li className="flex gap-3"><Icon name="ruler" className="size-5 shrink-0 text-berry" /> {tr(`عرض ${site.size.widthCm} سم · طول ${site.size.lengthCm} سم · مناسب لكل الأوزان · مقاسات خاصة بالطلب`, `${site.size.widthCm} cm wide · ${site.size.lengthCm} cm long · fits every size · custom sizes on request`)}</li>
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
            <div className="mt-4 max-w-[75ch] space-y-4 leading-8 text-mauve">
              {seo.description.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* shop the look */}
      <section className="px-3 pt-16 sm:px-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream px-5 py-10 sm:px-10">
          <Blobs />
          <Bow className="absolute -top-3 end-8 w-28 text-berry/30" w={2} />
          <div className="relative">
            <span className="tag">Shop the Look</span>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] font-bold">{lt.title} <Sparkle className="inline size-6 text-berry" /></h2>
            <p className="mt-2 max-w-2xl leading-8 text-mauve">{lt.tip}</p>

            <button className="group relative mt-6 block w-full overflow-hidden rounded-[28px] border-[6px] border-white shadow-[var(--shadow-lift)]" data-lightbox="look" data-full={lookImg.large} data-caption={lt.title} aria-label={tr("تكبير صورة اللوك", "Enlarge look photo")}>
              <img src={lookImg.src} srcSet={lookImg.srcset} sizes="(max-width:1400px) 95vw, 1300px" width={lookImg.width} height={lookImg.height} loading="lazy"
                alt={lt.title} className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105 sm:aspect-[16/9]" data-parallax-img />
              <span className="tag absolute bottom-4 start-4">🔍 {tr("اضغطي للتكبير", "Tap to zoom")}</span>
            </button>

            <div className="mt-6 text-[14px] font-bold">{tr("في اللوك ده:", "In this look:")}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {inLook.map((q) => {
                const qi = img(q.id);
                return (
                  <div key={q.id} className="flex flex-col rounded-3xl bg-white p-2.5 shadow-[var(--shadow-card)]">
                    <button className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-blush" data-lightbox="look" data-full={qi.large} data-caption={pName(q, lang)} aria-label={`${tr("تكبير", "Enlarge")}: ${pName(q, lang)}`}>
                      <img src={qi.src} srcSet={qi.srcset} sizes="25vw" alt={tr(`حزام ${pName(q, lang)}`, `${pName(q, lang)} belt`)} loading="lazy" className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-transform duration-500 hover:scale-110" />
                    </button>
                    <a href={url(productUrl(q.id))} className="mt-2.5 px-1 text-[14px] font-bold hover:text-berry">{pName(q, lang)}</a>
                    <div className="mt-1 flex items-center justify-between px-1">
                      <span className="font-extrabold text-berry"><span className="num">{priceOf(q)}</span> {tr("ج", "EGP")}</span>
                      <button className="plus" data-add={q.id} aria-label={tr(`أضيفي ${pName(q, lang)} للشنطة`, `Add ${pName(q, lang)} to bag`)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* more colours */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">{tr(`ألوان تانية من ${style.name}`, `More ${style.name} colours`)}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((q, i) => <ProductCard key={q.id} p={q} index={i} paged={false} />)}
          </div>
        </section>
      )}
    </>
  );
};
