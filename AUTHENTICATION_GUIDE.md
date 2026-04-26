# Authentication Guide - Tec Fazer

## Overview

The Tec Fazer platform has two separate authentication systems:
1. **Admin Panel** - For administrators to manage the website
2. **Client Portal** - For customers to access their projects and documents

---

## 🔐 Admin Login

### Access URL
- **Production**: https://tecfazer.pt/admin/login
- **Local**: http://localhost:3000/admin/login

### Default Admin Credentials
```
Email: admin@tecfazer.pt
Password: TecFazer2024Admin
```

### Admin Features
- Dashboard with analytics
- Content management (Blog, Projects, Services, Team, Testimonials)
- Client management
- Order management
- Lead management
- Pricing plans
- Settings
- Reviews moderation

### How to Create New Admin Users

You need to create admin users directly in the database:

```sql
-- Generate password hash first (use bcrypt with 10 rounds)
-- For password "MySecurePassword123"
-- Hash: $2a$10$YourHashedPasswordHere

INSERT INTO "User" (
  id,
  email,
  name,
  "hashedPassword",
  role,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'newadmin@tecfazer.pt',
  'Admin Name',
  '$2a$10$YourHashedPasswordHere',
  'ADMIN', -- or 'SUPER_ADMIN' for full access
  NOW(),
  NOW()
);
```

### Admin Roles
- **SUPER_ADMIN**: Full access to everything including settings
- **ADMIN**: Access to content management, limited settings access

---

## 👤 Client Portal Login

### Access URL
- **Production**: https://tecfazer.pt/pt/portal/login
- **Local**: http://localhost:3000/pt/portal/login

### Client Portal Features
- View project status and details
- Access project documents
- Submit support tickets
- View invoices and billing
- Update profile information

### How Customers Get Access

**Currently, there is NO self-registration system.** Customers must be created by administrators.

#### Method 1: Admin Creates Client (Recommended)

1. Admin logs into admin panel
2. Goes to "Clients" section
3. Clicks "Add New Client"
4. Fills in client information
5. System generates login credentials
6. Credentials are sent to client via email

#### Method 2: Direct Database Creation

```sql
-- Generate password hash first (use bcrypt with 10 rounds)
-- For password "ClientPassword123"
-- Hash: $2a$10$YourHashedPasswordHere

INSERT INTO "ClientUser" (
  id,
  email,
  name,
  "hashedPassword",
  phone,
  company,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'client@example.com',
  'Client Name',
  '$2a$10$YourHashedPasswordHere',
  '+351 123 456 789',
  'Company Name',
  NOW(),
  NOW()
);
```

---

## 🔧 Setting Up Authentication

### 1. Environment Variables (Required)

Add these to your Vercel environment variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://tecfazer.pt

# Database
DATABASE_URL=postgresql://user:password@host:5432/tecfazer?sslmode=require
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Database Setup

Ensure these tables exist in your database:
- `User` - For admin users
- `ClientUser` - For client portal users

### 3. Password Hashing

To generate password hashes for manual user creation:

**Using Node.js:**
```javascript
const bcrypt = require('bcryptjs');
const password = 'YourPassword123';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

**Using Online Tool:**
- Visit: https://bcrypt-generator.com/
- Enter password
- Use 10 rounds
- Copy the hash

---

## 🚀 Adding Self-Registration (Future Enhancement)

Currently, customers cannot register themselves. To add this feature, you would need:

### Client Registration Page
- Create `/app/[locale]/portal/register/page.tsx`
- Form with: name, email, password, company, phone
- Email verification system
- Terms & conditions acceptance

### Registration Flow
1. Customer fills registration form
2. System creates ClientUser record
3. Sends verification email
4. Customer verifies email
5. Account is activated
6. Customer can login

### Admin Approval (Optional)
- New registrations require admin approval
- Admin receives notification
- Admin reviews and approves/rejects
- Customer receives approval email

---

## 🔒 Security Best Practices

### For Admins
1. ✅ Use strong passwords (min 12 characters)
2. ✅ Change default admin password immediately
3. ✅ Don't share admin credentials
4. ✅ Use SUPER_ADMIN role sparingly
5. ✅ Regularly audit admin access logs

### For Clients
1. ✅ Enforce strong password policy
2. ✅ Implement password reset functionality
3. ✅ Add two-factor authentication (future)
4. ✅ Session timeout after inactivity
5. ✅ Email notifications for login attempts

### For Developers
1. ✅ Never commit credentials to git
2. ✅ Use environment variables
3. ✅ Keep NEXTAUTH_SECRET secure
4. ✅ Use HTTPS in production
5. ✅ Implement rate limiting on login endpoints

---

## 🐛 Troubleshooting

### "Server error" on Login
**Cause**: Missing NEXTAUTH_SECRET or DATABASE_URL
**Solution**: 
1. Check Vercel environment variables
2. Ensure NEXTAUTH_SECRET is set
3. Verify DATABASE_URL is correct
4. Check Vercel logs for detailed error

### "Invalid credentials" Error
**Cause**: Wrong email/password or user doesn't exist
**Solution**:
1. Verify user exists in database
2. Check password hash is correct
3. Ensure using correct login page (admin vs portal)
4. Try password reset (if implemented)

### Can't Access Portal After Login
**Cause**: Session not being created properly
**Solution**:
1. Clear browser cookies
2. Check NEXTAUTH_URL matches your domain
3. Verify database connection
4. Check browser console for errors

### Admin Login Redirects to Portal
**Cause**: Using wrong credentials provider
**Solution**:
- Admin login uses 'admin' provider
- Portal login uses 'portal' provider
- Ensure correct login page URL

---

## 📝 Quick Reference

### Login URLs
| Type | URL |
|------|-----|
| Admin | `/admin/login` |
| Portal | `/pt/portal/login` or `/en/portal/login` |

### Database Tables
| Type | Table | Key Fields |
|------|-------|------------|
| Admin | `User` | email, hashedPassword, role |
| Client | `ClientUser` | email, hashedPassword |

### Auth Providers
| Type | Provider ID | Used For |
|------|-------------|----------|
| Admin | `admin` | Admin panel authentication |
| Portal | `portal` | Client portal authentication |

---

## 📞 Support

If you need help with authentication:
1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Check this guide for common issues
5. Contact development team

---

## 🔄 Next Steps

To improve the authentication system:

1. **Add Client Self-Registration**
   - Registration form
   - Email verification
   - Password strength requirements

2. **Password Reset**
   - Forgot password link
   - Email with reset token
   - Secure password reset flow

3. **Two-Factor Authentication**
   - SMS or authenticator app
   - Backup codes
   - Optional for clients, required for admins

4. **Session Management**
   - View active sessions
   - Logout from all devices
   - Session timeout settings

5. **Audit Logging**
   - Track login attempts
   - Log admin actions
   - Security alerts

---

**Last Updated**: 2024
**Version**: 1.0
