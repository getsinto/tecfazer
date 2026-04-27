# Complete Environment Variables Setup Guide

## 📋 Overview

Your Tec Fazer project needs environment variables in two places:
1. **Vercel** (for production deployment)
2. **Local `.env.local`** (for local development)

---

## 🚀 For Production (Vercel)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com
2. Select your **tecfazer** project
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add these **3 CRITICAL** variables first:

#### 1. NEXTAUTH_SECRET
```bash
# Generate with:
openssl rand -base64 32
```
- **Key**: `NEXTAUTH_SECRET`
- **Value**: (your generated secret)
- **Environments**: ✅ Production, Preview, Development

#### 2. NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://tecfazer.pt`
- **Environments**: ✅ Production only

#### 3. DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://neondb_owner:npg_m0jVd7CTfUQB@ep-odd-king-anw9wc35-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Environments**: ✅ Production, Preview, Development

### Step 3: Add Optional Variables (as needed)

#### For Stripe Payments
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### For AI Chat
- `OPENAI_API_KEY`

#### For Email
- `RESEND_API_KEY`

#### For File Uploads
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

#### For Analytics
- `NEXT_PUBLIC_GA_ID`

### Step 4: Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click latest deployment
3. Click **⋯** menu → **Redeploy**
4. Wait 1-2 minutes

### Step 5: Verify

Visit: https://tecfazer.pt/api/auth/check

Should show:
```json
{
  "status": "ok",
  "checks": {
    "nextAuthSecret": true,
    "nextAuthUrl": "https://tecfazer.pt",
    "databaseUrl": true
  }
}
```

---

## 💻 For Local Development

### Step 1: Copy Environment File

The `.env.local` file is already created with your database URL.

### Step 2: Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output.

### Step 3: Update .env.local

Open `.env.local` and replace:
```env
NEXTAUTH_SECRET=GENERATE_YOUR_SECRET_HERE
```

With:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

### Step 4: Add Other API Keys (Optional)

Add keys for services you want to test locally:
- OpenAI API key
- Stripe test keys
- Resend API key
- etc.

### Step 5: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📊 Environment Variables Reference

### Critical (Required)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `DATABASE_URL` | Database connection | Neon.tech dashboard |
| `NEXTAUTH_SECRET` | Auth encryption | Generate with openssl |
| `NEXTAUTH_URL` | Auth callback URL | Your domain |

### Optional (Feature-specific)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `OPENAI_API_KEY` | AI chat widget | platform.openai.com |
| `RESEND_API_KEY` | Email sending | resend.com |
| `STRIPE_SECRET_KEY` | Payments | dashboard.stripe.com |
| `UPLOADTHING_SECRET` | File uploads | uploadthing.com |
| `NEXT_PUBLIC_GA_ID` | Analytics | analytics.google.com |

---

## 🔒 Security Best Practices

### DO:
✅ Use different secrets for production and development
✅ Rotate secrets regularly
✅ Use strong, random secrets (32+ characters)
✅ Keep `.env.local` in `.gitignore`
✅ Use environment-specific values

### DON'T:
❌ Commit `.env.local` to git
❌ Share secrets in public channels
❌ Use the same secret across environments
❌ Use weak or predictable secrets
❌ Hardcode secrets in code

---

## 🐛 Troubleshooting

### "Server error" on login
**Cause**: Missing NEXTAUTH_SECRET
**Fix**: Add to Vercel and redeploy

### "Database connection failed"
**Cause**: Wrong DATABASE_URL or database not accessible
**Fix**: 
1. Check URL is correct
2. Verify Neon.tech database is running
3. Check IP allowlist in Neon.tech

### "Invalid credentials"
**Cause**: User doesn't exist or wrong password
**Fix**: Create user in database (see AUTHENTICATION_GUIDE.md)

### Variables not working after adding
**Cause**: Didn't redeploy
**Fix**: Redeploy from Vercel dashboard

---

## 📝 Quick Commands

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Alternative (Node.js)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Check environment in production
```bash
curl https://tecfazer.pt/api/auth/check
```

### Start local development
```bash
npm run dev
```

---

## ✅ Setup Checklist

### Vercel (Production)
- [ ] NEXTAUTH_SECRET added
- [ ] NEXTAUTH_URL added
- [ ] DATABASE_URL added
- [ ] Redeployed after adding variables
- [ ] Verified at `/api/auth/check`
- [ ] Tested login at `/admin/login`

### Local Development
- [ ] `.env.local` file exists
- [ ] NEXTAUTH_SECRET generated and added
- [ ] DATABASE_URL is correct
- [ ] Can run `npm run dev` successfully
- [ ] Can access http://localhost:3000

---

## 🎯 Expected Results

After proper setup:

### Production
- ✅ Login works without errors
- ✅ Database queries succeed
- ✅ Authentication is functional
- ✅ All features work as expected

### Local Development
- ✅ Dev server starts without errors
- ✅ Can connect to database
- ✅ Can test authentication locally
- ✅ Hot reload works

---

## 📞 Need Help?

1. Check `/api/auth/check` endpoint
2. Review Vercel deployment logs
3. Verify all variables are spelled correctly
4. Make sure you redeployed after adding variables
5. Check `.env.local` has no syntax errors

---

**Files to reference:**
- `.env.example` - Template with all variables
- `.env.local` - Your local development config
- `FIX_LOGIN_NOW.md` - Quick fix guide
- `AUTHENTICATION_GUIDE.md` - Full auth documentation

---

**Last Updated**: 2024
**Status**: Ready for deployment
