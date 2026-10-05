// Arabic SEO copy for every product page: title, meta description, long description, image alt text.
// The long description is built from: a product-specific opening + who it suits (per style)
// + material and details (per style) + the key feature (per style) + a styling tip (per product)
// + sizes + a closing call to order.
import { site } from "./site";
import { products, priceOf, type Product, type StyleId } from "./products";

interface PerProduct {
  /** Short benefit used in the <title>: "حزام [الاسم] — [feature] | Vicuna". */
  feature: string;
  /** Opening sentence of the description. */
  hook: string;
  /** Styling tip specific to the colour. */
  wear: string;
}

const perStyle: Record<StyleId, { who: string; material: string; key: string; meta: string }> = {
  lace: {
    who: "مناسب لفساتين السواريه والخطوبة والفرح، ولخروجات بالليل، وكمان على فستان كاجوال لو عايزة لمسة ناعمة.",
    material: "الدانتيل مشغول على بطانة من جلد PU مستورد من أنضف الأنواع، فبيفضل محافظ على شكله ومش بيتكرمش، وأطرافه مقفولة بعناية من غير خيوط سايبة.",
    key: "بيتربط بشريط جلد رفيع فيونكة صغيرة في النص أو على جنب، وبيحدد الوسط من غير ما يضغط عليكي.",
    meta: "دانتيل على بطانة جلد",
  },
  "wide-bow": {
    who: "مناسب للخروجات والعزومات والشغل، وبيقلب أي فستان سادة أو بلوزة وجيبة لطقم مميز.",
    material: "مصنوع من جلد PU مستورد فيه ليكرا طرية، فبيتشكّل على الخصر ويلف الوسط بشكل مظبوط، وعريض من قدّام وطري كفاية إن الفيونكة تقف بشكلها.",
    key: "الميزة الأساسية الفيونكة الكبيرة اللي بتتربط قدّام وبتشد العين على الوسط، وتقدري تكبّريها أو تصغّريها أو تربطيها عقدة وتسيبي الطرف نازل على حسب ذوقك.",
    meta: "فيونكة عريضة جلد",
  },
  "thin-tie": {
    who: "مناسب لكل يوم: الشغل والجامعة والخروجات، على فستان أو قميص أو جاكيت أو حتى بالطو.",
    material: "حزام عريض من جلد PU مستورد فيه ليكرا طرية بتتشكّل على وسطك، وشريط رفيع بيلف حوالين الوسط، وخفيف جداً فمش هتحسي بيه طول اليوم.",
    key: "الكلاسيكي اللي بيمشي مع كل حاجة: لفّة واحدة وفيونكة صغيرة، وبيثبت مكانه من غير ما يتزحلق.",
    meta: "شريط رفيع",
  },
  croc: {
    who: "مناسب للشغل والخروجات والسهرات، وبيدّي أي لبس سادة شخصية وحضور.",
    material: "جلد PU مستورد بنقشة كروكو بارزة ودقيقة، ومعاه شريط رفيع للربط.",
    key: "النقشة هي النجمة هنا: لمسة جريئة وفخمة من غير ما تحتاجي أي إكسسوار تاني.",
    meta: "نقشة كروكو",
  },
  snake: {
    who: "مناسب للشغل والخروجات والسهرات، وبيدّي أي لبس سادة لمسة عصرية.",
    material: "جلد PU مستورد بنقشة ثعبان دقيقة، ومعاه شريط رفيع للربط.",
    key: "نقشة الثعبان بتلفت النظر وبتمشي مع الألوان السادة كلها من غير ما تحتاجي إكسسوار تاني.",
    meta: "نقشة ثعبان",
  },
  ruffle: {
    who: "مناسب للخروجات والعزومات والمناسبات، وبيليق جداً على الفساتين السادة والبلوزات الواسعة.",
    material: "جلد PU مستورد مكشكش من فوق ومن تحت، والكشكشة متخيطة بانتظام عشان تفضل واقفة بشكلها، ومعاه شريط للربط في النص.",
    key: "الكشكشة بتضيف حركة ونعومة للوسط، وبتخلي الفستان البسيط يبان كأنه متفصّل.",
    meta: "كشكشة جلد",
  },
};

