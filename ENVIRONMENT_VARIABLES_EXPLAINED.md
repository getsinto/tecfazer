# 🔐 Environment Variables - Complete Explanation

## Table of Contents
1. [Critical Variables (Required)](#critical-variables-required)
2. [Payment Variables (Stripe)](#payment-variables-stripe)
3. [AI Chat Variables (OpenAI)](#ai-chat-variables-openai)
4. [Email Variables (Resend)](#email-variables-resend)
5. [File Upload Variables (Uploadthing)](#file-upload-variables-uploadthing)
6. [SMS/WhatsApp Variables (Twilio)](#smswhatsapp-variables-twilio)
7. [Analytics Variables (Google)](#analytics-variables-google)
8. [Admin Variables](#admin-variables)
9. [Quick Setup Priority](#quick-setup-priority)

---

## Critical Variables (Required)

These 3 variables are **REQUIRED** for the site to work. Without them, login and database features won't work.

### 1. DATABASE_URL

**What it does:**
- Connects your application to the PostgreSQL database
- Stores all data: users, projects, blog posts, clients, etc.

**You already have this:**
```
postgresql://neondb_owner:npg_m0jVd7CTfUQB@ep-odd-king-anw9wc35-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**How to get it (if you need a new one):**
1. Go to: https://console.neon.tech
2. Login to your account
3. Select your project (or create new one)
4. Click "Connection Details"
5. Copy the "Connection string"
6. Make sure it includes `?sslmode=require` at the end

**Add to Vercel:**
- Key: `DATABASE_URL`
- Value: (your connection string)
- Environments: ✅ Production, Preview, Development

---

### 2. NEXTAUTH_SECRET

**What it does:**
- Encrypts authentication tokens and sessions
- Keeps user login sessions secure
- Required for admin and client portal login

**How to generate:**

**Option 1 - Using OpenSSL (Recommended):**
```bash
openssl rand -base64 32
```

**Option 2 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 - Online Generator:**
- Visit: https://generate-secret.vercel.app/32
- Click "Generate"
- Copy the secret

**Example output:**
```
Kix2f3VqJZ8YhN9mP4rT6wQ1sL7uE0vX2cA5bD8gH3j=
```

**Add to Vercel:**
- Key: `NEXTAUTH_SECRET`
- Value: (your generated secret)
- Environments: ✅ Production, Preview, Development

**Important:**
- Use a different secret for production and development
- Never share this secret
- Keep it at least 32 characters long

---

### 3. NEXTAUTH_URL

**What it does:**
- Tells NextAuth where your site is hosted
- Used for login/logout redirects
- Required for authentication callbacks

**Value for production:**
```
https://tecfazer.pt
```

**Value for local development:**
```
http://localhost:3000
```

**Add to Vercel:**
- Key: `NEXTAUTH_URL`
- Value: `https://tecfazer.pt`
- Environments: ✅ Production only

**Note:** For Preview and Development, you can leave this empty or set to preview URL.

---

## Payment Variables (Stripe)

These are needed if you want to accept payments on your site.

### 4. STRIPE_PUBLIC_KEY

**What it does:**
- Public key for Stripe payment forms
- Safe to expose in frontend code
- Used to initialize Stripe.js

**How to get:**
1. Go to: https://dashboard.stripe.com
2. Create account or login
3. Go to: Developers → API keys
4. Copy "Publishable key"

**Test mode example:**
```
pk_test_51Abc123...xyz
```

**Live mode example:**
```
pk_live_51Abc123...xyz
```

**Add to Vercel:**
- Key: `STRIPE_PUBLIC_KEY`
- Value: (your publishable key)
- Environments: ✅ Production, Preview, Development

**Cost:** Free to create account, pay only when you process payments

---

### 5. STRIPE_SECRET_KEY

**What it does:**
- Private key for server-side Stripe operations
- Creates payment intents, manages subscriptions
- **NEVER expose in frontend code**

**How to get:**
1. Same dashboard as above
2. Copy "Secret key"

**Test mode example:**
```
sk_test_51Abc123...xyz
```

**Live mode example:**
```
sk_live_51Abc123...xyz
```

**Add to Vercel:**
- Key: `STRIPE_SECRET_KEY`
- Value: (your secret key)
- Environments: ✅ Production, Preview, Development

**Important:** Use test keys for development, live keys for production only.

---

### 6. STRIPE_WEBHOOK_SECRET

**What it does:**
- Verifies webhook events from Stripe
- Ensures payment notifications are authentic
- Required for subscription management

**How to get:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://tecfazer.pt/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy "Signing secret"

**Example:**
```
whsec_abc123xyz...
```

**Add to Vercel:**
- Key: `STRIPE_WEBHOOK_SECRET`
- Value: (your webhook secret)
- Environments: ✅ Production

**Note:** You'll need different webhook endpoints for test and live modes.

---

## AI Chat Variables (OpenAI)

Needed for the AI chat widget on your site.

### 7. OPENAI_API_KEY

**What it does:**
- Powers the AI chat assistant
- Uses GPT-4o model for conversations
- Answers customer questions automatically

**How to get:**
1. Go to: https://platform.openai.com
2. Create account or login
3. Go to: API keys
4. Click "Create new secret key"
5. Give it a name (e.g., "Tec Fazer Production")
6. Copy the key immediately (you can't see it again!)

**Example:**
```
sk-proj-abc123xyz...
```

**Add to Vercel:**
- Key: `OPENAI_API_KEY`
- Value: (your API key)
- Environments: ✅ Production, Preview, Development

**Cost:**
- Pay per use (tokens)
- GPT-4o: ~$0.005 per 1K tokens
- Set usage limits in OpenAI dashboard
- Typical chat: $0.01-0.05 per conversation

**Budget tip:** Start with $10 credit, monitor usage.

---

## Email Variables (Resend)

Needed to send emails (contact forms, notifications, password resets).

### 8. RESEND_API_KEY

**What it does:**
- Sends transactional emails
- Contact form submissions
- Order confirmations
- Password reset emails

**How to get:**
1. Go to: https://resend.com
2. Create account (free tier available)
3. Verify your domain or use their test domain
4. Go to: API Keys
5. Click "Create API Key"
6. Copy the key

**Example:**
```
re_abc123xyz...
```

**Add to Vercel:**
- Key: `RESEND_API_KEY`
- Value: (your API key)
- Environments: ✅ Production, Preview, Development

**Cost:**
- Free tier: 3,000 emails/month
- Paid: $20/month for 50,000 emails

**Domain setup:**
1. Add your domain in Resend
2. Add DNS records they provide
3. Verify domain
4. Start sending from your@tecfazer.pt

---

## File Upload Variables (Uploadthing)

Needed for uploading images and files (blog images, project files, etc.).

### 9. UPLOADTHING_SECRET

**What it does:**
- Authenticates file uploads
- Manages file storage
- Handles image optimization

**How to get:**
1. Go to: https://uploadthing.com
2. Create account
3. Create new app
4. Go to: API Keys
5. Copy "Secret Key"

**Example:**
```
sk_live_abc123xyz...
```

**Add to Vercel:**
- Key: `UPLOADTHING_SECRET`
- Value: (your secret key)
- Environments: ✅ Production, Preview, Development

**Cost:**
- Free tier: 2GB storage, 2GB bandwidth/month
- Paid: $10/month for 100GB

---

### 10. UPLOADTHING_APP_ID

**What it does:**
- Identifies your app to Uploadthing
- Links uploads to your account

**How to get:**
1. Same dashboard as above
2. Copy "App ID"

**Example:**
```
abc123xyz
```

**Add to Vercel:**
- Key: `UPLOADTHING_APP_ID`
- Value: (your app ID)
- Environments: ✅ Production, Preview, Development

---

## SMS/WhatsApp Variables (Twilio)

**Optional** - Only needed if you want SMS/WhatsApp notifications.

### 11. TWILIO_ACCOUNT_SID

**What it does:**
- Identifies your Twilio account
- Required for sending SMS/WhatsApp

**How to get:**
1. Go to: https://console.twilio.com
2. Create account
3. Find "Account SID" on dashboard

**Example:**
```
ACabc123xyz...
```

**Cost:**
- Pay per message
- SMS: ~$0.0075 per message
- WhatsApp: ~$0.005 per message

---

### 12. TWILIO_AUTH_TOKEN

**What it does:**
- Authenticates API requests to Twilio

**How to get:**
1. Same dashboard
2. Find "Auth Token" (click to reveal)

**Example:**
```
abc123xyz...
```

---

### 13. TWILIO_WHATSAPP_FROM

**What it does:**
- WhatsApp number to send from

**How to get:**
1. In Twilio console
2. Go to: Messaging → Try it out → Send a WhatsApp message
3. Use Twilio sandbox number for testing

**Example:**
```
whatsapp:+14155238886
```

---

### 14. TWILIO_SMS_FROM

**What it does:**
- Phone number to send SMS from

**How to get:**
1. Buy a phone number in Twilio
2. Go to: Phone Numbers → Manage → Buy a number
3. Copy the number

**Example:**
```
+15551234567
```

---

## Analytics Variables (Google)

### 15. NEXT_PUBLIC_GA_ID

**What it does:**
- Tracks website visitors
- Analyzes user behavior
- Measures conversions

**How to get:**
1. Go to: https://analytics.google.com
2. Create account
3. Add property for tecfazer.pt
4. Copy "Measurement ID"

**Example:**
```
G-ABC123XYZ
```

**Add to Vercel:**
- Key: `NEXT_PUBLIC_GA_ID`
- Value: (your measurement ID)
- Environments: ✅ Production

**Cost:** Free

**Note:** Starts with `G-` for GA4 (Google Analytics 4)

---

## Admin Variables

### 16. ADMIN_EMAIL

**What it does:**
- Default admin email address
- Receives system notifications

**Value:**
```
geral@tecfazer.pt
```

**Add to Vercel:**
- Key: `ADMIN_EMAIL`
- Value: `geral@tecfazer.pt`
- Environments: ✅ Production

---

### 17. NOTIFICATION_EMAIL

**What it does:**
- Receives contact form submissions
- Gets lead notifications

**Value:**
```
info@tecfazer.pt
```

**Add to Vercel:**
- Key: `NOTIFICATION_EMAIL`
- Value: `info@tecfazer.pt`
- Environments: ✅ Production

---

### 18. CRON_SECRET

**What it does:**
- Secures cron job endpoints
- Prevents unauthorized access to scheduled tasks

**How to generate:**
```bash
openssl rand -hex 32
```

**Example:**
```
abc123def456...
```

**Add to Vercel:**
- Key: `CRON_SECRET`
- Value: (your generated secret)
- Environments: ✅ Production

---

### 19. NEXT_PUBLIC_ESTIMATOR_CURRENCY

**What it does:**
- Sets currency for budget calculator

**Value:**
```
EUR
```

**Add to Vercel:**
- Key: `NEXT_PUBLIC_ESTIMATOR_CURRENCY`
- Value: `EUR`
- Environments: ✅ Production

---

### 20. NEXT_PUBLIC_SITE_URL

**What it does:**
- Base URL for your site
- Used for generating absolute URLs

**Value:**
```
https://tecfazer.pt
```

**Add to Vercel:**
- Key: `NEXT_PUBLIC_SITE_URL`
- Value: `https://tecfazer.pt`
- Environments: ✅ Production

---

## Quick Setup Priority

### Phase 1: Get Site Working (Required)
1. ✅ `DATABASE_URL` - You already have this
2. ✅ `NEXTAUTH_SECRET` - Generate with openssl
3. ✅ `NEXTAUTH_URL` - Use https://tecfazer.pt

**Time:** 5 minutes
**Cost:** Free

---

### Phase 2: Basic Features (Recommended)
4. `RESEND_API_KEY` - For contact forms
5. `UPLOADTHING_SECRET` - For image uploads
6. `UPLOADTHING_APP_ID` - For image uploads
7. `NEXT_PUBLIC_SITE_URL` - For SEO

**Time:** 15 minutes
**Cost:** Free (with free tiers)

---

### Phase 3: Advanced Features (Optional)
8. `STRIPE_PUBLIC_KEY` - For payments
9. `STRIPE_SECRET_KEY` - For payments
10. `STRIPE_WEBHOOK_SECRET` - For payments
11. `OPENAI_API_KEY` - For AI chat

**Time:** 30 minutes
**Cost:** Pay per use

---

### Phase 4: Marketing & Analytics (Optional)
12. `NEXT_PUBLIC_GA_ID` - For analytics
13. `TWILIO_*` - For SMS/WhatsApp

**Time:** 20 minutes
**Cost:** Free (GA) / Pay per use (Twilio)

---

## Summary Table

| Variable | Required? | Cost | Setup Time |
|----------|-----------|------|------------|
| DATABASE_URL | ✅ Yes | Free | 0 min (you have it) |
| NEXTAUTH_SECRET | ✅ Yes | Free | 1 min |
| NEXTAUTH_URL | ✅ Yes | Free | 1 min |
| RESEND_API_KEY | Recommended | Free tier | 5 min |
| UPLOADTHING_* | Recommended | Free tier | 5 min |
| STRIPE_* | Optional | Pay per use | 15 min |
| OPENAI_API_KEY | Optional | Pay per use | 5 min |
| TWILIO_* | Optional | Pay per use | 10 min |
| NEXT_PUBLIC_GA_ID | Optional | Free | 5 min |

---

## Quick Start Command

To get started immediately, just add these 3:

```bash
# 1. Generate secret
openssl rand -base64 32

# 2. Add to Vercel:
# - NEXTAUTH_SECRET: (generated secret)
# - NEXTAUTH_URL: https://tecfazer.pt
# - DATABASE_URL: (you already have this)

# 3. Redeploy
```

**That's it! Your site will work with just these 3 variables.** 🚀

Add others as you need the features.

---

## Need Help?

- **Can't generate secret?** Use: https://generate-secret.vercel.app/32
- **Don't have openssl?** Use Node.js command above
- **Need test API keys?** Most services have test/sandbox modes
- **Confused about costs?** Start with free tiers, upgrade later

---

**Remember:** You only need 3 variables to get started. Add others when you need those features!
