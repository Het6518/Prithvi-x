<div align="center">

<img src="https://img.shields.io/badge/Prithvix-AgriTech%20Platform-2d6a4f?style=for-the-badge&logo=leaf&logoColor=white" alt="Prithvix" height="40"/>

# 🌾 Prithvix — Premium AgriTech Dealer Management Platform

**Empowering India's agricultural input dealers with modern, intelligent tools.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

> *Built for the 70% of India's population that feeds the nation — and the dealers who serve them.*

<br/>

[🚀 Live Demo](https://youtu.be/dPxlylURfm8) &nbsp;|&nbsp;&nbsp; [⚙️ Setup Guide](#-getting-started) &nbsp;|&nbsp; [🤖 AI Features](#-ai-agronomist-chatbot)

</div>

---

## 📌 Overview

**Prithvix** is a full-stack, production-grade AgriTech SaaS platform purpose-built for agricultural input dealers across India. From managing farmer profiles and field visits to tracking credit ledgers and inventory stock — Prithvix consolidates every operational workflow into a single, elegant dashboard.

The platform ships with an **AI-powered agronomist chatbot** (powered by Google Gemini), an interactive **farmer distribution map**, multilingual support, and a cinematic onboarding experience — all wrapped in a bold **Neobrutalist UI design system**.

This is not a prototype. This is a real product.

---

## ✨ Key Features

### 🔐 Authentication & Access Control
- Secure JWT-based login for dealers and staff members
- Role-aware session management with protected routes
- Auto token refresh and secure cookie handling

### 👨‍🌾 Farmer Management
- Full CRUD operations for farmer profiles
- Advanced filters by village, crop type, credit status, and more
- Individual farmer profile pages with visit history and ledger summaries

### 📦 Inventory Management
- Real-time stock tracking for seeds, fertilizers, and pesticides
- Low-stock alerts and reorder thresholds
- Product categorization with batch and expiry tracking

### 💰 Credit Ledger (Udhaar / Khata)
- Digitized Udhaar tracking per farmer
- Payment recording with timestamps and running balance
- Overdue detection and credit limit enforcement

### 📊 Analytics Dashboard
- Visual insights via charts: revenue trends, top farmers, inventory turnover
- Date-range filters and comparative metrics
- Dealer-level performance summaries

### 🗺️ Map + Heatmap Visualization
- Interactive Leaflet.js map plotting farmer locations
- Heatmap overlay showing geographic concentration of customers
- Region-based filtering for targeted outreach

### 🤖 AI Agronomist Chatbot
- Powered by **Google Gemini API**
- Answers crop health, pest management, and fertilizer queries
- Multilingual support — converse in Hindi, Gujarati, or English
- Contextually aware of regional farming practices

### 🌐 Multi-Language Support
- Integrated Google Translate for full UI localization
- Designed with Indian regional languages in mind

### 🎬 Cinematic Intro Animation
- Earth-based 3D globe entry sequence built with **React Three Fiber**
- Smooth GSAP/Framer Motion transitions into the dashboard
- Sets the tone as a premium, modern product

### 🎨 Neobrutalist Design System
- Custom UI component library with bold borders, high-contrast palettes, and deliberate asymmetry
- Consistent design tokens across the marketing site and ERP dashboard
- Accessibility-compliant and responsive across all screen sizes

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | Full-stack React framework with SSR & API routes |
| **Tailwind CSS** | Utility-first styling and responsive design |
| **Framer Motion / GSAP** | Page transitions, scroll animations, micro-interactions |
| **React Three Fiber** | 3D Earth globe for the cinematic intro sequence |
| **Leaflet.js** | Interactive farmer distribution maps and heatmaps |

### Backend

| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful backend endpoints co-located with the frontend |
| **Prisma ORM** | Type-safe database queries and schema management |
| **PostgreSQL (Supabase)** | Relational database with real-time capabilities |

### Integrations & Services

| Service | Purpose |
|---|---|
| **Google Gemini API** | AI agronomist chatbot with multilingual support |
| **JWT** | Stateless authentication and session management |
| **Vercel** | Deployment, edge functions, and CI/CD pipeline |
| **Supabase / Railway** | Managed PostgreSQL hosting |

---

## 📁 Project Structure

```
prithvix/
├── prisma/
│   └── schema.prisma          # Database schema and models
├── public/
│   └── assets/                # Static images, icons, fonts
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Public landing/marketing pages
│   │   ├── (dashboard)/       # Protected ERP dashboard routes
│   │   ├── api/               # Next.js API route handlers
│   │   │   ├── auth/
│   │   │   ├── farmers/
│   │   │   ├── inventory/
│   │   │   ├── ledger/
│   │   │   └── chat/
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── ui/                # Reusable Neobrutalist UI primitives
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── map/               # Leaflet map and heatmap components
│   │   ├── chat/              # AI chatbot UI components
│   │   └── intro/             # 3D globe and intro animation
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # JWT helpers and middleware
│   │   ├── gemini.ts          # Gemini API client
│   │   └── utils.ts           # Shared utility functions
│   └── styles/
│       └── globals.css        # Global styles and design tokens
├── .env.local                 # Environment variables (not committed)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- A **PostgreSQL** database (Supabase recommended)
- A **Google Gemini** API key

### 1. Clone the Repository

```bash
git clone https://github.com/Het6518/prithvix.git
cd prithvix
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/prithvix"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# AI Chatbot
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Supabase (if using Supabase client features)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Initialize the Database

```bash
# Generate the Prisma client
npx prisma generate

# Push schema to your database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment

Prithvix is deployed on **Vercel** for seamless CI/CD and global edge performance.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup on Vercel

In your Vercel project dashboard, add the following under **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string from Supabase/Railway |
| `JWT_SECRET` | A long, random secret string |
| `GEMINI_API_KEY` | Google AI Studio API key |

**Database Hosting Options:**
- **Supabase** — Recommended. Free tier with 500MB storage, built-in auth, and Postgres.
- **Railway** — Alternative with generous free compute and auto-deploy from GitHub.

---

## 🤖 AI Usage Log

AI tools were used responsibly throughout development as a force-multiplier — not a replacement for engineering judgment.

| Area | AI Tool | Usage |
|---|---|---|
| **UI Generation** | Claude / v0 | Scaffolding Neobrutalist component variants and layout ideas |
| **Backend Scaffolding** | GitHub Copilot | Prisma schema drafting, API route boilerplate, and type generation |
| **Debugging** | Claude | Diagnosing edge cases in JWT middleware and Prisma relation errors |
| **Gemini Integration** | Google AI Studio | Prompt engineering for the agronomist chatbot's persona and context |
| **Code Improvement** | Copilot / Claude | Refactoring repeated logic, improving error handling, and adding TypeScript generics |

All AI-generated code was reviewed, tested, and adapted by the developer before merging.

---

## ⚡ Performance & Optimization

- **Lazy Loading** — Heavy components (3D globe, Leaflet map, charts) are dynamically imported to reduce initial bundle size
- **Optimized API Calls** — Debounced search inputs, paginated queries, and Prisma `select` projections to minimize data transfer
- **Reduced Re-renders** — Strategic use of `useMemo`, `useCallback`, and React context scoping to prevent unnecessary renders
- **Image Optimization** — All images served via Next.js `<Image />` with WebP format and lazy loading
- **Edge-Ready** — API routes are compatible with Vercel Edge Runtime for low-latency global responses

---

## 🔭 Future Improvements

The roadmap for Prithvix includes several high-impact features:

- **📡 Real-Time Updates** — WebSocket or Supabase Realtime integration for live inventory and ledger changes
- **📴 Offline Support** — Progressive Web App (PWA) capabilities for rural areas with intermittent connectivity
- **📱 Mobile App** — React Native companion app for field staff and on-the-go dealer operations
- **🧠 Advanced AI Recommendations** — Crop advisory and demand forecasting using historical sales patterns
- **🔔 Push Notifications** — Automated alerts for overdue credit, low stock, and upcoming field visits
- **📤 Export & Reports** — PDF/Excel export for ledgers, inventory reports, and farmer summaries

---

## 👤 Contributor

<table>
  <tr>
    <td align="center">
      <b>Het Shah</b><br/>
      <a href="https://github.com/Het6518">@Het6518</a><br/>
      <sub>Full-Stack Developer · Designer · Builder</sub>
    </td>
  </tr>
</table>

---

<div align="center">

*Built with passion for Indian agriculture. 🌱*

**Prithvix** — Because every farmer deserves a dealer with the tools of tomorrow.

<br/>

⭐ If you found this project valuable, consider starring the repository!

</div>
