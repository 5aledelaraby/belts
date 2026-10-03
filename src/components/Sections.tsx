import { site, url, waLink } from "../data/site";
import { categories, categoryName, products, type Category, type Product } from "../data/products";
import { img } from "../lib/images";
import { Icon } from "./Icons";

const Price = () => (
  <div className="price">
    <span className="num-ltr">{site.price}</span> <small>{site.currency}</small>
  </div>
);

export const Hero = () => {
  const hero = img("hero");
  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <div className="eyebrow">أحزمة خصر بالربط</div>
          <h1>
            حزام واحد
            <br />
            يغيّر <em>شكل الفستان</em>
          </h1>
          <p>
            أحزمة عريضة بتتلف حوالين الخصر وتتربط، من الجلد الناعم والشمواه والكروكو والدانتيل والكشكشة. تنفع مع فستان أو
            بلوزة أو جاكيت.
          </p>
          <div className="price-tag">
            <strong className="num-ltr">{site.price}</strong>
            <span>{site.currency} لأي موديل</span>
          </div>
          <div className="actions">
            <a className="btn btn-main" href="#shop">تسوّقي الموديلات</a>
            <a className="btn btn-ghost" href={waLink("السلام عليكم، عندي استفسار عن الأحزمة")} target="_blank" rel="noopener">
              <Icon name="wa" />
              اسألي على واتساب
            </a>
          </div>
        </div>
        <figure>
          <img
            src={hero.src}
            srcSet={hero.srcset}
            sizes="(max-width: 760px) 100vw, 520px"
            width={hero.width}
            height={hero.height}
            alt="حزام دانتيل أسود على مانيكان أبيض وحزام دانتيل أحمر على مانيكان أسود"
            fetchPriority="high"
          />
        </figure>
      </div>
    </div>
  );
};

export const Perks = () => (
  <div className="perks">
    <div className="perk">
      <Icon name="tag" />
      <div>
        <b>سعر واحد</b>
        <span>{site.price} {site.currency} لأي حزام في الكتالوج</span>
      </div>
    </div>
    <div className="perk">
      <Icon name="truck" />
      <div>
        <b>توصيل لكل مصر</b>
        <span>
          الشحن {site.shipping.standard} {site.currency}، ومجاني فوق {site.shipping.freeOver} {site.currency}
        </span>
      </div>
    </div>
    <div className="perk">
      <Icon name="ruler" />
      <div>
        <b>بيظبط على مقاسك</b>
        <span>بيتلف ويتربط، فيلبس على مقاسات مختلفة</span>
      </div>
    </div>
    <div className="perk">
      <Icon name="return" />
      <div>
        <b>استرجاع خلال {site.returnDays} يوم</b>
        <span>فلوسك ترجعلك كاملة، أو بدّلي بموديل تاني</span>
      </div>
    </div>
  </div>
);

