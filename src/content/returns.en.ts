import { site, waLink } from "../data/site";
import { hrefFor } from "../i18n";

const s = site.shipping;
const url = (p: string) => hrefFor("en", p);

export const title = "Shipping & Returns";

export const html = `
<div class="box">In short: you have <b>${site.returnDays} days</b> from delivery to return any belt for a <b>full refund</b>, or to exchange it. If it's faulty or we sent the wrong item, we cover every cost.</div>

<h2>Shipping costs</h2>
<table>
<tr><th>Shipping</th><th>Cost</th></tr>
<tr><td>Standard, any governorate</td><td><span class="num">${s.standard}</span> EGP</td></tr>
<tr><td>Express</td><td><span class="num">${s.express}</span> EGP</td></tr>
<tr><td>Orders of <span class="num">${s.freeOver}</span> EGP or more</td><td><b>Free standard shipping</b></td></tr>
</table>

<h2>Delivery time</h2>
<p>We deliver to every governorate in Egypt within <b>${site.deliveryDays} working days</b> of confirming your order. Once you send your order on WhatsApp we confirm your details with you, and let you know when it's handed to the courier.</p>
<p>Custom sizes made to order can take a little longer — we'll tell you the exact time before we start.</p>

<h2>Payment</h2>
<ul>
<li><b>Cash on delivery:</b> pay the courier when your order arrives.</li>
<li><b>InstaPay:</b> transfer to <span class="num">${site.instapay}</span>, send the screenshot on WhatsApp, and we ship right away.</li>
</ul>

<h2>Cancelling before shipping</h2>
<p>You can cancel at any time before your order ships, at no cost. If you paid by InstaPay, we refund the full amount.</p>

<h2>Returns and refunds</h2>
<ul>
<li>You can return any item within <b>${site.returnDays} days</b> of delivery, no reason needed.</li>
<li>We refund the <b>full price of the item</b> — whether bought at full price, on offer or with a discount code.</li>
<li>If your order had the <a href="/en/terms/#offers">multi-belt offer</a> and you return part of it, the discount is recalculated on what you keep and we refund the difference.</li>
<li>The item must come back unused and undamaged.</li>
<li>We refund within <b>${site.refundDays} days</b> of receiving the item, by InstaPay or another method that suits you.</li>
<li>Prefer an exchange? Pick any other belt — you only pay the price difference, if any.</li>
</ul>

<h2>Custom sizes</h2>
<p>A belt made to your custom size is made especially for you, so we exchange or refund it if there is a manufacturing fault or it differs from the size we agreed.</p>

<h2>Faulty or wrong item</h2>
<ul>
<li>Message us on WhatsApp as soon as it arrives, with a photo of the item.</li>
<li>We send a replacement right away, or refund you in full <b>including shipping</b> — your choice.</li>
<li>Return shipping for faulty or wrong items is <b>on us</b>.</li>
</ul>

<h2>Return shipping costs</h2>
<p>If the item is faulty or wrong, all shipping is on us. If you're returning it because you changed your mind, you only pay the return shipping, and we refund the full price of the item.</p>

<h2>Colours and photos</h2>
<p>We photograph our products as true to life as we can, with no filters, but colours can look slightly different depending on your screen and lighting. If the colour isn't what you expected, you can still return or exchange within the ${site.returnDays} days.</p>

<h2>How to return or exchange</h2>
<p>No forms. Send us your name on WhatsApp and tell us whether you'd like a return or an exchange, and we'll arrange the pickup.</p>
<p>WhatsApp: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("Hello, I would like to return or exchange an order")}" target="_blank" rel="noopener">Message us on WhatsApp</a><br>Email: <a href="mailto:${site.supportEmail}" dir="ltr">${site.supportEmail}</a></p>

<p>See also our <a href="${url("terms/")}">Terms & Conditions</a> and <a href="${url("privacy/")}">Privacy Policy</a>.</p>
`;
