// Structured data (JSON-LD) for every page: Organization on the home page,
// BreadcrumbList on inner pages, Product on product pages.
import { site } from "./data/site";
import { products, styles, priceOf, productUrl, pName, sText, tName } from "./data/products";
import { img } from "./lib/images";
import { productSeo } from "./data/seo-copy";
import type { Post } from "./blog";
import { faqItems } from "./data/faq";
import { hrefFor, type Lang } from "./i18n";

const abs = (p: string) => (p.startsWith("http") ? p : site.url + p);

export const keywords = {
  ar: "حزام فستان, حزام وسط نسائي, أحزمة خصر, حزام دانتيل, حزام جلد, حزام فيونكة, شراء حزام أونلاين مصر, Vicuna, فيكونا",
  en: "waist belt, dress belt, women's belt Egypt, lace belt, leather belt, bow belt, tie belt, buy belts online Egypt, Vicuna",
};

const organization = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#org`,
  name: site.brand,
  alternateName: site.brandAr,
  legalName: site.legalNameEn,
  url: abs(hrefFor(lang)),
  logo: abs(hrefFor("ar", "assets/logo.png")),
  description: lang === "en"
    ? "An Egyptian store specialising in women's tie waist belts in exclusive designs."
    : "متجر متخصص في أحزمة الوسط النسائية بتصاميم حصرية",
  address: { "@type": "PostalAddress", streetAddress: site.headOfficeEn, addressLocality: "Cairo", addressCountry: "EG" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+" + site.whatsapp.international,
    contactType: "customer service",
    areaServed: "EG",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: site.social.map((s) => s.href),
});

const website = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.brand,
  url: abs(hrefFor(lang)),
  inLanguage: lang,
  publisher: { "@id": `${site.url}/#org` },
});

export const breadcrumbSchema = (lang: Lang, trail: Array<[string, string]>) => breadcrumb(lang, trail);

const breadcrumb = (lang: Lang, trail: Array<[string, string]>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: abs(hrefFor(lang, path)),
  })),
});

const product = (lang: Lang, id: string) => {
  const p = products.find((q) => q.id === id)!;
  const st = sText(styles.find((s) => s.id === p.style)!, lang);
  const name = pName(p, lang);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: lang === "en" ? `${name} belt` : `حزام ${name}`,
    image: [abs(img(p.id).large), abs(img(`${p.id}-detail`).large)],
    description: lang === "en" ? `${st.intro} ${tName(p, lang)}.` : productSeo(p).description.join(" "),
    sku: `VIC-${p.id.toUpperCase()}`,
    url: abs(hrefFor(lang, productUrl(p.id))),
    color: name,
    material: tName(p, lang),
    category: lang === "en" ? "Women's waist belts" : "أحزمة وسط نسائية",
    brand: { "@type": "Brand", name: site.brand },
    offers: {
      "@type": "Offer",
      url: abs(hrefFor(lang, productUrl(p.id))),
      priceCurrency: "EGP",
      // Prices aren't time-limited; the date moves forward on every build so it never looks expired.
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      price: String(priceOf(p)),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.brand },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: String(site.shipping.standard), currency: "EGP" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "EG" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: site.deliveryDays, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "EG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: site.returnDays,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  };
};

/** FAQPage: built from the same text the FAQ section shows (src/data/faq.ts). */
const faqPage = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: lang,
  mainEntity: faqItems(lang).map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

/** ItemList of product pages, in the order they appear on the page. */
const itemList = (lang: Lang, ids: string[], name: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: ids.length,
  itemListElement: ids.map((id, i) => ({ "@type": "ListItem", position: i + 1, url: abs(hrefFor(lang, productUrl(id))) })),
});

/** All JSON-LD blocks for a page, given its language-neutral path. */
export const schemaFor = (lang: Lang, path: string, title: string): object[] => {
  const home: [string, string] = [lang === "en" ? "Home" : "الرئيسية", ""];
  if (path === "") return [organization(lang), website(lang), itemList(lang, products.map((p) => p.id), lang === "en" ? "Women's waist belts by Vicuna" : "أحزمة خصر نسائية من Vicuna"), faqPage(lang)];
  if (path.endsWith(".html")) return [];
  const style = styles.find((s) => path === `${s.id}/`);
  if (style) {
    const name = sText(style, lang).name;
    return [
      breadcrumb(lang, [home, [name, path]]),
      itemList(lang, products.filter((p) => p.style === style.id).map((p) => p.id), lang === "en" ? `${name} belts` : `أحزمة ${name}`),
      faqPage(lang),
    ];
  }
  const m = path.match(/^p\/([^/]+)\/$/);
  if (m) {
    const p = products.find((q) => q.id === m[1])!;
    const s = styles.find((x) => x.id === p.style)!;
    return [
      product(lang, p.id),
      breadcrumb(lang, [home, [sText(s, lang).name, `${s.id}/`], [pName(p, lang), path]]),
      faqPage(lang),
    ];
  }
  return [breadcrumb(lang, [home, [title.split(" | ")[0], path]])];
};

export const articleSchema = (p: Post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: p.title,
  description: p.description,
  image: [abs(img(p.cover).large)],
  datePublished: p.date,
  dateModified: p.date,
  inLanguage: "ar",
  wordCount: p.words,
  keywords: p.keyword,
  mainEntityOfPage: { "@type": "WebPage", "@id": abs(hrefFor("ar", `blog/${p.slug}/`)) },
  author: { "@type": "Organization", name: site.brand, url: abs(hrefFor("ar")) },
  publisher: { "@type": "Organization", name: site.brand, logo: { "@type": "ImageObject", url: abs(hrefFor("ar", "assets/logo.png")) } },
});
