import { Router } from 'express'
import { hashPassword, validatePasswordStrength } from 'longcelot-sheet-db'
import { requireAuth, requireRole } from '../../middleware/auth'
import type { SheetAdapter } from 'longcelot-sheet-db'

const VALID_ROLES = ['super_admin', 'admin', 'operation', 'finance', 'marketing'] as const
type Role = typeof VALID_ROLES[number]

const ACTOR_SHEET_ENV: Record<string, string> = {
  operation: 'DEV_OPERATION_SHEET_ID',
  finance: 'DEV_FINANCE_SHEET_ID',
  marketing: 'DEV_MARKETING_SHEET_ID',
}

export function createAdminUsersRouter(adapter: SheetAdapter) {
  const router = Router()

  // POST /api/admin/users  — super admin only
  router.post('/', requireAuth, requireRole('super_admin'), async (req, res) => {
    const { name, email, password, role, actor_sheet_id } = req.body as {
      name?: string
      email?: string
      password?: string
      role?: string
      actor_sheet_id?: string
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password and role are required' })
    }

    if (!VALID_ROLES.includes(role as Role)) {
      return res.status(400).json({ message: `role must be one of: ${VALID_ROLES.join(', ')}` })
    }

    const { valid, errors } = validatePasswordStrength(password)
    if (!valid) {
      return res.status(400).json({ message: errors.join('. ') })
    }

    try {
      const ctx = adapter.withContext({ userId: 'auth', role: 'admin', actorSheetId: '' })

      const existing = await ctx.table('users').findOne({ where: { email } })
      if (existing) {
        return res.status(409).json({ message: 'A user with this email already exists' })
      }

      const password_hash = await hashPassword(password)

      // Resolve actor sheet ID: explicit body value > env var > empty string
      const resolvedSheetId =
        actor_sheet_id ?? (ACTOR_SHEET_ENV[role] ? process.env[ACTOR_SHEET_ENV[role]] ?? '' : '')

      const user = await ctx.table('users').create({
        user_id: `user_${Date.now()}`,
        name,
        email,
        role,
        actor_sheet_id: resolvedSheetId,
        status: 'active',
        password_hash,
      }) as any

      // Never return the password hash
      const { password_hash: _ph, ...safeUser } = user

      res.status(201).json(safeUser)
    } catch (err) {
      console.error('[POST /api/admin/users]', err)
      res.status(500).json({ message: 'Failed to create user' })
    }
  })

  return router
}
