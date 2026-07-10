import { Router, type RequestHandler } from 'express'
import { hashPassword, comparePassword, validatePasswordStrength, createAuthRouter } from 'longcelot-sheet-db'
import type { SheetAdapter, GoogleProfile } from 'longcelot-sheet-db'
import { env } from '../../config/env'
import { signJwt } from '../../utils/jwt'
import { requireAuth, requireRole, type AuthRequest } from '../../middleware/auth'

// The sheet row is snake_case; the mini-app (and everything it talks to here) expects
// camelCase, so both the JWT payload and the user DTO sent back to the client are
// normalised here rather than leaking the raw row shape.
function toUserDto(user: Record<string, any>) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    profileUrl: user.profile_url ?? null,
    status: user.status,
    language: user.language ?? null,
    gender: user.gender ?? null,
    dob: user.dob ?? null,
    createdAt: user._created_at,
    updatedAt: user._updated_at,
  }
}

function toJwtPayload(user: Record<string, any>) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    profileUrl: user.profile_url ?? null,
    role: 'user',
  }
}

// GET /api/user/auth/google  →  GET /api/user/auth/callback
// Must be mounted on the root app (not inside a sub-router) so req.path is not stripped,
// and given its own oauthConfig — otherwise it would default to GOOGLE_REDIRECT_URI and
// Google would bounce mini-app users back into the admin callback instead.
export function createUserGoogleAuthHandler(adapter: SheetAdapter): RequestHandler {
  const ctx = () => adapter.withContext({ userId: 'auth', actor: 'user', actorSheetId: env.DEV_USER_SHEET_ID })

  const googleAuth = createAuthRouter({
    adapter,
    basePath: '/api/user',
    jwtSecret: env.JWT_SECRET,
    frontendUrl: `${env.MINI_APP_FRONTEND_URL}/auth/callback`,
    registrationPolicy: 'open',
    oauthConfig: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_USER_REDIRECT_URI,
    },
    async onUser(profile: GoogleProfile, adapter) {
      // Rare, but an unverified email can't be trusted as the account identity —
      // fall through to a bare-profile token (no id/role) rather than provisioning it.
      if (profile.email_verified === false) return null

      let user = await ctx().table('customers').findOne({ where: { email: profile.email } }) as Record<string, any> | null

      if (!user) {
        const [firstName, ...restName] = profile.name.trim().split(/\s+/)
        user = await ctx().table('customers').create({
          email: profile.email,
          first_name: firstName,
          last_name: restName.join(' ') || firstName,
          status: 'active',
          profile_url: profile.picture ?? null,
        }) as Record<string, any>
      }

      return { ...toJwtPayload(user), status: user.status }
    },
  })
  return googleAuth.handler as RequestHandler
}

export function createUserAuthRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'auth', actor: 'user', actorSheetId: env.DEV_USER_SHEET_ID })

  // POST /api/user/auth/register
  router.post('/register', async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body as {
        email?: string; password?: string; firstName?: string; lastName?: string; phone?: string
      }

      if (!email || !password || !firstName || !lastName || !phone) {
        return res.status(400).json({ message: 'email, password, firstName, lastName and phone are required' })
      }

      const { valid, errors } = validatePasswordStrength(password)
      if (!valid) return res.status(400).json({ message: errors.join('. ') })

      const [existingEmail, existingPhone] = await Promise.all([
        ctx().table('customers').findOne({ where: { email } }),
        ctx().table('customers').findOne({ where: { phone } }),
      ])
      if (existingEmail) return res.status(409).json({ message: 'A user with this email already exists' })
      if (existingPhone) return res.status(409).json({ message: 'A user with this phone already exists' })

      const password_hash = await hashPassword(password)

      const user = await ctx().table('customers').create({
        email,
        password_hash,
        first_name: firstName,
        last_name: lastName,
        phone,
        status: 'active',
      }) as Record<string, any>

      const token = signJwt(toJwtPayload(user), env.JWT_SECRET)
      res.status(201).json({ token, user: toUserDto(user) })
    } catch (err) { next(err) }
  })

  // POST /api/user/auth/login
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string }
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const user = await ctx().table('customers').findOne({ where: { email } }) as Record<string, any> | null
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const valid = await comparePassword(password, user.password_hash)
      if (!valid) return res.status(401).json({ message: 'Invalid email or password' })

      const token = signJwt(toJwtPayload(user), env.JWT_SECRET)
      res.json({ token, user: toUserDto(user) })
    } catch (err) { next(err) }
  })

  // GET /api/user/auth/me — re-derives the user from the current DB state and reissues
  // a token, mirroring GET /admin/auth/me, so the frontend can silently restore a
  // session on load instead of trusting a possibly-stale token forever.
  router.get('/me', requireAuth, requireRole('user'), async (req: AuthRequest, res, next) => {
    try {
      const id = req.user?.id as string | undefined
      if (!id) return res.status(401).json({ message: 'Invalid or expired token' })

      const user = await ctx().table('customers').findOne({ where: { _id: id } }) as Record<string, any> | null
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Account is no longer active' })
      }

      const token = signJwt(toJwtPayload(user), env.JWT_SECRET)
      res.json({ token, user: toUserDto(user) })
    } catch (err) { next(err) }
  })

  return router
}