export const ProductCard = ({ p, eager = false }: { p: Product; eager?: boolean }) => {
  const im = img(p.id);
  return (
    <article className="card" data-id={p.id} data-cat={p.category}>
      <button className="ph" data-zoom={p.id} aria-label={`تكبير صورة ${p.name}`}>
        <img
          src={im.src}
          srcSet={im.srcset}
          sizes="(max-width: 760px) 50vw, 260px"
          width={im.width}
          height={im.height}
          alt={`حزام ${p.name}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </button>
      <div className="meta">
        <div>
          <h3>{p.name}</h3>
          <div className="sub">
            <span className="swatch" style={{ background: p.color }}></span>
            {categoryName(p.category)}
          </div>
        </div>
        <Price />
      </div>
      <div className="row">
        <button className="add" data-add={p.id}>أضيفي للسلة</button>
        <a
          className="quick"
          target="_blank"
          rel="noopener"
          aria-label={`اطلبي ${p.name} على واتساب`}
          href={waLink(`السلام عليكم، عايزة أطلب حزام: ${p.name} (${site.price} ${site.currency})`)}
        >
          <Icon name="wa" />
        </a>
      </div>
    </article>
  );
};

/** Full catalogue with filter chips (home page). */
export const Shop = () => (
  <section id="shop">
    <div className="wrap">
      <div className="sec-head">
        <div>
          <h2>الموديلات</h2>
          <div className="count" id="count">
            {products.length} موديل · {site.price} {site.currency} للحزام
          </div>
        </div>
        <div className="chips" role="group" aria-label="تصفية حسب التصميم">
          <button className="chip" data-filter="all" aria-pressed="true">الكل</button>
          {categories.map((c) => (
            <button key={c.id} className="chip" data-filter={c.id} aria-pressed="false">
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid" id="grid">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} eager={i < 4} />
        ))}
      </div>
    </div>
  </section>
);

/** One category's products (landing pages). */
export const CategoryGrid = ({ cat }: { cat: Category }) => {
  const list = products.filter((p) => p.category === cat.id);
  return (
    <section id="shop" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2>موديلات {cat.name}</h2>
            <div className="count">
              {list.length} موديل · {site.price} {site.currency} للحزام
            </div>
          </div>
        </div>
        <div className="grid">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} eager={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const CategoryHero = ({ cat }: { cat: Category }) => (
  <div className="wrap cat-hero">
    <nav className="crumbs" aria-label="مسار الصفحة">
      <a href={url()}>المتجر</a>
      <span aria-hidden="true">‹</span>
      <span>{cat.name}</span>
    </nav>
    <h1>{cat.headline}</h1>
    <p>{cat.intro}</p>
    <div className="price-tag">
      <strong className="num-ltr">{site.price}</strong>
      <span>{site.currency} للحزام · شحن مجاني فوق {site.shipping.freeOver} {site.currency}</span>
    </div>
    <div className="cat-nav">
      {categories.map((c) => (
        <a key={c.id} className="chip" href={url(`${c.id}/`)} aria-current={c.id === cat.id ? "page" : undefined}
           aria-pressed={c.id === cat.id ? "true" : "false"}>
          {c.name}
        </a>
      ))}
    </div>
  </div>
);

export const MoreCategories = ({ except }: { except: string }) => (
  <section>
    <div className="wrap">
      <div className="sec-head">
        <h2>تصميمات تانية</h2>
      </div>
      <div className="more-cats">
        {categories
          .filter((c) => c.id !== except)
          .map((c) => {
            const first = products.find((p) => p.category === c.id)!;
            const im = img(first.id);
            return (
              <a key={c.id} href={url(`${c.id}/`)}>
                <img src={im.src} width={im.width} height={im.height} alt="" loading="lazy" />
                <b>{c.name}</b>
              </a>
            );
          })}
        <a href={url("#shop")}>
          <img src={img("hero").src} width={img("hero").width} height={img("hero").height} alt="" loading="lazy" />
          <b>كل الموديلات</b>
        </a>
      </div>
    </div>
  </section>
);

export const TieSteps = () => (
  <section id="tie">
    <div className="wrap">
      <div className="sec-head">
        <h2>طريقة الربط</h2>
      </div>
      <div className="steps">
        <div className="step">
          <span>١</span>
          <h3>حطي الحزام على الخصر</h3>
          <p>الجزء العريض من قدّام، والشريطين من ورا.</p>
        </div>
        <div className="step">
          <span>٢</span>
          <h3>لفّي الشريطين</h3>
          <p>عدّيهم حوالين الوسط ورجّعيهم لقدّام فوق الحزام.</p>
        </div>
        <div className="step">
          <span>٣</span>
          <h3>اربطي فيونكة</h3>
          <p>في النص أو على جنب، وسيبي الأطراف نازلة. وتقدري تلفّيها كذا لفة حسب مقاسك.</p>
        </div>
      </div>
    </div>
  </section>
);

export const Mood = () => {
  const a = img("mood-lace");
  const b = img("mood-bow");
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="mood">
          <img src={a.src} srcSet={a.srcset} sizes="50vw" width={a.width} height={a.height} alt="حزام دانتيل أسود على مانيكان برونزي" loading="lazy" />
          <img src={b.src} srcSet={b.srcset} sizes="50vw" width={b.width} height={b.height} alt="حزام جلد وردي بفيونكة على مانيكان برونزي" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export const Faq = () => (
  <section id="faq">
    <div className="wrap">
      <div className="sec-head">
        <h2>أسئلة شائعة</h2>
      </div>
      <div className="faq">
        <details open>
          <summary>إزاي أطلب؟</summary>
          <p>
            اضغطي «أضيفي للسلة» تحت الموديلات اللي عجباكي، وبعدين افتحي السلة واكتبي اسمك ورقمك والمحافظة والعنوان، واضغطي
            «إرسال الطلب على واتساب». هيتفتح واتساب برسالة فيها الطلب كامل، تبعتيها بس، ونأكد معاكي على طول.
          </p>
        </details>
        <details>
          <summary>الشحن بكام؟ وبتوصلوا لأي محافظة؟</summary>
          <p>
            بنوصّل لجميع محافظات مصر. الشحن العادي {site.shipping.standard} {site.currency}، والسريع {site.shipping.express}{" "}
            {site.currency}، والشحن العادي مجاني للطلبات من {site.shipping.freeOver} {site.currency} وأكتر. بنبلغك بموعد
            التوصيل لما نأكد الطلب. <a href={url("returns/")}>تفاصيل الشحن</a>
          </p>
        </details>
        <details>
          <summary>لو الحزام ما عجبنيش أقدر أرجّعه؟</summary>
          <p>
            أيوه. معاكي {site.returnDays} يوم من يوم الاستلام ترجّعي أي حزام وتاخدي فلوسك كاملة، أو تبدّليه بموديل تاني. ولو
            فيه عيب أو وصلك موديل غلط، إحنا بنتحمل كل المصاريف. <a href={url("returns/")}>سياسة الاسترجاع</a>
          </p>
        </details>
        <details>
          <summary>سعر الحزام كام؟</summary>
          <p>
            كل الموديلات بسعر واحد: {site.price} {site.currency} للحزام، والشحن بيتحسب في السلة قبل ما تبعتي الطلب.
          </p>
        </details>
        <details>
          <summary>المقاس هيبقى مظبوط؟</summary>
          <p>
            الأحزمة دي بتتلف حوالين الخصر وتتربط، فبتظبط على مقاسات مختلفة. لو عندك سؤال عن مقاس معين ابعتيلنا مقاس وسطك
            على واتساب ونقولك.
          </p>
        </details>
        <details>
          <summary>ينفع أستلم بنفسي؟</summary>
          <p>ابعتيلنا على واتساب ونتفق على الاستلام من {site.pickup}.</p>
        </details>
      </div>
    </div>
  </section>
);

export const Contact = () => (
  <section id="contact">
    <div className="wrap">
      <div className="contact">
        <div>
          <h2>تواصلي معانا</h2>
          <p>لأي استفسار عن موديل أو لون أو طريقة توصيل، كلمينا على واتساب ونرد عليكي.</p>
          <div style={{ marginTop: 20 }}>
            <a className="btn btn-wa" href={waLink("السلام عليكم، عندي استفسار عن الأحزمة")} target="_blank" rel="noopener">
              <Icon name="wa" />
              كلمينا على واتساب
            </a>
          </div>
        </div>
        <div className="info">
          <div className="item">
            <Icon name="wa" />
            <div>
              <small>واتساب</small>
              <b className="num-ltr" id="phone">{site.whatsapp.display}</b>
              <button className="copy" id="copy" data-copy={site.whatsapp.display}>نسخ</button>
            </div>
          </div>
          <div className="item">
            <Icon name="pin" />
            <div>
              <small>المقر الرئيسي</small>
              <b>{site.headOffice}</b>
            </div>
          </div>
          <div className="item">
            <Icon name="pin" />
            <div>
              <small>الاستلام</small>
              <b>{site.pickup} (بالاتفاق على واتساب)</b>
            </div>
          </div>
          <div className="item">
            <Icon name="truck" />
            <div>
              <small>التوصيل</small>
              <b>متاح لجميع المحافظات</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
