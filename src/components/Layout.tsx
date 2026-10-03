import type { ReactNode } from "react";
import { site, url, waLink, governorates } from "../data/site";
import { products, styles, priceOf, styleOf, textureName } from "../data/products";
import { assets } from "../lib/assets";
import { img } from "../lib/images";
import { IconSprite, Icon } from "./Icons";
import { Logo, faviconHref } from "./Logo";
import { Bow, Sparkle } from "./Art";

interface Props {
  title: string;
  description: string;
  /** Path of this page relative to the site root, e.g. "lace/". */
  path: string;
  children: ReactNode;
}

const fonts =
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=El+Messiri:wght@500;600;700&family=Italiana&display=swap";

const marquee = [
  `شحن مجاني فوق ${site.shipping.freeOver} جنيه`,
  `توصيل خلال ${site.deliveryDays} أيام عمل لكل مصر`,
  "الدفع عند الاستلام أو InstaPay",
  `استرجاع خلال ${site.returnDays} يوم بفلوسك كاملة`,
  "مقاسات خاصة حسب الطلب",
];

export const Layout = ({ title, description, path, children }: Props) => {
  const canonical = site.url + url(path);
  const ogImage = site.url + url("assets/og.jpg");
  const catalog = Object.fromEntries(
    products.map((p) => {
      const im = img(p.id);
      return [p.id, {
        name: p.name, price: priceOf(p), style: p.style, styleName: styleOf(p.style).name, hex: p.hex,
        texture: textureName[p.texture], src: im.src, srcset: im.srcset, large: im.large,
      }];
    }),
  );
  const config = { shipping: site.shipping, whatsapp: site.whatsapp.international, instapay: site.instapay, deliveryDays: site.deliveryDays };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#FFF5F3" />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href={faviconHref} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.brand} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fonts} />
        <link rel="stylesheet" href={url(assets.css)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: site.brand,
              legalName: site.legalNameEn,
              url: site.url + url(),
              logo: site.url + url("assets/logo.png"),
              telephone: "+" + site.whatsapp.international,
              address: { "@type": "PostalAddress", streetAddress: site.headOfficeEn, addressLocality: "Cairo", addressCountry: "EG" },
              sameAs: site.social.map((s) => s.href),
            }),
          }}
        />
      </head>
      <body data-page={path || "home"}>
        <IconSprite />

        {/* announcement marquee */}
        <div className="marquee overflow-hidden bg-berry py-2 text-white" aria-label="عروض">
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
          <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button className="icon-btn lg:hidden" data-menu-open aria-label="القايمة">
                <Icon name="menu" className="size-6" />
              </button>
              <a href={url()} aria-label={`${site.brand} — الصفحة الرئيسية`}><Logo /></a>
            </div>
            <nav className="no-scrollbar hidden items-center gap-2 overflow-x-auto lg:flex" aria-label="الأقسام">
              <a className="nav-pill" href={url("#shop")}>كل الموديلات</a>
              {styles.map((s) => (
                <a key={s.id} className="nav-pill" href={url(`${s.id}/`)} aria-current={path === `${s.id}/` ? "page" : undefined}>{s.name}</a>
              ))}
            </nav>
            <div className="flex items-center gap-1">
              <a className="icon-btn" href={url("#favorites")} data-show-favs aria-label="المفضلة">
                <Icon name="heart" className="size-[22px]" />
                <span className="count-badge" data-fav-count hidden>0</span>
              </a>
              <button className="icon-btn" data-cart-open aria-label="الشنطة">
                <Icon name="bag" className="size-[22px]" />
                <span className="count-badge" data-cart-count hidden>0</span>
              </button>
            </div>
          </div>
        </header>

        {/* full-screen mobile menu */}
        <div className="menu-overlay" data-menu data-open="false" role="dialog" aria-modal="true" aria-label="القايمة">
          <div className="flex items-center justify-between">
            <Logo />
            <button className="icon-btn" data-menu-close aria-label="إغلاق القايمة"><Icon name="close" className="size-7" /></button>
          </div>
          <nav className="mt-10 flex flex-col">
            <a className="big" href={url("#shop")}>كل الموديلات</a>
            {styles.map((s) => <a key={s.id} className="big" href={url(`${s.id}/`)}>{s.name}</a>)}
          </nav>
          <Bow className="pointer-events-none absolute bottom-24 start-6 w-40 text-berry/30" />
          <div className="mt-auto flex flex-col gap-3 text-[15px] font-semibold">
            <a href={url("returns/")}>الشحن والاسترجاع</a>
            <a href={waLink("السلام عليكم، عندي استفسار عن الأحزمة")} target="_blank" rel="noopener">واتساب <span className="num">{site.whatsapp.display}</span></a>
            <div className="flex gap-2 pt-2">
              {site.social.map((s) => (
                <a key={s.id} className="icon-btn bg-white" href={s.href} target="_blank" rel="noopener" aria-label={s.label}><Icon name={s.id} /></a>
              ))}
            </div>
          </div>
        </div>

        <main>{children}</main>

        <Footer />

        {/* quick view */}
        <dialog className="quick" data-quick aria-label="تفاصيل الحزام">
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
                <button className="icon-btn -me-2 -mt-2" data-quick-close aria-label="إغلاق"><Icon name="close" className="size-6" /></button>
              </div>
              <div className="text-[28px] font-extrabold text-berry"><span className="num" data-q-price></span> <span className="text-[16px]">جنيه</span></div>
              <div>
                <div className="mb-3 text-[13px] font-semibold text-mauve">اللون: <span className="text-plum" data-q-color></span></div>
                <div className="flex flex-wrap gap-2.5" data-q-swatches></div>
              </div>
              <ul className="space-y-2.5 rounded-2xl bg-white p-4 text-[14px]">
                <li className="flex gap-3"><Icon name="ruler" className="size-5 shrink-0 text-berry" /> عرض {site.size.widthCm} سم · طول {site.size.lengthCm} سم · مناسب لكل الأوزان</li>
                <li className="flex gap-3"><Icon name="check" className="size-5 shrink-0 text-berry" /> <span data-q-texture></span></li>
                <li className="flex gap-3"><Icon name="truck" className="size-5 shrink-0 text-berry" /> توصيل خلال {site.deliveryDays} أيام عمل · مقاسات خاصة بالطلب</li>
              </ul>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <button className="btn btn-berry btn-shine flex-1" data-q-add>أضيفي للشنطة</button>
                <a className="btn btn-white flex-1" data-q-wa target="_blank" rel="noopener"><Icon name="wa" className="size-4" /> اطلبي على واتساب</a>
              </div>
            </div>
          </div>
        </dialog>

        {/* cart */}
        <div className="scrim" data-scrim hidden></div>
        <aside className="drawer" data-cart data-open="false" aria-label="الشنطة" aria-hidden="true" data-lenis-prevent>
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-display text-[28px] font-bold">الشنطة 🛍</h2>
            <button className="icon-btn" data-cart-close aria-label="إغلاق الشنطة"><Icon name="close" className="size-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div data-lines></div>
            <form id="order" className="mt-6 flex flex-col gap-4" noValidate>
              <div className="font-display text-[20px] font-bold">بيانات التوصيل</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field"><label htmlFor="f-name">الاسم</label><input id="f-name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="f-phone">رقم الموبايل</label><input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required /></div>
              </div>
              <div className="field">
                <label htmlFor="f-gov">المحافظة</label>
                <select id="f-gov" required defaultValue="">
                  <option value="">اختاري المحافظة</option>
                  {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="f-addr">العنوان بالتفصيل</label><textarea id="f-addr" placeholder="المنطقة، الشارع، رقم العمارة، الدور" required></textarea></div>
              <div className="field"><label htmlFor="f-note">ملاحظات أو مقاس خاص (اختياري)</label><input id="f-note" /></div>

              <div className="mt-2 font-display text-[20px] font-bold">طريقة الدفع</div>
              <label className="radio-card">
                <input type="radio" name="pay" value="cod" defaultChecked className="mt-1.5 accent-berry" />
                <span><b>الدفع عند الاستلام</b><br /><span className="text-[13px] text-mauve">ادفعي للمندوب لما الطلب يوصلك</span></span>
              </label>
              <label className="radio-card">
                <input type="radio" name="pay" value="instapay" className="mt-1.5 accent-berry" />
                <span><b>InstaPay</b><br /><span className="text-[13px] text-mauve">حوّلي على <b className="num text-plum">{site.instapay}</b> وابعتي صورة التحويل على واتساب</span></span>
              </label>
              <div className="field">
                <label htmlFor="f-ship">الشحن</label>
                <select id="f-ship" defaultValue="standard">
                  <option value="standard">عادي — {site.shipping.standard} جنيه (مجاني فوق {site.shipping.freeOver})</option>
                  <option value="express">سريع — {site.shipping.express} جنيه</option>
                </select>
              </div>
              <div className="min-h-5 text-[13px] font-semibold text-red-700" data-err role="alert"></div>
            </form>
          </div>
          <div className="space-y-2 rounded-t-[24px] bg-white px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-10px_30px_-20px_rgb(58_31_38/.3)]">
            <div className="flex justify-between text-[14px]"><span>المنتجات (<span className="num" data-n>0</span>)</span><span><span className="num" data-sub>0</span> جنيه</span></div>
            <div className="flex justify-between text-[14px]"><span>الشحن</span><span data-ship>—</span></div>
            <div className="flex justify-between text-[20px] font-extrabold"><span>الإجمالي</span><span className="text-berry"><span className="num" data-total>0</span> جنيه</span></div>
            <button type="submit" form="order" className="btn btn-wa w-full"><Icon name="wa" className="size-4" /> إرسال الطلب على واتساب</button>
            <p className="text-center text-[12px] text-mauve">توصيل خلال {site.deliveryDays} أيام عمل · استرجاع خلال {site.returnDays} يوم · <a className="underline" href={url("returns/")}>التفاصيل</a></p>
          </div>
        </aside>

        {/* lightbox */}
        <dialog className="lightbox" data-lightbox-dialog aria-label="عرض الصورة">
          <figure className="m-0 flex max-h-[92svh] w-full max-w-[1100px] flex-col items-center gap-4 px-4">
            <img data-lb-img alt="" className="max-h-[80svh] w-auto max-w-full rounded-[24px] bg-white object-contain shadow-2xl" />
            <figcaption className="text-[15px] font-semibold" data-lb-caption></figcaption>
          </figure>
          <button className="lb-btn top-4 end-4" data-lb-close aria-label="إغلاق"><Icon name="close" className="size-6" /></button>
          <button className="lb-btn start-3 top-1/2 -translate-y-1/2" data-lb-prev aria-label="الصورة اللي قبلها">›</button>
          <button className="lb-btn end-3 top-1/2 -translate-y-1/2" data-lb-next aria-label="الصورة اللي بعدها">‹</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/70 num" data-lb-count></div>
        </dialog>

        <div className="sheet" data-sheet data-open="false" role="dialog" aria-modal="true" aria-label="فلترة" data-lenis-prevent></div>
        <div className="toast" data-toast role="status"></div>

        <script id="catalog" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ config, catalog }) }} />
        {assets.vendor.map((v) => <script key={v} src={url(v)} defer></script>)}
        <script src={url(assets.js)} defer></script>
      </body>
    </html>
  );
};

