import type { ReactElement } from "react";
import { site, url } from "./data/site";
import { styles, products, priceOf, styleOf, productUrl } from "./data/products";
import { ProductPage } from "./components/ProductPage";
import { Layout } from "./components/Layout";
import {
  Hero, Stories, Perks, Shop, Lookbook, TieSteps, Faq, InnerCircle, StyleHero,
} from "./components/Sections";
import * as returns from "./content/returns";
import * as privacy from "./content/privacy";
import * as terms from "./content/terms";

export interface Page {
  /** Output path relative to the site root ("" = home). */
  path: string;
  element: ReactElement;
  /** Leave out of the sitemap (e.g. 404). */
  hidden?: boolean;
}

const home: Page = {
  path: "",
  element: (
    <Layout
      path=""
      title={`${site.brand} | أحزمة خصر بالربط — توصيل لكل مصر`}
      description={`أحزمة خصر بالربط من جلد PU مستورد: دانتيل، فيونكة عريضة، شريط رفيع، كروكو، ثعبان وكشكشة. من 120 جنيه، توصيل خلال ${site.deliveryDays} أيام عمل، والدفع عند الاستلام.`}
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
  ),
};

const stylePages: Page[] = styles.map((s) => ({
  path: `${s.id}/`,
  element: (
    <Layout path={`${s.id}/`} title={`أحزمة ${s.name} — ${s.price} جنيه | ${site.brand}`} description={`${s.headline}. ${s.intro}`}>
      <StyleHero s={s} />
      <Stories current={s.id} />
      <Shop only={s} title={`كل ألوان ${s.name}`} />
      <Perks />
      <Lookbook />
      <Faq />
      <InnerCircle />
    </Layout>
  ),
}));

const productPages: Page[] = products.map((p) => ({
  path: productUrl(p.id),
  element: (
    <Layout path={productUrl(p.id)} title={`حزام ${p.name} — ${priceOf(p)} جنيه | ${site.brand}`}
      description={`حزام ${p.name} من تصميمات ${styleOf(p.style).name}. ${priceOf(p)} جنيه، توصيل خلال ${site.deliveryDays} أيام عمل، والدفع عند الاستلام.`}>
      <ProductPage p={p} />
      <Faq />
      <InnerCircle />
    </Layout>
  ),
}));

const policy = (slug: string, mod: { title: string; html: string }, description: string): Page => ({
  path: `${slug}/`,
  element: (
    <Layout path={`${slug}/`} title={`${mod.title} | ${site.brand}`} description={description}>
      <article className="mx-auto max-w-[1000px] px-4 pb-10 pt-8 sm:px-6">
        <a className="text-[14px] font-bold text-mauve hover:text-berry" href={url()}>→ الرجوع للمتجر</a>
        <div className="mt-5 rounded-[36px] bg-white p-6 shadow-[0_6px_0_rgba(181,71,106,.08)] sm:p-12">
          <h1 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-bold leading-tight">{mod.title}</h1>
          <div className="mt-2 text-[13px] font-semibold text-mauve">آخر تحديث: {site.updated}</div>
          <div className="prose-ar mt-6" dangerouslySetInnerHTML={{ __html: mod.html }} />
        </div>
      </article>
    </Layout>
  ),
});

const notFound: Page = {
  path: "404.html",
  hidden: true,
  element: (
    <Layout path="" title={`الصفحة مش موجودة | ${site.brand}`} description="الصفحة اللي بتدوري عليها مش موجودة.">
      <section className="mx-auto flex min-h-[70svh] max-w-[900px] flex-col items-center justify-center px-5 text-center">
        <div className="font-display text-[clamp(5rem,18vw,10rem)] font-bold leading-none text-berry">404</div>
        <h1 className="mt-4 text-[clamp(1.8rem,5vw,3rem)] font-black">الصفحة دي مش موجودة 🥲</h1>
        <p className="mt-3 text-mauve">يمكن الرابط اتغير. ارجعي للمتجر وشوفي كل الموديلات.</p>
        <a className="btn btn-berry mt-8" href={url()}>الرجوع للمتجر</a>
      </section>
    </Layout>
  ),
};

export const pages: Page[] = [
  home,
  ...stylePages,
  ...productPages,
  policy("returns", returns, `الشحن والاسترجاع في ${site.brand}: توصيل خلال ${site.deliveryDays} أيام عمل، واسترجاع الفلوس كاملة خلال ${site.returnDays} يوم.`),
  policy("privacy", privacy, `إزاي ${site.brand} بتجمع وتستخدم بياناتك، وإيه حقوقك.`),
  policy("terms", terms, `الشروط والأحكام الخاصة بالطلب من ${site.brand}.`),
  notFound,
];
