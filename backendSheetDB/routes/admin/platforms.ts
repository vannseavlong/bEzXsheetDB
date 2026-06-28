import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createPlatformsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/platforms
  router.get('/', async (_req, res, next) => {
    try {
      const data = await ctx().table('platforms').findMany({})
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/platforms
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('platforms').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/platforms/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('platforms').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/platforms/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('platforms').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('platforms').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/platforms/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('platforms').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
