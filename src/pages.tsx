import type { ReactElement } from "react";
import { site, url } from "./data/site";
import { styles } from "./data/products";
import { Layout } from "./components/Layout";
import {
  Hero, EditorialIntro, Shop, EditorialBreak, TieSteps, Faq, InnerCircle, StyleHero, MoreStyles, Perks,
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
      overHero
      title={`${site.brand} | أحزمة خصر بالربط — توصيل لكل مصر`}
      description={`أحزمة خصر بالربط من جلد PU مستورد: دانتيل، فيونكة عريضة، شريط رفيع، كروكو، ثعبان وكشكشة. من 120 جنيه، توصيل خلال ${site.deliveryDays} أيام عمل، والدفع عند الاستلام.`}
    >
      <Hero />
      <Perks />
      <EditorialIntro />
      <Shop />
      <EditorialBreak />
      <MoreStyles />
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
      <Perks />
      <Shop only={s} title={`كل ألوان ${s.name}`} />
      <EditorialBreak />
      <MoreStyles except={s.id} />
      <Faq />
      <InnerCircle />
    </Layout>
  ),
}));

const policy = (slug: string, mod: { title: string; html: string }, description: string): Page => ({
  path: `${slug}/`,
  element: (
    <Layout path={`${slug}/`} title={`${mod.title} | ${site.brand}`} description={description}>
      <article className="mx-auto max-w-[1100px] px-5 pb-28 pt-[calc(34px+8rem)] sm:px-8">
        <a className="eyebrow text-stone hover:text-charcoal" href={url()}>→ الرجوع للمتجر</a>
        <h1 className="mt-8 font-ar text-[clamp(2.8rem,8vw,6rem)] leading-[1.1]" data-hero-line>{mod.title}</h1>
        <div className="eyebrow mt-4 text-stone">آخر تحديث: {site.updated}</div>
        <div className="prose-ar mt-10" dangerouslySetInnerHTML={{ __html: mod.html }} />
      </article>
    </Layout>
  ),
});

const notFound: Page = {
  path: "404.html",
  hidden: true,
  element: (
    <Layout path="" title={`الصفحة مش موجودة | ${site.brand}`} description="الصفحة اللي بتدوري عليها مش موجودة.">
      <section className="mx-auto flex min-h-[80svh] max-w-[900px] flex-col items-center justify-center px-5 pt-32 text-center">
        <div className="font-accent text-[clamp(5rem,18vw,12rem)] leading-none text-sienna">404</div>
        <h1 className="mt-6 font-ar text-[clamp(2rem,5vw,3.4rem)]">الصفحة دي مش موجودة</h1>
        <p className="mt-4 text-stone">يمكن الرابط اتغير. ارجعي للمتجر وشوفي كل الموديلات.</p>
        <a className="btn btn-dark mt-10" href={url()}>الرجوع للمتجر</a>
      </section>
    </Layout>
  ),
};

export const pages: Page[] = [
  home,
  ...stylePages,
  policy("returns", returns, `الشحن والاسترجاع في ${site.brand}: توصيل خلال ${site.deliveryDays} أيام عمل، واسترجاع الفلوس كاملة خلال ${site.returnDays} يوم.`),
  policy("privacy", privacy, `إزاي ${site.brand} بتجمع وتستخدم بياناتك، وإيه حقوقك.`),
  policy("terms", terms, `الشروط والأحكام الخاصة بالطلب من ${site.brand}.`),
  notFound,
];
