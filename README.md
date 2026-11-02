# Nestica Outdoor — Bilingual 2.2.1

نسخة كاملة ثنائية اللغة جاهزة للتشغيل في Visual Studio Code ثم الرفع على GitHub.

## التشغيل

افتح Terminal داخل فولدر المشروع ثم شغّل:

```bash
npm install
npm start
```

- Arabic: http://localhost:8080/
- English: http://localhost:8080/en/

## قبل الرفع

```bash
npm run build
git add .
git commit -m "Update Nestica bilingual website"
git push
```

## ملفات إعداد Eleventy

- `eleventy.config.js`: ملف الإعداد الرئيسي.
- `.eleventy.js`: ملف توافق بسيط يعيد استخدام نفس الإعداد الرئيسي، حتى لا يحدث تعارض مع المشاريع القديمة أو أوامر Eleventy الافتراضية.

لا تحذف أيًا منهما في هذه النسخة.


## تحديث الخط العربي 2.2.1
النسخة العربية تستخدم IBM Plex Sans Arabic مع هيدر مضغوط وHero أكثر اتزانًا، بينما تظل النسخة الإنجليزية على Manrope.

## أسعار التسليمات

راجع `DELIVERY_PRICES_EDIT_GUIDE_AR.md` لتعديل الأسعار التقريبية بسهولة.

## أبعاد المنتجات

لكل منتج في `src/_data/products.json` تقدر تضيف:

```json
"dimensions": "الكنبة 140×70×75 سم · الكرسي 70×70×75 سم",
"dimensions_en": "Sofa 140×70×75 cm · Chair 70×70×75 cm"
```

لو الحقل موجود بيظهر في أعلى صفحة المنتج وفي جدول البيانات. لو مش موجود بيظهر رابط «اطلب الأبعاد الدقيقة على واتساب».
