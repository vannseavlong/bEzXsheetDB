import { Router, type RequestHandler } from 'express'
import { createAuthRouter, comparePassword } from 'longcelot-sheet-db'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { env } from '../../config/env'
import { signJwt } from '../../utils/jwt'
import { requireAuth, type AuthRequest } from '../../middleware/auth'
import { getRoles, getModules, getActions, getRolePermissions } from '../../utils/rbac-cache'

async function resolveRole(adapter: SheetAdapter, roleId: string): Promise<any> {
  const roles = await getRoles(adapter)
  return roles.find((r: any) => String(r._id) === String(roleId)) ?? null
}

async function buildPermissions(adapter: SheetAdapter, role: any): Promise<string[]> {
  if (!role || role.code === 'super_admin') return []
  const [all, modules, actions] = await Promise.all([
    getRolePermissions(adapter),
    getModules(adapter),
    getActions(adapter),
  ])
  const moduleById = new Map(modules.map((m) => [String(m._id), m.key]))
  const actionById = new Map(actions.map((a) => [String(a._id), a.key]))

  return all
    .filter((rp: any) => String(rp.role_id) === String(role._id))
    .map((rp: any) => {
      const moduleKey = moduleById.get(String(rp.module_id))
      const actionKey = actionById.get(String(rp.action_id))
      return moduleKey && actionKey ? `${moduleKey}:${actionKey}` : null
    })
    .filter((p): p is string => !!p)
}

// GET /api/admin/auth/google  →  GET /api/admin/auth/callback
// Must be mounted on the root app (not inside a sub-router) so req.path is not stripped.
export function createAdminGoogleAuthHandler(adapter: SheetAdapter): RequestHandler {
  const googleAuth = createAuthRouter({
    adapter,
    basePath: '/api/admin',
    jwtSecret: env.JWT_SECRET,
    frontendUrl: `${env.FRONTEND_URL}/auth/callback`,
    registrationPolicy: 'login-only',
    async onUser(profile, adapter) {
      const ctx = adapter.withContext({ userId: 'auth', actor: 'admin', actorSheetId: '' })
      const user = await ctx.table('users').findOne({ where: { email: profile.email } }) as any
      if (!user || user.status !== 'active') return null
      const role = await resolveRole(adapter, user.role_id)
      const permissions = await buildPermissions(adapter, role)
      return {
        id: user._id,
        email: user.email,
        name: profile.name,
        role: role?.code ?? null,
        permissions,
        profileUrl: profile.picture ?? user.profile_url ?? null,
      }
    },
  })
  return googleAuth.handler as RequestHandler
}

export function createAuthRoutes(adapter: SheetAdapter) {
  const router = Router()

  // POST /api/auth/login
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string }

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const ctx = adapter.withContext({ userId: 'auth', actor: 'admin', actorSheetId: '' })
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

      const role = await resolveRole(adapter, user.role_id)
      const permissions = await buildPermissions(adapter, role)
      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: role?.code ?? null,
        permissions,
        profileUrl: user.profile_url ?? null,
      }

      res.json({ token: signJwt(payload, env.JWT_SECRET), user: payload })
    } catch (err) {
      next(err)
    }
  })

  // GET /api/admin/auth/me — re-derives role/permissions from the current DB state and
  // reissues a token, so a role's permissions take effect without the user re-entering
  // credentials. The frontend calls this on load/focus/interval instead of trusting the
  // (possibly stale) permissions baked into the token it already has.
  router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const id = req.user?.id as string | undefined
      if (!id) return res.status(401).json({ message: 'Invalid or expired token' })

      const ctx = adapter.withContext({ userId: 'auth', actor: 'admin', actorSheetId: '' })
      const user = await ctx.table('users').findOne({ where: { _id: id } }) as any
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Account is no longer active' })
      }

      const role = await resolveRole(adapter, user.role_id)
      const permissions = await buildPermissions(adapter, role)
      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: role?.code ?? null,
        permissions,
        profileUrl: user.profile_url ?? null,
      }

      res.json({ token: signJwt(payload, env.JWT_SECRET), user: payload })
    } catch (err) {
      next(err)
    }
  })

  return router
}
