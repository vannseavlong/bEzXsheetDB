import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'

function toProductOptionDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    type: r.type,
    status: r.status,
  }
}

export function createProductOptionsRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/product-options?product_id=xxx
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('product_options'), req.query, {
        searchFields: ['name_en', 'name_km', 'type'],
        filterFields: ['status', 'type'],
        booleanFields: ['status'],
        defaultOrderBy: 'name_en',
        defaultOrder: 'asc',
      })

      res.json({
        ...result,
        data: result.data.map((r) => toProductOptionDto(r)),
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/product-options
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('product_options').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/product-options/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('product_options').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/product-options/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('product_options').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('product_options').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/product-options/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('product_options').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
