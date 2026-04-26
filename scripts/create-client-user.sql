-- Create Client User Script
-- 
-- Instructions:
-- 1. Generate password hash using: node scripts/generate-password-hash.js "ClientPassword"
-- 2. Replace the values below with your actual client data
-- 3. Run this SQL in your database (Neon.tech console or psql)

-- Example: Create a new client user
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
  'client@example.com',                       -- Change this email
  'Client Full Name',                         -- Change this name
  '$2a$10$REPLACE_WITH_YOUR_HASHED_PASSWORD', -- Replace with generated hash
  '+351 123 456 789',                         -- Change phone (optional)
  'Company Name Ltd',                         -- Change company (optional)
  NOW(),
  NOW()
);

-- Verify the client was created
SELECT id, email, name, company, phone, "createdAt" 
FROM "ClientUser" 
WHERE email = 'client@example.com';

-- ============================================
-- OPTIONAL: Link client to a project
-- ============================================
-- First, find the client ID and project ID:
-- SELECT id FROM "ClientUser" WHERE email = 'client@example.com';
-- SELECT id FROM "Project" WHERE title = 'Project Name';

-- Then create the relationship:
-- INSERT INTO "_ClientToProject" ("A", "B")
-- VALUES (
--   'client-uuid-here',
--   'project-uuid-here'
-- );

-- ============================================
-- CLIENT PORTAL ACCESS:
-- ============================================
-- URL: https://tecfazer.pt/pt/portal/login
-- Email: client@example.com
-- Password: (the password you used to generate the hash)
-- ============================================
