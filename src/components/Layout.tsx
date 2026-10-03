import type { ReactNode } from "react";
import { site, url, waLink, governorates } from "../data/site";
import { products } from "../data/products";
import { assets } from "../lib/assets";
import { img } from "../lib/images";
import { IconSprite, Icon } from "./Icons";

interface Props {
  title: string;
  description: string;
  /** Path of this page relative to the site root, e.g. "lace/". */
  path: string;
  children: ReactNode;
}

const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%238E5536'/%3E%3Ctext x='32' y='44' font-family='Georgia,serif' font-style='italic' font-size='34' fill='%23FFF8F2' text-anchor='middle'%3EV%3C/text%3E%3C/svg%3E";

const fonts =
  "https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@1,500&display=swap";

export const Layout = ({ title, description, path, children }: Props) => {
  const canonical = site.url + url(path);
  const ogImage = site.url + url("assets/og.jpg");
  // Small catalogue for the cart script: names and thumbnails only.
  const catalog = Object.fromEntries(
    products.map((p) => [p.id, { name: p.name, thumb: img(p.id).src, large: img(p.id).large }]),
  );
  const config = {
    price: site.price,
    shipping: site.shipping,
    whatsapp: site.whatsapp.international,
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#ECE7EB" />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href={favicon} />
        <meta property="og:type" content="website" />
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
              telephone: "+" + site.whatsapp.international,
              address: { "@type": "PostalAddress", streetAddress: site.headOffice, addressCountry: "EG" },
            }),
          }}
        />
      </head>
      <body>
        <IconSprite />
        <div className="notice">
          كل الموديلات بـ <b>{site.price} {site.currency}</b> · توصيل لـ<b>جميع المحافظات</b> ·{" "}
          <b>شحن مجاني</b> فوق {site.shipping.freeOver} {site.currency}
        </div>

        <header className="top">
          <div className="wrap">
            <a className="mark" href={url()}>
              {site.brand}
              <small>{site.tagline}</small>
            </a>
            <nav className="links" aria-label="الأقسام">
              <a href={url("#shop")}>الموديلات</a>
              <a href={url("#tie")}>طريقة الربط</a>
              <a href={url("#faq")}>أسئلة شائعة</a>
              <a href={url("returns/")}>الشحن والاسترجاع</a>
            </nav>
            <button className="cart-btn" id="open-cart" aria-label="فتح السلة">
              <Icon name="bag" />
              السلة <span className="badge" id="badge">0</span>
            </button>
          </div>
        </header>

        <main>{children}</main>

        <footer>
          <div className="wrap legal">
            <div>
              <b>{site.legalNameAr}</b> <span className="num-ltr">{site.legalNameEn}</span>
              <br />
              {site.legalForm} · سجل تجاري رقم <span className="num-ltr">{site.commercialRegister}</span>
            </div>
            <div>
              المقر: {site.headOffice}
              <br />
              <a href={url("returns/")}>الشحن والاسترجاع</a> · <a href={url("privacy/")}>سياسة الخصوصية</a> ·{" "}
              <a href={url("terms/")}>الشروط والأحكام</a>
              <br />© 2026 {site.brand}. جميع الحقوق محفوظة.
            </div>
          </div>
        </footer>

        <a className="fab" href={waLink("السلام عليكم، عندي استفسار عن الأحزمة")} target="_blank" rel="noopener" aria-label="تواصل على واتساب">
          <Icon name="wa" />
        </a>

        <dialog className="zoom" id="dlg">
          <img id="dlg-img" alt="" />
          <div className="dbar">
            <div>
              <strong id="dlg-name"></strong>
              <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                {site.price} {site.currency}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn btn-main" id="dlg-add">أضيفي للسلة</button>
              <button className="x" id="dlg-x" aria-label="إغلاق">×</button>
            </div>
          </div>
        </dialog>

        <div className="shade" id="shade" hidden></div>
        <aside className="drawer" id="drawer" aria-label="سلة المشتريات" aria-hidden="true">
          <div className="dhead">
            <h2>سلة المشتريات</h2>
            <button className="x" id="close-cart" aria-label="إغلاق السلة">×</button>
          </div>
          <div className="dbody">
            <div id="lines"></div>
            <form className="form" id="order" noValidate>
              <h3>بيانات التوصيل</h3>
              <div className="two">
                <div className="field">
                  <label htmlFor="f-name">الاسم</label>
                  <input id="f-name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">رقم الموبايل</label>
                  <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-gov">المحافظة</label>
                <select id="f-gov" required defaultValue="">
                  <option value="">اختاري المحافظة</option>
                  {governorates.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-addr">العنوان بالتفصيل</label>
                <textarea id="f-addr" placeholder="المنطقة، الشارع، رقم العمارة، الدور" required></textarea>
              </div>
              <div className="field">
                <label htmlFor="f-note">ملاحظات (اختياري)</label>
                <input id="f-note" />
              </div>
              <div className="err" id="err" role="alert"></div>
            </form>
          </div>
          <div className="dfoot">
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="f-ship">طريقة الشحن</label>
              <select id="f-ship" defaultValue="standard">
                <option value="standard">شحن عادي — {site.shipping.standard} {site.currency}</option>
                <option value="express">شحن سريع — {site.shipping.express} {site.currency}</option>
              </select>
            </div>
            <div className="sum">
              <span>
                الأحزمة (<span id="n-items" className="num-ltr">0</span>)
              </span>
              <span>
                <span id="subtotal" className="num-ltr">0</span> {site.currency}
              </span>
            </div>
            <div className="sum">
              <span>الشحن</span>
              <span id="ship-cost">—</span>
            </div>
            <div className="sum total">
              <span>الإجمالي</span>
              <span>
                <span id="grand" className="num-ltr">0</span> {site.currency}
              </span>
            </div>
            <button className="btn btn-wa" id="send" type="submit" form="order">
              <Icon name="wa" />
              إرسال الطلب على واتساب
            </button>
            <small style={{ color: "var(--muted)", fontSize: ".8rem" }}>
              استرجاع خلال {site.returnDays} يوم بفلوسك كاملة · <a href={url("returns/")}>الشحن والاسترجاع</a> ·{" "}
              <a href={url("terms/")}>الشروط</a>
            </small>
          </div>
        </aside>

        <div className="toast" id="toast" role="status"></div>

        <script id="catalog" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ config, catalog }) }} />
        <script type="module" src={url(assets.js)}></script>
      </body>
    </html>
  );
};
