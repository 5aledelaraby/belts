import { site, waLink } from "../data/site";
import { hrefFor } from "../i18n";

const url = (p: string) => hrefFor("en", p);

export const title = "Terms & Conditions";

export const html = `
<p>This site belongs to <b>${site.legalNameEn}</b> (<span lang="ar" style="unicode-bidi:isolate">${site.legalNameAr}</span>), a ${site.legalFormEn.toLowerCase()} registered in the Commercial Register under No. <span class="num">${site.commercialRegister}</span>, with its head office at ${site.headOfficeEn}. “We” on this page means ${site.brand}. By using the site or ordering from it, you agree to these terms.</p>
<p>These terms are a translation of the Arabic version. If the two differ, the Arabic version applies, unless the English wording is more favourable to you.</p>

<h2>1. Using the site</h2>
<ul>
<li>By using the site you confirm that you are of legal age, or that your parent or guardian agrees.</li>
<li>You may not use the site or our products for any unlawful purpose.</li>
<li>You may not copy, sell or exploit any part of the site or its content without our written permission.</li>
</ul>

<h2>2. Orders</h2>
<ul>
<li>Your order is confirmed when we reply on WhatsApp confirming your details, the total and the payment method.</li>
<li>If a belt sells out after you order it, we tell you straight away; you can choose an alternative or cancel at no cost, and we refund anything you paid.</li>
<li>You can cancel at no cost at any time before shipping.</li>
<li>We may decline an order if the details are incomplete or incorrect after we try to reach you, or if the quantities are clearly for resale.</li>
</ul>

<h2>3. Prices and payment</h2>
<ul>
<li>Prices are in Egyptian pounds (EGP) and shown next to each belt.</li>
<li>You pay the price confirmed for your order, even if the price changes afterwards.</li>
<li>Shipping costs are shown on the <a href="${url("returns/")}">Shipping & Returns</a> page and included in the total before you send your order.</li>
<li>Payment methods: cash on delivery, or InstaPay to <span class="num">${site.instapay}</span>.</li>
<li>If there is a mistake in a price or description on the site, we'll tell you before shipping, and you can continue at the correct price or cancel at no cost.</li>
</ul>

<h2>4. Products</h2>
<ul>
<li>Our belts are made of imported PU leather or lace depending on the design; the material is listed on each product. Natural leather belts are made to measure only, ordered on WhatsApp, available in Cairo and Giza only, with the price and size confirmed with you before we start. Because they are made to your size, they can only be returned if faulty or not made to the agreed size.</li>
<li>Standard size: ${site.size.widthCm} cm wide and ${site.size.lengthCm} cm long, fitting every size. Custom sizes are made to order.</li>
<li>We show colours and details as accurately as we can, but colours can vary slightly between screens.</li>
<li>If a product isn't what you expected for any reason, you can return or exchange it under our <a href="${url("returns/")}">returns policy</a>.</li>
</ul>

<h2 id="offers">5. Offers and the birthday gift</h2>
<p><b>Multi-belt offer (2nd belt 25% off, 3rd belt 35% off):</b></p>
<ul>
<li>The discount is applied automatically in your bag: in every three belts in the same order, the second is 25% off and the third 35% off, always on the lower-priced belts.</li>
<li>The discount applies to belt prices only, not to shipping. Free shipping is worked out on the amount after the discount.</li>
<li>If you return part of a discounted order, the discount is recalculated on the belts you keep, and we refund the difference between what you paid and the recalculated amount.</li>
<li>The offer can't be combined with any other offer or discount code unless we say so.</li>
</ul>
<p><b>Birthday gift:</b></p>
<ul>
<li>Message us on WhatsApp on your birthday and we'll send you a gift belt chosen by us from the designs available at the time.</li>
<li>One gift per person per year, and per mobile number and delivery address.</li>
<li>We may ask for simple proof of your date of birth, such as a photo of your ID with everything hidden except your name and date of birth.</li>
<li>Shipping for the gift is on you, unless it is sent with another order of yours in the same shipment.</li>
<li>The gift can't be exchanged for cash and can't be returned or exchanged unless it arrives faulty.</li>
</ul>
<p><b>For all offers:</b> offers and gifts are available while stocks last. We may change or end any offer at any time; orders confirmed before a change keep the terms that applied when they were placed. If we see unfair use — such as fake orders or more than one gift for the same person under different names or numbers — we may cancel the discount or the gift.</p>

<h2>6. Accurate details</h2>
<p>We need correct and complete delivery details to reach you. If there's a delay because of incorrect details, we'll contact you and try to sort it out.</p>

<h2>7. Links and other sites</h2>
<p>The site links to WhatsApp and our social media accounts. These platforms are independent of us and have their own terms and policies.</p>

<h2>8. Prohibited uses</h2>
<p>You may not use the site for any unlawful purpose; to infringe our or anyone else's intellectual property; to abuse or harass anyone; to submit false or misleading information; to upload malicious code; to collect other people's data; or to try to disrupt the site or get around its security.</p>

<h2>9. Intellectual property</h2>
<p>Product photos, designs, the logo and the content on this site belong to ${site.brand} and may not be copied or used commercially without written permission.</p>

<h2>10. Limitation of liability</h2>
<p>We do everything we can to keep the site running without errors, but we can't guarantee it will always be available. Our liability for any order is limited to the value of that order — without reducing any of your rights under the law.</p>

<h2>11. Consumer protection</h2>
<p>These terms do not reduce any of your rights under Egyptian Consumer Protection Law No. 181 of 2018. If there is any conflict, the law applies, in the way that is most favourable to you.</p>

<h2>12. Severability</h2>
<p>If any clause in these terms is found unlawful or unenforceable, the remaining clauses stay in force.</p>

<h2>13. Governing law</h2>
<p>These terms are governed by Egyptian law, and the competent courts are those of Cairo.</p>

<h2>14. Changes to these terms</h2>
<p>We may update these terms from time to time. Changes take effect when published here. Orders confirmed before a change follow the terms in force at the time.</p>

<h2>15. Contact us</h2>
<p>WhatsApp: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("Hello, I have a question about the terms")}" target="_blank" rel="noopener">Message us on WhatsApp</a><br>Email: <a href="mailto:${site.email}" dir="ltr">${site.email}</a></p>
`;
