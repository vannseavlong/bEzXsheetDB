import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { listResource } from '../../utils/list-query'

function toActivityLogDto(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    createdAt: r._created_at,
    user: { username: r.username },
    reqMethod: r.method,
    reqUrl: r.url,
    module: r.module,
    detail: r.detail,
  }
}

export function createActivityLogRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/activity-log — read-only
  router.get('/', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('activity_logs'), req.query, {
        searchFields: ['username', 'module', 'detail', 'url'],
        defaultOrderBy: '_created_at',
        defaultOrder: 'desc',
      })
      res.json({ ...result, data: result.data.map(toActivityLogDto) })
    } catch (err) { next(err) }
  })

  return router
}
