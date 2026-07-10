import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requireRole } from '../../middleware/auth'
import { createUserAuthRouter } from './auth'
import { createCatalogRouter } from './catalog'
import { createAddressRouter } from './address'
import { createOrderRouter } from './order'
import { createCouponRouter } from './coupon'

/**
 * Mobile app routes — /api/user/*
 * Everything below /auth requires a valid user JWT (role: 'user').
 */
export function createUserRouter(adapter: SheetAdapter) {
  const router = Router()

  // Public: register/login. GET /auth/me requires auth internally.
  router.use('/auth', createUserAuthRouter(adapter))

  router.use(requireAuth, requireRole('user'))

  router.use(createCatalogRouter(adapter))
  router.use('/address', createAddressRouter(adapter))
  router.use('/order', createOrderRouter(adapter))
  router.use('/coupon', createCouponRouter(adapter))

  return router
}
