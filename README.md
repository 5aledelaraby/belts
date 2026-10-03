# Vicuna — متجر الأحزمة

موقع ثابت (Static) سريع، مبني بـ **React + TypeScript** (صفحات بتتجهز وقت البناء) و**Tailwind CSS v4**، والحركة بـ **GSAP** (ScrollTrigger + Flip) و**Lenis**، ومنشور على **GitHub Pages** من فولدر `docs/` على الدومين **vicuna-eg.com**.

## التعديل السريع

| عايز تغيّر | الملف |
|---|---|
| الشحن، الواتساب، InstaPay، العنوان، السوشيال، أكواد الـPixel | `src/data/site.ts` |
| إضافة / حذف موديل | `src/data/products.ts` + صورة مربعة في `src/assets/products/<id>.jpg` |
| أسعار التصميمات وكلام صفحات الهبوط | `styles` في `src/data/products.ts` |
| سياسة الاسترجاع / الخصوصية / الشروط | `src/content/*.ts` |
| الألوان والخطوط والتصميم | `src/styles/app.css` (Tailwind) |

## البناء

```bash
npm install
# Tailwind v4 standalone CLI لازم يكون متسطب (أو حدد مكانه في TAILWIND_BIN)
npm run build      # يبني الموقع في docs/
```

بعد البناء: ارفع التغييرات على GitHub، والموقع بيتحدّث لوحده خلال دقيقة.

## هيكل المشروع

```
src/
  data/        إعدادات المتجر وكتالوج المنتجات
  components/  مكوّنات الصفحات (Layout, Sections, Icons)
  content/     نصوص السياسات
  client/      كود المتصفح: السلة والطلب على واتساب
  styles/      CSS
  assets/      الصور الأصلية
  pages.tsx    قائمة الصفحات
scripts/build.tsx   البناء: صور WebP بمقاسات متعددة + تجميع JS/CSS + توليد الصفحات + sitemap
docs/          الناتج النهائي (GitHub Pages)
```

## الصفحات

- `/` — المتجر كامل
- `/lace/` `/wide-bow/` `/sash/` `/thin-tie/` `/croc-snake/` `/ruffle/` — صفحة هبوط لكل تصميم (للإعلانات)
- `/p/<id>/` — صفحة لكل حزام فيها معرض صور و«Shop the Look» وLightbox
- `/returns/` `/privacy/` `/terms/` — السياسات

## المكتبات

GSAP 3.15 وLenis 1.3 محفوظين في `src/vendor/` ومتنشرين مع الموقع (مش من CDN)، فالموقع أسرع ومش معتمد على أي سيرفر تاني.
