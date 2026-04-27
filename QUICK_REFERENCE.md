# 🎯 Tec Fazer - Quick Reference Card

**Keep this handy for quick access to important information**

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| **Production Site** | https://tecfazer.pt |
| **Admin Panel** | https://tecfazer.pt/admin/login |
| **Client Portal** | https://tecfazer.pt/pt/portal/login |
| **API Health Check** | https://tecfazer.pt/api/auth/check |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Database Console** | https://console.neon.tech |
| **Google Analytics** | https://analytics.google.com |

---

## 🔑 Default Credentials (CHANGE THESE!)

### Admin Login
```
URL: https://tecfazer.pt/admin/login
Email: admin@tecfazer.pt
Password: TecFazer2024Admin
```

⚠️ **IMPORTANT**: Change this password immediately after first login!

---

## 🌍 Environment Variables

### Required (Must Have)
```env
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://tecfazer.pt
DATABASE_URL=postgresql://neondb_owner:npg_m0jVd7CTfUQB@ep-odd-king-anw9wc35-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_GA_ID=G-N7M3QCZZZK
```

### Optional (Add Later)
```env
RESEND_API_KEY=re_xxx                    # Email service
UPLOADTHING_SECRET=sk_live_xxx           # File uploads
UPLOADTHING_APP_ID=xxx                   # File uploads
STRIPE_PUBLIC_KEY=pk_test_xxx            # Payments
STRIPE_SECRET_KEY=sk_test_xxx            # Payments
STRIPE_WEBHOOK_SECRET=whsec_xxx          # Payments
OPENAI_API_KEY=sk-proj_xxx               # AI Chat
```

---

## 📊 Database Connection

### Connection String
```
postgresql://neondb_owner:npg_m0jVd7CTfUQB@ep-odd-king-anw9wc35-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Access Database
1. Go to: https://console.neon.tech
2. Select: neondb
3. Click: SQL Editor
4. Run queries

---

## 👥 User Management

### Create Admin User
```bash
# 1. Generate password hash
node scripts/generate-password-hash.js "YourPassword"

# 2. Run SQL in Neon.tech
INSERT INTO "User" (id, email, name, "hashedPassword", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'your@email.com',
  'Your Name',
  '$2a$10$YOUR_HASH_HERE',
  'SUPER_ADMIN',
  NOW(),
  NOW()
);
```

### Create Client User
```bash
# 1. Generate password hash
node scripts/generate-password-hash.js "ClientPassword"

# 2. Run SQL in Neon.tech
INSERT INTO "ClientUser" (id, email, name, "hashedPassword", phone, company, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'client@email.com',
  'Client Name',
  '$2a$10$YOUR_HASH_HERE',
  '+351 123 456 789',
  'Company Name',
  NOW(),
  NOW()
);
```

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linter
```

### Database
```bash
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma client
```

### Deployment
```bash
git add .
git commit -m "Your message"
git push origin main     # Auto-deploys to Vercel
```

---

## 🎨 Brand Colors

```css
/* Primary - Teal */
--primary: #1B7A8A
--primary-hover: #156570

/* Secondary - Orange */
--secondary: #F5A623
--secondary-hover: #E09612

/* Backgrounds */
--bg-white: #FFFFFF
--bg-slate-50: #F8FAFC
--bg-slate-100: #F1F5F9

/* Text */
--text-primary: #0F172A
--text-secondary: #334155
--text-muted: #64748B
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

---

## 🔍 SEO Checklist

- [x] Meta titles (50-60 chars)
- [x] Meta descriptions (150-160 chars)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Structured data (JSON-LD)
- [x] Alt text on images
- [x] Google Analytics
- [ ] Google Search Console (add your site)
- [ ] Bing Webmaster Tools (add your site)

---

## 📊 Analytics

### Google Analytics
- **ID**: G-N7M3QCZZZK
- **Dashboard**: https://analytics.google.com
- **Real-time**: Check visitor activity
- **Reports**: Traffic, conversions, behavior

### Track Custom Events
```javascript
// In your code
gtag('event', 'event_name', {
  'event_category': 'category',
  'event_label': 'label',
  'value': 1
});
```

---

## 🚨 Troubleshooting

### Login Not Working
1. Check: https://tecfazer.pt/api/auth/check
2. Verify environment variables in Vercel
3. Check database connection
4. Verify user exists in database
5. Check Vercel logs

### Contact Form Not Working
1. Check RESEND_API_KEY is set
2. Verify email service status
3. Check Vercel logs
4. Test API endpoint directly

### Images Not Loading
1. Check UPLOADTHING_SECRET is set
2. Verify file upload service
3. Check image URLs
4. Test upload manually

### Build Failing
1. Check Vercel logs
2. Verify all dependencies installed
3. Check TypeScript errors
4. Verify environment variables

---

## 📞 Support Services

### Email Service (Resend)
- **Website**: https://resend.com
- **Free Tier**: 3,000 emails/month
- **Docs**: https://resend.com/docs

### File Uploads (Uploadthing)
- **Website**: https://uploadthing.com
- **Free Tier**: 2GB storage
- **Docs**: https://docs.uploadthing.com

### Payments (Stripe)
- **Website**: https://stripe.com
- **Dashboard**: https://dashboard.stripe.com
- **Docs**: https://stripe.com/docs

### AI Chat (OpenAI)
- **Website**: https://platform.openai.com
- **Dashboard**: https://platform.openai.com/account
- **Docs**: https://platform.openai.com/docs

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_COMPLETE_SUMMARY.md` | Complete project overview |
| `LAUNCH_ROADMAP.md` | Step-by-step launch guide |
| `FINAL_DEPLOYMENT_CHECKLIST.md` | Detailed deployment checklist |
| `PROJECT_AUDIT_COMPLETE.md` | Full project audit |
| `AUTHENTICATION_GUIDE.md` | User management guide |
| `ENVIRONMENT_VARIABLES_EXPLAINED.md` | All env vars explained |
| `QUICK_REFERENCE.md` | This document |

---

## 🎯 Quick Start (15 Minutes)

### Step 1: Generate Secret (2 min)
```bash
openssl rand -base64 32
```

### Step 2: Add to Vercel (5 min)
1. Go to Vercel → Settings → Environment Variables
2. Add 4 variables (see above)
3. Save each

### Step 3: Redeploy (3 min)
1. Deployments → Latest → ⋯ → Redeploy
2. Wait for completion

### Step 4: Test (5 min)
1. Visit: https://tecfazer.pt/api/auth/check
2. Login: https://tecfazer.pt/admin/login
3. Change password

✅ **Done!** Your site is live.

---

## 📈 Success Metrics

### Week 1 Goals
- 100+ visitors
- 5+ leads
- 10+ newsletter signups

### Month 1 Goals
- 1,000+ visitors
- 50+ leads
- 100+ newsletter signups
- First client conversion

### Month 3 Goals
- 5,000+ visitors
- 200+ leads
- 500+ newsletter signups
- 10+ client conversions

---

## 🎉 You're Ready!

**Everything you need is in this document.**

**Next step**: Add environment variables to Vercel

**Time to launch**: 15 minutes

---

**Good luck! 🚀**

*Last Updated: April 28, 2026*

