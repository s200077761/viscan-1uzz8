# 👁️ ViScan - Iris Analysis System

نظام متقدم لتحليل القزحية باستخدام Node.js وتقنيات معالجة الصور لتقديم رؤى صحية بناءً على خرائط التشخيص الطبي (Iridology).

## ⚠️ إخلاء المسؤولية الطبية

**هذا التطبيق مخصص للأغراض التعليمية والمعلوماتية فقط.** النتائج ليست تشخيصاً طبياً ولا تحل محل استشارة الطبيب المتخصص. علم القزحية (Iridology) غير معترف به علمياً كأداة تشخيصية موثوقة. يُرجى استشارة مقدم الرعاية الصحية المؤهل لأي مخاوف صحية.

## ✨ المميزات

- 📸 **رفع صور القزحية** - دعم السحب والإفلات مع معاينة فورية
- 🗺️ **تحليل 20+ منطقة** - بناءً على خريطة برنارد جينسن العالمية
- 🎨 **تحليل الألوان** - كشف الألوان السائدة وتفسيرها
- 🔍 **كشف الأنماط** - تحديد الخطوط والبقع والحلقات
- 📊 **لوحة تحكم تفاعلية** - عرض مرئي للنتائج مع مخططات المناطق
- 🔐 **مصادقة آمنة** - JWT token مع تشفير كلمات المرور
- 📜 **سجل التحليلات** - حفظ ومراجعة جميع التحليلات السابقة
- 🌙 **تصميم داكن متميز** - واجهة عصرية مع تأثيرات glassmorphism

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** + **Express.js** - إطار عمل الخادم
- **MongoDB** + **Mongoose** - قاعدة البيانات
- **Sharp.js** - معالجة وتحليل الصور
- **Multer** - رفع الملفات
- **JWT** - المصادقة الآمنة
- **bcrypt** - تشفير كلمات المرور

### Frontend
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **Google Fonts (Inter)** - خطوط عصرية
- تصميم متجاوب (Responsive Design)
- تأثيرات Glassmorphism
- دعم اللغة العربية (RTL)

## 📦 التثبيت والإعداد

### المتطلبات الأساسية
- Node.js (v14 أو أحدث)
- MongoDB (v4.4 أو أحدث)
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المستودع**
\`\`\`bash
git clone https://github.com/yourusername/viscan-1uzz8.git
cd viscan-1uzz8
\`\`\`

2. **تثبيت التبعيات**
\`\`\`bash
npm install
\`\`\`

3. **إعداد متغيرات البيئة**
\`\`\`bash
cp .env.example .env
\`\`\`

ثم قم بتحرير `.env` وتعديل القيم:
\`\`\`env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/viscan
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
\`\`\`

4. **تشغيل MongoDB**
\`\`\`bash
# macOS
brew services start mongodb-community

# أو تشغيل مباشر
mongod --dbpath /path/to/data/db
\`\`\`

5. **تشغيل الخادم**
\`\`\`bash
# وضع التطوير (مع إعادة التشغيل التلقائي)
npm run dev

# وضع الإنتاج
npm start
\`\`\`

6. **فتح المتصفح**
افتح المتصفح وانتقل إلى: `http://localhost:3000`

## 📡 واجهة برمجة التطبيقات (API)

### المصادقة

#### تسجيل مستخدم جديد
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "username": "ahmad",
  "email": "ahmad@example.com",
  "password": "password123"
}
\`\`\`

#### تسجيل الدخول
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmad@example.com",
  "password": "password123"
}
\`\`\`

#### التحقق من الرمز
\`\`\`http
GET /api/auth/verify
Authorization: Bearer <token>
\`\`\`

### التحليل

#### رفع وتحليل صورة القزحية
\`\`\`http
POST /api/analysis/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

irisImage: <file>
\`\`\`

#### الحصول على سجل التحليلات
\`\`\`http
GET /api/analysis/history?page=1&limit=10
Authorization: Bearer <token>
\`\`\`

#### الحصول على تحليل محدد
\`\`\`http
GET /api/analysis/:id
Authorization: Bearer <token>
\`\`\`

#### حذف تحليل
\`\`\`http
DELETE /api/analysis/:id
Authorization: Bearer <token>
\`\`\`

#### الحصول على معلومات المناطق
\`\`\`http
GET /api/analysis/zones/all
Authorization: Bearer <token>
\`\`\`

## 📂 هيكل المشروع

\`\`\`
viscan-1uzz8/
├── config/                 # ملفات الإعداد
│   ├── database.js        # اتصال MongoDB
│   └── multer.js          # إعداد رفع الملفات
├── public/                # الملفات الثابتة
│   ├── css/
│   │   ├── style.css      # الأنماط الرئيسية
│   │   └── dashboard.css  # أنماط لوحة التحكم
│   ├── js/
│   │   ├── auth.js        # منطق المصادقة
│   │   ├── dashboard.js   # منطق لوحة التحكم
│   │   └── utils.js       # وظائف مساعدة
│   ├── index.html         # الصفحة الرئيسية
│   ├── auth.html          # صفحة تسجيل الدخول
│   └── dashboard.html     # لوحة التحكم
├── src/
│   ├── controllers/       # منطق التحكم
│   │   ├── authController.js
│   │   └── analysisController.js
│   ├── models/            # نماذج قاعدة البيانات
│   │   ├── User.js
│   │   └── Analysis.js
│   ├── routes/            # مسارات API
│   │   ├── authRoutes.js
│   │   └── analysisRoutes.js
│   ├── services/          # خدمات المعالجة
│   │   ├── irisProcessor.js
│   │   └── iridologyMapper.js
│   └── data/
│       └── iridologyZones.json
├── uploads/               # الصور المرفوعة
├── .env                   # متغيرات البيئة
├── .env.example           # نموذج متغيرات البيئة
├── .gitignore
├── package.json
├── server.js              # نقطة الدخول الرئيسية
└── README.md
\`\`\`

## 🧪 الاختبار

\`\`\`bash
npm test
\`\`\`

## 🔒 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT tokens للمصادقة
- التحقق من صحة الملفات المرفوعة
- حماية CORS
- التحقق من حجم ونوع الملفات

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت Apache License 2.0 - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير

- **Bernard Jensen** - خرائط علم القزحية
- **Sharp.js** - مكتبة معالجة الصور الرائعة
- **MongoDB** - قاعدة البيانات المرنة

## 📞 التواصل

لأي استفسارات أو مشاكل، يرجى فتح issue في المستودع.

---

**تم التطوير بـ ❤️ لأغراض تعليمية** 
