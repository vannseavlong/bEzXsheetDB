import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'

export function createBlockedSchedulesRouter(adapter: SheetAdapter) {
  const router = Router()
  const opCtx = () => adapter.withContext({
    userId: 'system',
    role: 'operation',
    actorSheetId: process.env.DEV_OPERATION_SHEET_ID ?? '',
  })

  // GET /api/admin/blocked-schedules/cleaners — picker for the form
  router.get('/cleaners', async (_req, res, next) => {
    try {
      const data = await opCtx().table('cleaners').findMany({ orderBy: 'name', order: 'asc' })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // GET /api/admin/blocked-schedules
  router.get('/', async (_req, res, next) => {
    try {
      const data = await opCtx().table('blocked_schedules').findMany({ orderBy: 'blocked_date', order: 'desc' })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // POST /api/admin/blocked-schedules
  router.post('/', async (req, res, next) => {
    try {
      const record = await opCtx().table('blocked_schedules').create(req.body)
      res.status(201).json({ data: record })
    } catch (err) { next(err) }
  })

  // GET /api/admin/blocked-schedules/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const record = await opCtx().table('blocked_schedules').findOne({ where: { _id: req.params.id } })
      if (!record) return res.status(404).json({ message: 'Not found' })
      res.json({ data: record })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/blocked-schedules/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const count = await opCtx().table('blocked_schedules').update({ where: { _id: req.params.id }, data: req.body })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      const record = await opCtx().table('blocked_schedules').findOne({ where: { _id: req.params.id } })
      res.json({ data: record })
    } catch (err) { next(err) }
  })

  // DELETE /api/admin/blocked-schedules/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const count = await opCtx().table('blocked_schedules').delete({ where: { _id: req.params.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  return router
}
