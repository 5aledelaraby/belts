import { site, url, waLink } from "../data/site";
import { products, priceOf } from "../data/products";
import { img } from "../lib/images";
import { posts, relatedPosts, formatDate, type Post } from "../blog";
import { Icon } from "./Icons";
import { Bow, Sparkle, Blobs } from "./Art";

const PAGE_SIZE = 6;

const PostCard = ({ p, index, paged = true }: { p: Post; index: number; paged?: boolean }) => {
  const im = img(p.cover);
  const productCover = !/^(hero|mood-)/.test(p.cover);
  return (
    <article className="post-card group" data-post hidden={paged && index >= PAGE_SIZE ? true : undefined}>
      <a href={url(`blog/${p.slug}/`)} className="block">
        <div className={`relative aspect-[4/3] overflow-hidden rounded-[24px] ${productCover ? "bg-white" : "bg-petal"}`}>
          <img src={im.src} srcSet={im.srcset} sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw" width={im.width} height={im.height}
            alt={p.coverAlt} loading={index < 3 ? "eager" : "lazy"} decoding="async"
            className={`size-full transition-transform duration-[1.1s] ease-soft group-hover:scale-105 ${productCover ? "object-contain p-[10%] mix-blend-multiply" : "object-cover"}`} />
          <span className="tag absolute bottom-3 start-3"><span className="num">{p.minutes}</span> دقايق قراية</span>
        </div>
        <div className="px-1.5 pb-2 pt-4">
          <time dateTime={p.date} className="text-[12px] font-semibold text-mauve">{formatDate(p.date)}</time>
          <h2 className="mt-1.5 font-display text-[22px] font-bold leading-snug transition-colors group-hover:text-berry">{p.title}</h2>
          <p className="mt-2 line-clamp-3 text-[14px] leading-7 text-mauve">{p.description}</p>
          <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-bold text-berry">اقرئي المقالة <Icon name="arrow" className="size-4" /></span>
        </div>
      </a>
    </article>
  );
};

export const BlogIndex = () => {
  const list = posts();
  return (
    <>
      <section className="px-3 pt-3 sm:px-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-gradient-to-bl from-petal via-peach to-cream px-6 py-14 text-center sm:py-20">
          <Blobs />
          <Bow className="absolute -top-2 start-8 w-24 text-berry/30 sm:w-32" w={2} />
          <Sparkle className="twinkle absolute bottom-10 end-[12%] size-5 text-berry" />
          <div className="relative">
            <nav className="crumbs text-[13px] font-semibold text-mauve" aria-label="مسار الصفحة">
              <a href={url()} className="hover:text-berry">الرئيسية</a> ‹ <span className="text-plum">المدونة</span>
            </nav>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1.15]">مدونة <span className="text-berry">Vicuna</span></h1>
            <p className="mx-auto mt-3 max-w-md text-[17px] text-mauve">نصائح وإلهام لتنسيق الأحزمة</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6" data-blog>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-blog-grid>
          {list.map((p, i) => <PostCard key={p.slug} p={p} index={i} />)}
        </div>
        <div className="mt-10 text-center" hidden={list.length <= PAGE_SIZE ? true : undefined} data-blog-more-wrap>
          <button className="btn btn-white" data-blog-more data-page-size={PAGE_SIZE}>مقالات أكتر ↓</button>
        </div>
      </section>
    </>
  );
};

