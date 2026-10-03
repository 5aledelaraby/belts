import type { ReactNode } from "react";
import { site, url, waLink, governorates } from "../data/site";
import { products, styles, priceOf, styleOf, textureName } from "../data/products";
import { assets } from "../lib/assets";
import { img } from "../lib/images";
import { IconSprite, Icon } from "./Icons";
import { Logo, faviconHref } from "./Logo";

interface Props {
  title: string;
  description: string;
  /** Path of this page relative to the site root, e.g. "lace/". */
  path: string;
  /** Header sits transparent over a full-bleed hero. */
  overHero?: boolean;
  children: ReactNode;
}

const fonts =
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Italiana&family=Manrope:wght@400;500;600&display=swap";

const marquee = [
  `شحن مجاني للطلبات فوق ${site.shipping.freeOver} جنيه`,
  `استرجاع خلال ${site.returnDays} يوم بفلوسك كاملة`,
  `توصيل خلال ${site.deliveryDays} أيام عمل لكل المحافظات`,
  "الدفع عند الاستلام أو InstaPay",
  "مقاسات خاصة حسب الطلب",
];

export const Layout = ({ title, description, path, overHero = false, children }: Props) => {
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
  const config = {
    shipping: site.shipping,
    whatsapp: site.whatsapp.international,
    instapay: site.instapay,
    deliveryDays: site.deliveryDays,
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#F7F4EF" />
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
        {/* Loader only appears when JS runs, and only once per visit. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!sessionStorage.getItem('v-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('is-loading');setTimeout(function(){document.documentElement.classList.remove('is-loading')},3200)}}catch(e){}",
          }}
        />
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

        <div className="loader" aria-hidden="true">
          <div className="text-center">
            <div className="loader-word font-accent text-[clamp(2.5rem,8vw,5rem)] tracking-[.4em] text-charcoal" style={{ direction: "ltr" }}>VICUNA</div>
            <div className="loader-line mx-auto mt-5 h-px w-32 origin-right bg-sienna" />
          </div>
        </div>

        {/* announcement marquee */}
        <div className="marquee fixed inset-x-0 top-0 z-50 h-[34px] overflow-hidden bg-charcoal text-bone" aria-label="عروض">
          <div className="marquee-track h-full items-center text-[12px] tracking-wide">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-12" aria-hidden={i >= marquee.length ? "true" : undefined}>
                {m}
                <span className="text-sienna">✦</span>
              </span>
            ))}
          </div>
        </div>

        <header className="site-header" data-solid={overHero ? "false" : "true"} data-over-hero={overHero ? "true" : "false"}>
          <div className="mx-auto grid h-16 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-20 sm:px-8">
            <div className="flex items-center gap-6">
              <button className="icon-btn lg:hidden" data-menu-open aria-label="القايمة">
                <Icon name="menu" className="size-6" />
              </button>
              <nav className="hidden items-center gap-7 lg:flex" aria-label="الأقسام">
                <a className="nav-link" href={url("#shop")}>المجموعة</a>
                {styles.slice(0, 4).map((s) => (
                  <a key={s.id} className="nav-link" href={url(`${s.id}/`)} aria-current={path === `${s.id}/` ? "page" : undefined}>
                    {s.name}
                  </a>
                ))}
                <a className="nav-link" href={url("returns/")} aria-current={path === "returns/" ? "page" : undefined}>الشحن والاسترجاع</a>
              </nav>
            </div>
            <a href={url()} aria-label={`${site.brand} — الصفحة الرئيسية`}>
              <Logo />
            </a>
            <div className="flex items-center justify-end gap-1">
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
            <span className="eyebrow text-bone/60">Menu</span>
            <button className="icon-btn text-bone" data-menu-close aria-label="إغلاق القايمة">
              <Icon name="close" className="size-7" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col">
            <a className="big" href={url("#shop")}>المجموعة كاملة</a>
            {styles.map((s) => (
              <a key={s.id} className="big" href={url(`${s.id}/`)}>{s.name}</a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 text-[14px] text-bone/70">
            <a href={url("returns/")}>الشحن والاسترجاع</a>
            <a href={waLink("السلام عليكم، عندي استفسار عن الأحزمة")} target="_blank" rel="noopener">واتساب {site.whatsapp.display}</a>
            <div className="flex gap-3 pt-2">
              {site.social.map((s) => (
                <a key={s.id} className="icon-btn border border-bone/20" href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                  <Icon name={s.id} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <main>{children}</main>

        <Footer />

        {/* quick view */}
        <dialog className="quick" data-quick aria-label="تفاصيل الحزام">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-square bg-white">
              <img data-q-img alt="" className="absolute inset-0 size-full object-contain p-[6%]" />
            </div>
            <div className="flex flex-col gap-5 p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="eyebrow text-stone" data-q-style></div>
                  <h2 className="mt-3 font-ar text-[34px] leading-tight" data-q-name></h2>
                </div>
                <button className="icon-btn -me-2 -mt-2" data-quick-close aria-label="إغلاق">
                  <Icon name="close" className="size-6" />
                </button>
              </div>
              <div className="font-display text-[28px]"><span className="num" data-q-price></span> <span className="text-[16px] text-stone">جنيه</span></div>
              <div>
                <div className="eyebrow mb-3 text-stone">اللون: <span className="normal-case tracking-normal" data-q-color></span></div>
                <div className="flex flex-wrap gap-2.5" data-q-swatches></div>
              </div>
              <ul className="space-y-2 border-y border-charcoal/10 py-5 text-[14px] text-charcoal/80">
                <li className="flex gap-3"><Icon name="ruler" className="size-5 text-sienna" /> عرض {site.size.widthCm} سم · طول {site.size.lengthCm} سم · مناسب لكل الأوزان</li>
                <li className="flex gap-3"><Icon name="check" className="size-5 text-sienna" /> <span data-q-texture></span></li>
                <li className="flex gap-3"><Icon name="truck" className="size-5 text-sienna" /> توصيل خلال {site.deliveryDays} أيام عمل · مقاسات خاصة بالطلب</li>
              </ul>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <button className="btn btn-dark flex-1" data-q-add data-magnetic>أضيفي للشنطة</button>
                <a className="btn btn-line flex-1" data-q-wa target="_blank" rel="noopener">
                  <Icon name="wa" className="size-4" /> اطلبي على واتساب
                </a>
              </div>
            </div>
          </div>
        </dialog>

        {/* cart */}
        <div className="scrim" data-scrim hidden></div>
        <aside className="drawer" data-cart data-open="false" aria-label="الشنطة" aria-hidden="true" data-lenis-prevent>
          <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
            <h2 className="font-ar text-[26px]">الشنطة</h2>
            <button className="icon-btn" data-cart-close aria-label="إغلاق الشنطة"><Icon name="close" className="size-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div data-lines></div>
            <form id="order" className="mt-8 flex flex-col gap-5" noValidate>
              <div className="eyebrow text-stone">بيانات التوصيل</div>
              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="eyebrow mt-2 text-stone">طريقة الدفع</div>
              <label className="radio-card">
                <input type="radio" name="pay" value="cod" defaultChecked className="mt-1 accent-charcoal" />
                <span><b className="font-medium">الدفع عند الاستلام</b><br /><span className="text-[13px] text-stone">ادفعي للمندوب لما الطلب يوصلك</span></span>
              </label>
              <label className="radio-card">
                <input type="radio" name="pay" value="instapay" className="mt-1 accent-charcoal" />
                <span>
                  <b className="font-medium">InstaPay</b><br />
                  <span className="text-[13px] text-stone">حوّلي على <b className="num text-charcoal">{site.instapay}</b> وابعتي صورة التحويل على واتساب</span>
                </span>
              </label>
              <div className="field">
                <label htmlFor="f-ship">الشحن</label>
                <select id="f-ship" defaultValue="standard">
                  <option value="standard">عادي — {site.shipping.standard} جنيه (مجاني فوق {site.shipping.freeOver})</option>
                  <option value="express">سريع — {site.shipping.express} جنيه</option>
                </select>
              </div>
              <div className="min-h-5 text-[13px] text-red-700" data-err role="alert"></div>
            </form>
          </div>
          <div className="space-y-2.5 border-t border-charcoal/10 bg-white/60 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
            <div className="flex justify-between text-[14px]"><span>المنتجات (<span className="num" data-n>0</span>)</span><span><span className="num" data-sub>0</span> جنيه</span></div>
            <div className="flex justify-between text-[14px]"><span>الشحن</span><span data-ship>—</span></div>
            <div className="flex justify-between font-display text-[22px]"><span className="font-sans text-[15px] font-medium">الإجمالي</span><span><span className="num" data-total>0</span> <span className="text-[14px]">جنيه</span></span></div>
            <button type="submit" form="order" className="btn btn-wa w-full">
              <Icon name="wa" className="size-4" /> إرسال الطلب على واتساب
            </button>
            <p className="text-center text-[12px] text-stone">
              توصيل خلال {site.deliveryDays} أيام عمل · استرجاع خلال {site.returnDays} يوم · <a className="underline" href={url("returns/")}>التفاصيل</a>
            </p>
          </div>
        </aside>

        {/* mobile filter sheet (filled by the grid on pages that have one) */}
        <div className="sheet" data-sheet data-open="false" role="dialog" aria-modal="true" aria-label="فلترة" data-lenis-prevent></div>

        <div className="toast" data-toast role="status"></div>
        <div className="cursor" data-cursor-el aria-hidden="true"><span>VIEW</span></div>

        <script id="catalog" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ config, catalog }) }} />
        {assets.vendor.map((v) => <script key={v} src={url(v)} defer></script>)}
        <script src={url(assets.js)} defer></script>
      </body>
    </html>
  );
};

