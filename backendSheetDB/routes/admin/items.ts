import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createItemsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/items
  router.get('/', async (_req, res, next) => {
    try {
      const data = await ctx().table('items').findMany({ orderBy: 'sort_order', order: 'asc' })
      res.json({ data })
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
