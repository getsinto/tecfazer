# 🚨 URGENT: Fix Login in 5 Minutes

## Current Status
Your site is deployed but login won't work because environment variables are missing:
- ❌ NEXTAUTH_SECRET is missing
- ❌ NEXTAUTH_URL is not set
- ❌ DATABASE_URL is missing

## ✅ Step-by-Step Fix

### Step 1: Generate NEXTAUTH_SECRET (1 minute)

Open your terminal and run:
```bash
openssl rand -base64 32
```

**You'll get something like:**
```
Kix2f3VqJZ8YhN9mP4rT6wQ1sL7uE0vX2cA5bD8gH3j=
```

**Copy this entire string!** You'll need it in Step 2.

**Don't have openssl?** Use this Node.js command instead:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### Step 2: Add Environment Variables to Vercel (3 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Click on your **tecfazer** project

2. **Open Settings**
   - Click the **"Settings"** tab at the top
   - Click **"Environment Variables"** in the left sidebar

3. **Add NEXTAUTH_SECRET**
   - Click **"Add New"** button
   - Fill in:
     - **Key**: `NEXTAUTH_SECRET`
     - **Value**: (paste the secret from Step 1)
     - **Environments**: ✅ Check all three boxes:
       - Production
       - Preview  
       - Development
   - Click **"Save"**

4. **Add NEXTAUTH_URL**
   - Click **"Add New"** again
   - Fill in:
     - **Key**: `NEXTAUTH_URL`
     - **Value**: `https://tecfazer.pt`
     - **Environments**: ✅ Check **Production** only
   - Click **"Save"**

5. **Add DATABASE_URL**
   - Click **"Add New"** again
   - Fill in:
     - **Key**: `DATABASE_URL`
     - **Value**: Your Neon.tech PostgreSQL connection string
       - Format: `postgresql://user:password@host:5432/tecfazer?sslmode=require`
       - Get this from: https://console.neon.tech
   - **Environments**: ✅ Check all three boxes
   - Click **"Save"**

---

### Step 3: Redeploy (1 minute)

1. **Go to Deployments**
   - Click the **"Deployments"** tab at the top

2. **Redeploy Latest**
   - Click on the **latest deployment** (top of the list)
   - Click the **"⋯"** menu (three dots in the top right)
   - Click **"Redeploy"**
   - Confirm by clicking **"Redeploy"** again

3. **Wait for Deployment**
   - Wait 1-2 minutes for the deployment to complete
   - You'll see a green checkmark when it's done

---

### Step 4: Verify It Works (30 seconds)

1. **Check Configuration**
   - Visit: https://tecfazer.pt/api/auth/check
   - You should now see:
     ```json
     {
       "status": "ok",
       "checks": {
         "nextAuthSecret": true,  ← Should be true now
         "nextAuthUrl": "https://tecfazer.pt",
         "databaseUrl": true,  ← Should be true now
         "nodeEnv": "production"
       },
       "message": "NextAuth is configured"
     }
     ```

2. **Test Admin Login**
   - Visit: https://tecfazer.pt/admin/login
   - Login with:
     ```
     Email: admin@tecfazer.pt
     Password: TecFazer2024Admin
     ```
   - Should work! ✅

---

## 📋 Quick Reference

### Where to Get Each Value

| Variable | Where to Get It |
|----------|----------------|
| NEXTAUTH_SECRET | Generate with: `openssl rand -base64 32` |
| NEXTAUTH_URL | Use: `https://tecfazer.pt` |
| DATABASE_URL | Get from Neon.tech dashboard |

### Neon.tech Database URL

1. Go to: https://console.neon.tech
2. Select your **tecfazer** project
3. Click **"Connection Details"**
4. Copy the **"Connection string"**
5. Make sure it includes `?sslmode=require` at the end

**Example format:**
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/tecfazer?sslmode=require
```

---

## 🐛 Troubleshooting

### Still seeing "Server error" after adding variables?

**Check:**
1. ✅ Did you click "Save" for each variable?
2. ✅ Did you redeploy after adding variables?
3. ✅ Did you wait for deployment to complete?
4. ✅ Did you clear browser cache/cookies?

**Try:**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Open in incognito/private mode
- Check `/api/auth/check` to verify variables are set

### Variables show as "true" but login still fails?

**Possible causes:**
1. **Database not accessible**: Check Neon.tech is running
2. **Wrong credentials**: Verify email/password
3. **User doesn't exist**: Create user in database (see AUTHENTICATION_GUIDE.md)

### Can't find Neon.tech connection string?

1. Go to: https://console.neon.tech
2. Login to your account
3. Select your project
4. Look for "Connection Details" or "Connection String"
5. Copy the PostgreSQL connection string

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] `/api/auth/check` shows all values as `true`
- [ ] Admin login works at `/admin/login`
- [ ] No "Server error" message
- [ ] Can access admin dashboard
- [ ] All three environment variables are set in Vercel

---

## 🎯 Expected Result

After following these steps:

1. ✅ Login pages work without errors
2. ✅ Admin can access dashboard
3. ✅ Database connection is working
4. ✅ Authentication is fully functional

---

## 📞 Still Need Help?

If you've followed all steps and it's still not working:

1. Check Vercel deployment logs: https://vercel.com/your-project/logs
2. Verify all environment variables are spelled correctly (case-sensitive!)
3. Make sure you redeployed after adding variables
4. Try deleting and re-adding the variables
5. Contact support with:
   - Screenshot of `/api/auth/check` response
   - Screenshot of Vercel environment variables (hide values!)
   - Error message you're seeing

---

**Time to complete: 5 minutes**
**Difficulty: Easy**
**Required: Vercel account access + Neon.tech database**

🚀 **Let's get your login working!**
