// FAQ shown on the home, collection and product pages. The FAQPage schema reads the same text,
// so what Google sees always matches the page word for word.
import { site } from "./site";

export const faqItems = (lang: "ar" | "en"): Array<[string, string]> =>
  lang === "en" ? [
    ["How do I order?", "Pick a belt and tap “+” or “Add to bag”, then open your bag, fill in your details and choose how to pay. WhatsApp opens with your full order — just send it and we will confirm right away."],
    ["How do I pay?", `Either cash on delivery to the courier, or an InstaPay transfer to ${site.instapay} — then send the screenshot on WhatsApp.`],
    ["How long does delivery take, and how much?", `We deliver to every governorate in Egypt within ${site.deliveryDays} working days. Standard shipping is ${site.shipping.standard} EGP, express is ${site.shipping.express} EGP, and standard shipping is free on orders from ${site.shipping.freeOver} EGP.`],
    ["Will it fit me?", `The belt is ${site.size.widthCm} cm wide and ${site.size.lengthCm} cm long, and it wraps and ties, so it fits every size. Need a custom size? Write it in the notes and we will make it.`],
    ["What is it made of?", "Top-grade imported PU leather — soft and light. There are also suede, lace, croc and snake designs."],
    ["What if I don’t like it?", `You have ${site.returnDays} days from delivery to return it for a full refund or exchange it. If it is faulty or we sent the wrong item, all shipping is on us.`],
  ] : [
    ["إزاي أطلب؟", "اختاري الموديل واضغطي «+» أو «أضيفي للشنطة»، وبعدين افتحي الشنطة واكتبي بياناتك واختاري طريقة الدفع. هيتفتح واتساب برسالة فيها الطلب كامل، ابعتيها ونأكد معاكي على طول."],
    ["الدفع إزاي؟", `يا إما الدفع عند الاستلام للمندوب، يا إما تحويل InstaPay على رقم ${site.instapay} وتبعتي صورة التحويل على واتساب.`],
    ["التوصيل بياخد قد إيه وبكام؟", `بنوصّل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل. الشحن العادي ${site.shipping.standard} جنيه، والسريع ${site.shipping.express} جنيه، والشحن العادي مجاني للطلبات من ${site.shipping.freeOver} جنيه.`],
    ["المقاس هيبقى مظبوط؟", `الحزام عرضه ${site.size.widthCm} سم وطوله ${site.size.lengthCm} سم، وبيتلف ويتربط فمناسب لكل الأوزان. ولو محتاجة مقاس خاص اكتبيه في الملاحظات وإحنا نعمله.`],
    ["الخامة إيه؟", "جلد PU مستورد من أنضف الأنواع، ناعم وخفيف. وفيه موديلات شمواه ودانتيل وكروكو وثعبان."],
    ["لو الحزام ما عجبنيش؟", `معاكي ${site.returnDays} يوم من الاستلام ترجّعيه وتاخدي فلوسك كاملة، أو تبدّليه. ولو فيه عيب أو وصلك غلط، الشحن كله علينا.`],
  ];
