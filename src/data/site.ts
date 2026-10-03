// Store-wide settings. Change values here and rebuild — every page picks them up.

export const site = {
  brand: "Vicuna",
  tagline: "Belts & Accessories",
  legalNameAr: "فيكونا للتجارة العامة والتصميمات",
  legalNameEn: "Vicuna for General Trading & Designs",
  legalForm: "شركة ذات مسئولية محدودة",
  commercialRegister: "196463",
  headOffice: "21 شارع عباس العقاد، مدينة نصر، القاهرة",
  pickup: "جاردينيا سيتي، مدينة نصر",

  /** Public URL of the site. Change to "https://shopvicuna.com" (and base to "/") once the domain is connected. */
  url: "https://5aledelaraby.github.io",
  base: "/belts/",
  /** Set to the custom domain (e.g. "shopvicuna.com") to write a CNAME file into the build. */
  customDomain: "",

  whatsapp: {
    display: "01000860448",
    international: "201000860448",
  },

  currency: "جنيه",
  price: 200,
  shipping: {
    standard: 80,
    express: 120,
    freeOver: 1500,
  },
  returnDays: 14,
  refundDays: 7,

  /** Ad pixels — paste the IDs here when the ad accounts are ready. Empty = not loaded. */
  pixels: {
    tiktok: "",
    snapchat: "",
    meta: "",
  },

  updated: "4 أكتوبر 2026",
} as const;

export const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", "الشرقية", "الغربية",
  "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
  "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء",
];

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp.international}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Prefix a site-relative path with the deploy base. */
export const url = (path = "") => site.base + path.replace(/^\//, "");
