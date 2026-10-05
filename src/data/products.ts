// The catalogue. To add a belt: drop a square photo in src/assets/products/<id>.jpg and add one line below.
// Price comes from the style, so changing a style's price updates every belt in it.

export type StyleId = "lace" | "wide-bow" | "thin-tie" | "croc" | "snake" | "ruffle";
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
  texture: "smooth" | "lace" | "croc" | "snake" | "ruffle";
  /** Shows a "جديد" badge. */
  isNew?: boolean;
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
    intro: "جلد PU بليكرا طري بيتلف حوالين الخصر ويتشكّل عليه، ويتربط فيونكة كبيرة من قدّام أو عقدة بطرف طويل نازل. الحزام هنا هو نجم اللبس.",
  },
  {
    id: "thin-tie",
    name: "شريط رفيع",
    price: 120,
    headline: "الحزام الكلاسيك اللي بيمشي مع كل حاجة",
    intro: "حزام عريض بشريط رفيع بيتلف حوالين الوسط ويتربط فيونكة صغيرة. جلد PU بليكرا طري بيتشكّل على وسطك، بألوان كتير، يلبس مع الفستان والبلوزة والجاكيت.",
  },
  {
    id: "croc",
    name: "كروكو",
    price: 200,
    headline: "ملمس كروكو يدّي اللبس شخصية",
    intro: "نقشة كروكو بارزة على جلد PU مستورد، بشريط رفيع للربط. لمسة جريئة وفخمة لأي لبس سادة.",
  },
  {
    id: "snake",
    name: "ثعبان",
    price: 200,
    headline: "نقشة ثعبان عصرية تلفت النظر",
    intro: "نقشة ثعبان على جلد PU مستورد، بشريط رفيع للربط. لمسة مختلفة وعصرية لأي لبس سادة.",
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

  { id: "sash-red", name: "فيونكة أحمر", style: "wide-bow", color: "red", hex: "#C33A40", texture: "smooth" },
  { id: "sash-black", name: "فيونكة أسود", style: "wide-bow", color: "black", hex: "#1E1E22", texture: "smooth" },
  { id: "sash-blush", name: "فيونكة بينك فاتح", style: "wide-bow", color: "pink", hex: "#EBC9C2", texture: "smooth" },
  { id: "sash-green", name: "فيونكة أخضر", style: "wide-bow", color: "green", hex: "#3E9B3A", texture: "smooth" },
  { id: "sash-cognac", name: "فيونكة كونياك", style: "wide-bow", color: "brown", hex: "#A8613F", texture: "smooth" },
  { id: "sash-brown", name: "فيونكة بني غامق", style: "wide-bow", color: "brown", hex: "#4A2E2B", texture: "smooth" },
  { id: "twist-grey", name: "فيونكة رمادي مجدول", style: "wide-bow", color: "grey", hex: "#7D8592", texture: "smooth" },

  { id: "classic-white", name: "شريط رفيع أبيض", style: "thin-tie", color: "white", hex: "#F4F2EF", texture: "smooth" },
  { id: "classic-red", name: "شريط رفيع أحمر", style: "thin-tie", color: "red", hex: "#C9252C", texture: "smooth" },
  { id: "classic-rose", name: "شريط رفيع وردي غامق", style: "thin-tie", color: "red", hex: "#9E4A55", texture: "smooth" },
  { id: "classic-pink-suede", name: "شريط رفيع بينك", style: "thin-tie", color: "pink", hex: "#E3C3C8", texture: "smooth" },
  { id: "classic-mustard", name: "شريط رفيع مسطردة", style: "thin-tie", color: "yellow", hex: "#EBA92E", texture: "smooth" },
  { id: "classic-orange-suede", name: "شريط رفيع برتقالي", style: "thin-tie", color: "yellow", hex: "#D97A45", texture: "smooth" },
  { id: "classic-camel-suede", name: "شريط رفيع كامل", style: "thin-tie", color: "brown", hex: "#A9653F", texture: "smooth" },
  { id: "classic-green", name: "شريط رفيع أخضر زمردي", style: "thin-tie", color: "green", hex: "#1F8A5C", texture: "smooth" },
  { id: "classic-sky-blue", name: "شريط رفيع لبني", style: "thin-tie", color: "blue", hex: "#5BC0DE", texture: "smooth" },
  { id: "classic-royal-blue", name: "شريط رفيع أزرق ملكي", style: "thin-tie", color: "blue", hex: "#2F55A8", texture: "smooth" },
  { id: "classic-navy", name: "شريط رفيع كحلي", style: "thin-tie", color: "blue", hex: "#24305E", texture: "smooth" },

  { id: "croc-black", name: "كروكو أسود", style: "croc", color: "black", hex: "#1C1C1F", texture: "croc" },
  { id: "croc-wine", name: "كروكو عنابي", style: "croc", color: "red", hex: "#5A2730", texture: "croc" },
  { id: "croc-pink", name: "كروكو بينك", style: "croc", color: "pink", hex: "#D9A79F", texture: "croc" },
  { id: "croc-cognac", name: "كروكو كونياك", style: "croc", color: "brown", hex: "#A8653C", texture: "croc" },
  { id: "snake-grey", name: "ثعبان رمادي", style: "snake", color: "grey", hex: "#9EA3A8", texture: "snake" },
  { id: "snake-beige", name: "ثعبان بيج", style: "snake", color: "gold", hex: "#C9A57C", texture: "snake" },

  { id: "ruffle-red", name: "كشكشة أحمر", style: "ruffle", color: "red", hex: "#D3262E", texture: "ruffle" },
  { id: "ruffle-black", name: "كشكشة أسود", style: "ruffle", color: "black", hex: "#1C1C1F", texture: "ruffle" },
  { id: "ruffle-brown", name: "كشكشة بني", style: "ruffle", color: "brown", hex: "#9A5236", texture: "ruffle" },
];