export const BlogPost = ({ p }: { p: Post }) => {
  const cover = img(p.cover);
  const productCover = !/^(hero|mood-)/.test(p.cover);
  const pageUrl = site.url + url(`blog/${p.slug}/`);
  const shareText = `${p.title} — ${pageUrl}`;
  const featured = p.products.map((id) => products.find((q) => q.id === id)).filter((q) => q !== undefined).slice(0, 4);
  const related = relatedPosts(p);

  const share = (
    <div className="flex flex-wrap items-center gap-2" aria-label="شاركي المقالة">
      <span className="me-1 text-[13px] font-bold text-mauve">شاركي:</span>
      <a className="share-btn bg-wa text-white" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener" aria-label="مشاركة على واتساب"><Icon name="wa" className="size-[18px]" /></a>
      <a className="share-btn bg-[#1877F2] text-white" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener" aria-label="مشاركة على فيسبوك"><Icon name="facebook" className="size-[18px]" /></a>
      <button className="share-btn bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white" data-share-native data-url={pageUrl} data-title={p.title} aria-label="مشاركة على إنستجرام"><Icon name="instagram" className="size-[18px]" /></button>
      <button className="share-btn bg-white text-plum shadow-[0_0_0_1px_rgb(58_31_38/.12)]" data-copy-link={pageUrl} aria-label="نسخ رابط المقالة"><Icon name="link" className="size-[18px]" /></button>
    </div>
  );

  return (
    <>
      <article className="mx-auto max-w-[1000px] px-4 pt-6 sm:px-6">
        <nav className="crumbs text-[13px] font-semibold text-mauve" aria-label="مسار الصفحة">
          <a href={url()} className="hover:text-berry">الرئيسية</a> ‹ <a href={url("blog/")} className="hover:text-berry">المدونة</a> ‹ <span className="text-plum">{p.title}</span>
        </nav>
        <header className="mt-5">
          <h1 className="font-display text-[clamp(2.1rem,5.4vw,3.6rem)] font-bold leading-[1.25]">{p.title}</h1>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-8 text-mauve">{p.description}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-mauve">
              <span className="rounded-full bg-white px-3 py-1.5">✍️ فريق {site.brand}</span>
              <time dateTime={p.date} className="rounded-full bg-white px-3 py-1.5">{formatDate(p.date)}</time>
              <span className="rounded-full bg-white px-3 py-1.5">⏱ <span className="num">{p.minutes}</span> دقايق قراية</span>
            </div>
            {share}
          </div>
        </header>
        <figure className={`mt-7 overflow-hidden rounded-[32px] border-[6px] border-white shadow-[var(--shadow-lift)] ${productCover ? "bg-white" : ""}`}>
          <img src={cover.src} srcSet={cover.srcset} sizes="(max-width:1000px) 94vw, 960px" width={cover.width} height={cover.height}
            alt={p.coverAlt} fetchPriority="high"
            className={`aspect-[16/10] w-full ${productCover ? "object-contain p-[8%] mix-blend-multiply" : "object-cover object-[50%_40%]"}`} />
        </figure>

        <div className="post-body mx-auto mt-10 max-w-[720px]" dangerouslySetInnerHTML={{ __html: p.html }} />

        {featured.length > 0 && (
          <aside className="mx-auto mt-12 max-w-[820px] rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)] sm:p-7">
            <div className="font-display text-[24px] font-bold">الأحزمة اللي في المقالة</div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featured.map((q) => (
                <a key={q.id} href={url(`p/${q.id}/`)} className="group rounded-2xl bg-blush p-2.5 transition-transform hover:-translate-y-1">
                  <span className="block aspect-square overflow-hidden rounded-xl bg-white">
                    <img src={img(q.id).src} width={img(q.id).width} height={img(q.id).height} alt={`حزام ${q.name}`} loading="lazy" decoding="async" className="size-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="mt-2 block px-1 text-[14px] font-bold group-hover:text-berry">{q.name}</span>
                  <span className="block px-1 text-[13px] font-extrabold text-berry"><span className="num">{priceOf(q)}</span> جنيه</span>
                </a>
              ))}
            </div>
          </aside>
        )}

        <div className="mx-auto mt-10 flex max-w-[720px] flex-col items-start gap-4 rounded-[30px] bg-gradient-to-br from-petal via-peach to-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="font-display text-[24px] font-bold">محتارة تختاري أنهي حزام؟</div>
            <p className="mt-1 text-mauve">ابعتيلنا صورة فستانك على واتساب ونرشحلك الحزام اللي يليق عليه.</p>
          </div>
          <a className="btn btn-wa shrink-0" href={waLink(`السلام عليكم، قريت مقالة «${p.title}» وعايزة مساعدة أختار حزام`)} target="_blank" rel="noopener">
            <Icon name="wa" className="size-4" /> كلمينا على واتساب
          </a>
        </div>

        <div className="mx-auto mt-8 flex max-w-[720px] justify-center">{share}</div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">مقالات ممكن تعجبك</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((q, i) => <PostCard key={q.slug} p={q} index={i + 3} paged={false} />)}
          </div>
        </section>
      )}
    </>
  );
};