const perProduct: Record<string, PerProduct> = {
  "lace-black": { feature: "لمسة سهرة للفستان الأسود", hook: "حزام الدانتيل الأسود هو الحتة اللي بتحوّل الفستان الأسود البسيط لطقم سهرة كامل.", wear: "جربيه على فستان أسود سادة أو أبيض عشان التباين، مع شنطة سودا صغيرة." },
  "lace-red": { feature: "دانتيل جريء للمناسبات", hook: "لو عايزة كل العيون عليكي، الدانتيل الأحمر هو اختيارك.", wear: "بيطلع حلو جداً على الأسود والأبيض والبيج، ومع جزمة حمرا يقفل اللوك." },
  "lace-white": { feature: "إطلالة ناعمة للخطوبة والصيف", hook: "دانتيل أبيض رقيق يدّي أي فستان إحساس ناعم وفاتح.", wear: "حلو على الفساتين الفاتحة والباستيل، وكمان على الأسود لو بتحبي التباين." },
  "lace-gold": { feature: "إطلالة ناعمة للفساتين السواريه", hook: "دانتيل بلون دهبي هادي، فخم من غير ما يبقى صارخ.", wear: "البسيه على فستان أسود أو كحلي أو أوف وايت، مع إكسسوارات دهبي." },
  "lace-caramel": { feature: "دانتيل دافي للخريف والشتا", hook: "لون الكراميل الدافي بيدّي الدانتيل طابع مختلف وعصري.", wear: "بيمشي مع البيج والبني والأخضر الزيتي، ومع بوت بني." },

  "bow-white": { feature: "فيونكة كبيرة تشد العين", hook: "فيونكة بيضا عريضة بتخلي الفستان السادة يبان كأنه طقم مختلف.", wear: "على فستان أسود أو كحلي أو أحمر بتبان جداً، أو على أبيض في أبيض للوك هادي." },
  "bow-silver": { feature: "فيونكة فضي للسهرات", hook: "لمعة فضي خفيفة في فيونكة عريضة، مناسبة لأي سهرة.", wear: "حلو على الأسود والرمادي والكحلي والأزرق، مع إكسسوارات فضي." },
  "bow-gold": { feature: "فيونكة دهبي فخمة", hook: "فيونكة دهبي عريضة تدّي الطقم لمسة فخامة على طول.", wear: "البسيها على أسود أو بيج أو أبيض، مع جزمة أو شنطة دهبي." },
  "bow-mustard": { feature: "لون مسطردة مبهج", hook: "لون المسطردة المبهج هيصحّي أي لبس سادة.", wear: "بيطلع تحفة على الأسود والكحلي والأبيض والجينز." },
  "bow-burgundy": { feature: "عنابي أنيق للشتا", hook: "عنابي غامق وأنيق، من الألوان اللي بتليق على كل البشرات.", wear: "حلو على الأسود والبيج والرمادي، وعلى فساتين الشتا التقيلة." },
  "bow-taupe": { feature: "بني فاتح يمشي مع كل حاجة", hook: "بني فاتح هادي في فيونكة عريضة، من أسهل الألوان في التنسيق.", wear: "يمشي مع الأبيض والبيج والأسود والأخضر، ومع ألوان الخريف كلها." },

  "sash-red": { feature: "عقدة بسيطة بلون جريء", hook: "حزام أحمر بطرف طويل: بسيط في الربط وجريء في اللون.", wear: "على فستان أسود أو أبيض أو جينز، ومع شنطة أو جزمة حمرا." },
  "sash-black": { feature: "الأسود الأساسي في كل دولاب", hook: "الحزام الأسود اللي كل دولاب محتاجه، بطرف طويل يدّي حركة للبس.", wear: "بيمشي مع كل الألوان تقريباً، وخصوصاً الأبيض والبيج والألوان الفاتحة." },
  "sash-blush": { feature: "بينك فاتح ناعم وهادي", hook: "بينك فاتح ناعم يدّي اللوك إحساس رقيق وأنثوي.", wear: "حلو على الأبيض والبيج والرمادي والأسود، وفي لوكات الصيف." },
  "sash-green": { feature: "لون واحد جريء يكلّم عنك", hook: "الأخضر الجريء ده بيخلي اللبس المحايد كله يتكلم.", wear: "خلي باقي اللبس أبيض أو بيج أو أسود، وسيبي الحزام هو اللي يلفت النظر." },
  "sash-cognac": { feature: "كونياك كلاسيكي دافي", hook: "لون الكونياك الكلاسيكي اللي عمره ما يقدم.", wear: "على الأبيض والأسود والجينز والأخضر الزيتي، ومع بوت أو شنطة بني." },
  "sash-brown": { feature: "بني غامق راقي وهادي", hook: "بني غامق راقي، بديل أنيق للأسود.", wear: "حلو على البيج والكريمي والأبيض والكاكي." },
  "twist-grey": { feature: "تصميم مجدول مختلف", hook: "حزام رمادي مجدول بتصميم مختلف عن أي حزام شفتيه.", wear: "على الأسود والأبيض والكحلي والوردي، ومع إكسسوارات فضي." },

  "classic-white": { feature: "الكلاسيكي اللي يمشي مع كله", hook: "حزام أبيض كلاسيكي بشريط رفيع، أساسي في كل دولاب.", wear: "على الأسود والكحلي والألوان الغامقة بيبان جداً، وعلى الجينز كمان." },
  "classic-red": { feature: "لمسة لون لكل يوم", hook: "لمسة أحمر بسيطة تفرق في اللبس اليومي.", wear: "على الأسود والأبيض والكحلي والجينز." },
  "classic-rose": { feature: "وردي غامق هادي وأنيق", hook: "وردي غامق هادي، شيك ومش صارخ.", wear: "حلو على البيج والرمادي والأبيض والأسود." },
  "classic-pink-suede": { feature: "بينك ناعم ورقيق", hook: "بينك ناعم ورقيق، ومريح جداً في اللبس.", wear: "على الأبيض والرمادي والكحلي، وفي لوكات الشتا الفاتحة." },
  "classic-mustard": { feature: "مسطردة مبهج لكل يوم", hook: "مسطردة مبهج يصحّي أي لبس سادة في ثانية.", wear: "على الأسود والكحلي والأبيض والجينز." },
  "classic-orange-suede": { feature: "برتقالي دافي وعصري", hook: "برتقالي دافي، لون مختلف وعصري.", wear: "بيمشي مع البني والبيج والكحلي والأبيض." },
  "classic-camel-suede": { feature: "كامل كلاسيكي", hook: "لون الكامل الكلاسيكي، من أسهل الألوان في التنسيق.", wear: "على الأبيض والأسود والأخضر والجينز، ومع بوت بني." },
  "classic-green": { feature: "أخضر زمردي فخم", hook: "أخضر زمردي غني، فخم وجريء في نفس الوقت.", wear: "على الأسود والأبيض والبيج، ومع إكسسوارات دهبي." },
  "classic-sky-blue": { feature: "لبني صيفي منعش", hook: "لبني منعش، لون الصيف في حزام.", wear: "على الأبيض والبيج والكحلي والجينز الفاتح." },
  "classic-royal-blue": { feature: "أزرق ملكي يلفت النظر", hook: "أزرق ملكي قوي يدّي اللوك حضور من غير مجهود.", wear: "على الأبيض والأسود والبيج والرمادي." },
  "classic-navy": { feature: "كحلي عملي للشغل", hook: "كحلي عملي وأنيق، بديل هادي للأسود في الشغل.", wear: "على الأبيض والبيج والرمادي والأحمر." },

  "croc-black": { feature: "نقشة كروكو فخمة", hook: "نقشة كروكو سودا فخمة تدّي أي طقم شخصية.", wear: "على الأبيض والبيج والأحمر والجمل، ومع جزمة أو شنطة سودا." },
  "croc-wine": { feature: "كروكو عنابي جريء", hook: "كروكو بلون عنابي غامق، جريء وراقي.", wear: "على الأسود والبيج والرمادي، وفي لوكات الشتا." },
  "croc-pink": { feature: "كروكو بينك عصري", hook: "كروكو بينك، المزيج بين الجرأة والنعومة.", wear: "على الأبيض والرمادي والأسود والجينز." },
  "croc-cognac": { feature: "كروكو كونياك كلاسيكي", hook: "كروكو كونياك كلاسيكي، فخم وسهل في التنسيق.", wear: "على الأبيض والأسود والأخضر الزيتي والجينز." },
  "snake-grey": { feature: "نقشة ثعبان عصرية", hook: "نقشة ثعبان رمادي عصرية، لمسة مختلفة لأي لوك.", wear: "على الأسود والأبيض والكحلي، ومع إكسسوارات فضي." },
  "snake-beige": { feature: "نقشة ثعبان بيج هادية", hook: "نقشة ثعبان بيج هادية، جريئة بس سهلة في التنسيق.", wear: "على الأسود والأبيض والبني والأخضر." },

  "ruffle-red": { feature: "كشكشة تضيف حركة للفستان", hook: "حزام أحمر مكشكش بيضيف حركة وأنوثة لأي فستان.", wear: "على الأسود والأبيض والبيج، ومع شنطة حمرا صغيرة." },
  "ruffle-black": { feature: "كشكشة سودا ناعمة", hook: "كشكشة سودا ناعمة تخلي الفستان البسيط يبان متفصّل.", wear: "على الأبيض والبيج والألوان الفاتحة، أو أسود في أسود." },
  "ruffle-brown": { feature: "كشكشة بني دافية", hook: "كشكشة بني دافية بلمسة ناعمة ومختلفة.", wear: "على الأبيض والبيج والكريمي والأخضر الزيتي." },
};

