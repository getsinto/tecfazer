# 🚨 URGENT: Fix "Server Error" on Login

## The Problem

You're seeing "Server error - There is a problem with the server configuration" because **NEXTAUTH_SECRET is not set in Vercel**.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Generate a Secret

Run this command on your computer:

```bash
openssl rand -base64 32
```

**Example output:**
```
Kix2f3VqJZ8YhN9mP4rT6wQ1sL7uE0vX2cA5bD8gH3j=
```

Copy this entire string.

---

### Step 2: Add to Vercel

1. Go to: https://vercel.com/your-username/tecfazer/settings/environment-variables

2. Click **"Add New"**

3. Fill in:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: (paste the string from Step 1)
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. Click **"Save"**

---

### Step 3: Add NEXTAUTH_URL

While you're there, add another variable:

1. Click **"Add New"** again

2. Fill in:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://tecfazer.pt`
   - **Environments**: Check **Production** only

3. Click **"Save"**

---

### Step 4: Redeploy

1. Go to: https://vercel.com/your-username/tecfazer/deployments

2. Click on the latest deployment

3. Click the **"⋯"** menu (three dots)

4. Click **"Redeploy"**

5. Wait 1-2 minutes for deployment to complete

---

### Step 5: Test Login

After redeployment completes:

1. Visit: https://tecfazer.pt/admin/login

2. Try logging in with:
   ```
   Email: admin@tecfazer.pt
   Password: TecFazer2024Admin
   ```

3. Should work now! ✅

---

## 🔍 Verify Environment Variables

Visit this URL to check if variables are set:
```
https://tecfazer.pt/api/auth/check
```

You should see:
```json
{
  "status": "ok",
  "checks": {
    "nextAuthSecret": true,
    "nextAuthUrl": "https://tecfazer.pt",
    "databaseUrl": true,
    "nodeEnv": "production"
  },
  "message": "NextAuth is configured"
}
```

If `nextAuthSecret` is `false`, the environment variable is not set correctly.

---

## 📋 All Required Environment Variables

Here's the complete list you should have in Vercel:

```env
# Required for Authentication
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://tecfazer.pt

# Required for Database
DATABASE_URL=postgresql://user:password@host:5432/tecfazer?sslmode=require

# Optional but Recommended
NEXT_PUBLIC_SITE_URL=https://tecfazer.pt
OPENAI_API_KEY=sk-your-key
RESEND_API_KEY=re_your-key
STRIPE_SECRET_KEY=sk_live_your-key
UPLOADTHING_SECRET=sk_live_your-secret
```

---

## 🐛 Still Not Working?

### Check Vercel Logs

1. Go to: https://vercel.com/your-username/tecfazer/logs

2. Look for errors related to:
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - Authentication errors

### Common Issues

**Issue**: "Server error" persists after adding NEXTAUTH_SECRET
**Solution**: 
- Make sure you clicked "Save" in Vercel
- Verify you redeployed after adding the variable
- Check the variable name is exactly `NEXTAUTH_SECRET` (case-sensitive)

**Issue**: "Invalid credentials" error
**Solution**: 
- This is different from "Server error"
- This means authentication is working but credentials are wrong
- Check email/password are correct
- Verify user exists in database

**Issue**: Can't generate secret (no openssl)
**Solution**:
- Use online generator: https://generate-secret.vercel.app/32
- Or use Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

---

## 📞 Need Help?

1. Check Vercel deployment logs
2. Visit `/api/auth/check` to verify configuration
3. Review `AUTHENTICATION_GUIDE.md`
4. Check database connection
5. Contact development team

---

## ✅ Checklist

Before asking for help, verify:

- [ ] NEXTAUTH_SECRET is set in Vercel
- [ ] NEXTAUTH_URL is set to https://tecfazer.pt
- [ ] DATABASE_URL is set and correct
- [ ] You redeployed after adding variables
- [ ] You waited for deployment to complete
- [ ] You cleared browser cache/cookies
- [ ] You're using the correct login URL
- [ ] You checked `/api/auth/check` endpoint

---

**Last Updated**: 2024
**Priority**: URGENT - Required for login to work
