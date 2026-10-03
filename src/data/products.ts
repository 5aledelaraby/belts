// The catalogue. To add a belt: drop a square photo in src/assets/products/<id>.jpg and add one line below.
// Price comes from the style, so changing a style's price updates every belt in it.

export type StyleId = "lace" | "wide-bow" | "sash" | "thin-tie" | "croc-snake" | "ruffle";
export type ColorId = "black" | "white" | "red" | "pink" | "brown" | "gold" | "yellow" | "green" | "blue" | "grey";

export interface Style {
  id: StyleId;
  name: string;
  price: number;
  /** Landing-page copy, used at /<id>/ for ads. */
  headline: string;
  intro: string;
}

export interface Product {
  id: string;
  name: string;
  style: StyleId;
  color: ColorId;
  /** Swatch colour. */
  hex: string;
  texture: "smooth" | "suede" | "lace" | "croc" | "snake" | "ruffle";
}

export const styles: Style[] = [
  {
    id: "lace",
    name: "دانتيل",
    price: 300,
    headline: "حزام دانتيل بيحوّل أبسط فستان لطقم سهرة",
    intro: "دانتيل مشغول على بطانة جلد PU مستورد، وبيتربط بشريط رفيع. مناسب للخروجات والمناسبات، وبيرسم الوسط من غير ما يضايقك.",
  },
  {
    id: "wide-bow",
    name: "فيونكة عريضة",
    price: 200,
    headline: "فيونكة عريضة تلفت النظر لوسطك",
    intro: "جلد PU ناعم بيتلف حوالين الخصر ويتربط فيونكة كبيرة من قدّام. الحزام هنا هو نجم اللبس.",
  },
  {
    id: "sash",
    name: "طرف طويل",
    price: 200,
    headline: "عقدة بسيطة وطرف طويل نازل",
    intro: "حزام عريض بيتربط عقدة واحدة وطرفه نازل على الفستان. شكل هادي وأنيق، يمشي مع اللبس الكاجوال والرسمي.",
  },
  {
    id: "thin-tie",
    name: "شريط رفيع",
    price: 120,
    headline: "الحزام الكلاسيك اللي بيمشي مع كل حاجة",
    intro: "حزام عريض بشريط رفيع بيتلف حوالين الوسط ويتربط فيونكة صغيرة. جلد ناعم وشمواه بألوان كتير، يلبس مع الفستان والبلوزة والجاكيت.",
  },
  {
    id: "croc-snake",
    name: "كروكو وثعبان",
    price: 200,
    headline: "ملمس كروكو وثعبان يدّي اللبس شخصية",
    intro: "نقشة كروكو أو ثعبان على جلد PU مستورد، بشريط رفيع للربط. لمسة جريئة لأي لبس سادة.",
  },
  {
    id: "ruffle",
    name: "كشكشة",
    price: 200,
    headline: "كشكشة بتضيف حركة وأنوثة للبس",
    intro: "حزام بكشكشة من فوق وتحت وشريط بيتربط في النص. لمسة ناعمة ومختلفة لأي فستان سادة.",
  },
];

export const colors: Array<{ id: ColorId; name: string; hex: string }> = [
  { id: "black", name: "أسود", hex: "#1E1E22" },
  { id: "white", name: "أبيض", hex: "#F4F2EF" },
  { id: "red", name: "أحمر", hex: "#C8232B" },
  { id: "pink", name: "وردي", hex: "#E5B9BC" },
  { id: "brown", name: "بني", hex: "#8A5434" },
  { id: "gold", name: "دهبي وبيج", hex: "#D6C08F" },
  { id: "yellow", name: "أصفر وبرتقالي", hex: "#E7A12C" },
  { id: "green", name: "أخضر", hex: "#2E8B4E" },
  { id: "blue", name: "أزرق", hex: "#3062B0" },
  { id: "grey", name: "رمادي وفضي", hex: "#8A909A" },
];

