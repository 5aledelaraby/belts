# Vicuna — متجر الأحزمة

موقع ثابت (Static) سريع، مبني بـ **React + TypeScript** بيتحول لصفحات HTML جاهزة وقت البناء، ومنشور على **GitHub Pages** من فولدر `docs/`.

## التعديل السريع

| عايز تغيّر | الملف |
|---|---|
| السعر، الشحن، رقم الواتساب، العنوان، أكواد الـPixel | `src/data/site.ts` |
| إضافة / حذف موديل | `src/data/products.ts` + صورته في `src/assets/products/<id>.jpg` |
| كلام صفحات الهبوط لكل تصميم | `categories` في `src/data/products.ts` |
| سياسة الاسترجاع / الخصوصية / الشروط | `src/content/*.ts` |
| الألوان والخطوط والتصميم | `src/styles/main.css` |

## البناء

```bash
npm install
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
- `/lace/` `/wide-tie/` `/classic/` `/ruffle/` — صفحة هبوط لكل تصميم (للإعلانات)
- `/returns/` `/privacy/` `/terms/` — السياسات

## الدومين

لما تربط دومين: في `src/data/site.ts` غيّر `url` للدومين، و`base` لـ `"/"`، و`customDomain` لاسم الدومين، وابني تاني.
