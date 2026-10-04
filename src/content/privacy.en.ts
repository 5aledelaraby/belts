import { site, waLink } from "../data/site";
import { hrefFor } from "../i18n";

const url = (p: string) => hrefFor("en", p);

export const title = "Privacy Policy";

export const html = `
<p>At ${site.brand} we respect your privacy and collect only the minimum data needed to deliver your order. This page explains what we collect, what we do with it, and your rights.</p>

<h2>1. What we collect</h2>
<ul>
<li><b>Order details:</b> your name, mobile number, governorate, address and notes. You type them on the site and they reach us in a WhatsApp message that you send yourself. The site itself does not store them on any server.</li>
<li><b>Bag and favourites:</b> saved only on your own device (in your browser's storage) so they aren't lost if you close the page. They never reach us.</li>
<li><b>Payment details:</b> if you pay by InstaPay we only see the sender's name and the amount. We <b>never ask for or store</b> card or bank account numbers.</li>
<li><b>General technical data:</b> such as browser, device type and IP address, logged automatically by the services the site runs on.</li>
</ul>

<h2>2. Consent</h2>
<p>When you send us your details for an order, a delivery or a return, you agree to us using them for that purpose only. If we ever want to use them for anything else — such as sending you offers — we will ask you clearly first, and you can say no.</p>

<h2>3. Withdrawing consent</h2>
<p>If you agree and later change your mind, you can ask us at any time to stop contacting you or to stop using your data. Message us on WhatsApp and we will do it.</p>

<h2>4. How we use your data</h2>
<ul>
<li>To confirm and deliver your order.</li>
<li>To contact you about your order, a return or an exchange.</li>
<li>To improve the site and our ads: we use measurement tools such as Google Analytics and the Meta Pixel (Facebook and Instagram), and similar tools from TikTok and Snapchat, which tell us how many visits and orders came from our ads.</li>
<li><b>Ad matching:</b> when you fill in your details in the bag, your mobile number, name and governorate may be sent to these ad platforms <b>in hashed (encrypted) form</b>. The platform uses them only to tell whether an order came from an ad you saw; we never see your account on their side.</li>
</ul>

<h2>5. Sharing your data</h2>
<p>We never sell or rent your data. We only share:</p>
<ul>
<li>Your address and mobile number with the <b>courier company</b>, so they can deliver your order.</li>
<li>Hashed data with <b>ad platforms</b> (Meta, TikTok and Snapchat), for ad measurement only, as described above.</li>
<li>Any data required by <b>Egyptian law</b> or a competent authority.</li>
</ul>

<h2>6. Other services we use</h2>
<p>The site is hosted on GitHub Pages, fonts come from Google Fonts, and orders are sent through WhatsApp. Each of these has its own privacy policy for technical data. If you follow a link to another site or app, this policy doesn't cover it.</p>

<h2>7. Security</h2>
<p>The site runs on HTTPS, so your connection to it is encrypted, and we take reasonable precautions so your data isn't lost, leaked or altered. Even so, no method of transmission or storage on the internet is 100% secure.</p>

<h2>8. Cookies and browser storage</h2>
<p>The site uses browser storage (localStorage) to remember your bag and favourites on your device. Measurement tools (Google Analytics, the Meta Pixel and others) use their own cookies. You can clear this data at any time from your browser settings, or limit ad cookies from your Facebook, Instagram and TikTok account settings.</p>

<h2>9. Age</h2>
<p>By using the site you confirm that you are of legal age, or that your parent or guardian agrees to you ordering.</p>

<h2>10. Your rights</h2>
<p>You can ask at any time to see the data we hold about you, correct it, delete it, or make a complaint. Contact us and we'll get back to you.</p>
<p>WhatsApp: <b class="num">${site.whatsapp.display}</b> · <a href="${waLink("Hello, I have a request about my data")}" target="_blank" rel="noopener">Message us on WhatsApp</a><br>Email: <a href="mailto:${site.email}" dir="ltr">${site.email}</a></p>

<h2>11. Changes to this policy</h2>
<p>We may update this policy from time to time. Changes take effect when published here, and the date of the last update is shown above. If there is a significant change, we'll explain it on this page.</p>

<p>See also our <a href="${url("terms/")}">Terms & Conditions</a> and <a href="${url("returns/")}">Shipping & Returns</a>.</p>
`;
