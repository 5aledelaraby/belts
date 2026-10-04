import type { ReactElement } from "react";
import { site } from "./data/site";
import { styles, products, priceOf, productUrl, pName, sText } from "./data/products";
import { ProductPage } from "./components/ProductPage";
import { Layout } from "./components/Layout";
import {
  Hero, Stories, Perks, Shop, Lookbook, TieSteps, Faq, InnerCircle, StyleHero,
} from "./components/Sections";
import { productSeo } from "./data/seo-copy";
import { LangCtx, hrefFor, type Lang } from "./i18n";
import * as returnsAr from "./content/returns";
import * as privacyAr from "./content/privacy";
import * as termsAr from "./content/terms";
import * as returnsEn from "./content/returns.en";
import * as privacyEn from "./content/privacy.en";
import * as termsEn from "./content/terms.en";

export interface Page {
  /** Output path relative to the site root ("" = home). */
  path: string;
  element: ReactElement;
  /** Leave out of the sitemap (e.g. 404). */
  hidden?: boolean;
}

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
      <Lookbook />
      <TieSteps />
      <Faq />
      <InnerCircle />
    </Layout>
  ));

  const stylePages = styles.map((s) => {
    const st = sText(s, lang);
    return wrap(`${s.id}/`, (
      <Layout path={`${s.id}/`}
        title={tr(`أحزمة ${st.name} — ${s.price} جنيه | ${site.brand}`, `${st.name} belts — ${s.price} EGP | ${site.brand}`)}
        description={`${st.headline}. ${st.intro}`}>
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
          `The ${name} belt from our ${st.name} collection. ${priceOf(p)} EGP, delivered in ${site.deliveryDays} working days, cash on delivery.`,
        )}>
        <ProductPage p={p} />
        <Faq />
        <InnerCircle />
      </Layout>
    ));
  });

  const policy = (slug: string, mod: { title: string; html: string }, description: string) =>
    wrap(`${slug}/`, (
      <Layout path={`${slug}/`} title={`${mod.title} | ${site.brand}`} description={description}>
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
      ? policy("returns", returnsEn, `Shipping and returns at ${site.brand}: delivery in ${site.deliveryDays} working days and a full refund within ${site.returnDays} days.`)
      : policy("returns", returnsAr, `الشحن والاسترجاع في ${site.brand}: توصيل خلال ${site.deliveryDays} أيام عمل، واسترجاع الفلوس كاملة خلال ${site.returnDays} يوم.`),
    en
      ? policy("privacy", privacyEn, `How ${site.brand} collects and uses your data, and your rights.`)
      : policy("privacy", privacyAr, `إزاي ${site.brand} بتجمع وتستخدم بياناتك، وإيه حقوقك.`),
    en
      ? policy("terms", termsEn, `Terms and conditions for ordering from ${site.brand}.`)
      : policy("terms", termsAr, `الشروط والأحكام الخاصة بالطلب من ${site.brand}.`),
  ];

  if (!en) {
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
