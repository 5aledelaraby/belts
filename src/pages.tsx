import type { ReactElement } from "react";
import { site, url } from "./data/site";
import { categories } from "./data/products";
import { Layout } from "./components/Layout";
import {
  Hero, Perks, Shop, CategoryHero, CategoryGrid, MoreCategories, TieSteps, Mood, Faq, Contact,
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
      title={`${site.brand} | أحزمة خصر بـ ${site.price} جنيه`}
      description={`أحزمة خصر بالربط: دانتيل وجلد وشمواه وكروكو وكشكشة. كل الموديلات بـ ${site.price} جنيه، والتوصيل لجميع المحافظات، واسترجاع خلال ${site.returnDays} يوم.`}
    >
      <Hero />
      <Perks />
      <Shop />
      <TieSteps />
      <Mood />
      <Faq />
      <Contact />
    </Layout>
  ),
};

const categoryPages: Page[] = categories.map((cat) => ({
  path: `${cat.id}/`,
  element: (
    <Layout path={`${cat.id}/`} title={`أحزمة ${cat.name} | ${site.brand}`} description={cat.intro}>
      <CategoryHero cat={cat} />
      <CategoryGrid cat={cat} />
      <Perks />
      <TieSteps />
      <Faq />
      <MoreCategories except={cat.id} />
      <Contact />
    </Layout>
  ),
}));

const policy = (slug: string, mod: { title: string; html: string }, description: string): Page => ({
  path: `${slug}/`,
  element: (
    <Layout path={`${slug}/`} title={`${mod.title} | ${site.brand}`} description={description}>
      <div className="wrap doc">
        <a className="back" href={url()}>→ الرجوع للمتجر</a>
        <h1>{mod.title}</h1>
        <div className="updated">آخر تحديث: {site.updated}</div>
        <div dangerouslySetInnerHTML={{ __html: mod.html }} />
      </div>
    </Layout>
  ),
});

const notFound: Page = {
  path: "404.html",
  hidden: true,
  element: (
    <Layout path="" title={`الصفحة مش موجودة | ${site.brand}`} description="الصفحة اللي بتدوري عليها مش موجودة.">
      <div className="wrap doc" style={{ textAlign: "center" }}>
        <h1>الصفحة دي مش موجودة</h1>
        <p style={{ marginInline: "auto" }}>يمكن الرابط اتغير. ارجعي للمتجر وشوفي كل الموديلات.</p>
        <a className="btn btn-main" href={url()}>الرجوع للمتجر</a>
      </div>
    </Layout>
  ),
};

export const pages: Page[] = [
  home,
  ...categoryPages,
  policy("returns", returns, `مصاريف الشحن وسياسة الاسترجاع في ${site.brand}: استرجاع الفلوس كاملة خلال ${site.returnDays} يوم.`),
  policy("privacy", privacy, `إزاي ${site.brand} بتجمع وتستخدم بياناتك.`),
  policy("terms", terms, `الشروط والأحكام الخاصة بالطلب من ${site.brand}.`),
  notFound,
];
