import { site, waLink } from "../data/site";

export const title = "About us";

export const html = `
<p><b>${site.brand}</b> is an Egyptian brand specialising in <a href="/en/#shop">women's tie waist belts</a>. Our belts wrap around the waist and tie in a bow or a knot — no buckle, no holes — so one belt fits every size and changes the look of any dress or blouse.</p>

<h2>What we make</h2>
<p>Six designs, each in several colours:</p>
<ul>
<li><a href="/en/lace/">Lace belts</a> — lace worked over a leather lining, for evenings and occasions.</li>
<li><a href="/en/wide-bow/">Wide bow</a> — a big front bow or a knot with a long tail that draws the eye to the waist.</li>
<li><a href="/en/thin-tie/">Thin tie</a> — the classic that goes with everything.</li>
<li><a href="/en/croc/">Croc</a> — a bold, luxe texture that gives an outfit character.</li>
<li><a href="/en/snake/">Snake</a> — a modern print that turns heads.</li>
<li><a href="/en/ruffle/">Ruffle</a> — movement and softness for any plain dress.</li>
</ul>

<h2>Material and size</h2>
<p>Our belts are made of top-grade imported PU leather, and the plain belts have soft stretch that shapes to your waist. There are lace, croc and snake designs too. The standard size is ${site.size.widthCm} cm wide and ${site.size.lengthCm} cm long and fits up to 90 kg, and we make custom sizes to order.</p>

<h2>How we work</h2>
<ul>
<li>Delivery to every governorate in Egypt within ${site.deliveryDays} working days.</li>
<li>Cash on delivery or InstaPay.</li>
<li>${site.returnDays}-day returns with a full refund — see <a href="/en/returns/">Shipping & Returns</a>.</li>
<li>Every order is confirmed with you on WhatsApp, and we answer any question before and after you order.</li>
</ul>

<h2>Company details</h2>
<p>${site.legalNameEn} (<span lang="ar" style="unicode-bidi:isolate">${site.legalNameAr}</span>), ${site.legalFormEn}, Commercial Register No. <span class="num">${site.commercialRegister}</span>.<br>Head office: ${site.headOfficeEn}.</p>

<h2>Contact us</h2>
<p>WhatsApp: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("Hello, I have a question")}" target="_blank" rel="noopener">Message us on WhatsApp</a><br>Email: <a href="mailto:${site.email}" dir="ltr">${site.email}</a><br>Follow us on ${site.social.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.labelEn}</a>`).join(", ")}.</p>
`;
