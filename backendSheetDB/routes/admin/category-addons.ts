import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'
import { countBy, groupBy } from '../../utils/group-by'

function toCategoryAddonDto(r: Record<string, unknown>, categoryNames: string[], itemCount: number) {
  return {
    id: r._id,
    nameEn: r.name_en,
    categories: categoryNames,
    selection_type: r.selection_type,
    status: r.status,
    itemCount,
    badge_en: r.badge_en ?? '',
  }
}

export function createCategoryAddonsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/category-addons
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('category_addons'), req.query, {
        searchFields: ['name_en', 'name_km', 'badge_en', 'badge_km'],
        filterFields: ['status', 'selection_type'],
        booleanFields: ['status'],
      })

      const [addonLinks, categories, items] = await Promise.all([
        ctx().table('category_category_addons').findMany({}) as Promise<any[]>,
        ctx().table('categories').findMany({}) as Promise<any[]>,
        ctx().table('category_addon_items').findMany({}) as Promise<any[]>,
      ])
      const categoryNameById = Object.fromEntries(categories.map((c) => [c._id, c.name_en]))
      const categoryNamesByAddon = groupBy(addonLinks, 'addon_id', (l) => categoryNameById[l.category_id])
      const itemCountByAddon = countBy(items, 'addon_id')

      res.json({
        ...result,
        data: result.data.map((r) =>
          toCategoryAddonDto(r, categoryNamesByAddon[String(r._id)] ?? [], itemCountByAddon[String(r._id)] ?? 0)
        ),
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/category-addons
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('category_addons').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/category-addons/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('category_addons').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/category-addons/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('category_addons').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('category_addons').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/category-addons/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('category_addons').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // GET /api/admin/category-addons/:id/items
  router.get('/:id/items', async (req, res, next) => {
    try {
      const data = await ctx().table('category_addon_items').findMany({
        where: { addon_id: req.params.id },
        orderBy: 'sort',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/category-addons/:id/items
  router.post('/:id/items', async (req, res, next) => {
    try {
      const item = await ctx().table('category_addon_items').create({ ...req.body, addon_id: req.params.id })
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  return router
}