export const styleOf = (id: StyleId) => styles.find((s) => s.id === id)!;
export const priceOf = (p: Product) => styleOf(p.style).price;
export const textureName: Record<Product["texture"], string> = {
  smooth: "جلد PU مستورد بليكرا طري",
  lace: "دانتيل على بطانة جلد PU",
  croc: "جلد PU مستورد بنقشة كروكو",
  snake: "جلد PU مستورد بنقشة ثعبان",
  ruffle: "جلد PU مستورد بكشكشة",
};

/** Looks: a styled photo plus the belts worn in it. Used for "Shop the Look" and the editorial block. */
export interface Look {
  id: string;
  /** Image key from src/assets/site. */
  image: string;
  title: string;
  tip: string;
  products: string[];
}

export const looks: Look[] = [
  {
    id: "trio",
    image: "hero",
    title: "تلات أحزمة، تلات شخصيات",
    tip: "على فستان أبيض أو أسود سادة: الطرف الطويل يدّي إحساس هادي، والفيونكة العريضة بتلفت النظر، والكشكشة بتضيف حركة.",
    products: ["sash-cognac", "bow-white", "ruffle-black"],
  },
  {
    id: "green",
    image: "mood-green",
    title: "لون واحد جريء",
    tip: "خلي اللبس كله لون محايد، وسيبي الحزام الأخضر هو اللي يتكلم. اربطيه عقدة على جنب وسيبي الطرف نازل.",
    products: ["sash-green"],
  },
  {
    id: "lace",
    image: "mood-lace",
    title: "دانتيل للسهرة",
    tip: "حزام الدانتيل بيحوّل الفستان الأسود البسيط لطقم سهرة. اربطيه فيونكة صغيرة في النص.",
    products: ["lace-black"],
  },
];

export const productUrl = (id: string) => `p/${id}/`;
export const lookFor = (id: string) => looks.find((l) => l.products.includes(id)) ?? looks[0];

/* ---------- English copy (pages under /en/) ---------- */
type L = "ar" | "en";

