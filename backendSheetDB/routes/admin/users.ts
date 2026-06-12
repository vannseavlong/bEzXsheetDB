import { Router } from 'express'
import { hashPassword, validatePasswordStrength } from 'longcelot-sheet-db'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireRole } from '../../middleware/auth'

const VALID_ROLES = ['super_admin', 'admin', 'operation', 'finance', 'marketing'] as const
type Role = (typeof VALID_ROLES)[number]

const ACTOR_SHEET_ENV: Partial<Record<Role, string>> = {
  operation: 'DEV_OPERATION_SHEET_ID',
  finance: 'DEV_FINANCE_SHEET_ID',
  marketing: 'DEV_MARKETING_SHEET_ID',
}

export function createUsersRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', role: 'admin', actorSheetId: '' })

  // GET /api/admin/users  — list all
  router.get('/', requireRole('super_admin'), async (_req, res, next) => {
    try {
      const users = await ctx().table('users').findMany({})
      const safe = (users as any[]).map(({ password_hash: _ph, ...u }) => u)
      res.json({ data: safe })
    } catch (err) { next(err) }
  })

  // GET /api/admin/users/:id
  router.get('/:id', requireRole('super_admin'), async (req, res, next) => {
    try {
      const user = await ctx().table('users').findOne({ where: { _id: req.params.id } }) as any
      if (!user) return res.status(404).json({ message: 'Not found' })
      const { password_hash: _ph, ...safe } = user
      res.json({ data: safe })
    } catch (err) { next(err) }
  })

  // POST /api/admin/users  — create user (super_admin only)
  router.post('/', requireRole('super_admin'), async (req, res, next) => {
    const { name, email, password, role, actor_sheet_id } = req.body as {
      name?: string; email?: string; password?: string; role?: string; actor_sheet_id?: string
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password and role are required' })
    }
    if (!VALID_ROLES.includes(role as Role)) {
      return res.status(400).json({ message: `role must be one of: ${VALID_ROLES.join(', ')}` })
    }

    const { valid, errors } = validatePasswordStrength(password)
    if (!valid) return res.status(400).json({ message: errors.join('. ') })

    try {
      const existing = await ctx().table('users').findOne({ where: { email } })
      if (existing) return res.status(409).json({ message: 'A user with this email already exists' })

      const password_hash = await hashPassword(password)
      const envKey = ACTOR_SHEET_ENV[role as Role]
      const resolvedSheetId = actor_sheet_id ?? (envKey ? process.env[envKey] ?? '' : '')

      const user = await ctx().table('users').create({
        user_id: `user_${Date.now()}`,
        name, email, role,
        actor_sheet_id: resolvedSheetId,
        status: 'active',
        password_hash,
      }) as any

      const { password_hash: _ph, ...safeUser } = user
      res.status(201).json({ data: safeUser })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/users/:id  — update name/role/status (super_admin only)
  router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
    try {
      // Never allow updating email or password_hash through this endpoint
      const { password_hash: _ph, email: _em, ...safeData } = req.body
      const count = await ctx().table('users').update({ where: { _id: req.params.id }, data: safeData })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const user = await ctx().table('users').findOne({ where: { _id: req.params.id } }) as any
      const { password_hash: _p2, ...safeUser } = user
      res.json({ data: safeUser })
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
