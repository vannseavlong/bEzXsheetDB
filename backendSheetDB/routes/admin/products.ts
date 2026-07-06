import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'
import { groupBy } from '../../utils/group-by'

function toProductDto(r: Record<string, unknown>, categoryNames: string[]) {
  return {
    id: r._id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    categories: categoryNames,
    thumbnailUrl: r.thumbnail_url ?? null,
    status: r.status,
    sort: r.sort,
  }
}

export function createProductsRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/products
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('products'), req.query, {
        searchFields: ['name_en', 'name_km'],
        filterFields: ['status'],
        booleanFields: ['status'],
        defaultOrderBy: 'sort',
        defaultOrder: 'asc',
      })

      const [productLinks, categories] = await Promise.all([
        ctx().table('category_products').findMany({}) as Promise<any[]>,
        ctx().table('categories').findMany({}) as Promise<any[]>,
      ])
      const categoryNameById = Object.fromEntries(categories.map((c) => [c._id, c.name_en]))
      const categoryNamesByProduct = groupBy(productLinks, 'product_id', (l) => categoryNameById[l.category_id])

      res.json({
        ...result,
        data: result.data.map((r) => toProductDto(r, categoryNamesByProduct[String(r._id)] ?? [])),
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/products
  router.post('/', async (req, res, next) => {
    try {
      const existing = await ctx().table('products').findMany({})
      const item = await ctx().table('products').create({ ...req.body, sort: existing.length })
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/products/sort — reorder, sort = offset + index in `ids`.
  // `offset` lets a paginated page reorder its own slice without touching rows on other pages.
  router.put('/sort', async (req, res, next) => {
    try {
      const { ids, offset = 0 }: { ids: string[]; offset?: number } = req.body
      await Promise.all(ids.map((id, i) =>
        ctx().table('products').update({ where: { _id: id }, data: { sort: offset + i } })
      ))
      res.json({ success: true })
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

  // GET /api/admin/products/:id/categories — which categories this product is linked to
  // (product options/pricing are category-scoped, see categories.ts :categoryId/products/:productId/options)
  router.get('/:id/categories', async (req, res, next) => {
    try {
      const data = await ctx().table('category_products').findMany({
        where: { product_id: req.params.id },
        orderBy: 'sort',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/products/:id/categories — replace full category list for this product.
  // Diffs against existing links (same reasoning as categories.ts PUT /:id/products) so
  // unchanged links keep their _id and category_product_options survive the save; new links
  // are appended to the end of that category's own product ordering.
  router.put('/:id/categories', async (req, res, next) => {
    try {
      const { category_ids }: { category_ids: string[] } = req.body
      const existing = await ctx().table('category_products').findMany({
        where: { product_id: req.params.id },
      }) as any[]
      const existingByCategory = new Map(existing.map((l) => [l.category_id, l]))
      const keep = new Set(category_ids)

      const removed = existing.filter((l) => !keep.has(l.category_id))
      await Promise.all(removed.map((l) => ctx().table('category_products').delete({ where: { _id: l._id } })))
      await Promise.all(
        removed.map((l) => ctx().table('category_product_options').delete({ where: { category_product_id: l._id } }))
      )

      const added = category_ids.filter((category_id) => !existingByCategory.has(category_id))
      await Promise.all(
        added.map(async (category_id) => {
          const siblings = await ctx().table('category_products').findMany({ where: { category_id } })
          return ctx().table('category_products').create({ category_id, product_id: req.params.id, sort: siblings.length })
        })
      )

      const data = await ctx().table('category_products').findMany({
        where: { product_id: req.params.id },
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  return router
}
