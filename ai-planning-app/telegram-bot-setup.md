# 🤖 Telegram Bot va Mini App Sozlash Qo'llanmasi

## 1. Telegram Bot Yaratish

### Bosqich 1: BotFather bilan ishlash
1. Telegram da [@BotFather](https://t.me/botfather) ga o'ting
2. `/start` buyrug'ini yuboring
3. `/newbot` buyrug'ini yuboring
4. Bot nomini kiriting: `AI Planning Assistant`
5. Username kiriting: `ai_planning_bot` (yoki boshqa mavjud bo'lmagan)
6. Bot tokenini saqlang: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Bosqich 2: Bot Sozlash
```
/setdescription
@ai_planning_bot
AI yordamida kuningizni rejalashtiring, vazifalarni boshqaring va maqsadlaringizga erishingiz uchun yordamchi bot.
```

```
/setabouttext
@ai_planning_bot
🤖 AI Planning Assistant - Kuningizni AI yordamida rejalashtiring!
📝 Vazifa boshqaruvi
🎯 Maqsadlar belgilash  
⏰ Pomodoro timer
🤖 AI yordamchisi
```

## 2. Mini App Yaratish

### Bosqich 1: Web App Yaratish
1. BotFather da `/newapp` buyrug'ini yuboring
2. Botingizni tanlang: `@ai_planning_bot`
3. App nomini kiriting: `AI Planning Assistant`
4. App tavsifini kiriting: `AI yordamida kuningizni rejalashtiring va vazifalarni boshqaring`
5. App URL ni kiriting: `https://yourdomain.com` (HTTPS kerak!)
6. App ikonkasini yuklang (512x512 px)

### Bosqich 2: Web App URL Sozlash
```
/setmenubutton
@ai_planning_bot
Web App
https://yourdomain.com
```

## 3. Hosting Sozlash

### Variant 1: GitHub Pages (Bepul)
1. GitHub da yangi repository yarating
2. Loyiha fayllarini yuklang
3. Settings > Pages ga o'ting
4. Source: Deploy from a branch
5. Branch: main
6. URL: `https://username.github.io/repository-name`

### Variant 2: Netlify (Bepul)
1. [Netlify.com](https://netlify.com) ga o'ting
2. "New site from Git" ni tanlang
3. GitHub repository ni ulang
4. Deploy settings:
   - Build command: (bo'sh qoldiring)
   - Publish directory: `/` (root)
5. Deploy tugmasini bosing
6. URL: `https://random-name.netlify.app`

### Variant 3: Vercel (Bepul)
1. [Vercel.com](https://vercel.com) ga o'ting
2. GitHub bilan login qiling
3. Repository ni import qiling
4. Deploy tugmasini bosing
5. URL: `https://project-name.vercel.app`

## 4. Bot Tokenini Sozlash

### Environment Variables
```bash
# .env fayli yarating
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
WEB_APP_URL=https://yourdomain.com
```

### Bot Tokenini Tekshirish
```javascript
// script.js faylida
const BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz';
const WEB_APP_URL = 'https://yourdomain.com';
```

## 5. Test Qilish

### Lokal Test
1. Loyihani ishga tushiring:
```bash
cd ai-planning-app
python -m http.server 8000
```

2. Brauzerda oching: `http://localhost:8000`

### Telegram Test
1. BotFather da Web App URL ni sozlang
2. Telegram da botingizni toping
3. `/start` buyrug'ini yuboring
4. "Web App" tugmasini bosing
5. Ilova ochilishini tekshiring

## 6. Xatoliklarni Tuzatish

### Keng Tarqalgan Muammolar

**1. Web App ochilmaydi**
- URL HTTPS da ekanligini tekshiring
- CORS sozlamalarini tekshiring
- Telegram Web App SDK yuklanganligini tekshiring

**2. Bot ishlamaydi**
- Bot tokenini tekshiring
- Bot faol ekanligini tekshiring
- Web App URL to'g'ri ekanligini tekshiring

**3. Ma'lumotlar saqlanmaydi**
- LocalStorage ishlayotganligini tekshiring
- JavaScript xatoliklarini tekshiring

## 7. Production Sozlash

### HTTPS Majburiy
Telegram Mini Apps faqat HTTPS orqali ishlaydi!

### Domain Sozlash
1. Domen sotib oling
2. SSL sertifikatini oling (Let's Encrypt bepul)
3. DNS sozlamalarini qiling

### Performance
1. Fayllarni minify qiling
2. Rasmlarni optimallashtiring
3. CDN ishlatishni ko'ring

## 8. Monitoring va Analytics

### Bot Statistikalari
```
/getstats
@ai_planning_bot
```

### Web App Analytics
- Google Analytics qo'shing
- Telegram Web App events kuzating
- User behavior tahlil qiling

## 9. Keyingi Qadamlar

1. **Real AI Integration**
   - OpenAI API qo'shing
   - Claude API qo'shing
   - Custom AI model yarating

2. **Database Integration**
   - Firebase qo'shing
   - PostgreSQL qo'shing
   - MongoDB qo'shing

3. **Advanced Features**
   - Push notifications
   - Multi-language support
   - Premium features
   - Team collaboration

## 10. Xavfsizlik

### Bot Token Xavfsizligi
- Tokenni hech qachon public qilmang
- Environment variables ishlating
- Regular token rotation

### User Data
- Ma'lumotlarni shifrlash
- GDPR compliance
- Data retention policies

---

**Muvaffaqiyatli deployment!** 🚀

Agar muammolar bo'lsa, GitHub Issues yoki Telegram orqali yozing.