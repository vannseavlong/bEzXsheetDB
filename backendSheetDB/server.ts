import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { createSheetAdapter, createAuthRouter } from 'longcelot-sheet-db'

import usersSchema from './schemas/admin/users'
import { createEmailLoginRouter } from './routes/auth'
import { createAdminUsersRouter } from './routes/admin/create-user'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

const credentials = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
}

const sheetsTokens = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '.sheet-db-tokens.json'), 'utf-8')
)

const adapter = createSheetAdapter({
  adminSheetId: process.env.ADMIN_SHEET_ID!,
  credentials,
  tokens: sheetsTokens,
})
adapter.registerSchema(usersSchema)

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())

// ─── Admin auth ───────────────────────────────────────────────────────────────
// Routes: GET /auth/google  →  GET /auth/callback
// Policy 'open' so the router always redirects to the frontend (no 401 pages).
// If onUser returns null the JWT will have no 'role' — AuthCallbackPage detects
// this and shows "Account not authorised" on the login screen.

const auth = createAuthRouter({
  adapter,
  jwtSecret: JWT_SECRET,
  frontendUrl: `${FRONTEND_URL}/auth/callback`,
  registrationPolicy: 'open',
  async onUser(profile, adapter) {
    const ctx = adapter.withContext({ userId: 'auth', role: 'admin', actorSheetId: '' })
    const user = await ctx.table('users').findOne({ where: { email: profile.email } }) as any

    if (!user || user.status !== 'active') return null

    return {
      id: user._id,
      email: user.email,
      name: profile.name,
      role: user.role,
      permissions: [],
    }
  },
})

app.use(auth.handler)

// ─── Email + password login ───────────────────────────────────────────────────
app.use('/api/auth', createEmailLoginRouter(adapter))

// ─── Admin — create user (super admin only) ───────────────────────────────────
app.use('/api/admin/users', createAdminUsersRouter(adapter))

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`bEasy API server running on http://localhost:${PORT}`)
})
