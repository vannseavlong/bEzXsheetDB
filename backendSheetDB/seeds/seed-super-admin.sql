-- One-time super admin seed for the production Postgres DB.
-- lsdb seed is Sheets-only (no --driver flag) — this is the Postgres equivalent
-- of seeds/super-admin.ts. Run with:
--   psql "$DATABASE_URL" -f seeds/seed-super-admin.sql
--
-- Edit the two values below before running.
\set admin_email '''seavlongvann55@gmail.com'''
\set admin_name '''Super Admin'''

-- 1. Ensure the super_admin role exists (no-op if already migrated in from Sheets)
INSERT INTO roles (_id, name, code, description, status, created_by, _created_at, _updated_at)
VALUES (
  substr(md5(random()::text), 1, 21),
  'Super Admin',
  'super_admin',
  'Full system access, bypasses RBAC checks',
  'active',
  'seed-cli',
  now(),
  now()
)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert the super admin user, linked to that role.
-- password_hash is left NULL on purpose — matches seeds/super-admin.ts's original
-- intent: this account logs in via "Continue with Google" only (see
-- routes/auth/index.ts's "This account uses Google Sign-In" check), so the email
-- below must be a real Google account.
INSERT INTO users (_id, user_id, name, role_id, email, actor_sheet_id, status, password_hash, profile_url, _created_at, _updated_at)
VALUES (
  substr(md5(random()::text), 1, 21),
  'user_' || extract(epoch from now())::bigint,
  :admin_name,
  (SELECT _id FROM roles WHERE code = 'super_admin'),
  :admin_email,
  '',
  'active',
  NULL,
  NULL,
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- 3. Verify
SELECT u._id, u.email, u.name, r.code AS role_code
FROM users u JOIN roles r ON r._id = u.role_id
WHERE u.email = :admin_email;
