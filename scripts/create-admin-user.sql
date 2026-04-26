-- Create Admin User Script
-- 
-- Instructions:
-- 1. Generate password hash using: node scripts/generate-password-hash.js "YourPassword"
-- 2. Replace the values below with your actual data
-- 3. Run this SQL in your database (Neon.tech console or psql)

-- Example: Create a new admin user
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
  'newadmin@tecfazer.pt',                    -- Change this email
  'Admin Name',                               -- Change this name
  '$2a$10$REPLACE_WITH_YOUR_HASHED_PASSWORD', -- Replace with generated hash
  'ADMIN',                                    -- Options: 'ADMIN' or 'SUPER_ADMIN'
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT id, email, name, role, "createdAt" 
FROM "User" 
WHERE email = 'newadmin@tecfazer.pt';

-- ============================================
-- ROLES EXPLANATION:
-- ============================================
-- SUPER_ADMIN: Full access to everything including system settings
-- ADMIN: Access to content management, limited settings access
-- ============================================

-- ============================================
-- DEFAULT ADMIN CREDENTIALS (if not changed):
-- ============================================
-- Email: admin@tecfazer.pt
-- Password: TecFazer2024Admin
-- ============================================
