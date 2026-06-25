# 🛍️ LUXE — Curated Premium Store

A modern, fully responsive ecommerce web application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-shoptoo.vercel.app-black?style=for-the-badge&logo=vercel)](https://shoptoo.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-RonaldoClindon%2Fshoptoo-blue?style=for-the-badge&logo=github)](https://github.com/RonaldoClindon/shoptoo)

---

## ✨ Features

- 🛒 **Shopping Cart** — Add, remove, and manage products
- 💳 **Multi-Payment Support** — Credit/Debit Card, UAE Wallets (e& money, PayIt, BOTIM, Careem), Google Pay / UPI
- 🔍 **Product Search & Filter** — Search by name, filter by category
- 📱 **Fully Mobile Responsive** — Works on all screen sizes
- 🌙 **Dark / Light Mode** — Toggle between themes
- 🎉 **Purchase Confirmation** — Animated thank you dialog after payment
- 🔐 **Google Sign-In** — Custom email dialog (no browser prompts)
- 🏷️ **Category Navigation** — Jewelry, Electronics, Men's, Women's
- 💎 **Product Detail Modal** — Full-screen on mobile, card on desktop
- 📣 **Announcement Bar** — Rotating flash sale offers
- 🏅 **Trust Bar** — Free shipping, secure checkout, returns, fast delivery
- 🌟 **Featured Marquee** — Scrolling best-seller products

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Lucide React](https://lucide.dev/) | Icon library |
| [FakeStoreAPI](https://fakestoreapi.com/) | Product data |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) **v18 or higher**
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/RonaldoClindon/shoptoo.git
```

### 2. Navigate to the Project Directory

```bash
cd shoptoo/ecommerce-store
```

> ⚠️ The Next.js app is inside the `ecommerce-store` subfolder.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open in Browser

```
http://localhost:3000
```

---

## 📁 Project Structure

```
ecommerce-store/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── cart/
│   │   │   └── page.tsx      # Cart & Checkout page
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Hero.tsx           # Hero section
│   │   ├── ProductCard.tsx    # Product card
│   │   ├── ProductDetailModal.tsx  # Product detail popup
│   │   ├── CartSummary.tsx    # Cart & payment modal
│   │   ├── CategoryFilter.tsx # Category filter pills
│   │   ├── AnnouncementBar.tsx # Top banner + trust bar
│   │   ├── FeaturedMarquee.tsx # Scrolling marquee
│   │   ├── AuthModal.tsx      # Login/Register modal
│   │   └── LoginForm.tsx      # Login form
│   ├── context/
│   │   └── AppContext.tsx     # Global state (cart, user)
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── public/                   # Static assets
├── package.json
└── tailwind.config.ts
```

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy on Vercel

The easiest way to deploy is via [Vercel](https://vercel.com/):

1. Go to [vercel.com](https://vercel.com/)
2. Click **"New Project"**
3. Import `RonaldoClindon/shoptoo` from GitHub
4. Set **Root Directory** to `ecommerce-store`
5. Click **Deploy** ✅

---

## 📸 Screenshots

| Home Page | Product Detail | Checkout |
|---|---|---|
| Premium hero with category cards | Full-screen mobile modal | Multi-payment support |

---

## 👨‍💻 Author

**Ronaldo Clindon**
- GitHub: [@RonaldoClindon](https://github.com/RonaldoClindon)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
