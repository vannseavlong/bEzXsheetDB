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
    basePrice: r.base_price,
    duration: r.duration,
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
