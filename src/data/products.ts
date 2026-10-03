// The catalogue. To add a belt: drop a photo in src/assets/products/<id>.jpg and add one line here.

export type CategoryId = "lace" | "wide-tie" | "classic" | "ruffle";

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Swatch colour shown next to the name. */
  color: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  /** Landing-page copy, used at /<id>/ for ads. */
  headline: string;
  intro: string;
}

export const categories: Category[] = [
  {
    id: "lace",
    name: "دانتيل",
    headline: "حزام دانتيل بيحوّل أبسط فستان لطقم سهرة",
    intro: "دانتيل مشغول على جلد ناعم، وبيتربط بشريط رفيع. ينفع للخروجات والمناسبات، وبيدّي الوسط شكل مرسوم من غير ما يضايقك.",
  },
  {
    id: "wide-tie",
    name: "ربطة عريضة",
    headline: "فيونكة عريضة تلفت النظر لوسطك",
    intro: "جلد ناعم عريض بيتلف ويتربط فيونكة كبيرة أو بطرف طويل نازل. الحزام ده بيبقى هو نجم اللبس.",
  },
  {
    id: "classic",
    name: "شريط رفيع",
    headline: "الحزام الكلاسيك اللي بيمشي مع كل حاجة",
    intro: "حزام عريض بشريط رفيع بيتلف حوالين الوسط. جلد وشمواه وكروكو بألوان كتير، يلبس مع الفستان والبلوزة والجاكيت.",
  },
  {
    id: "ruffle",
    name: "كشكشة",
    headline: "كشكشة بتضيف حركة وأنوثة للبس",
    intro: "حزام بكشكشة من فوق وتحت وشريط بيتربط في النص. لمسة ناعمة ومختلفة لأي فستان سادة.",
  },
];

export const products: Product[] = [
  { id: "lace-black", name: "دانتيل أسود", category: "lace", color: "#1E1E22" },
  { id: "lace-red", name: "دانتيل أحمر", category: "lace", color: "#C8232B" },
  { id: "lace-caramel", name: "دانتيل كراميل", category: "lace", color: "#A8652F" },
  { id: "lace-gold", name: "دانتيل دهبي", category: "lace", color: "#CDB98A" },

  { id: "bow-white", name: "أبيض بفيونكة عريضة", category: "wide-tie", color: "#F4F2EF" },
  { id: "bow-silver", name: "فضي بفيونكة عريضة", category: "wide-tie", color: "#C9D2DC" },
  { id: "bow-mustard", name: "مسطردة بفيونكة عريضة", category: "wide-tie", color: "#E2A93A" },
  { id: "bow-burgundy", name: "عنابي بفيونكة عريضة", category: "wide-tie", color: "#7E2632" },
  { id: "bow-gold", name: "دهبي بفيونكة عريضة", category: "wide-tie", color: "#D8C18E" },
  { id: "bow-taupe", name: "بني فاتح بفيونكة عريضة", category: "wide-tie", color: "#9A6B52" },
  { id: "sash-red", name: "أحمر بطرف طويل", category: "wide-tie", color: "#C33A40" },
  { id: "sash-cognac", name: "كونياك بطرف طويل", category: "wide-tie", color: "#A8613F" },
  { id: "sash-brown", name: "بني غامق بطرف طويل", category: "wide-tie", color: "#4A2E2B" },
  { id: "sash-blush", name: "بينك فاتح بطرف طويل", category: "wide-tie", color: "#EBC9C2" },
  { id: "twist-grey", name: "رمادي مجدول", category: "wide-tie", color: "#7D8592" },

  { id: "classic-white", name: "أبيض بشريط رفيع", category: "classic", color: "#F4F2EF" },
  { id: "classic-red", name: "أحمر بشريط رفيع", category: "classic", color: "#C9252C" },
  { id: "classic-rose", name: "وردي غامق بشريط رفيع", category: "classic", color: "#A9545E" },
  { id: "classic-mustard", name: "مسطردة بشريط رفيع", category: "classic", color: "#EBA92E" },
  { id: "classic-orange-suede", name: "برتقالي شمواه بشريط رفيع", category: "classic", color: "#D97A45" },
  { id: "classic-pink-suede", name: "بينك شمواه بشريط رفيع", category: "classic", color: "#E3C3C8" },
  { id: "classic-camel-suede", name: "كامل شمواه بشريط رفيع", category: "classic", color: "#A9653F" },
  { id: "classic-green", name: "أخضر بشريط رفيع", category: "classic", color: "#1F8A5C" },
  { id: "classic-royal-blue", name: "أزرق ملكي بشريط رفيع", category: "classic", color: "#2F55A8" },
  { id: "classic-wine-croc", name: "عنابي كروكو بشريط أسود", category: "classic", color: "#5A2730" },
  { id: "classic-pink-croc", name: "بينك كروكو بشريط أسود", category: "classic", color: "#D9A79F" },
  { id: "classic-black-croc", name: "أسود كروكو", category: "classic", color: "#1C1C1F" },

  { id: "ruffle-red", name: "كشكشة أحمر", category: "ruffle", color: "#D3262E" },
  { id: "ruffle-caramel", name: "كشكشة كراميل", category: "ruffle", color: "#A8603F" },
  { id: "ruffle-white", name: "كشكشة أبيض", category: "ruffle", color: "#F2F0EC" },
];

export const categoryName = (id: CategoryId) => categories.find((c) => c.id === id)!.name;
