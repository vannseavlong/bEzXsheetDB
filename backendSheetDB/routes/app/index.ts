import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requireRole } from '../../middleware/auth'

/**
 * Mobile app routes — /api/app/*
 * All routes require a valid user JWT (role: 'user').
 */
export function createAppRouter(_adapter: SheetAdapter) {
  const router = Router()

  router.use(requireAuth, requireRole('user'))

  // Placeholder — add app-facing endpoints here
  // e.g. router.get('/categories', ...)
  //      router.get('/products', ...)
  //      router.post('/bookings', ...)

  return router
}
