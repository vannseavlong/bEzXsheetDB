import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createCategoryAddonItemsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', role: 'admin', actorSheetId: '' })

  // GET /api/admin/category-addon-items/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('category_addon_items').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/category-addon-items/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('category_addon_items').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('category_addon_items').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/category-addon-items/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('category_addon_items').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
