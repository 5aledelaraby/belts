import type { ReactElement } from "react";
import { site } from "./data/site";
import { styles, products, priceOf, productUrl, pName, sText, tName } from "./data/products";
import { ProductPage } from "./components/ProductPage";
import { Layout } from "./components/Layout";
import {
  Hero, Stories, Perks, Shop, ShopByStyle, Lookbook, TieSteps, HowToOrder, Faq, InnerCircle, StyleHero,
} from "./components/Sections";
import { productSeo } from "./data/seo-copy";
import { BlogIndex, BlogPost } from "./components/Blog";
import { posts } from "./blog";
import { articleSchema, breadcrumbSchema } from "./seo";
import { LangCtx, hrefFor, type Lang } from "./i18n";
import * as returnsAr from "./content/returns";
import * as privacyAr from "./content/privacy";
import * as termsAr from "./content/terms";
import * as returnsEn from "./content/returns.en";
import * as privacyEn from "./content/privacy.en";
import * as termsEn from "./content/terms.en";
import * as aboutAr from "./content/about";
import * as aboutEn from "./content/about.en";

export interface Page {
  /** Output path relative to the site root ("" = home). */
  path: string;
  element: ReactElement;
  /** Leave out of the sitemap (e.g. 404). */
  hidden?: boolean;
  /** Exists in one language only — no hreflang alternates in the sitemap. */
  single?: boolean;
}

/** The longest wording that fits Google's ~160-character snippet. */
const fit = (variants: string[]) => variants.find((v) => v.length <= 160) ?? variants[variants.length - 1];

