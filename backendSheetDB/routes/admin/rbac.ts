import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'

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

  function toActionItem(a: any) {
    return { id: a._id, key: a.key, label: a.label }
  }

  function toModuleItem(m: any, actionsById: Map<string, any>) {
    return {
      id: m._id,
      key: m.key,
      label: m.label,
      section: m.section,
      actions: ((m.action_ids ?? []) as string[])
        .map((id) => actionsById.get(String(id))?.key)
        .filter((key): key is string => !!key)
    }
  }

  // Loads the modules/actions catalog once per request, keyed both ways for
  // translating between the frontend's key-based wire format and the id-based
  // foreign keys stored in role_permissions.
  async function loadCatalog() {
    const [modules, actions] = await Promise.all([
      ctx().table('modules').findMany({}) as Promise<any[]>,
      ctx().table('actions').findMany({}) as Promise<any[]>
    ])
    return {
      modules,
      actions,
      moduleByKey: new Map(modules.map((m) => [m.key, m])),
      moduleById: new Map(modules.map((m) => [String(m._id), m])),
      actionByKey: new Map(actions.map((a) => [a.key, a])),
      actionById: new Map(actions.map((a) => [String(a._id), a]))
    }
  }

  // ── Roles CRUD ────────────────────────────────────────────────────────────

  // GET /rbac/roles
  router.get('/roles', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('roles'), req.query, {
        searchFields: ['name', 'code', 'description'],
        filterFields: ['status'],
      })
      res.json({ ...result, data: (result.data as any[]).map(toRoleItem) })
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

  // ── Actions catalog ───────────────────────────────────────────────────────

  // GET /rbac/actions
  router.get('/actions', async (_req, res, next) => {
    try {
      const actions = await ctx().table('actions').findMany({}) as any[]
      res.json({ data: actions.map(toActionItem) })
    } catch (err) { next(err) }
  })

  // POST /rbac/actions
  router.post('/actions', async (req, res, next) => {
    try {
      const { key, label } = req.body as { key?: string; label?: string }
      if (!key || !label) return res.status(400).json({ message: 'key and label are required' })

      const { actionByKey } = await loadCatalog()
      if (actionByKey.has(key)) return res.status(409).json({ message: 'Action key already exists' })

      const created = await ctx().table('actions').create({ key, label }) as any
      res.status(201).json({ data: toActionItem(created) })
    } catch (err) { next(err) }
  })

  // ── Modules catalog ───────────────────────────────────────────────────────

  // GET /rbac/modules
  router.get('/modules', async (_req, res, next) => {
    try {
      const { modules, actionById } = await loadCatalog()
      res.json({ data: modules.map((m) => toModuleItem(m, actionById)) })
    } catch (err) { next(err) }
  })

  // POST /rbac/modules
  router.post('/modules', async (req, res, next) => {
    try {
      const { key, label, section = 'Other', actions = [] } = req.body as {
        key?: string; label?: string; section?: string; actions?: string[]
      }
      if (!key || !label) return res.status(400).json({ message: 'key and label are required' })

      const catalog = await loadCatalog()
      if (catalog.moduleByKey.has(key)) return res.status(409).json({ message: 'Module key already exists' })

      const unknown = actions.filter((a) => !catalog.actionByKey.has(a))
      if (unknown.length) {
        return res.status(400).json({ message: `Unknown action key(s): ${unknown.join(', ')}` })
      }

      const created = await ctx().table('modules').create({
        key,
        label,
        section,
        action_ids: actions.map((a) => String(catalog.actionByKey.get(a)._id))
      }) as any
      res.status(201).json({ data: toModuleItem(created, catalog.actionById) })
    } catch (err) { next(err) }
  })

  // PUT /rbac/modules/:key
  router.put('/modules/:key', async (req, res, next) => {
    try {
      const { label, section, actions } = req.body as {
        label?: string; section?: string; actions?: string[]
      }
      const catalog = await loadCatalog()
      const existing = catalog.moduleByKey.get(req.params.key)
      if (!existing) return res.status(404).json({ message: 'Module not found' })

      const data: Record<string, unknown> = {}
      if (label !== undefined) data.label = label
      if (section !== undefined) data.section = section
      if (actions !== undefined) {
        const unknown = actions.filter((a) => !catalog.actionByKey.has(a))
        if (unknown.length) {
          return res.status(400).json({ message: `Unknown action key(s): ${unknown.join(', ')}` })
        }
        data.action_ids = actions.map((a) => String(catalog.actionByKey.get(a)._id))
      }

      await ctx().table('modules').update({ where: { _id: existing._id }, data })
      const updated = await ctx().table('modules').findOne({ where: { _id: existing._id } }) as any
      res.json({ data: toModuleItem(updated, catalog.actionById) })
    } catch (err) { next(err) }
  })

  // DELETE /rbac/modules/:key
  router.delete('/modules/:key', async (req, res, next) => {
    try {
      const module = await ctx().table('modules').findOne({ where: { key: req.params.key } }) as any
      if (!module) return res.status(404).json({ message: 'Module not found' })
      await ctx().table('modules').delete({ where: { _id: module._id } })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // ── Role Permissions (module_id/action_id, translated to keys on the wire) ─

  // GET /rbac/roles/:code/permissions
  router.get('/roles/:code/permissions', async (req, res, next) => {
    try {
      const role = await ctx().table('roles').findOne({ where: { code: req.params.code } }) as any
      if (!role) return res.status(404).json({ message: 'Role not found' })

      const [all, { moduleById, actionById }] = await Promise.all([
        ctx().table('role_permissions').findMany({}) as Promise<any[]>,
        loadCatalog()
      ])
      const mine = all.filter((rp) => String(rp.role_id) === String(role._id))
      const data = mine
        .map((rp) => ({
          module: moduleById.get(String(rp.module_id))?.key,
          action: actionById.get(String(rp.action_id))?.key
        }))
        .filter((rp) => rp.module && rp.action)
      res.json({ data })
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

      const { moduleByKey, actionByKey } = await loadCatalog()
      const unknown = permissions.filter((p) => !moduleByKey.has(p.module) || !actionByKey.has(p.action))
      if (unknown.length) {
        return res.status(400).json({ message: 'Permissions reference unknown module/action keys' })
      }

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
          module_id: String(moduleByKey.get(module)._id),
          action_id: String(actionByKey.get(action)._id),
        })
      }

      res.json({ message: 'Permissions updated' })
    } catch (err) { next(err) }
  })

  return router
}
