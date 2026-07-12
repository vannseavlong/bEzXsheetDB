import dotenv from 'dotenv'
dotenv.config()

function get(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback
  if (val === undefined) throw new Error(`Missing required env var: ${key}`)
  return val
}

// 'sheets' locally/staging, Render Postgres in production — override with $DB_DRIVER for a
// one-off flip (e.g. dual-write verification against prod Postgres from a non-production
// NODE_ENV) without touching code. See longcelot-sheet-db FAQ.md #13 and README §"Reference
// CI/CD pipeline" for the dual-write-then-flip cutover model this supports.
const NODE_ENV = get('NODE_ENV', 'development')
const DB_DRIVER = get('DB_DRIVER', NODE_ENV === 'production' ? 'postgres' : 'sheets') as
  | 'sheets'
  | 'postgres'
  | 'mysql'

export const env = {
  NODE_ENV,
  DB_DRIVER,
  // createDatabaseAdapter() reads $DATABASE_URL directly for the postgres/mysql drivers — only
  // actually required when one of those is selected.
  DATABASE_URL: DB_DRIVER === 'sheets' ? process.env.DATABASE_URL : get('DATABASE_URL'),
  PORT: get('PORT', '3000'),
  FRONTEND_URL: get('FRONTEND_URL', 'http://localhost:5173'),
  JWT_SECRET: get('JWT_SECRET', 'dev-secret-change-in-production'),
  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: get('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: get('GOOGLE_REDIRECT_URI'),
  // Separate from GOOGLE_REDIRECT_URI (which is the admin/adapter callback) because
  // createAuthRouter sends whatever redirectUri its OAuth client was built with — reusing
  // the admin URI here would bounce mini-app users back into the admin callback handler.
  // Must be added as an additional "Authorized redirect URI" on the same Google OAuth client.
  GOOGLE_USER_REDIRECT_URI: get('GOOGLE_USER_REDIRECT_URI'),
  MINI_APP_FRONTEND_URL: get('MINI_APP_FRONTEND_URL', 'http://localhost:5173'),
  // Always required, regardless of DB_DRIVER: file uploads (routes/admin/upload.ts) always ride
  // on Google Drive via a Sheets-backed client (config/adapter.ts's `storage`), since the SQL
  // adapters have no upload/storage concept of their own.
  ADMIN_SHEET_ID: get('ADMIN_SHEET_ID'),
  // Used as the shared customer-actor tenant key on every driver (Sheets sheet ID, or the SQL
  // adapters' `tenant_id` value) — real per-customer isolation is the `user_id` column filter
  // routes already apply on top, so this staying constant across drivers is correct, not a gap.
  DEV_USER_SHEET_ID: get('DEV_USER_SHEET_ID'),
  SUPER_ADMIN_EMAIL: get('SUPER_ADMIN_EMAIL'),
  SHEET_DB_TOKENS: process.env.SHEET_DB_TOKENS,
  ON_SCHEMA_MISMATCH: get('ON_SCHEMA_MISMATCH', 'warn') as 'warn' | 'error' | 'auto-sync',
  // Straight-line service area check for the mini-app's address distance guard.
  // Defaults are Phnom Penh city center — replace with the real business origin.
  SERVICE_ORIGIN_LAT: parseFloat(get('SERVICE_ORIGIN_LAT', '11.5564')),
  SERVICE_ORIGIN_LNG: parseFloat(get('SERVICE_ORIGIN_LNG', '104.9282')),
  MAX_SERVICE_DISTANCE_KM: parseFloat(get('MAX_SERVICE_DISTANCE_KM', '25')),
}
