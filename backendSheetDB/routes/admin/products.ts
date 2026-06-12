import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createProductsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', role: 'admin', actorSheetId: '' })

  // GET /api/admin/products
  router.get('/', async (_req, res, next) => {
    try {
      const data = await ctx().table('products').findMany({})
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/products
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('products').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/products/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('products').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/products/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('products').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('products').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/products/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('products').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // GET /api/admin/products/:id/options
  router.get('/:id/options', async (req, res, next) => {
    try {
      const data = await ctx().table('product_options').findMany({
        where: { product_id: req.params.id },
        orderBy: 'sort',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  return router
}
