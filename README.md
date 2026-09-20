# 📚 ImprintAI + BookStock

> An AI-powered publishing and inventory management platform for modern publishing houses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)

---

## 📖 Overview

**ImprintAI + BookStock** is a comprehensive full-stack platform designed for publishing houses, authors, editors, and publishers to manage the entire book lifecycle — from manuscript submission to inventory tracking and sales analytics.

Whether you're an indie author or a large publishing house, this platform provides role-based dashboards, AI-powered assistance, and real-time inventory management to streamline your publishing workflow.

---

## ✨ Key Features

### 🤖 AI-Powered Tools
- **Manuscript Analysis** — Automatic grammar, tone, and style suggestions
- **Story Bible Builder** — Track characters, timelines, and world facts
- **Audiobook Generation** — AI text-to-speech pipeline
- **Smart Contracts** — Blockchain-based royalty agreements

### 📊 Inventory Management (BookStock)
- Real-time stock tracking across multiple warehouses
- Purchase orders & sales orders management
- Low-stock alerts and automatic reorder suggestions
- Returns processing
- Stock movement history

### 👥 Role-Based Dashboards
| Role | Dashboard | Features |
|------|-----------|----------|
| **Admin** | `/dashboard/admin` | Analytics, user management, security, models |
| **Author** | `/dashboard/author` | Manuscripts, story bible, market, audiobooks |
| **Editor** | `/dashboard/editor` | Manuscript review, production, messages |
| **Publisher** | `/dashboard/publisher` | Books, authors, financials, warehouses, audit |
| **Beta Reader** | `/dashboard/beta-reader` | Reading history, feedback |

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Multi-tenant architecture
- Role-based access control (RBAC)
- Audit logging

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** / Custom components

### Backend
- **Next.js API Routes** (Server Actions)
- **Node.js**
- **JWT** for authentication
- **bcrypt** for password hashing

### Database
- **PostgreSQL 16** (Local or Neon Cloud)
- **Drizzle ORM** — Type-safe SQL for TypeScript
- **Drizzle Kit** — Schema migrations

### DevOps & Tools
- **Git & GitHub**
- **ESLint** for code quality
- **Turbopack** for fast builds
- **pgAdmin** for database management

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/emuhammadali/ImprintAI-BookStock.git
cd ImprintAI-BookStock
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/imprintai_db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
NODE_ENV="development"
```
*Note: If using Neon, replace `DATABASE_URL` with your Neon connection string.*

### 4. Create the Database
Open pgAdmin or use `psql`:
```sql
CREATE DATABASE imprintai_db;
```

### 5. Push Schema to Database
```bash
npx drizzle-kit push
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
ai-publishing-and-inventory-platform/
├── src/
│   ├── app/
│   │   ├── api/                      # API routes (auth, books, orders, stock)
│   │   ├── dashboard/                # Role-based dashboards
│   │   │   ├── admin/                # Admin panel
│   │   │   ├── author/               # Author panel
│   │   │   ├── beta-reader/          # Beta reader panel
│   │   │   ├── editor/               # Editor panel
│   │   │   ├── publisher/            # Publisher panel
│   │   │   └── layout.tsx            # Shared dashboard layout
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/                       # Reusable UI components
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   └── schema.ts                 # Drizzle schema
│   └── lib/
│       ├── api-utils.ts              # API helpers
│       ├── auth.ts                   # Auth utilities
│       └── constants.ts              # App constants
├── drizzle.config.ts                 # Drizzle config
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## 🗄️ Database Schema (Key Tables)

| Table | Purpose |
|---|---|
| `users` | User accounts (email, password_hash, role) |
| `tenants` | Multi-tenant organizations |
| `books` | Published books catalog |
| `manuscripts` | Author manuscripts & drafts |
| `stock_items` | Inventory items |
| `stock_movements` | Stock in/out history |
| `warehouses` | Physical warehouses |
| `purchase_orders` | Supplier purchases |
| `sales_orders` | Customer sales |
| `returns` | Product returns |
| `story_bible_characters` | Character tracking |
| `story_bible_timeline` | Story timeline events |
| `story_bible_world_facts` | World-building facts |
| `smart_contracts` | Blockchain contracts |
| `tasks` | Task management |

---

## 🔑 User Roles & Permissions

| Role | Permissions |
|---|---|
| **Admin** | Full system access, user management, analytics |
| **Publisher** | Manage books, authors, inventory, financials |
| **Author** | Submit manuscripts, track sales, story bible |
| **Editor** | Review manuscripts, manage production |
| **Beta Reader** | Read drafts, submit feedback |

---

## 🧪 Testing & Seeding

### Seed Database with Sample Data
Visit `/api/seed` in your browser (after running the dev server):
```text
http://localhost:3000/api/seed
```

### Health Check
```text
http://localhost:3000/api/health
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project on Vercel
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`)
4. Deploy!

### Database (Production)
Use Neon or Supabase for serverless PostgreSQL.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 👨‍💻 Author

**Muhammad Ali**  
GitHub: [@emuhammadali](https://github.com/emuhammadali)  
Project: ImprintAI + BookStock

---

## 🙏 Acknowledgments

- Next.js
- Drizzle ORM
- Neon
- Tailwind CSS
- Radix UI

⭐ If you find this project useful, please give it a star! ⭐