# Vercel Environment Variables Setup

## Critical Environment Variables for Portal Login

The portal login requires these environment variables to be set in Vercel:

### 1. NEXTAUTH_SECRET (Required)
Generate a secure secret:
```bash
openssl rand -base64 32
```

Then add to Vercel:
- Go to: https://vercel.com/your-project/settings/environment-variables
- Variable: `NEXTAUTH_SECRET`
- Value: (paste the generated secret)
- Environment: Production, Preview, Development

### 2. NEXTAUTH_URL (Required)
- Variable: `NEXTAUTH_URL`
- Value: `https://tecfazer.pt`
- Environment: Production

### 3. DATABASE_URL (Required)
Your Neon.tech PostgreSQL connection string:
- Variable: `DATABASE_URL`
- Value: `postgresql://user:password@host:5432/tecfazer?sslmode=require`
- Environment: Production, Preview, Development

## All Environment Variables Needed

```env
# App
NEXT_PUBLIC_SITE_URL=https://tecfazer.pt
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Database
DATABASE_URL=postgresql://user:password@host:5432/tecfazer?sslmode=require

# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://tecfazer.pt

# Stripe
STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Resend
RESEND_API_KEY=re_your_api_key

# Uploadthing
UPLOADTHING_SECRET=sk_live_your_secret
UPLOADTHING_APP_ID=your_app_id

# Admin
ADMIN_EMAIL=geral@tecfazer.pt
NOTIFICATION_EMAIL=info@tecfazer.pt
CRON_SECRET=your-random-cron-secret

# Estimator
NEXT_PUBLIC_ESTIMATOR_CURRENCY=EUR
```

## How to Add in Vercel

1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add each variable one by one
5. Select which environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your project

## Testing Portal Login

After setting up the environment variables:

1. Create a test client user in the database:
```sql
INSERT INTO "ClientUser" (id, email, name, "hashedPassword", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'test@client.com',
  'Test Client',
  '$2a$10$YourHashedPasswordHere',
  NOW(),
  NOW()
);
```

2. Visit: https://tecfazer.pt/pt/portal/login
3. Login with the test credentials

## Troubleshooting

If you still see "Server error":
1. Check Vercel logs: https://vercel.com/your-project/logs
2. Verify NEXTAUTH_SECRET is set
3. Verify DATABASE_URL is correct
4. Check that the database is accessible from Vercel
5. Ensure NextAuth URL matches your domain

## Current Fix Applied

The code now includes:
- ✅ Lazy database initialization (getDbClient)
- ✅ Error handling in auth callbacks
- ✅ Fallback secret for development
- ✅ Debug mode in development
- ✅ Correct provider ID ('portal' for client login)
