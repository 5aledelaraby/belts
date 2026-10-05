import { site, waLink } from "../data/site";

export const title = "من نحن";

export const html = `
<p><b>${site.brand}</b> براند مصري متخصص في <a href="/#shop">أحزمة الوسط النسائية بالربط</a>. بنصمم أحزمة بتتلف حوالين الوسط وتتربط فيونكة أو عقدة، من غير توكة ولا خرم، عشان حزام واحد يناسب كل المقاسات ويغير شكل أي فستان أو بلوزة.</p>

<h2>إيه اللي بنعمله</h2>
<p>عندنا 6 تصميمات، وكل تصميم بكذا لون:</p>
<ul>
<li><a href="/lace/">أحزمة الدانتيل</a>: دانتيل مشغول على بطانة جلد، للسهرات والمناسبات.</li>
<li><a href="/wide-bow/">الفيونكة العريضة</a>: فيونكة كبيرة قدّام أو عقدة بطرف طويل، بتشد العين على الوسط.</li>
<li><a href="/thin-tie/">الشريط الرفيع</a>: الكلاسيكي اللي يمشي مع كل حاجة.</li>
<li><a href="/croc/">الكروكو</a>: نقشة جريئة وفخمة تدّي اللبس شخصية.</li>
<li><a href="/snake/">الثعبان</a>: نقشة عصرية تلفت النظر.</li>
<li><a href="/ruffle/">الكشكشة</a>: حركة ونعومة لأي فستان سادة.</li>
</ul>

<h2>الخامة والمقاس</h2>
<p>الأحزمة معمولة من جلد PU مستورد عالي الجودة، والأحزمة السادة فيها ليكرا طرية بتتشكّل على الخصر، وفيه موديلات دانتيل ونقشات كروكو وثعبان. المقاس العادي عرض ${site.size.widthCm} سم وطول ${site.size.lengthCm} سم وبيلبس لحد وزن 90 كيلو، وبنعمل مقاسات خاصة حسب الطلب. لو عايزة تعرفي أكتر، اقري <a href="/blog/waist-belt-size-material-guide/">دليل المقاسات والخامات</a>.</p>

<h2>إزاي بنشتغل</h2>
<ul>
<li>بنوصّل لكل محافظات مصر خلال ${site.deliveryDays} أيام عمل.</li>
<li>الدفع عند الاستلام أو InstaPay.</li>
<li>استرجاع خلال ${site.returnDays} يوم بفلوسك كاملة. التفاصيل في <a href="/returns/">الشحن والاسترجاع</a>.</li>
<li>الطلب بيتأكد معاكي على واتساب، وبنرد على أي سؤال قبل وبعد الطلب.</li>
</ul>

<h2>بيانات الشركة</h2>
<p>${site.legalNameAr} (<span style="direction:ltr;unicode-bidi:isolate">${site.legalNameEn}</span>)، ${site.legalForm}، سجل تجاري رقم <span class="num">${site.commercialRegister}</span>.<br>المقر: ${site.headOffice}.</p>

<h2>تواصلي معانا</h2>
<p>واتساب: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("السلام عليكم، عندي استفسار")}" target="_blank" rel="noopener">كلمينا على واتساب</a><br>الإيميل: <a href="mailto:${site.email}" dir="ltr">${site.email}</a><br>وتابعي جديدنا على ${site.social.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join(" و")}.</p>
<p>وفي <a href="/blog/">مدونة Vicuna</a> هتلاقي نصايح لتنسيق الأحزمة واختيار الحزام المناسب ليكي.</p>
`;
