import { site, url, waLink } from "../data/site";
import { products, priceOf, styleOf, textureName, productUrl, lookFor, type Product } from "../data/products";
import { img } from "../lib/images";
import { Icon } from "./Icons";
import { Bow, Sparkle, Blobs } from "./Art";
import { ProductCard } from "./Sections";

export const ProductPage = ({ p }: { p: Product }) => {
  const style = styleOf(p.style);
  const main = img(p.id), detail = img(`${p.id}-detail`);
  const siblings = products.filter((q) => q.style === p.style);
  const related = siblings.filter((q) => q.id !== p.id).slice(0, 4);
  const look = lookFor(p.id);
  const lookImg = img(look.image);
  const inLook = look.products.map((id) => products.find((q) => q.id === id)!);

  const gallery = [
    { im: main, alt: `حزام ${p.name}`, contain: true },
    { im: detail, alt: `تفاصيل عقدة ${p.name}`, contain: false },
    { im: lookImg, alt: look.title, contain: false },
  ];

  return (
    <>
      {/* product */}
      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <nav className="mb-4 text-[13px] font-semibold text-mauve" aria-label="مسار الصفحة">
            <a href={url()} className="hover:text-berry">الرئيسية</a> ‹ <a href={url(`${style.id}/`)} className="hover:text-berry">{style.name}</a> ‹ <span className="text-plum">{p.name}</span>
          </nav>
          <div className="grid grid-cols-[1fr_76px] gap-3 sm:grid-cols-[1fr_96px]">
            <button className="relative aspect-[3/4] overflow-hidden rounded-[30px] bg-white shadow-[var(--shadow-card)]" data-lightbox="product" data-full={main.large} data-caption={p.name} aria-label="تكبير الصورة" data-zoom-main>
              <span className="absolute inset-[18%] rounded-full bg-petal/70 blur-3xl" />
              <img src={main.src} srcSet={main.srcset} sizes="(max-width:1024px) 80vw, 45vw" width={main.width} height={main.height}
                alt={`حزام ${p.name}`} className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-transform duration-700 ease-soft hover:scale-105" fetchPriority="high" data-img />
              {p.isNew && <span className="badge">جديد ✨</span>}
            </button>
            <div className="flex flex-col gap-3">
              {gallery.slice(1).map((g, i) => (
                <button key={i} className="aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1" data-lightbox="product" data-full={g.im.large} data-caption={g.alt} aria-label={`تكبير: ${g.alt}`}>
                  <img src={g.im.src} alt={g.alt} loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:pt-10">
          <span className="tag">{style.name}</span>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-tight">{p.name}</h1>
          <div className="mt-3 text-[30px] font-extrabold text-berry"><span className="num">{priceOf(p)}</span> <span className="text-[16px]">جنيه</span></div>
          <p className="mt-4 max-w-lg leading-8 text-mauve">{style.intro}</p>

          <div className="mt-6">
            <div className="mb-3 text-[13px] font-semibold text-mauve">اللون: <span className="text-plum">{p.name}</span></div>
            <div className="flex flex-wrap gap-2.5">
              {siblings.map((q) => (
                <a key={q.id} href={url(productUrl(q.id))} className="swatch size-8" style={{ background: q.hex }} aria-current={q.id === p.id ? "true" : undefined} aria-label={q.name} title={q.name} />
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-berry btn-shine flex-1" data-add={p.id} data-magnetic>أضيفي للشنطة 🛍</button>
            <a className="btn btn-white flex-1" href={waLink(`السلام عليكم، عايزة أطلب حزام ${p.name} (${priceOf(p)} جنيه)`)} target="_blank" rel="noopener"><Icon name="wa" className="size-4" /> اطلبي على واتساب</a>
          </div>
          <button className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-mauve hover:text-berry" data-fav={p.id} aria-pressed="false">
            <Icon name="heart" className="size-5" /> أضيفي للمفضلة
          </button>

          <ul className="mt-7 space-y-3 rounded-3xl bg-white p-5 text-[14px] shadow-[var(--shadow-card)]">
            <li className="flex gap-3"><Icon name="check" className="size-5 shrink-0 text-berry" /> {textureName[p.texture]}</li>
            <li className="flex gap-3"><Icon name="ruler" className="size-5 shrink-0 text-berry" /> عرض {site.size.widthCm} سم · طول {site.size.lengthCm} سم · مناسب لكل الأوزان · مقاسات خاصة بالطلب</li>
            <li className="flex gap-3"><Icon name="truck" className="size-5 shrink-0 text-berry" /> توصيل خلال {site.deliveryDays} أيام عمل · مجاني فوق {site.shipping.freeOver} جنيه</li>
            <li className="flex gap-3"><Icon name="cash" className="size-5 shrink-0 text-berry" /> الدفع عند الاستلام أو InstaPay</li>
            <li className="flex gap-3"><Icon name="return" className="size-5 shrink-0 text-berry" /> استرجاع خلال {site.returnDays} يوم بفلوسك كاملة · <a href={url("returns/")} className="underline">التفاصيل</a></li>
          </ul>
        </div>
      </section>

      {/* shop the look */}
      <section className="px-3 pt-16 sm:px-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream px-5 py-10 sm:px-10">
          <Blobs />
          <Bow className="absolute -top-3 end-8 w-28 text-berry/30" w={2} />
          <div className="relative">
            <span className="tag">Shop the Look</span>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] font-bold">{look.title} <Sparkle className="inline size-6 text-berry" /></h2>
            <p className="mt-2 max-w-2xl leading-8 text-mauve">{look.tip}</p>

            <button className="group relative mt-6 block w-full overflow-hidden rounded-[28px] border-[6px] border-white shadow-[var(--shadow-lift)]" data-lightbox="look" data-full={lookImg.large} data-caption={look.title} aria-label="تكبير صورة اللوك">
              <img src={lookImg.src} srcSet={lookImg.srcset} sizes="(max-width:1400px) 95vw, 1300px" width={lookImg.width} height={lookImg.height} loading="lazy"
                alt={look.title} className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105 sm:aspect-[16/9]" data-parallax-img />
              <span className="tag absolute bottom-4 start-4">🔍 اضغطي للتكبير</span>
            </button>

            <div className="mt-6 text-[14px] font-bold">في اللوك ده:</div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {inLook.map((q) => {
                const qi = img(q.id);
                return (
                  <div key={q.id} className="flex flex-col rounded-3xl bg-white p-2.5 shadow-[var(--shadow-card)]">
                    <button className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-blush" data-lightbox="look" data-full={qi.large} data-caption={q.name} aria-label={`تكبير: ${q.name}`}>
                      <img src={qi.src} srcSet={qi.srcset} sizes="25vw" alt={`حزام ${q.name}`} loading="lazy" className="absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-transform duration-500 hover:scale-110" />
                    </button>
                    <a href={url(productUrl(q.id))} className="mt-2.5 px-1 text-[14px] font-bold hover:text-berry">{q.name}</a>
                    <div className="mt-1 flex items-center justify-between px-1">
                      <span className="font-extrabold text-berry"><span className="num">{priceOf(q)}</span> ج</span>
                      <button className="plus" data-add={q.id} aria-label={`أضيفي ${q.name} للشنطة`}>+</button>
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
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">ألوان تانية من {style.name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((q, i) => <ProductCard key={q.id} p={q} index={i} paged={false} />)}
          </div>
        </section>
      )}
    </>
  );
};
