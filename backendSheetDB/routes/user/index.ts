import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requireRole } from '../../middleware/auth'
import { createUserAuthRouter } from './auth'

/**
 * Mobile app routes — /api/user/*
 * Everything below /auth requires a valid user JWT (role: 'user').
 */
export function createUserRouter(adapter: SheetAdapter) {
  const router = Router()

  // Public: register/login. GET /auth/me requires auth internally.
  router.use('/auth', createUserAuthRouter(adapter))

  router.use(requireAuth, requireRole('user'))

  // Placeholder — add app-facing endpoints here
  // e.g. router.get('/categories', ...)
  //      router.get('/products', ...)
  //      router.post('/bookings', ...)

  return router
}
