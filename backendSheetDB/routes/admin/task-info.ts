import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createTaskInfoRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/task-info?category_id=xxx  or  ?product_id=xxx
  router.get('/', async (req, res, next) => {
    try {
      const where: Record<string, unknown> = {}
      if (req.query.category_id) where.category_id = req.query.category_id
      if (req.query.product_id) where.product_id = req.query.product_id
      const data = await ctx().table('task_info').findMany({ where, orderBy: 'sort', order: 'asc' })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/task-info
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('task_info').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/task-info/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('task_info').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/task-info/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('task_info').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('task_info').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/task-info/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('task_info').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/task-info/by-category/:categoryId  — bulk clear for replace
  router.delete('/by-category/:categoryId', async (req, res, next) => {
    try {
      await ctx().table('task_info').delete({ where: { category_id: req.params.categoryId } })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/task-info/by-product/:productId  — bulk clear for replace
  router.delete('/by-product/:productId', async (req, res, next) => {
    try {
      await ctx().table('task_info').delete({ where: { product_id: req.params.productId } })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
