import { Router } from 'express'
import type { DatabaseAdapter, SheetAdapter } from 'longcelot-sheet-db'
import { createAuthRoutes } from './auth/index'
import { createAdminRouter } from './admin/index'
import { createUserRouter } from './user/index'

export function createRouter(adapter: DatabaseAdapter, storage: SheetAdapter) {
  const router = Router()

  router.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }))

  router.use('/admin/auth', createAuthRoutes(adapter))
  router.use('/admin', createAdminRouter(adapter, storage))
  router.use('/user', createUserRouter(adapter))

  return router
}