const care = "العناية بيه سهلة: امسحيه بقماشة مبلولة ميّة بس، وسيبيه ينشف بعيد عن الشمس، وخزّنيه مفرود أو ملفوف لفّة واسعة عشان يفضل بشكله. وكمان هدية لطيفة لصاحبتك أو أختك أو مامتك، لأنه مقاس واحد مناسب للكل ومش محتاجة تعرفي مقاسها.";

const sizes = `المقاس العادي عرض ${site.size.widthCm} سم وطول ${site.size.lengthCm} سم، وبيتلف ويتربط فبيلبس لحد وزن 90 كيلو، ولو محتاجة مقاس خاص اكتبيه في الملاحظات وإحنا نعمله. والشريط طويل كفاية إنك تلفيه مرتين حوالين الوسط لو حابة شكل أرفع.`;

export interface ProductSeo {
  title: string;
  meta: string;
  description: string[];
  /** Same paragraphs with internal links on the key phrases (Arabic pages). */
  descriptionHtml: string[];
  alt: string;
  altDetail: string;
}

/* Internal links inside the description: each target is linked once, on the first phrase found. */
const styleLinks: Record<StyleId, { href: string; phrases: string[] }> = {
  lace: { href: "/lace/", phrases: ["حزام الدانتيل", "الدانتيل", "دانتيل"] },
  "wide-bow": { href: "/wide-bow/", phrases: ["فيونكة عريضة", "الفيونكة الكبيرة", "فيونكة"] },
  "thin-tie": { href: "/thin-tie/", phrases: ["بشريط رفيع", "شريط رفيع", "الكلاسيكي"] },
  croc: { href: "/croc/", phrases: ["نقشة كروكو", "كروكو", "النقشة"] },
  snake: { href: "/snake/", phrases: ["نقشة ثعبان", "ثعبان", "النقشة"] },
  ruffle: { href: "/ruffle/", phrases: ["حزام أحمر مكشكش", "الكشكشة", "كشكشة", "مكشكش"] },
};
const commonLinks = [
  { href: "/blog/waist-belt-size-material-guide/", phrases: ["جلد PU مستورد", "المقاس العادي"] },
  { href: "/blog/evening-dress-belt/", phrases: ["فساتين السواريه", "السواريه", "السهرات", "سهرة"] },
];

