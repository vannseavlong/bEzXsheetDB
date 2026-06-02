import { Router } from 'express'
import { comparePassword } from 'longcelot-sheet-db'
import { signJwt } from '../utils/jwt'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createEmailLoginRouter(adapter: SheetAdapter) {
  const router = Router()

  // POST /api/auth/login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
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
      if (!valid) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: [],
        profileUrl: user.profile_url ?? null,
      }

      const token = signJwt(
        payload,
        process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
      )

      res.json({ token, user: payload })
    } catch (err) {
      console.error('[POST /api/auth/login]', err)
      res.status(500).json({ message: 'Authentication failed' })
    }
  })

  return router
}
