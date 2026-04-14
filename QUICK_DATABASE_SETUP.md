# 🚀 Quick Database Setup Guide

## Issues Fixed

1. ✅ **Root Layout** - Added missing `<html>` and `<body>` tags
2. ⏳ **Database Connection** - Needs PostgreSQL setup

---

## Option 1: Free Cloud Database (Recommended - 5 minutes)

### Using Neon.tech (Free Forever, No Credit Card)

1. **Sign Up**
   - Go to https://neon.tech
   - Click "Sign Up" (use GitHub, Google, or email)
   - No credit card required!

2. **Create Project**
   - Click "Create Project"
   - Name: `tecfazer`
   - Region: Choose closest to you
   - Click "Create Project"

3. **Get Connection String**
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - Copy this entire string

4. **Update .env.local**
   - Open `.env.local` in your project
   - Replace the `DATABASE_URL` line with:
   ```env
   DATABASE_URL=your-copied-connection-string-here
   ```

5. **Setup Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed with sample data
   npx prisma db seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Done!** 🎉
   - Open http://localhost:3000
   - Admin login: admin@tecfazer.pt / TecFazer2024Admin

---

## Option 2: Supabase (Also Free Forever)

1. **Sign Up**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Name: `tecfazer`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

3. **Get Connection String**
   - Go to Project Settings (gear icon)
   - Click "Database" in sidebar
   - Scroll to "Connection string"
   - Select "URI" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Update .env.local**
   ```env
   DATABASE_URL=your-supabase-connection-string-here
   ```

5. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## Option 3: Local PostgreSQL (Advanced)

### Windows

1. **Download PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL 16
   - During installation:
     - Set password for postgres user (remember this!)
     - Port: 5432 (default)
     - Locale: Default

2. **Create Database**
   - Open pgAdmin (installed with PostgreSQL)
   - Right-click "Databases" → "Create" → "Database"
   - Name: `tecfazer`
   - Click "Save"

3. **Update .env.local**
   ```env
   DATABASE_URL=postgresql://postgres:your-password@localhost:5432/tecfazer?schema=public
   ```
   Replace `your-password` with the password you set during installation

4. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

### Mac

1. **Install PostgreSQL**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```

2. **Create Database**
   ```bash
   createdb tecfazer
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL=postgresql://localhost:5432/tecfazer?schema=public
   ```

4. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

### Linux

1. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   sudo -u postgres createdb tecfazer
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL=postgresql://postgres@localhost:5432/tecfazer?schema=public
   ```

4. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

---

## Verify Setup

After completing any option above, verify everything works:

```bash
# Open Prisma Studio to see your data
npx prisma studio
```

This will open http://localhost:5555 where you can see all your database tables and data.

---

## Troubleshooting

### Error: "Can't reach database server"
- **Cloud Database:** Check your connection string is correct
- **Local Database:** Make sure PostgreSQL is running
  - Windows: Check Services → PostgreSQL should be "Running"
  - Mac: `brew services list` → postgresql should be "started"
  - Linux: `sudo systemctl status postgresql` → should be "active"

### Error: "Authentication failed"
- Check your password in the connection string
- Make sure there are no special characters that need URL encoding

### Error: "Database does not exist"
- Make sure you created the database
- Check the database name in your connection string matches

### Error: "SSL connection required"
- For cloud databases, add `?sslmode=require` to the end of your connection string

---

## What Gets Created

When you run `npx prisma db seed`, you'll get:

- ✅ 1 Admin user (admin@tecfazer.pt / TecFazer2024Admin)
- ✅ 1 Site settings record
- ✅ 6 Team members with photos and skills
- ✅ 35+ Services across all categories
- ✅ 4 Pricing plans (Starter, Business, Enterprise, Custom)
- ✅ 8 Testimonials with 5-star ratings
- ✅ 8 Estimator features
- ✅ 2 URL redirects

---

## Next Steps

Once your database is set up:

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Browse the public pages
4. Login to admin: http://localhost:3000/admin/login
   - Email: admin@tecfazer.pt
   - Password: TecFazer2024Admin
5. Explore the admin dashboard and content management

---

## Recommended: Use Neon.tech

For the easiest setup with zero configuration:
- ✅ Free forever (no credit card)
- ✅ No installation required
- ✅ Works immediately
- ✅ Automatic backups
- ✅ 0.5 GB storage (plenty for development)
- ✅ Can upgrade later if needed

Just follow Option 1 above - takes 5 minutes total!