const linkify = (paras: string[], p: Product) => {
  const targets = [styleLinks[p.style], ...commonLinks];
  const done = new Set<string>();
  const out = paras.map((text) => {
    let html = text;
    for (const t of targets) {
      if (done.has(t.href)) continue;
      const phrase = t.phrases.find((ph) => html.includes(ph));
      if (!phrase) continue;
      html = html.replace(phrase, `<a href="${t.href}">${phrase}</a>`);
      done.add(t.href);
    }
    return html;
  });
  // Styling ideas + the whole catalogue, at the end of the tip and the closing paragraphs.
  out[2] += ` ولو عايزة أفكار أكتر، اقري <a href="/blog/dress-belt-styling-ideas/">طرق تنسيق حزام الفستان لإطلالة أنيقة</a>.`;
  out[4] += ` أو شوفي <a href="/#shop">كل أحزمة الجلد والدانتيل</a> عندنا.`;
  return out;
};

export const productSeo = (p: Product): ProductSeo => {
  const pp = perProduct[p.id];
  const st = perStyle[p.style];
  const price = priceOf(p);
  const closing = `اطلبيه دلوقتي بـ${price} جنيه بس، والتوصيل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل، والدفع عند الاستلام أو InstaPay، ومعاكي ${site.returnDays} يوم استرجاع بفلوسك كاملة. ولو عندك أي سؤال، كلمينا على واتساب وهنرد عليكي على طول.`;
  // Longest variant that stays within 160 characters.
  const metas = [
    `حزام ${p.name} من Vicuna بـ${price} جنيه: ${pp.feature}. جلد PU مستورد، توصيل لكل مصر خلال ${site.deliveryDays} أيام، دفع عند الاستلام واسترجاع ${site.returnDays} يوم. اطلبي دلوقتي!`,
    `حزام ${p.name} من Vicuna بـ${price} جنيه: ${pp.feature}. جلد PU مستورد، توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام. اطلبي دلوقتي!`,
    `حزام ${p.name} من Vicuna بـ${price} جنيه: ${pp.feature}. توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام واسترجاع ${site.returnDays} يوم. اطلبي دلوقتي!`,
    `حزام ${p.name} من Vicuna بـ${price} جنيه: ${pp.feature}. توصيل لكل مصر خلال ${site.deliveryDays} أيام والدفع عند الاستلام. اطلبي دلوقتي!`,
    `حزام ${p.name} من Vicuna بـ${price} جنيه: ${pp.feature}. توصيل لكل مصر والدفع عند الاستلام. اطلبي دلوقتي!`,
  ];
  const meta = metas.find((m) => m.length <= 160) ?? metas[metas.length - 1];
  return {
    title: `حزام ${p.name} — ${pp.feature} | Vicuna`,
    meta,
    description: [pp.hook + " " + st.who, st.material + " " + st.key, pp.wear + " " + sizes, care, closing],
    descriptionHtml: linkify([pp.hook + " " + st.who, st.material + " " + st.key, pp.wear + " " + sizes, care, closing], p),
    alt: `حزام وسط نسائي ${p.name} من Vicuna، ${st.meta}`,
    altDetail: `تفاصيل عقدة حزام ${p.name} من Vicuna`,
  };
};

// Fail the build if any product is missing copy.
for (const p of products) if (!perProduct[p.id]) throw new Error(`Missing SEO copy for ${p.id}`);