const productEn: Record<string, string> = {
  "lace-black": "Black Lace", "lace-red": "Red Lace", "lace-white": "White Lace", "lace-gold": "Gold Lace", "lace-caramel": "Caramel Lace",
  "bow-white": "White Bow", "bow-silver": "Silver Bow", "bow-gold": "Gold Bow", "bow-mustard": "Mustard Bow", "bow-burgundy": "Burgundy Bow", "bow-taupe": "Taupe Bow",
  "sash-red": "Red Bow", "sash-black": "Black Bow", "sash-blush": "Blush Bow", "sash-green": "Green Bow",
  "sash-cognac": "Cognac Bow", "sash-brown": "Chocolate Bow", "twist-grey": "Grey Twist Bow",
  "classic-white": "White Thin Tie", "classic-red": "Red Thin Tie", "classic-rose": "Rosewood Thin Tie", "classic-pink-suede": "Pink Thin Tie",
  "classic-mustard": "Mustard Thin Tie", "classic-orange-suede": "Orange Thin Tie", "classic-camel-suede": "Camel Thin Tie",
  "classic-green": "Emerald Thin Tie", "classic-sky-blue": "Sky Blue Thin Tie", "classic-royal-blue": "Royal Blue Thin Tie", "classic-navy": "Navy Thin Tie",
  "croc-black": "Black Croc", "croc-wine": "Wine Croc", "croc-pink": "Pink Croc", "croc-cognac": "Cognac Croc",
  "snake-grey": "Grey Snake", "snake-beige": "Beige Snake",
  "ruffle-red": "Red Ruffle", "ruffle-black": "Black Ruffle", "ruffle-brown": "Brown Ruffle",
};

const styleEn: Record<StyleId, { name: string; headline: string; intro: string }> = {
  lace: { name: "Lace", headline: "A lace belt turns the simplest dress into an evening look", intro: "Lace worked over an imported PU leather lining, tied with a slim strap. Made for nights out and occasions — it defines the waist without squeezing." },
  "wide-bow": { name: "Wide Bow", headline: "A wide bow that draws every eye to your waist", intro: "Soft PU leather with stretch that wraps and shapes to the waist, tied in a big bow at the front or a knot with a long tail. Here the belt is the star of the outfit." },
  "thin-tie": { name: "Thin Tie", headline: "The classic belt that goes with everything", intro: "A wide belt with a slim strap that wraps the waist and ties into a small bow. Soft PU leather with stretch that shapes to your waist, in many colours — wear it with dresses, blouses and jackets." },
  croc: { name: "Croc", headline: "Croc texture that gives your outfit character", intro: "Croc embossing on imported PU leather, with a slim tie. A bold, luxe touch for any plain outfit." },
  snake: { name: "Snake", headline: "A modern snake print that turns heads", intro: "Snake print on imported PU leather, with a slim tie. A different, modern touch for any plain outfit." },
  ruffle: { name: "Ruffle", headline: "Ruffles that add movement and softness", intro: "A belt ruffled top and bottom with a strap that ties in the middle. A soft, different touch for any plain dress." },
};

const colorEn: Record<ColorId, string> = {
  black: "Black", white: "White", red: "Red", pink: "Pink", brown: "Brown", gold: "Gold & beige", yellow: "Yellow & orange", green: "Green", blue: "Blue", grey: "Grey & silver",
};

const textureEn: Record<Product["texture"], string> = {
  smooth: "Imported PU leather with soft stretch", lace: "Lace on a PU leather lining",
  croc: "Imported PU leather, croc embossed", snake: "Imported PU leather, snake print", ruffle: "Ruffled imported PU leather",
};

const lookEn: Record<string, { title: string; tip: string }> = {
  trio: { title: "Three belts, three moods", tip: "Over a plain white or black dress: the long sash feels calm, the wide bow turns heads, and the ruffle adds movement." },
  green: { title: "One bold colour", tip: "Keep the whole outfit neutral and let the green belt do the talking. Tie it in a side knot and let the tail fall." },
  lace: { title: "Lace for the evening", tip: "A lace belt turns a simple black dress into an evening look. Tie it in a small bow at the centre." },
};

export const pName = (p: Product, lang: L) => (lang === "en" ? productEn[p.id] ?? p.name : p.name);
export const sText = (s: Style, lang: L) => (lang === "en" ? styleEn[s.id] : { name: s.name, headline: s.headline, intro: s.intro });
export const sName = (id: StyleId, lang: L) => sText(styleOf(id), lang).name;
export const cName = (c: { id: ColorId; name: string }, lang: L) => (lang === "en" ? colorEn[c.id] : c.name);
export const tName = (p: Product, lang: L) => (lang === "en" ? textureEn[p.texture] : textureName[p.texture]);
export const lookText = (l: Look, lang: L) => (lang === "en" ? lookEn[l.id] : { title: l.title, tip: l.tip });
