import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requirePermission } from '../../middleware/auth'
import { createUsersRouter } from './users'
import { createRbacRouter } from './rbac'
import { createCategoriesRouter } from './categories'
import { createProductsRouter } from './products'
import { createCategoryAddonsRouter } from './category-addons'
import { createProductOptionsRouter } from './product-options'
import { createPopularServicesRouter } from './popular-services'
import { createTaskInfoRouter } from './task-info'
import { createCategoryAddonItemsRouter } from './category-addon-items'
import { createItemsRouter } from './items'
import { createBlockedSchedulesRouter } from './blocked-schedules'

/**
 * All /api/admin/* routes.
 * requireAuth is applied at this level — every sub-router inherits it.
 * Role granularity (e.g. super_admin only for /users) is handled per-router.
 */
export function createAdminRouter(adapter: SheetAdapter) {
  const router = Router()

  router.use(requireAuth)

  router.use('/users', requirePermission('ADMIN_USERS', 'VIEW'), createUsersRouter(adapter))
  router.use('/rbac', requirePermission('RBAC', 'VIEW'), createRbacRouter(adapter))
  router.use('/categories', createCategoriesRouter(adapter))
  router.use('/products', createProductsRouter(adapter))
  router.use('/category-addons', createCategoryAddonsRouter(adapter))
  router.use('/product-options', createProductOptionsRouter(adapter))
  router.use('/popular-services', createPopularServicesRouter(adapter))
  router.use('/task-info', createTaskInfoRouter(adapter))
  router.use('/category-addon-items', createCategoryAddonItemsRouter(adapter))
  router.use('/items', createItemsRouter(adapter))
  router.use('/blocked-schedules', createBlockedSchedulesRouter(adapter))

  return router
}
