# SantaMaryna — Next.js + Sanity

Повний сайт для AI-художника з CMS-адмінкою.

---

## 🚀 Запуск проєкту

### 1. Встанови залежності
```bash
npm install
```

### 2. Створи Sanity проєкт
1. Зайди на [sanity.io](https://sanity.io) → Sign up (безкоштовно)
2. Натисни **"Create new project"**
3. Назва: `santamaryna`, Dataset: `production`
4. Скопіюй **Project ID** (буде щось типу `abc12345`)

### 3. Налаштуй змінні середовища
```bash
cp .env.local.example .env.local
```
Відкрий `.env.local` і заповни:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=твій_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=  # поки залиш порожнім
```

### 4. Запусти локально
```bash
npm run dev
```

Відкрий:
- **Сайт:** http://localhost:3000
- **Адмінка:** http://localhost:3000/admin

### 5. Перший раз в адмінці
- Зайди на http://localhost:3000/admin
- Увійди з Sanity акаунтом
- Розділи зліва: **Site Settings, Portfolio, Services, Video Greetings, How It Works**
- Починай заповнювати контент!

---

## 📁 Структура проєкту

```
santamaryna/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Головна сторінка
│   │   ├── admin/                # Sanity Studio (адмінка)
│   │   └── api/contact/          # API для форми
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── PortfolioSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── GreetingsSection.tsx
│   │       └── ContactSection.tsx
│   └── lib/
│       ├── sanity.ts             # Sanity клієнт
│       ├── queries.ts            # GROQ запити
│       └── lang.tsx              # EN/UA перемикач
├── sanity/
│   └── schemas/                  # Структура контенту
│       ├── siteSettings.ts
│       ├── portfolioItem.ts
│       ├── service.ts
│       ├── greeting.ts
│       └── howItWorksStep.ts
└── sanity.config.ts              # Конфіг адмінки
```

---

## 🌐 Деплой на Vercel

```bash
# 1. Встанови Vercel CLI
npm i -g vercel

# 2. Деплой
vercel

# 3. Додай env змінні в Vercel Dashboard:
#    Settings → Environment Variables
#    NEXT_PUBLIC_SANITY_PROJECT_ID
#    NEXT_PUBLIC_SANITY_DATASET
```

Або через GitHub:
1. `git init && git add . && git commit -m "init"`
2. Пуш на GitHub
3. Підключи репо на [vercel.com](https://vercel.com)
4. Додай env змінні в Settings → Environment Variables

---

## ✉️ Підключення email для форми

Відкрий `src/app/api/contact/route.ts` і розкоментуй блок з Resend:
1. Зареєструйся на [resend.com](https://resend.com) (безкоштовно до 3000 листів/міс)
2. Отримай API ключ
3. Додай в `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   CONTACT_EMAIL=твій@email.com
   ```

---

## 🎁 Наступний етап — Відео-привітання

Коли будемо готові до автоматизації відео:
- **Creatomate** — API для рендерингу персоналізованих відео
- **WayForPay** — вже підключений, треба лише webhook
- **Supabase** — зберігання замовлень

Все це додається окремим модулем без переробки поточного коду.
