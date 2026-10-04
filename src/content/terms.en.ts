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
<li>Our belts are made of imported PU leather, lace or suede depending on the design; the material is listed on each product.</li>
<li>Standard size: ${site.size.widthCm} cm wide and ${site.size.lengthCm} cm long, fitting every size. Custom sizes are made to order.</li>
<li>We show colours and details as accurately as we can, but colours can vary slightly between screens.</li>
<li>If a product isn't what you expected for any reason, you can return or exchange it under our <a href="${url("returns/")}">returns policy</a>.</li>
</ul>

<h2>5. Accurate details</h2>
<p>We need correct and complete delivery details to reach you. If there's a delay because of incorrect details, we'll contact you and try to sort it out.</p>

<h2>6. Links and other sites</h2>
<p>The site links to WhatsApp and our social media accounts. These platforms are independent of us and have their own terms and policies.</p>

<h2>7. Prohibited uses</h2>
<p>You may not use the site for any unlawful purpose; to infringe our or anyone else's intellectual property; to abuse or harass anyone; to submit false or misleading information; to upload malicious code; to collect other people's data; or to try to disrupt the site or get around its security.</p>

<h2>8. Intellectual property</h2>
<p>Product photos, designs, the logo and the content on this site belong to ${site.brand} and may not be copied or used commercially without written permission.</p>

<h2>9. Limitation of liability</h2>
<p>We do everything we can to keep the site running without errors, but we can't guarantee it will always be available. Our liability for any order is limited to the value of that order — without reducing any of your rights under the law.</p>

<h2>10. Consumer protection</h2>
<p>These terms do not reduce any of your rights under Egyptian Consumer Protection Law No. 181 of 2018. If there is any conflict, the law applies, in the way that is most favourable to you.</p>

<h2>11. Severability</h2>
<p>If any clause in these terms is found unlawful or unenforceable, the remaining clauses stay in force.</p>

<h2>12. Governing law</h2>
<p>These terms are governed by Egyptian law, and the competent courts are those of Cairo.</p>

<h2>13. Changes to these terms</h2>
<p>We may update these terms from time to time. Changes take effect when published here. Orders confirmed before a change follow the terms in force at the time.</p>

<h2>14. Contact us</h2>
<p>WhatsApp: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("Hello, I have a question about the terms")}" target="_blank" rel="noopener">Message us on WhatsApp</a><br>Email: <a href="mailto:${site.email}" dir="ltr">${site.email}</a></p>
`;
