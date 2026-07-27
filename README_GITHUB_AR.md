# Nestica — ملفات جاهزة للدمج مع GitHub

هذه النسخة مخصصة للمشروع الذي يتم نشره تلقائيًا عند عمل Push إلى GitHub.

## طريقة الاستخدام

1. فك ضغط الملف.
2. انسخ محتوياته إلى **جذر الريبو الحالي**؛ لا ترفع المجلد الأب نفسه.
3. اعمل Merge مع ملفات الريبو الموجودة ولا تحذف ملفات الربط الخاصة بالاستضافة مثل:
   - `.github/`
   - `netlify.toml`
   - `vercel.json`
   - إعدادات الدومين أو متغيرات البيئة
4. راجع التغييرات ثم نفّذ:

```bash
git add .
git commit -m "Improve Nestica UI SEO AIO and product structure"
git push
```

## الملفات الأساسية في هذه الحزمة

- `src/`: صفحات الموقع والبيانات والصور والتصميم.
- `.eleventy.js`: إعدادات Eleventy والفلاتر المطلوبة للصفحات الجديدة (وهو ملف الإعداد الوحيد المعتمد).
- `package.json`: أمر البناء `npm run build`.
- `.gitignore`: يمنع رفع `_site` و`node_modules`.

## إعداد البناء المتوقع

- Build command: `npm run build`
- Publish directory: `_site`
- Node: إصدار حديث متوافق مع Eleventy 3

## مهم قبل الـPush

- احتفظ بملفات إعداد الاستضافة الموجودة في الريبو؛ هذه الحزمة لا تستبدلها.
- راجع رقم الهاتف والواتساب والبريد داخل `src/_data/settings.json`.
- في حالة وجود `package-lock.json` قديم وحدوث خطأ Dependencies، نفّذ `npm install` محليًا ثم ارفع ملف القفل المحدّث.


## تشغيل المشروع محليًا

من داخل جذر المشروع شغّل:

```bash
npm install
npm start
```

الأوامر المتاحة:

- `npm start`: تشغيل Eleventy محليًا مع Live Reload.
- `npm run dev`: نفس أمر التشغيل المحلي.
- `npm run build`: إنشاء نسخة الإنتاج داخل مجلد `_site`.

لو ظهر خطأ أن أمر `eleventy` غير معروف، تأكد من تنفيذ `npm install` أولًا.
