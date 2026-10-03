// Store-wide settings. Change values here and rebuild — every page picks them up.

export const site = {
  brand: "Vicuna",
  brandAr: "فيكونا",
  tagline: "Belts & Accessories",
  legalNameAr: "فيكونا للتجارة العامة والتصميمات",
  legalNameEn: "Vicuna for General Trading & Designs",
  legalForm: "شركة ذات مسئولية محدودة",
  commercialRegister: "196463",
  headOffice: "21 شارع عباس العقاد، المنطقة الأولى، مدينة نصر، القاهرة 4450225",
  headOfficeEn: "21 Abbas El-Akkad, Al Manteqah Al Oula, Nasr City, Cairo 4450225, Egypt",
  pickup: "جاردينيا سيتي، مدينة نصر",

  /** Public URL of the site (no trailing slash) and the path it is served under. */
  url: "https://vicuna-eg.com",
  base: "/",
  /** Writes a CNAME file into the build so GitHub Pages serves the custom domain. */
  customDomain: "vicuna-eg.com",

  whatsapp: {
    display: "01221988192",
    international: "201221988192",
  },
  instapay: "01221988192",

  social: [
    { id: "tiktok", label: "تيك توك", handle: "@elaraby_khaled", href: "https://www.tiktok.com/@elaraby_khaled" },
    { id: "instagram", label: "إنستجرام", handle: "5aled.elaraby", href: "https://www.instagram.com/5aled.elaraby" },
    { id: "snapchat", label: "سناب شات", handle: "khaled-elaraby", href: "https://www.snapchat.com/add/khaled-elaraby" },
  ],

  currency: "جنيه",
  shipping: {
    standard: 80,
    express: 120,
    freeOver: 1500,
  },
  deliveryDays: 3,
  returnDays: 14,
  refundDays: 7,

  size: {
    widthCm: 14,
    lengthCm: 140,
  },

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