const Footer = () => (
  <footer className="bg-charcoal text-bone">
    <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <div className="[--ink:var(--color-bone)]"><Logo /></div>
        <p className="mt-6 max-w-sm text-[14px] leading-7 text-bone/60">
          أحزمة خصر بالربط من جلد PU مستورد، بتتصمم في القاهرة وبتوصل لكل محافظات مصر.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-bone/20 px-3 py-1.5 text-[12px]">الدفع عند الاستلام</span>
          <span className="rounded-full border border-bone/20 px-3 py-1.5 text-[12px]" style={{ direction: "ltr" }}>InstaPay</span>
        </div>
      </div>
      <div>
        <div className="eyebrow text-bone/50">تسوّقي</div>
        <ul className="mt-5 space-y-3 text-[14px]">
          {styles.map((s) => <li key={s.id}><a className="hover:text-sand" href={url(`${s.id}/`)}>{s.name}</a></li>)}
        </ul>
      </div>
      <div>
        <div className="eyebrow text-bone/50">مساعدة</div>
        <ul className="mt-5 space-y-3 text-[14px]">
          <li><a className="hover:text-sand" href={url("returns/")}>الشحن والاسترجاع</a></li>
          <li><a className="hover:text-sand" href={url("#tie")}>طريقة الربط</a></li>
          <li><a className="hover:text-sand" href={url("#faq")}>أسئلة شائعة</a></li>
          <li><a className="hover:text-sand" href={url("privacy/")}>سياسة الخصوصية</a></li>
          <li><a className="hover:text-sand" href={url("terms/")}>الشروط والأحكام</a></li>
          <li><a className="hover:text-sand" href={waLink("السلام عليكم، عندي استفسار")} target="_blank" rel="noopener">واتساب <span className="num">{site.whatsapp.display}</span></a></li>
        </ul>
      </div>
      <div>
        <div className="eyebrow text-bone/50">تابعينا</div>
        <ul className="mt-5 space-y-3 text-[14px]">
          {site.social.map((s) => (
            <li key={s.id}>
              <a className="inline-flex items-center gap-3 hover:text-sand" href={s.href} target="_blank" rel="noopener">
                <Icon name={s.id} className="size-5" /> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-bone/10">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-[12px] leading-6 text-bone/50 sm:px-8 lg:flex-row lg:justify-between">
        <div>
          {site.legalNameAr} · <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{site.legalNameEn}</span> · {site.legalForm} · سجل تجاري رقم <span className="num">{site.commercialRegister}</span>
          <br />
          {site.headOffice}
        </div>
        <div>© 2026 {site.brand} · اتصمم بعناية في القاهرة</div>
      </div>
    </div>
  </footer>
);
