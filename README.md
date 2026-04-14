# Tec Fazer - Complete Full Stack Web Application

**Building The Future**

A production-ready, bilingual (Portuguese + English) technology company website built with Next.js 14, TypeScript, PostgreSQL, and modern web technologies.

## 🚀 Quick Start (15 minutes)

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14+ (or [Neon.tech](https://neon.tech) free account)
- Stripe account (free)
- OpenAI API key
- Resend account (free 3000 emails/month)
- Uploadthing account (free tier)

### Installation

```bash
# 1. Clone and install
git clone <repository-url>
cd tecfazer
npm install

# 2. Setup environment
cp .env.example .env.local
# Fill in all variables in .env.local (see Environment Variables section below)

# 3. Setup database
npx prisma migrate dev --name init
npx prisma db seed

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

## 📋 Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | [Neon.tech](https://neon.tech) or local PostgreSQL |
| `NEXTAUTH_SECRET` | Auth secret (32+ chars) | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Site URL | `http://localhost:3000` (dev) |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | See Stripe Local Testing below |
| `OPENAI_API_KEY` | OpenAI API key | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `RESEND_API_KEY` | Resend API key | [Resend Dashboard](https://resend.com/api-keys) |
| `UPLOADTHING_SECRET` | Uploadthing secret | [Uploadthing Dashboard](https://uploadthing.com/dashboard) |
| `UPLOADTHING_APP_ID` | Uploadthing app ID | [Uploadthing Dashboard](https://uploadthing.com/dashboard) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (optional) | [Twilio Console](https://console.twilio.com) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token (optional) | [Twilio Console](https://console.twilio.com) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://tecfazer.pt` (prod) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | [Google Analytics](https://analytics.google.com) |

## 🔗 Localhost URLs

| URL | Description | Credentials |
|-----|-------------|-------------|
| http://localhost:3000 | Public site (Portuguese) | — |
| http://localhost:3000/en | Public site (English) | — |
| http://localhost:3000/admin | Admin dashboard | `admin@tecfazer.pt` / `TecFazer2024Admin` |
| http://localhost:3000/pt/portal | Client portal | (register via admin) |
| http://localhost:3000/pt/orcamento | Project estimator | — |

### Prisma Studio

```bash
npx prisma studio
# Opens at http://localhost:5555
```

## 💳 Stripe Local Testing

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Listen for webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret (whsec_...) to STRIPE_WEBHOOK_SECRET in .env.local

# Test with Stripe test cards:
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
```

## 🚢 Deployment to Netlify

1. Push code to GitHub
2. Connect repository on [app.netlify.com](https://app.netlify.com)
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Add all environment variables in Netlify Site Settings
5. Enable Next.js runtime plugin (automatic)
6. Deploy!

## 🏗️ Architecture Overview

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3 + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **Payments:** Stripe
- **File Uploads:** Uploadthing
- **AI:** OpenAI GPT-4o + Vercel AI SDK
- **Email:** Resend
- **i18n:** next-intl
- **Animations:** Framer Motion
- **Forms:** react-hook-form + Zod
- **Charts:** Recharts

### Folder Structure

```
tecfazer/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── sections/         # Homepage sections
│   ├── admin/            # Admin components
│   ├── chat/             # Chat widget
│   ├── forms/            # Form components
│   └── ui/               # UI primitives
├── lib/                   # Utility libraries
├── prisma/               # Database schema & seed
├── messages/             # i18n translations
├── types/                # TypeScript types
└── public/               # Static assets
```

### Key Features

✅ **Bilingual** - Full Portuguese and English support  
✅ **SEO Optimized** - Meta tags, JSON-LD, sitemap, robots.txt  
✅ **Admin Dashboard** - Complete CMS for all content  
✅ **Client Portal** - Project tracking, documents, tickets, billing  
✅ **AI Chat Widget** - GPT-4o powered assistant  
✅ **Project Estimator** - Interactive cost calculator  
✅ **Stripe Integration** - Subscriptions, webhooks, billing portal  
✅ **Email System** - Branded templates with Resend  
✅ **Analytics** - Custom tracking + Google Analytics  
✅ **File Uploads** - Images, documents, bulk imports  
✅ **Review System** - Client testimonials with verification  
✅ **Newsletter** - Subscriber management + campaigns  
✅ **Responsive Design** - Mobile-first, fully responsive  
✅ **Dark Mode Ready** - Theme system included  

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## 🗄️ Database Schema

The application includes 25+ models covering:

- **Content:** Services, Projects, Blog Posts, Team Members
- **Business:** Leads, Orders, Pricing Plans, Reviews
- **Users:** Admin Users, Client Users, Permissions
- **Support:** Tickets, Messages, Documents
- **Marketing:** Newsletter, Campaigns, Analytics
- **System:** Settings, Redirects, Notifications, SEO

See `prisma/schema.prisma` for complete schema.

## 🔐 Security Features

- NextAuth.js authentication with JWT
- Role-based access control (SUPER_ADMIN, EDITOR, SUPPORT)
- Protected API routes with middleware
- CSRF protection
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- Secure password hashing (bcrypt)

## 🌍 Internationalization

- Default locale: Portuguese (`pt`)
- Secondary locale: English (`en`)
- URL structure: `/pt/page` and `/en/page`
- All content bilingual in database
- Automatic locale detection
- Language switcher component

## 📧 Email Templates

Pre-built branded templates for:

- Lead confirmation
- Order confirmation
- Review requests
- Newsletter confirmation
- Portal welcome
- Weekly admin digest

## 🎨 Design System

- Brand colors: Teal (#1B7A8A) + Orange (#F5A623)
- Consistent spacing scale
- Typography system
- Component library (shadcn/ui)
- Animation patterns (Framer Motion)
- Responsive breakpoints

## 🐛 Troubleshooting

### Database connection fails
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- For Neon.tech, verify connection string includes `?sslmode=require`

### Stripe webhooks not working
- Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`
- Restart dev server

### Build errors
- Run `npx prisma generate` to regenerate Prisma client
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### TypeScript errors
- Ensure all environment variables are set
- Run `npx tsc --noEmit` to check for type errors
- Check `types/next-auth.d.ts` for auth type extensions

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Support

For issues or questions:
- Email: geral@tecfazer.pt
- Phone: 963 101 123
- Website: https://tecfazer.pt

## 📄 License

Proprietary - Tec Fazer © 2024

---

**Built with ❤️ by Tec Fazer - Building The Future**
