// FAQ shown on the home, collection and product pages. The FAQPage schema reads the same text,
// so what Google sees always matches the page word for word.
import { site } from "./site";

export const faqItems = (lang: "ar" | "en"): Array<[string, string]> =>
  lang === "en" ? [
    ["How do I place an order on the site?", "1. Tap “Add to bag” under the belt you like 👜\n2. Tap the bag icon at the top 🛍️\n3. Write your name, number and address, then tap “Send order on WhatsApp” ✅\n\nWhatsApp opens with your order ready — just send it and we’ll call you to confirm. Or simply send us a photo of the belt on WhatsApp and we’ll take it from there 💬"],
    ["How do I pay?", `Either cash on delivery to the courier, or an InstaPay transfer to ${site.instapay} — then send the screenshot on WhatsApp.`],
    ["How long does delivery take, and how much?", `We deliver to every governorate in Egypt within ${site.deliveryDays} working days. Standard shipping is ${site.shipping.standard} EGP, express is ${site.shipping.express} EGP, and standard shipping is free on orders from ${site.shipping.freeOver} EGP.`],
    ["Will it fit me?", `The belt is ${site.size.widthCm} cm wide and ${site.size.lengthCm} cm long, and it wraps and ties, so it fits comfortably up to 90 kg. Need a custom size? Write it in the notes and we will make it.`],
    ["What is it made of?", "Top-grade imported PU leather — soft and light, and the plain belts have soft stretch that shapes to your waist. There are also lace, croc and snake designs."],
    ["Can I get a belt made to my size in natural leather?", "Yes. Alongside our PU belts, we make belts to measure in natural leather: choose the leather and colour, send your waist size and preferred width, and we'll confirm the price and send you a photo before shipping. Message us on WhatsApp to start."],
    ["What if I don’t like it?", `You have ${site.returnDays} days from delivery to return it for a full refund or exchange it. If it is faulty or we sent the wrong item, all shipping is on us.`],
  ] : [
    ["إزاي أعمل أوردر على الموقع؟", "1. دوسي «أضيفي للشنطة» تحت الحزام اللي عاجبك 👜\n2. دوسي على أيقونة الشنطة فوق 🛍️\n3. اكتبي اسمك ورقمك وعنوانك، ودوسي «إرسال الطلب على واتساب» ✅\n\nهيتفتح واتساب والطلب مكتوب جاهز، ابعتيه بس وإحنا هنكلمك نأكد معاكي. ولو حابة، ابعتيلنا صورة الحزام على واتساب على طول وإحنا نكمّل معاكي 💬"],
    ["الدفع إزاي؟", `يا إما الدفع عند الاستلام للمندوب، يا إما تحويل InstaPay على رقم ${site.instapay} وتبعتي صورة التحويل على واتساب.`],
    ["التوصيل بياخد قد إيه وبكام؟", `بنوصّل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل. الشحن العادي ${site.shipping.standard} جنيه، والسريع ${site.shipping.express} جنيه، والشحن العادي مجاني للطلبات من ${site.shipping.freeOver} جنيه.`],
    ["المقاس هيبقى مظبوط؟", `الحزام عرضه ${site.size.widthCm} سم وطوله ${site.size.lengthCm} سم، وبيتلف ويتربط فبيلبس مريح لحد وزن 90 كيلو. ولو محتاجة مقاس خاص اكتبيه في الملاحظات وإحنا نعمله.`],
    ["الخامة إيه؟", "جلد PU مستورد من أنضف الأنواع، ناعم وخفيف، والأحزمة السادة فيها ليكرا طرية بتتشكّل على وسطك. وفيه موديلات دانتيل وكروكو وثعبان."],
    ["ينفع أفصّل حزام جلد طبيعي على مقاسي؟", "أيوه. جنب أحزمة الـ PU، بنفصّل أحزمة جلد طبيعي على المقاس: اختاري الجلد واللون، وابعتيلنا مقاس وسطك والعرض اللي يريحك، وإحنا نقولك السعر ونبعتلك صورة الحزام قبل الشحن. ابعتيلنا على واتساب ونبدأ."],
    ["لو الحزام ما عجبنيش؟", `معاكي ${site.returnDays} يوم من الاستلام ترجّعيه وتاخدي فلوسك كاملة، أو تبدّليه. ولو فيه عيب أو وصلك غلط، الشحن كله علينا.`],
  ];
