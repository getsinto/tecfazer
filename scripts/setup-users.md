# User Setup Guide

## Quick Start: Create Your First Users

### Step 1: Generate Password Hashes

```bash
# Install dependencies if not already installed
npm install

# Generate hash for admin password
node scripts/generate-password-hash.js "YourAdminPassword123"

# Generate hash for client password
node scripts/generate-password-hash.js "YourClientPassword123"
```

Copy the generated hashes - you'll need them in the next step.

---

### Step 2: Create Admin User

1. Open your database console (Neon.tech or psql)
2. Copy the SQL from `scripts/create-admin-user.sql`
3. Replace these values:
   - Email: `newadmin@tecfazer.pt`
   - Name: `Admin Name`
   - HashedPassword: (paste the hash from Step 1)
   - Role: `ADMIN` or `SUPER_ADMIN`
4. Run the SQL query

**Example:**
```sql
INSERT INTO "User" (
  id, email, name, "hashedPassword", role, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'john@tecfazer.pt',
  'John Silva',
  '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK',
  'SUPER_ADMIN',
  NOW(),
  NOW()
);
```

---

### Step 3: Create Client User

1. Open your database console
2. Copy the SQL from `scripts/create-client-user.sql`
3. Replace these values:
   - Email: `client@example.com`
   - Name: `Client Full Name`
   - HashedPassword: (paste the hash from Step 1)
   - Phone: `+351 123 456 789`
   - Company: `Company Name Ltd`
4. Run the SQL query

**Example:**
```sql
INSERT INTO "ClientUser" (
  id, email, name, "hashedPassword", phone, company, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'maria@example.com',
  'Maria Santos',
  '$2a$10$zyxwvutsrqponmlkjihgfedcba0987654321ZYXWVUTSRQ',
  '+351 987 654 321',
  'Santos Consulting',
  NOW(),
  NOW()
);
```

---

### Step 4: Test Login

#### Test Admin Login
1. Go to: https://tecfazer.pt/admin/login
2. Enter your admin email and password
3. You should be redirected to the admin dashboard

#### Test Client Login
1. Go to: https://tecfazer.pt/pt/portal/login
2. Enter your client email and password
3. You should be redirected to the client portal dashboard

---

## Default Credentials

### Default Admin (if exists)
```
Email: admin@tecfazer.pt
Password: TecFazer2024Admin
```

⚠️ **IMPORTANT**: Change this password immediately in production!

---

## Troubleshooting

### "Invalid credentials" error
- ✅ Check email is correct
- ✅ Verify password hash was generated correctly
- ✅ Ensure user exists in correct table (User vs ClientUser)
- ✅ Check you're using the correct login page

### "Server error" message
- ✅ Check NEXTAUTH_SECRET is set in Vercel
- ✅ Verify DATABASE_URL is correct
- ✅ Check Vercel deployment logs
- ✅ Ensure database is accessible

### Can't generate password hash
- ✅ Run `npm install` first
- ✅ Check Node.js is installed (v18+)
- ✅ Try: `npm install bcryptjs`

---

## Password Requirements

### For Production
- ✅ Minimum 12 characters
- ✅ Mix of uppercase and lowercase
- ✅ Include numbers
- ✅ Include special characters
- ✅ No common words or patterns

### Good Examples
- `MyS3cur3P@ssw0rd!2024`
- `TecF@zer#Admin$2024`
- `Cl!ent$P0rt@l#2024`

### Bad Examples
- ❌ `password123`
- ❌ `admin`
- ❌ `12345678`
- ❌ `tecfazer`

---

## Bulk User Creation

If you need to create multiple users, you can modify the SQL scripts:

```sql
-- Create multiple admins at once
INSERT INTO "User" (id, email, name, "hashedPassword", role, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'admin1@tecfazer.pt', 'Admin One', '$2a$10$hash1', 'ADMIN', NOW(), NOW()),
  (gen_random_uuid(), 'admin2@tecfazer.pt', 'Admin Two', '$2a$10$hash2', 'ADMIN', NOW(), NOW()),
  (gen_random_uuid(), 'admin3@tecfazer.pt', 'Admin Three', '$2a$10$hash3', 'SUPER_ADMIN', NOW(), NOW());

-- Create multiple clients at once
INSERT INTO "ClientUser" (id, email, name, "hashedPassword", phone, company, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'client1@example.com', 'Client One', '$2a$10$hash1', '+351 111', 'Company 1', NOW(), NOW()),
  (gen_random_uuid(), 'client2@example.com', 'Client Two', '$2a$10$hash2', '+351 222', 'Company 2', NOW(), NOW()),
  (gen_random_uuid(), 'client3@example.com', 'Client Three', '$2a$10$hash3', '+351 333', 'Company 3', NOW(), NOW());
```

---

## Next Steps

After creating users:

1. ✅ Test both admin and client logins
2. ✅ Change default admin password
3. ✅ Set up email notifications
4. ✅ Configure password reset (if needed)
5. ✅ Add more admins/clients as needed
6. ✅ Review security settings

---

## Need Help?

- 📖 Read: `AUTHENTICATION_GUIDE.md`
- 🔧 Check: `VERCEL_ENV_SETUP.md`
- 🐛 Debug: Check Vercel logs
- 💬 Contact: Development team
