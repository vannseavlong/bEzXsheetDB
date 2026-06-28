import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'
import { countBy } from '../../utils/group-by'

function toPopularServiceDto(r: Record<string, unknown>, itemCount: number) {
  return {
    id: r._id,
    nameEn: r.name_en,
    status: r.status,
    displayOrder: r.display_order,
    imageUrl: r.image_url ?? null,
    itemCount,
  }
}

export function createPopularServicesRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/popular-services
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('popular_services'), req.query, {
        searchFields: ['name_en', 'name_km'],
        filterFields: ['status'],
        booleanFields: ['status'],
        defaultOrderBy: 'display_order',
        defaultOrder: 'asc',
      })

      const items = (await ctx().table('popular_service_items').findMany({})) as any[]
      const itemCountByService = countBy(items, 'popular_service_id')

      res.json({
        ...result,
        data: result.data.map((r) => toPopularServiceDto(r, itemCountByService[String(r._id)] ?? 0)),
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/popular-services
  router.post('/', async (req, res, next) => {
    try {
      const item = await ctx().table('popular_services').create(req.body)
      res.status(201).json({ data: item })
    } catch (err) { next(err) }
  })

  // GET /api/admin/popular-services/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await ctx().table('popular_services').findOne({ where: { _id: req.params.id } })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/popular-services/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('popular_services').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const item = await ctx().table('popular_services').findOne({ where: { _id: req.params.id } })
      res.json({ data: item })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/popular-services/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await ctx().table('popular_services').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // GET /api/admin/popular-services/:id/items
  router.get('/:id/items', async (req, res, next) => {
    try {
      const data = await ctx().table('popular_service_items').findMany({
        where: { popular_service_id: req.params.id },
        orderBy: 'priority',
        order: 'asc',
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // PUT /api/admin/popular-services/:id/items  — replace full item list
  router.put('/:id/items', async (req, res, next) => {
    try {
      const { items }: { items: Array<{ type: 'CATEGORY' | 'PRODUCT'; ref_id: string; priority?: number }> } = req.body
      await ctx().table('popular_service_items').delete({ where: { popular_service_id: req.params.id } })
      const data = items.length
        ? await ctx().table('popular_service_items').createMany(
            items.map((item, i) => ({
              popular_service_id: req.params.id,
              type: item.type,
              category_id: item.type === 'CATEGORY' ? item.ref_id : null,
              product_id: item.type === 'PRODUCT' ? item.ref_id : null,
              priority: item.priority ?? i,
            }))
          )
        : []
      res.json({ data })
    } catch (err) { next(err) }
  })

  return router
}
