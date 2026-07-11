import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'

function toCleanerDto(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    name: r.name,
    gender: r.gender,
    role: r.role,
    status: r.status,
    image: r.image_url ?? null,
    phone: r.phone ?? null,
    joinedDate: r.joined_date,
    autoAssign: r.auto_assign,
    expertises: r.expertises ? JSON.parse(String(r.expertises)) : [],
    cleanerWeeklyOffs: r.weekly_offs ? JSON.parse(String(r.weekly_offs)) : [],
  }
}

export function createCleanersRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/cleaners
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('cleaners'), req.query, {
        searchFields: ['name'],
        filterFields: ['status'],
        booleanFields: ['status'],
        defaultOrderBy: 'name',
        defaultOrder: 'asc',
      })
      res.json({ ...result, data: result.data.map(toCleanerDto) })
    } catch (err) { next(err) }
  })

  // POST /api/admin/cleaners
  router.post('/', async (req, res, next) => {
    try {
      const record = await ctx().table('cleaners').create(req.body)
      res.status(201).json({ data: record })
    } catch (err) { next(err) }
  })

  // GET /api/admin/cleaners/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const record = await ctx().table('cleaners').findOne({ where: { _id: req.params.id } })
      if (!record) return res.status(404).json({ message: 'Not found' })
      res.json({ data: record })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/cleaners/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('cleaners').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const record = await ctx().table('cleaners').findOne({ where: { _id: req.params.id } })
      res.json({ data: record })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/cleaners/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('cleaners').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
