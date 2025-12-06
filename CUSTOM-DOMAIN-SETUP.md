# إعداد الدومين المخصص viscan.app مع Firebase

## نظرة عامة

لديك دومين: **viscan.app**  
Name Servers:
- ns1.whois.com
- ns2.whois.com
- ns3.whois.com
- ns4.whois.com

هذا الدليل سيساعدك على ربط دومينك مع Firebase Hosting.

---

## الخطوة 1: إضافة Custom Domain في Firebase

### 1.1 افتح Firebase Console

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروع ViScan الخاص بك
3. من القائمة اليسرى → **Hosting**
4. اضغط على تبويب **Custom domains**

### 1.2 أضف الدومين

1. اضغط على **Add custom domain**
2. أدخل: `viscan.app`
3. اضغط **Continue**

Firebase سيعطيك DNS records للتحقق من ملكية الدومين.

---

## الخطوة 2: إعداد DNS Records

سيطلب منك Firebase إضافة TXT record للتحقق، ثم A records للربط.

### 2.1 التحقق من الملكية (Verification)

Firebase سيعطيك TXT record مثل:

```
Type: TXT
Name: @  (or viscan.app)
Value: google-site-verification=XXXXXXXXXXXXXXXX
TTL: 3600
```

### 2.2 ربط الدومين (DNS Setup)

بعد التحقق، أضف A records التالية:

```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

### 2.3 إضافة www (اختياري)

لدعم `www.viscan.app`:

```
Type: CNAME
Name: www
Value: viscan.app
TTL: 3600
```

---

## الخطوة 3: تطبيق DNS Settings

### خيار 1: إدارة DNS مع مزود Name Servers الحالي

إذا كنت تدير DNS من خلال لوحة تحكم موفر الدومين (whois.com):

1. سجل الدخول إلى لوحة تحكم whois.com
2. اذهب إلى DNS Management
3. أضف الـ records المذكورة أعلاه
4. احفظ التغييرات

### خيار 2: استخدام Firebase Name Servers (موصى به)

Firebase لا يوفر name servers خاصة، لذا ستحتاج:

**الحل الأمثل: استخدام Cloudflare (مجاني)**

1. أنشئ حساب على [Cloudflare](https://cloudflare.com)
2. أضف موقع `viscan.app`
3. Cloudflare سيعطيك name servers جديدة مثل:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
4. غيّر Name Servers في whois.com إلى Cloudflare
5. في Cloudflare DNS، أضف A records من Firebase

**مزايا Cloudflare:**
- DNS مجاني وسريع
- SSL/TLS تلقائي
- CDN عالمي
- حماية DDoS

---

## الخطوة 4: انتظر التفعيل

- **DNS Propagation**: قد يستغرق 24-48 ساعة
- **Firebase SSL**: بعد ربط DNS، Firebase سيصدر SSL certificate تلقائياً (قد يستغرق حتى 24 ساعة)

تحقق من الحالة في Firebase Console → Hosting → Custom domains

---

## دليل خطوة بخطوة (مع Cloudflare)

### الخطوة 1: Firebase Setup

```bash
# في مجلد المشروع
firebase deploy --only hosting
```

### الخطوة 2: أضف Domain في Firebase

1. Firebase Console → Hosting → Custom domains
2. Add domain: `viscan.app`
3. انسخ TXT record للتحقق
4. انسخ A records (عادة 151.101.1.195 و 151.101.65.195)

### الخطوة 3: Cloudflare Setup

1. أنشئ حساب في cloudflare.com
2. Add site → أدخل `viscan.app`
3. اختر Free plan
4. سينسخ Cloudflare DNS records الحالية تلقائياً
5. أضف/عدّل DNS records:
   
   **A Records (للدومين الرئيسي):**
   ```
   Type: A
   Name: @
   IPv4: 151.101.1.195
   Proxy: Enabled (☁️)
   
   Type: A
   Name: @
   IPv4: 151.101.65.195
   Proxy: Enabled (☁️)
   ```

   **TXT Record (للتحقق):**
   ```
   Type: TXT
   Name: @
   Content: google-site-verification=YOUR_VERIFICATION_CODE
   ```

   **CNAME for www:**
   ```
   Type: CNAME
   Name: www
   Target: viscan.app
   Proxy: Enabled (☁️)
   ```

6. Cloudflare سيعطيك name servers مثل:
   ```
   bob.ns.cloudflare.com
   tara.ns.cloudflare.com
   ```

### الخطوة 4: تحديث Name Servers

1. اذهب إلى لوحة تحكم whois.com
2. ابحث عن Domain Management أو Name Servers
3. غيّر من:
   ```
   ns1.whois.com → bob.ns.cloudflare.com
   ns2.whois.com → tara.ns.cloudflare.com
   ```
4. احفظ التغييرات

### الخطوة 5: انتظر وتحقق

```bash
# تحقق من DNS propagation (بعد بضع ساعات)
nslookup viscan.app