const pagesFor = (lang: Lang): Page[] => {
  const en = lang === "en";
  const tr = (ar: string, e: string) => (en ? e : ar);
  const prefix = en ? "en/" : "";
  const wrap = (path: string, element: ReactElement, hidden?: boolean): Page => ({
    path: prefix + path,
    hidden,
    element: <LangCtx.Provider value={lang}>{element}</LangCtx.Provider>,
  });

  const home = wrap("", (
    <Layout
      path=""
     
      title={tr(`${site.brand} | أحزمة خصر بالربط — توصيل لكل مصر`, `${site.brand} | Tie waist belts — delivered across Egypt`)}
      description={tr(
        `أحزمة خصر بالربط من جلد PU مستورد: دانتيل، فيونكة عريضة، شريط رفيع، كروكو، ثعبان وكشكشة. من 120 جنيه، توصيل خلال ${site.deliveryDays} أيام عمل، والدفع عند الاستلام.`,
        `Tie waist belts in imported PU leather: lace, wide bow, thin tie, croc, snake and ruffle. From 120 EGP, delivered in ${site.deliveryDays} working days, cash on delivery.`,
      )}
    >
      <Hero />
      <Stories />
      <Perks />
      <Shop />
      <ShopByStyle />
      <Lookbook />
      <TieSteps />
      <HowToOrder />
      <Faq />
      <InnerCircle />
    </Layout>
  ));

  const stylePages = styles.map((s) => {
    const st = sText(s, lang);
    return wrap(`${s.id}/`, (
      <Layout path={`${s.id}/`}
        title={tr(`أحزمة ${st.name} — ${s.price} جنيه | ${site.brand}`, `${st.name} belts — ${s.price} EGP | ${site.brand}`)}
        description={(() => {
          const n = products.filter((p) => p.style === s.id).length;
          return fit(en ? [
            `${st.headline}. ${n} colours in imported PU leather at ${s.price} EGP, delivered across Egypt in ${site.deliveryDays} days. Cash on delivery, ${site.returnDays}-day returns.`,
            `${st.headline}. ${n} colours at ${s.price} EGP, delivered across Egypt in ${site.deliveryDays} days. Cash on delivery, ${site.returnDays}-day returns.`,
            `${st.headline}. ${n} colours at ${s.price} EGP, delivered across Egypt in ${site.deliveryDays} days. Cash on delivery.`,
          ] : [
            `${st.headline}. ${n} ألوان من جلد PU مستورد بـ${s.price} جنيه، توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام واسترجاع ${site.returnDays} يوم. اطلبي دلوقتي!`,
            `${st.headline}. ${n} ألوان من جلد PU مستورد بـ${s.price} جنيه، توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام واسترجاع ${site.returnDays} يوم.`,
            `${st.headline}. ${n} ألوان بـ${s.price} جنيه، توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام واسترجاع ${site.returnDays} يوم.`,
            `${st.headline}. ${n} ألوان بـ${s.price} جنيه، توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام.`,
          ]);
        })()}>
        <StyleHero s={s} />
        <Stories current={s.id} />
        <Shop only={s} title={tr(`كل ألوان ${st.name}`, `All ${st.name} colours`)} />
        <Perks />
        <Lookbook />
        <Faq />
        <InnerCircle />
      </Layout>
    ));
  });

  const productPages = products.map((p) => {
    const name = pName(p, lang);
    const st = sText(styles.find((s) => s.id === p.style)!, lang);
    return wrap(productUrl(p.id), (
      <Layout path={productUrl(p.id)}
        title={tr(productSeo(p).title, `${name} belt — ${priceOf(p)} EGP | ${site.brand}`)}
        description={tr(
          productSeo(p).meta,
          `${name} tie waist belt by Vicuna — ${st.name} design in ${tName(p, "en").toLowerCase()}. ${priceOf(p)} EGP, delivered across Egypt in ${site.deliveryDays} days. Order now!`,
        )}>
        <ProductPage p={p} />
        <Faq />
        <InnerCircle />
      </Layout>
    ));
  });

  const policy = (slug: string, mod: { title: string; html: string }, description: string, pageTitle = `${mod.title} | ${site.brand}`) =>
    wrap(`${slug}/`, (
      <Layout path={`${slug}/`} title={pageTitle} description={description}>
        <article className="mx-auto max-w-[1000px] px-4 pb-10 pt-8 sm:px-6">
          <a className="text-[14px] font-bold text-mauve hover:text-berry" href={hrefFor(lang)}>{tr("→ الرجوع للمتجر", "← Back to the shop")}</a>
          <div className="mt-5 rounded-[36px] bg-white p-6 shadow-[0_6px_0_rgba(181,71,106,.08)] sm:p-12">
            <h1 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-bold leading-tight">{mod.title}</h1>
            <div className="mt-2 text-[13px] font-semibold text-mauve">{tr("آخر تحديث:", "Last updated:")} {en ? site.updatedEn : site.updated}</div>
            <div className="prose-ar mt-6" dangerouslySetInnerHTML={{ __html: mod.html }} />
          </div>
        </article>
      </Layout>
    ));

  const list = [
    home,
    ...stylePages,
    ...productPages,
    en
      ? policy("about", aboutEn, `About ${site.brand}: an Egyptian brand of women's tie waist belts in imported PU leather and lace, delivered across Egypt with cash on delivery.`, `About ${site.brand} | Women's tie waist belts from Egypt`)
      : policy("about", aboutAr, `تعرفي على ${site.brand}: براند مصري لأحزمة الوسط النسائية بالربط من جلد PU مستورد ودانتيل، بتوصيل لكل مصر والدفع عند الاستلام واسترجاع ${site.returnDays} يوم.`, `من نحن | ${site.brand} — براند أحزمة خصر مصري`),
    en
      ? policy("returns", returnsEn, `Shipping and returns at ${site.brand}: delivery to every governorate in ${site.deliveryDays} working days, free shipping over ${site.shipping.freeOver} EGP, and ${site.returnDays}-day full refunds.`)
      : policy("returns", returnsAr, `الشحن والاسترجاع في ${site.brand}: توصيل لكل المحافظات خلال ${site.deliveryDays} أيام عمل، وشحن مجاني فوق ${site.shipping.freeOver} جنيه، واسترجاع فلوسك كاملة خلال ${site.returnDays} يوم.`),
    en
      ? policy("privacy", privacyEn, `How ${site.brand} collects, uses and protects your data when you order a belt — what we collect, who we share it with, and your rights over it.`)
      : policy("privacy", privacyAr, `سياسة الخصوصية في ${site.brand}: البيانات اللي بنجمعها لما تطلبي حزام، وبنستخدمها في إيه، ومين بنشاركها معاه، وإيه حقوقك عليها.`),
    en
      ? policy("terms", termsEn, `Terms and conditions for ordering from ${site.brand}: orders, prices and payment, products, returns and your rights under Egyptian consumer protection law.`)
      : policy("terms", termsAr, `الشروط والأحكام للطلب من ${site.brand}: الطلبات والأسعار والدفع والمنتجات والاسترجاع، وحقوقك في قانون حماية المستهلك المصري.`),
  ];

  if (!en) {
    // Blog (Arabic only)
    list.push({ ...wrap("blog/", (
      <Layout path="blog/" hasTwin={false}
        title={`مدونة ${site.brand} | نصايح لتنسيق أحزمة الوسط والفساتين`}
        description="مدونة Vicuna: نصايح وإلهام لتنسيق حزام الفستان، اختيار الحزام المناسب لجسمك، والمقاسات والخامات. اقرئي واختاري حزامك وتوصيل لكل مصر."
        schema={[breadcrumbSchema("ar", [["الرئيسية", ""], ["المدونة", "blog/"]])]}>
        <BlogIndex />
        <InnerCircle />
      </Layout>
    )), single: true });
    for (const post of posts()) {
      list.push({ ...wrap(`blog/${post.slug}/`, (
        <Layout path={`blog/${post.slug}/`} hasTwin={false} title={`${post.title} | ${site.brand}`} description={post.description}
          schema={[articleSchema(post), breadcrumbSchema("ar", [["الرئيسية", ""], ["المدونة", "blog/"], [post.title, `blog/${post.slug}/`]])]}>
          <BlogPost p={post} />
          <InnerCircle />
        </Layout>
      )), single: true });
    }

    list.push(wrap("404.html", (
      <Layout path="404.html" title={`الصفحة مش موجودة | ${site.brand}`} description="الصفحة اللي بتدوري عليها مش موجودة.">
        <section className="mx-auto flex min-h-[70svh] max-w-[900px] flex-col items-center justify-center px-5 text-center">
          <div className="font-display text-[clamp(5rem,18vw,10rem)] font-bold leading-none text-berry">404</div>
          <h1 className="mt-4 text-[clamp(1.8rem,5vw,3rem)] font-black">الصفحة دي مش موجودة 🥲</h1>
          <p className="mt-3 text-mauve">يمكن الرابط اتغير. ارجعي للمتجر وشوفي كل الموديلات.</p>
          <p className="mt-1 text-mauve" dir="ltr" lang="en">This page doesn’t exist.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a className="btn btn-berry" href={hrefFor("ar")}>الرجوع للمتجر</a>
            <a className="btn btn-white" href={hrefFor("en")} lang="en">English shop</a>
          </div>
        </section>
      </Layout>
    ), true));
  }
  return list;
};

export const pages: Page[] = [...pagesFor("ar"), ...pagesFor("en")];
