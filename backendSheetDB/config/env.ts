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
  ADMIN_SHEET_ID: get('ADMIN_SHEET_ID'),
  SUPER_ADMIN_EMAIL: get('SUPER_ADMIN_EMAIL'),
  ON_SCHEMA_MISMATCH: get('ON_SCHEMA_MISMATCH', 'warn') as 'warn' | 'error' | 'auto-sync',
}
