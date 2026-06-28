import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'
import { groupBy } from '../../utils/group-by'

function toCategoryDto(r: Record<string, unknown>, productNames: string[], addonNames: string[]) {
  return {
    id: r._id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    thumbnailUrl: r.thumbnail_url ?? null,
    status: r.status,
    sort: r.sort,
    platform: r.platform ?? [],
    products: productNames,
    categoryAddOns: addonNames,
  }
}

export function createCategoriesRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/categories
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('categories'), req.query, {
        searchFields: ['name_en', 'name_km'],
        filterFields: ['status'],
        booleanFields: ['status'],
        defaultOrderBy: 'sort',
        defaultOrder: 'asc',
      })

      const [productLinks, products, addonLinks, addons] = await Promise.all([
        ctx().table('category_products').findMany({}) as Promise<any[]>,
        ctx().table('products').findMany({}) as Promise<any[]>,
        ctx().table('category_category_addons').findMany({}) as Promise<any[]>,
        ctx().table('category_addons').findMany({}) as Promise<any[]>,
      ])
      const productNameById = Object.fromEntries(products.map((p) => [p._id, p.name_en]))
      const addonNameById = Object.fromEntries(addons.map((a) => [a._id, a.name_en]))
      const productNamesByCategory = groupBy(productLinks, 'category_id', (l) => productNameById[l.product_id])
      const addonNamesByCategory = groupBy(addonLinks, 'category_id', (l) => addonNameById[l.addon_id])

      res.json({
        ...result,
        data: result.data.map((r) =>
          toCategoryDto(r, productNamesByCategory[String(r._id)] ?? [], addonNamesByCategory[String(r._id)] ?? [])
        ),
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/categories
  router.post('/', async (req, res, next) => {
    try {
      const existing = await ctx().table('categories').findMany({})
      const item = await ctx().table('categories').create({ ...req.body, sort: existing.length })
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/categories/sort — reorder, sort = offset + index in `ids`.
  // `offset` lets a paginated page reorder its own slice without touching rows on other pages.
  router.put('/sort', async (req, res, next) => {
    try {
      const { ids, offset = 0 }: { ids: string[]; offset?: number } = req.body
      await Promise.all(ids.map((id, i) =>
        ctx().table('categories').update({ where: { _id: id }, data: { sort: offset + i } })
      ))
      res.json({ success: true })
    } catch (err) { next(err) }
  })

  // GET /api/admin/categories/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('categories').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/categories/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('categories').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('categories').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/categories/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('categories').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // GET /api/admin/categories/:id/products
  router.get('/:id/products', async (req, res, next) => {
    try {
      const data = await ctx().table('category_products').findMany({
        where: { category_id: req.params.id },
        orderBy: 'sort',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/categories/:id/products  — replace full product list
  router.put('/:id/products', async (req, res, next) => {
    try {
      const { product_ids }: { product_ids: string[] } = req.body
      await ctx().table('category_products').delete({ where: { category_id: req.params.id } })
      const data = product_ids.length
        ? await ctx().table('category_products').createMany(
            product_ids.map((product_id, sort) => ({ category_id: req.params.id, product_id, sort }))
          )
        : []
      res.json({ data })
    } catch (err) { next(err) }
  })

  // GET /api/admin/categories/:id/addons
  router.get('/:id/addons', async (req, res, next) => {
    try {
      const data = await ctx().table('category_category_addons').findMany({
        where: { category_id: req.params.id },
        orderBy: 'sort',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/categories/:id/addons  — replace full addon list
  router.put('/:id/addons', async (req, res, next) => {
    try {
      const { addon_ids }: { addon_ids: string[] } = req.body
      await ctx().table('category_category_addons').delete({ where: { category_id: req.params.id } })
      const data = addon_ids.length
        ? await ctx().table('category_category_addons').createMany(
            addon_ids.map((addon_id, sort) => ({ category_id: req.params.id, addon_id, sort }))
          )
        : []
      res.json({ data })
    } catch (err) { next(err) }
  })

  return router
}
