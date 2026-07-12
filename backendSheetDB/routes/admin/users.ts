import { Router } from 'express'
import { hashPassword, validatePasswordStrength } from 'longcelot-sheet-db'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { requireRole } from '../../middleware/auth'
import { listResource } from '../../utils/list-query'

export function createUsersRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  async function attachRoles<T extends { role_id?: unknown }>(users: T[]): Promise<(T & { role_name: string | null; role_code: string | null })[]> {
    const roles = await ctx().table('roles').findMany({}) as any[]
    const roleById = new Map(roles.map((r) => [String(r._id), r]))
    return users.map((u) => {
      const role = roleById.get(String(u.role_id))
      return { ...u, role_name: role?.name ?? null, role_code: role?.code ?? null }
    })
  }

  // GET /api/admin/users  — list all (auth only; RBAC gates the frontend page)
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('users'), req.query, {
        searchFields: ['name', 'email', 'user_id'],
        filterFields: ['status', 'role_id'],
      })
      const withoutPassword = (result.data as any[]).map(({ password_hash: _ph, ...u }) => u)
      const data = await attachRoles(withoutPassword)
      res.json({ ...result, data })
    } catch (err) { next(err) }
  })

  // GET /api/admin/users/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const user = await ctx().table('users').findOne({ where: { _id: req.params.id } }) as any
      if (!user) return res.status(404).json({ message: 'Not found' })
      const { password_hash: _ph, ...safe } = user
      const [data] = await attachRoles([safe])
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/users  — create user (super_admin only)
  router.post('/', requireRole('super_admin'), async (req, res, next) => {
    const { name, email, password, role_id } = req.body as {
      name?: string; email?: string; password?: string; role_id?: string
    }

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: 'name, email, password and role_id are required' })
    }

    const { valid, errors } = validatePasswordStrength(password)
    if (!valid) return res.status(400).json({ message: errors.join('. ') })

    try {
      const existing = await ctx().table('users').findOne({ where: { email } })
      if (existing) return res.status(409).json({ message: 'A user with this email already exists' })

      const password_hash = await hashPassword(password)

      const user = await ctx().table('users').create({
        user_id: `user_${Date.now()}`,
        name, email, role_id,
        status: 'active',
        password_hash,
      }) as any

      const { password_hash: _ph, ...safeUser } = user
      const [data] = await attachRoles([safeUser])
      res.status(201).json({ data })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/users/:id  — update name/role_id/status (super_admin only)
  router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
    try {
      // Never allow updating email or password_hash through this endpoint
      const { password_hash: _ph, email: _em, ...safeData } = req.body
      const count = await ctx().table('users').update({ where: { _id: req.params.id }, data: safeData })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const user = await ctx().table('users').findOne({ where: { _id: req.params.id } }) as any
      const { password_hash: _p2, ...safeUser } = user
      const [data] = await attachRoles([safeUser])
      res.json({ data })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/users/:id  — deactivate, not hard delete
  router.delete('/:id', requireRole('super_admin'), async (req, res, next) => {
    try {
      const count = await ctx().table('users').update({
        where: { _id: req.params.id },
        data: { status: 'inactive' },
      })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