# أو استخدم
dig viscan.app

# يجب أن ترى Firebase IPs:
# 151.101.1.195
# 151.101.65.195
```

---

## التحقق من النشر

بعد اكتمال DNS propagation:

1. افتح `https://viscan.app` في المتصفح
2. تحقق من:
   - ✅ الموقع يعمل
   - ✅ SSL certificate نشط (قفل 🔒 في شريط العنوان)
   - ✅ `https://www.viscan.app` يعمل أيضاً

---

## Troubleshooting

### المشكلة: "DNS_PROBE_FINISHED_NXDOMAIN"

**الحل:**
- DNS لم ينتشر بعد، انتظر 24-48 ساعة
- تحقق من صحة DNS records

### المشكلة: "Your connection is not private" (SSL Error)

**الحل:**
- Firebase لم يصدر SSL بعد، انتظر حتى 24 ساعة
- تأكد من صحة A records

### المشكلة: الموقع يعرض صفحة Firebase الافتراضية

**الحل:**
```bash
# أعد النشر
firebase deploy --only hosting
```

### تحقق من حالة Domain في Firebase

في Firebase Console → Hosting → Custom domains:
- ✅ **Connected**: الدومين يعمل بنجاح
- ⏳ **Pending**: انتظر DNS propagation
- ❌ **Needs setup**: راجع DNS records

---

## ملخص سريع

**بدون Cloudflare (إدارة DNS من whois.com):**
1. Firebase Console → أضف Custom Domain
2. whois.com DNS → أضف TXT record للتحقق
3. whois.com DNS → أضف A records من Firebase
4. انتظر التفعيل

**مع Cloudflare (موصى به):**
1. Firebase Console → أضف Custom Domain  
2. Cloudflare → أضف الموقع وانسخ DNS records
3. Cloudflare DNS → أضف A records + TXT record
4. whois.com → غيّر Name Servers إلى Cloudflare
5. انتظر التفعيل

---

## الخطوات التالية بعد تفعيل الدومين

1. **تحديث Firebase Rewrites** (إن لزم):
   ```json
   // في firebase.json - تأكد من وجود rewrites
   {
     "hosting": {
       "rewrites": [
         {
           "source": "/api/**",
           "function": "api"
         }
       ]
     }
   }
   ```

2. **تحديث OAuth/CORS** (إن وجد):
   - أضف `viscan.app` للـ allowed origins
   - حدّث redirect URLs

3. **PWA Manifest**:
   ```json
   // public/manifest.json - تحديث start_url
   {
     "start_url": "https://viscan.app/"
   }
   ```

---

**وقت التفعيل المتوقع:**
- DNS Propagation: 1-48 ساعة
- Firebase SSL: 1-24 ساعة بعد DNS
- **الإجمالي: 2-72 ساعة** (عادةً أسرع)

**للتحقق الفوري:**
```bash
# تحقق من DNS
dig viscan.app +short

# يجب أن يعرض:
# 151.101.1.195
# 151.101.65.195
```

---

💡 **نصيحة**: استخدم Cloudflare للحصول على أداء أفضل وأمان إضافي مجاناً!