export const products: Product[] = [
  { id: "lace-black", name: "دانتيل أسود", style: "lace", color: "black", hex: "#1E1E22", texture: "lace" },
  { id: "lace-red", name: "دانتيل أحمر", style: "lace", color: "red", hex: "#C8232B", texture: "lace" },
  { id: "lace-white", name: "دانتيل أبيض", style: "lace", color: "white", hex: "#F4F2EF", texture: "lace" },
  { id: "lace-gold", name: "دانتيل دهبي", style: "lace", color: "gold", hex: "#CDB98A", texture: "lace" },
  { id: "lace-caramel", name: "دانتيل كراميل", style: "lace", color: "brown", hex: "#A8652F", texture: "lace" },

  { id: "bow-white", name: "فيونكة أبيض", style: "wide-bow", color: "white", hex: "#F4F2EF", texture: "smooth" },
  { id: "bow-silver", name: "فيونكة فضي", style: "wide-bow", color: "grey", hex: "#C9D2DC", texture: "smooth" },
  { id: "bow-gold", name: "فيونكة دهبي", style: "wide-bow", color: "gold", hex: "#D8C18E", texture: "smooth" },
  { id: "bow-mustard", name: "فيونكة مسطردة", style: "wide-bow", color: "yellow", hex: "#E2A93A", texture: "smooth" },
  { id: "bow-burgundy", name: "فيونكة عنابي", style: "wide-bow", color: "red", hex: "#7E2632", texture: "smooth" },
  { id: "bow-taupe", name: "فيونكة بني فاتح", style: "wide-bow", color: "brown", hex: "#9A6B52", texture: "smooth" },

  { id: "sash-red", name: "طرف طويل أحمر", style: "sash", color: "red", hex: "#C33A40", texture: "smooth" },
  { id: "sash-black", name: "طرف طويل أسود", style: "sash", color: "black", hex: "#1E1E22", texture: "smooth" },
  { id: "sash-blush", name: "طرف طويل بينك فاتح", style: "sash", color: "pink", hex: "#EBC9C2", texture: "smooth" },
  { id: "sash-green", name: "طرف طويل أخضر", style: "sash", color: "green", hex: "#3E9B3A", texture: "smooth" },
  { id: "sash-cognac", name: "طرف طويل كونياك", style: "sash", color: "brown", hex: "#A8613F", texture: "smooth" },
  { id: "sash-brown", name: "طرف طويل بني غامق", style: "sash", color: "brown", hex: "#4A2E2B", texture: "smooth" },
  { id: "twist-grey", name: "مجدول رمادي", style: "sash", color: "grey", hex: "#7D8592", texture: "smooth" },

  { id: "classic-white", name: "شريط رفيع أبيض", style: "thin-tie", color: "white", hex: "#F4F2EF", texture: "smooth" },
  { id: "classic-red", name: "شريط رفيع أحمر", style: "thin-tie", color: "red", hex: "#C9252C", texture: "smooth" },
  { id: "classic-rose", name: "شريط رفيع وردي غامق", style: "thin-tie", color: "red", hex: "#9E4A55", texture: "smooth" },
  { id: "classic-pink-suede", name: "شريط رفيع بينك شمواه", style: "thin-tie", color: "pink", hex: "#E3C3C8", texture: "suede" },
  { id: "classic-mustard", name: "شريط رفيع مسطردة", style: "thin-tie", color: "yellow", hex: "#EBA92E", texture: "smooth" },
  { id: "classic-orange-suede", name: "شريط رفيع برتقالي شمواه", style: "thin-tie", color: "yellow", hex: "#D97A45", texture: "suede" },
  { id: "classic-camel-suede", name: "شريط رفيع كامل شمواه", style: "thin-tie", color: "brown", hex: "#A9653F", texture: "suede" },
  { id: "classic-green", name: "شريط رفيع أخضر زمردي", style: "thin-tie", color: "green", hex: "#1F8A5C", texture: "suede" },
  { id: "classic-sky-blue", name: "شريط رفيع لبني", style: "thin-tie", color: "blue", hex: "#5BC0DE", texture: "smooth" },
  { id: "classic-royal-blue", name: "شريط رفيع أزرق ملكي", style: "thin-tie", color: "blue", hex: "#2F55A8", texture: "smooth" },
  { id: "classic-navy", name: "شريط رفيع كحلي", style: "thin-tie", color: "blue", hex: "#24305E", texture: "smooth" },

  { id: "croc-black", name: "كروكو أسود", style: "croc-snake", color: "black", hex: "#1C1C1F", texture: "croc" },
  { id: "croc-wine", name: "كروكو عنابي", style: "croc-snake", color: "red", hex: "#5A2730", texture: "croc" },
  { id: "croc-pink", name: "كروكو بينك", style: "croc-snake", color: "pink", hex: "#D9A79F", texture: "croc" },
  { id: "croc-cognac", name: "كروكو كونياك", style: "croc-snake", color: "brown", hex: "#A8653C", texture: "croc" },
  { id: "snake-grey", name: "ثعبان رمادي", style: "croc-snake", color: "grey", hex: "#9EA3A8", texture: "snake" },
  { id: "snake-beige", name: "ثعبان بيج", style: "croc-snake", color: "gold", hex: "#C9A57C", texture: "snake" },

  { id: "ruffle-red", name: "كشكشة أحمر", style: "ruffle", color: "red", hex: "#D3262E", texture: "ruffle" },
  { id: "ruffle-black", name: "كشكشة أسود", style: "ruffle", color: "black", hex: "#1C1C1F", texture: "ruffle" },
  { id: "ruffle-brown", name: "كشكشة بني", style: "ruffle", color: "brown", hex: "#9A5236", texture: "ruffle" },
];

export const styleOf = (id: StyleId) => styles.find((s) => s.id === id)!;
export const priceOf = (p: Product) => styleOf(p.style).price;
export const textureName: Record<Product["texture"], string> = {
  smooth: "جلد PU مستورد ناعم",
  suede: "شمواه PU مستورد",
  lace: "دانتيل على بطانة جلد PU",
  croc: "جلد PU مستورد بنقشة كروكو",
  snake: "جلد PU مستورد بنقشة ثعبان",
  ruffle: "جلد PU مستورد بكشكشة",
};
