import { Router, type RequestHandler } from 'express'
import { createAuthRouter, comparePassword } from 'longcelot-sheet-db'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { env } from '../../config/env'
import { signJwt } from '../../utils/jwt'

// GET /api/admin/auth/google  →  GET /api/admin/auth/callback
// Must be mounted on the root app (not inside a sub-router) so req.path is not stripped.
export function createAdminGoogleAuthHandler(adapter: SheetAdapter): RequestHandler {
  const googleAuth = createAuthRouter({
    adapter,
    basePath: '/api/admin',
    jwtSecret: env.JWT_SECRET,
    frontendUrl: `${env.FRONTEND_URL}/auth/callback`,
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
        profileUrl: profile.picture ?? user.profile_url ?? null,
      }
    },
  })
  return googleAuth.handler as RequestHandler
}

export function createAuthRoutes(adapter: SheetAdapter) {
  const router = Router()

  // ── Email + password login ─────────────────────────────────────────────────
  // POST /api/auth/login
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string }

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const ctx = adapter.withContext({ userId: 'auth', role: 'admin', actorSheetId: '' })
      const user = await ctx.table('users').findOne({ where: { email } }) as any

      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      if (!user.password_hash) {
        return res.status(401).json({
          message: 'This account uses Google Sign-In. Please use "Continue with Google".',
        })
      }

      const valid = await comparePassword(password, user.password_hash)
      if (!valid) return res.status(401).json({ message: 'Invalid email or password' })

      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: [],
        profileUrl: user.profile_url ?? null,
      }

      res.json({ token: signJwt(payload, env.JWT_SECRET), user: payload })
    } catch (err) {
      next(err)
    }
  })

  return router
}
