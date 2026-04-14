# Tec Fazer - Quick Start Guide

## 🚀 Get Running in 15 Minutes

### Step 1: Install Dependencies (2 min)

```bash
npm install
```

### Step 2: Setup Database (5 min)

**Option A: Use Neon.tech (Recommended - Free)**

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project called "tecfazer"
4. Copy the connection string
5. Paste into `.env.local` as `DATABASE_URL`

**Option B: Use Local PostgreSQL**

```bash
# Make sure PostgreSQL is running
# Update DATABASE_URL in .env.local with your local connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/tecfazer"
```

### Step 3: Configure Environment (3 min)

Edit `.env.local` and update these **required** variables:

```bash
# Database (from Step 2)
DATABASE_URL=your_database_url_here

# Auth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_generated_secret_here

# Site URL (keep as is for local dev)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Optional** (can add later):
- Stripe keys (for payments)
- OpenAI key (for AI features)
- Resend key (for emails)
- Uploadthing keys (for file uploads)

### Step 4: Initialize Database (2 min)

```bash
# Create database tables
npx prisma migrate dev --name init

# Seed with sample data (once seed.ts is created)
# npx prisma db seed
```

### Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 What You'll See

Currently, you'll see a blank page because:
- ✅ Infrastructure is complete
- ✅ Database is ready
- ⏳ Pages need to be built (Phase 2-4)

## 📝 Next Steps

### Immediate (to see something working):

1. **Create translation files** so text can display:
   ```bash
   # Create messages/pt.json and messages/en.json
   # See IMPLEMENTATION_STATUS.md for required structure
   ```

2. **Create a simple homepage**:
   ```bash
   # Create app/[locale]/page.tsx
   # Add a simple "Hello World" to verify routing works
   ```

3. **Create database seed**:
   ```bash
   # Create prisma/seed.ts
   # Run: npx prisma db seed
   # This gives you data to work with
   ```

### Short-term (build the UI):

4. **Build UI components** (buttons, inputs, cards)
5. **Create layout** (Navbar, Footer)
6. **Build homepage sections** (Hero, Services, Portfolio, etc.)
7. **Add public pages** (Services, Portfolio, Blog, Contact)

### Medium-term (add functionality):

8. **Implement API routes** (contact form, newsletter, etc.)
9. **Build admin dashboard** (content management)
10. **Add client portal** (project tracking)
11. **Integrate chat widget** (AI assistant)

## 🔍 Verify Installation

Run these commands to check everything is working:

```bash
# Check TypeScript (should show no errors)
npx tsc --noEmit

# Check Prisma (should open database viewer)
npx prisma studio

# Check build (should complete successfully)
npm run build
```

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in `.env.local`
- Ensure PostgreSQL is running (if local)
- For Neon.tech, verify connection string includes `?sslmode=require`

### "NEXTAUTH_SECRET is not defined"
- Run: `openssl rand -base64 32`
- Copy output to NEXTAUTH_SECRET in `.env.local`
- Restart dev server

### "Module not found"
- Run: `npm install`
- Run: `npx prisma generate`
- Clear `.next` folder: `rm -rf .next`

### "Port 3000 already in use"
- Kill the process: `npx kill-port 3000`
- Or use different port: `npm run dev -- -p 3001`

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma db seed       # Seed database
npx prisma generate      # Regenerate client

# TypeScript
npx tsc --noEmit        # Check types
```

## 🎨 Project Structure

```
tecfazer/
├── app/                 # Next.js pages (to be built)
├── components/          # React components (to be built)
├── lib/                 # ✅ Utility functions (complete)
├── prisma/              # ✅ Database schema (complete)
├── types/               # ✅ TypeScript types (complete)
├── messages/            # ⏳ Translations (to be created)
├── public/              # ⏳ Static assets (to be added)
└── .env.local           # ⚠️ Configure this first!
```

## 💡 Pro Tips

1. **Use Prisma Studio** to inspect your database visually
2. **Check IMPLEMENTATION_STATUS.md** for detailed progress
3. **Read PROJECT_SUMMARY.md** for architecture overview
4. **Follow README.md** for complete documentation
5. **Start with Phase 2** (translations + seed) before building UI

## 🎯 Success Criteria

You're ready to build when:
- ✅ `npm run dev` starts without errors
- ✅ `npx tsc --noEmit` shows zero errors
- ✅ `npx prisma studio` opens database viewer
- ✅ Database is connected and migrated
- ✅ Environment variables are configured

## 🚀 Ready to Build!

You have a **production-grade foundation**. The infrastructure is solid, type-safe, and follows best practices. Now it's time to build the user interface!

**Recommended path:**
1. Create translation files (30 min)
2. Create database seed (1 hour)
3. Build UI component library (3-4 hours)
4. Build homepage (2-3 hours)
5. Add remaining pages (5-8 hours)
6. Implement API routes (4-6 hours)
7. Build admin dashboard (6-8 hours)

**Total estimated time to completion: 20-30 hours with AI assistance**

---

**Questions? Check README.md or open an issue!**

**Built with ❤️ for Tec Fazer - Building The Future**
