import type { Response, NextFunction } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import type { AuthRequest } from './auth'

const LOGGED_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

function summarize(method: string, body: unknown, params: Record<string, string>): string {
  if (method === 'POST') return 'Created new record'
  if (method === 'DELETE') {
    const id = params.id ?? params.bulkOrderId ?? ''
    return id ? `Deleted record ${id}` : 'Deleted record'
  }
  const keys = Object.keys((body as Record<string, unknown>) ?? {})
  if (keys.length === 0) return 'Updated record'
  if (keys.length <= 3) return `Updated ${keys.join(', ')}`
  return `Updated ${keys.length} fields`
}

/**
 * Auto-logs every successful mutating /api/admin/* request — mounted once, not
 * per-route, so it never has to touch the existing route files. GETs are
 * intentionally skipped: they already go through the sheet adapter's read
 * cache, and writing a log row on every read would burn write-quota for no
 * benefit. Only requests that actually succeeded (status < 400) are recorded.
 */
export function logActivity(adapter: DatabaseAdapter) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!LOGGED_METHODS.has(req.method)) return next()

    // req.originalUrl is stable regardless of how many nested routers strip/restore
    // req.url as the request descends — unlike req.path, it's safe to read from the
    // res.on('finish') callback below, which fires after the whole stack has unwound.
    const path = req.originalUrl.split('?')[0]
    const module = path.split('/').filter(Boolean)[2] ?? 'unknown'
    const method = req.method
    const body = req.body

    res.on('finish', () => {
      if (res.statusCode >= 400) return

      const ctx = adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })
      ctx.table('activity_logs').create({
        username: (req.user?.email as string) ?? 'unknown',
        method,
        url: req.originalUrl,
        module,
        detail: summarize(method, body, req.params),
      }).catch((err) => console.error('activity-log write failed:', err))
    })

    next()
  }
}
