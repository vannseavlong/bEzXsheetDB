import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'

function toItemDto(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    nameEn: r.name_en,
    category: r.category,
    status: r.status,
    sortOrder: r.sort_order,
  }
}

export function createItemsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/items
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('items'), req.query, {
        searchFields: ['name_en', 'name_km', 'category'],
        filterFields: ['status', 'category'],
        booleanFields: ['status'],
        defaultOrderBy: 'sort_order',
        defaultOrder: 'asc',
      })
      res.json({ ...result, data: result.data.map(toItemDto) })
    } catch (err) { next(err) }
  })

  // POST /api/admin/items
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('items').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/items/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('items').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/items/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('items').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('items').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/items/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('items').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