const Footer = () => (
  <footer className="relative mt-10 overflow-hidden rounded-t-[40px] bg-plum text-white">
    <Bow className="pointer-events-none absolute -top-4 end-6 w-48 text-white/10 sm:w-72" w={1.2} />
    <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <div className="[--ink:white] [--accent:var(--color-rose)] [--accent-deep:var(--color-petal)]"><Logo /></div>
        <p className="mt-5 max-w-sm text-[14px] leading-7 text-white/70">أحزمة خصر بالربط من جلد PU مستورد، بتتصمم في القاهرة وبتوصل لكل محافظات مصر.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold">
          <span className="rounded-full bg-white/10 px-3 py-1.5">💵 الدفع عند الاستلام</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5" style={{ direction: "ltr" }}>InstaPay</span>
        </div>
      </div>
      <div>
        <div className="font-display text-[18px] font-bold text-rose">تسوّقي</div>
        <ul className="mt-4 space-y-2.5 text-[14px]">{styles.map((s) => <li key={s.id}><a className="hover:text-rose" href={url(`${s.id}/`)}>{s.name}</a></li>)}</ul>
      </div>
      <div>
        <div className="font-display text-[18px] font-bold text-rose">مساعدة</div>
        <ul className="mt-4 space-y-2.5 text-[14px]">
          <li><a className="hover:text-rose" href={url("returns/")}>الشحن والاسترجاع</a></li>
          <li><a className="hover:text-rose" href={url("#tie")}>طريقة الربط</a></li>
          <li><a className="hover:text-rose" href={url("#faq")}>أسئلة شائعة</a></li>
          <li><a className="hover:text-rose" href={url("privacy/")}>سياسة الخصوصية</a></li>
          <li><a className="hover:text-rose" href={url("terms/")}>الشروط والأحكام</a></li>
          <li><a className="hover:text-rose" href={waLink("السلام عليكم، عندي استفسار")} target="_blank" rel="noopener">واتساب <span className="num">{site.whatsapp.display}</span></a></li>
        </ul>
      </div>
      <div>
        <div className="font-display text-[18px] font-bold text-rose">تابعينا</div>
        <ul className="mt-4 space-y-2.5 text-[14px]">
          {site.social.map((s) => (
            <li key={s.id}><a className="inline-flex items-center gap-3 hover:text-rose" href={s.href} target="_blank" rel="noopener"><span className="grid size-9 place-items-center rounded-full bg-white/10"><Icon name={s.id} className="size-[18px]" /></span>{s.label}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="relative border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-[12px] leading-6 text-white/50 sm:px-8 lg:flex-row lg:justify-between">
        <div>
          {site.legalNameAr} · <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{site.legalNameEn}</span> · {site.legalForm} · سجل تجاري رقم <span className="num">{site.commercialRegister}</span>
          <br />{site.headOffice}
        </div>
        <div>© 2026 {site.brand} · اتعمل بحب في القاهرة ♡</div>
      </div>
    </div>
  </footer>
);
