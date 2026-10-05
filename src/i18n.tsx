// Two languages: Arabic at the site root, English under /en/.
import { createContext, useContext } from "react";
import { url } from "./data/site";

export type Lang = "ar" | "en";
export const LANGS: Lang[] = ["ar", "en"];

export const LangCtx = createContext<Lang>("ar");
export const useLang = () => useContext(LangCtx);

/** Pick the Arabic or English string for the current page. */
export const useTr = () => {
  const lang = useLang();
  return (ar: string, en: string) => (lang === "en" ? en : ar);
};

/** Site-relative link in the current language. */
export const hrefFor = (lang: Lang, path = "") => url((lang === "en" ? "en/" : "") + path.replace(/^\//, ""));
export const useHref = () => {
  const lang = useLang();
  return (path = "") => hrefFor(lang, path);
};

/** Strings the browser script needs (toasts, cart, WhatsApp order message). */
export const clientStrings = {
  ar: {
    favAdded: "اتضاف للمفضلة 💗", bagAdded: "✅ اتحط في الشنطة — دوسي على أيقونة الشنطة فوق 👆", openBag: "افتحي الشنطة", free: "مجاني", currency: "جنيه",
    emptyTitle: "لسه ما اخترتيش حاجة 🛍", emptyHint: "ارجعي للموديلات، اضغطي على أي حزام يعجبك، وبعدين دوسي على «أضيفي للشنطة».", emptyCta: "شوفي الموديلات ✨",
    leftForFree: "فاضل {n} جنيه وتاخدي شحن مجاني", gotFree: "🎉 طلبك عليه شحن مجاني",
    inc: "زيادة", dec: "تقليل", needItem: "ضيفي حزام واحد على الأقل قبل ما تبعتي الطلب.", missing: "ناقص: ",
    fName: "الاسم", fPhone: "رقم الموبايل", fGov: "المحافظة", fAddr: "العنوان", sep: "، ",
    orderTitle: "طلب جديد من موقع Vicuna 🛍️", products: "المنتجات", shipping: "الشحن", express: "سريع", standard: "عادي",
    total: "الإجمالي", payment: "الدفع", payInsta: "InstaPay على {n} (هبعت صورة التحويل)", payCod: "عند الاستلام",
    name: "الاسم", phone: "الموبايل", gov: "المحافظة", addr: "العنوان", notes: "ملاحظات / مقاس",
    openingWa: "بنفتح واتساب برسالة الطلب، ابعتيها من هناك", beltAlt: "حزام", orderOne: "السلام عليكم، عايزة أطلب حزام {name} ({price} جنيه)",
    noFavs: "لسه ما ضفتيش حاجة للمفضلة ♡", orderNo: "رقم الطلب",
    disc: "خصم الأحزمة", offer1: "🎁 ضيفي حزام كمان وخدي خصم 25% عليه", offer2: "🔥 ضيفي التالت وخدي خصم 35% عليه", offer3: "🎉 خدتي أعلى خصم! ضيفي كمان وابدأي العرض من جديد",
    addedNext1: "✅ اتضاف! الحزام التاني عليه خصم 25% 🎁", addedNext2: "✅ اتضاف بخصم 25%! التالت عليه خصم 35% 🔥", addedNext3: "✅ اتضاف بخصم 35%! 🎉",
  },
  en: {
    favAdded: "Added to favourites 💗", bagAdded: "✅ Added to your bag — tap the bag icon above 👆", openBag: "Open bag", free: "Free", currency: "EGP",
    emptyTitle: "Nothing in your bag yet 🛍", emptyHint: "Go back to the belts, tap any one you like, then tap “Add to bag”.", emptyCta: "See the belts ✨",
    leftForFree: "{n} EGP more for free shipping", gotFree: "🎉 Your order ships free",
    inc: "Increase", dec: "Decrease", needItem: "Add at least one belt before sending your order.", missing: "Missing: ",
    fName: "name", fPhone: "mobile number", fGov: "governorate", fAddr: "address", sep: ", ",
    orderTitle: "New order from the Vicuna website 🛍️", products: "Items", shipping: "Shipping", express: "express", standard: "standard",
    total: "Total", payment: "Payment", payInsta: "InstaPay to {n} (I'll send the transfer screenshot)", payCod: "Cash on delivery",
    name: "Name", phone: "Mobile", gov: "Governorate", addr: "Address", notes: "Notes / size",
    openingWa: "Opening WhatsApp with your order — just tap send", beltAlt: "Belt", orderOne: "Hello, I'd like to order the {name} belt ({price} EGP)",
    noFavs: "No favourites yet ♡", orderNo: "Order no.",
    disc: "Multi-belt discount", offer1: "🎁 Add one more belt and get 25% off it", offer2: "🔥 Add a third and get 35% off it", offer3: "🎉 You've got the top discount! Add more to start the offer again",
    addedNext1: "✅ Added! Your 2nd belt is 25% off 🎁", addedNext2: "✅ Added at 25% off! The 3rd is 35% off 🔥", addedNext3: "✅ Added at 35% off! 🎉",
  },
} satisfies Record<Lang, Record<string, string>>;
export type ClientStrings = typeof clientStrings.ar;
