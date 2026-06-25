import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

// All available module→action pairs (mirrors frontend permission.ts MODULE_ACTIONS).
// Used by GET /rbac/permissions so the frontend can render the full permissions matrix.
const SYSTEM_MODULE_ACTIONS: Record<string, string[]> = {
  DASHBOARD: ['VIEW'],
  ORDER: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'ASSIGN'],
  'FINANCE-ORDER': ['VIEW', 'EXPORT'],
  'FINANCE-TOPUP': ['VIEW', 'ADD', 'EXPORT'],
  'FINANCE-BCOMBO': ['VIEW', 'EXPORT'],
  'FINANCE-DIRECT_SALES': ['VIEW', 'EXPORT'],
  CLEANER: ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  PARTNER: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'ASSIGN'],
  'PARTNER-ONBOARDING': ['VIEW', 'UPDATE'],
  'PARTNER-TRACKING': ['VIEW', 'ASSIGN'],
  'PARTNER-PAYOUT': ['VIEW', 'UPDATE', 'EXPORT', 'MARK_AS_PAID'],
  'MARKETING-CUSTOMER': ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
  'MARKETING-COUPON': ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  'MARKETING-PAYMENT_LINK': ['VIEW', 'ADD', 'EXPORT', 'MARK_AS_PAID'],
  'MARKETING-OTP': ['VIEW'],
  'MARKETING-NOTIFICATION': ['VIEW', 'ADD'],
  'MARKETING-OVERVIEW': ['VIEW'],
  'MARKETING-BANNER': ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  MARKETING_ALL_USER: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
  'SETUP-ITEM': ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  'SETUP-SCHEDULE': ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  ACTIVITY_LOG: ['VIEW'],
  RBAC: ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  ADMIN_USERS: ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  CHAT: ['VIEW', 'ADD', 'UPDATE', 'DELETE'],
  CUSTOMER_OVERVIEW: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
  CUSTOMER_DIRECT_SALE: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
  CUSTOMER_REGISTERED: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
  CUSTOMER_TICKETS: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT'],
}

export function createRbacRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  function toRoleItem(r: any) {
    return {
      id: r._id,
      name: r.name,
      code: r.code,
      status: r.status === 'active',
      description: r.description ?? ''
    }
  }

  // ── Roles CRUD ────────────────────────────────────────────────────────────

  // GET /rbac/roles
  router.get('/roles', async (_req, res, next) => {
    try {
      const roles = (await ctx().table('roles').findMany({})) as any[]
      res.json({ data: roles.map(toRoleItem) })
    } catch (err) { next(err) }
  })

  // POST /rbac/roles
  router.post('/roles', async (req, res, next) => {
    try {
      const { name, code, status = true, description = '' } = req.body as {
        name?: string; code?: string; status?: boolean; description?: string
      }
      if (!name || !code) return res.status(400).json({ message: 'name and code are required' })

      const created = await ctx().table('roles').create({
        name,
        code,
        description,
        status: status ? 'active' : 'inactive',
        created_by: (req as any).user?.id ?? 'system'
      }) as any
      res.status(201).json({ data: toRoleItem(created) })
    } catch (err) { next(err) }
  })

  // GET /rbac/roles/:id
  router.get('/roles/:id', async (req, res, next) => {
    try {
      const role = await ctx().table('roles').findOne({ where: { _id: req.params.id } }) as any
      if (!role) return res.status(404).json({ message: 'Role not found' })
      res.json({ data: toRoleItem(role) })
    } catch (err) { next(err) }
  })

  // PUT /rbac/roles/:id
  router.put('/roles/:id', async (req, res, next) => {
    try {
      const { name, code, status, description } = req.body as {
        name?: string; code?: string; status?: boolean; description?: string
      }
      const data: Record<string, unknown> = {}
      if (name !== undefined) data.name = name
      if (code !== undefined) data.code = code
      if (status !== undefined) data.status = status ? 'active' : 'inactive'
      if (description !== undefined) data.description = description

      const count = await ctx().table('roles').update({ where: { _id: req.params.id }, data })
      if (count === 0) return res.status(404).json({ message: 'Role not found' })
      const role = await ctx().table('roles').findOne({ where: { _id: req.params.id } }) as any
      res.json({ data: toRoleItem(role) })
    } catch (err) { next(err) }
  })

  // DELETE /rbac/roles/:id
  router.delete('/roles/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('roles').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Role not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // ── Role Permissions (module + action stored directly) ────────────────────

  // GET /rbac/roles/:code/permissions
  router.get('/roles/:code/permissions', async (req, res, next) => {
    try {
      const role = await ctx().table('roles').findOne({ where: { code: req.params.code } }) as any
      if (!role) return res.status(404).json({ message: 'Role not found' })

      const all = (await ctx().table('role_permissions').findMany({})) as any[]
      const mine = all.filter((rp) => String(rp.role_id) === String(role._id))
      res.json({ data: mine.map((rp) => ({ module: rp.module, action: rp.action })) })
    } catch (err) { next(err) }
  })

  // PUT /rbac/roles/:code/permissions
  router.put('/roles/:code/permissions', async (req, res, next) => {
    try {
      const { permissions } = req.body as { permissions: Array<{ module: string; action: string }> }
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: 'permissions must be an array' })
      }

      const role = await ctx().table('roles').findOne({ where: { code: req.params.code } }) as any
      if (!role) return res.status(404).json({ message: 'Role not found' })

      // Delete all existing grants for this role
      const all = (await ctx().table('role_permissions').findMany({})) as any[]
      const toDelete = all.filter((rp) => String(rp.role_id) === String(role._id))
      for (const rp of toDelete) {
        await ctx().table('role_permissions').delete({ where: { _id: rp._id } })
      }

      // Write new grants
      for (const { module, action } of permissions) {
        await ctx().table('role_permissions').create({
          role_id: String(role._id),
          module,
          action,
        })
      }

      res.json({ message: 'Permissions updated' })
    } catch (err) { next(err) }
  })

  // ── System Permissions (static registry) ─────────────────────────────────

  // GET /rbac/permissions — returns all available module→actions pairs
  router.get('/permissions', (_req, res) => {
    res.json({ data: SYSTEM_MODULE_ACTIONS })
  })

  return router
}
