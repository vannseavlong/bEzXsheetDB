import dotenv from 'dotenv'
dotenv.config()

function get(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback
  if (val === undefined) throw new Error(`Missing required env var: ${key}`)
  return val
}

export const env = {
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
  ADMIN_SHEET_ID: get('ADMIN_SHEET_ID'),
  DEV_USER_SHEET_ID: get('DEV_USER_SHEET_ID'),
  SUPER_ADMIN_EMAIL: get('SUPER_ADMIN_EMAIL'),
  SHEET_DB_TOKENS: process.env.SHEET_DB_TOKENS,
  ON_SCHEMA_MISMATCH: get('ON_SCHEMA_MISMATCH', 'warn') as 'warn' | 'error' | 'auto-sync',
}
