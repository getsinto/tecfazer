# 🚀 Quick Start Guide - Tec Fazer

## Login Information

### 🔐 Admin Panel
**URL**: https://tecfazer.pt/admin/login

**Default Credentials** (change immediately!):
```
Email: admin@tecfazer.pt
Password: TecFazer2024Admin
```

**Features**:
- Content management (Blog, Projects, Services)
- Client & order management
- Analytics dashboard
- Settings & configuration

---

### 👤 Client Portal
**URL**: https://tecfazer.pt/pt/portal/login

**Note**: Clients cannot self-register. Admins must create client accounts.

**Features**:
- View projects
- Access documents
- Submit tickets
- View invoices

---

## How to Create Users

### Method 1: Using Scripts (Recommended)

```bash
# 1. Generate password hash
node scripts/generate-password-hash.js "YourPassword123"

# 2. Copy the hash

# 3. Run SQL script in your database
# - For admin: scripts/create-admin-user.sql
# - For client: scripts/create-client-user.sql
```

### Method 2: Direct SQL

**Create Admin:**
```sql
INSERT INTO "User" (id, email, name, "hashedPassword", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@tecfazer.pt',
  'Admin Name',
  '$2a$10$YOUR_HASH_HERE',
  'SUPER_ADMIN',
  NOW(),
  NOW()
);
```

**Create Client:**
```sql
INSERT INTO "ClientUser" (id, email, name, "hashedPassword", phone, company, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'client@example.com',
  'Client Name',
  '$2a$10$YOUR_HASH_HERE',
  '+351 123 456 789',
  'Company Name',
  NOW(),
  NOW()
);
```

---

## Important URLs

| Page | URL |
|------|-----|
| Homepage | https://tecfazer.pt/pt |
| Admin Login | https://tecfazer.pt/admin/login |
| Client Portal | https://tecfazer.pt/pt/portal/login |
| Services | https://tecfazer.pt/pt/servicos |
| Portfolio | https://tecfazer.pt/pt/portfolio |
| Blog | https://tecfazer.pt/pt/blog |
| Pricing | https://tecfazer.pt/pt/precos |
| Contact | https://tecfazer.pt/pt/contacto |
| About | https://tecfazer.pt/pt/sobre |
| Budget Calculator | https://tecfazer.pt/pt/orcamento |

---

## Environment Variables (Vercel)

**Required for authentication:**
```env
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://tecfazer.pt
DATABASE_URL=postgresql://...
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## Common Issues

### ❌ "Server error" on login
**Fix**: Set NEXTAUTH_SECRET in Vercel environment variables

### ❌ "Invalid credentials"
**Fix**: Verify user exists in database and password hash is correct

### ❌ Can't access portal after login
**Fix**: Clear cookies, check NEXTAUTH_URL matches domain

---

## Documentation

- 📖 **Full Auth Guide**: `AUTHENTICATION_GUIDE.md`
- 🔧 **Vercel Setup**: `VERCEL_ENV_SETUP.md`
- 👥 **User Setup**: `scripts/setup-users.md`
- 📋 **Project Complete**: `PROJECT_100_PERCENT_COMPLETE.md`

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon.tech)
- **Auth**: NextAuth v5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Payments**: Stripe
- **Email**: Resend
- **File Upload**: Uploadthing
- **AI Chat**: OpenAI GPT-4o

---

## Support

Need help? Check:
1. Vercel deployment logs
2. Database connection
3. Environment variables
4. Documentation files
5. Contact development team

---

**Last Updated**: 2024
**Version**: 1.0
