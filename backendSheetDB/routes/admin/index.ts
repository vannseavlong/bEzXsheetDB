import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requirePermission } from '../../middleware/auth'
import { createUsersRouter } from './users'
import { createRbacRouter } from './rbac'
import { createCategoriesRouter } from './categories'
import { createPlatformsRouter } from './platforms'
import { createProductsRouter } from './products'
import { createCategoryAddonsRouter } from './category-addons'
import { createProductOptionsRouter } from './product-options'
import { createPopularServicesRouter } from './popular-services'
import { createTaskInfoRouter } from './task-info'
import { createCategoryAddonItemsRouter } from './category-addon-items'
import { createItemsRouter } from './items'
import { createBlockedSchedulesRouter } from './blocked-schedules'
import { createUploadRouter } from './upload'

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
  router.use('/categories', requirePermission('SETUP-ITEM', 'VIEW'), createCategoriesRouter(adapter))
  router.use('/platforms', requirePermission('SETUP-ITEM', 'VIEW'), createPlatformsRouter(adapter))
  router.use('/products', requirePermission('SETUP-ITEM', 'VIEW'), createProductsRouter(adapter))
  router.use('/category-addons', requirePermission('SETUP-ITEM', 'VIEW'), createCategoryAddonsRouter(adapter))
  router.use('/product-options', requirePermission('SETUP-ITEM', 'VIEW'), createProductOptionsRouter(adapter))
  router.use('/popular-services', requirePermission('SETUP-ITEM', 'VIEW'), createPopularServicesRouter(adapter))
  router.use('/task-info', requirePermission('SETUP-ITEM', 'VIEW'), createTaskInfoRouter(adapter))
  router.use('/category-addon-items', requirePermission('SETUP-ITEM', 'VIEW'), createCategoryAddonItemsRouter(adapter))
  router.use('/items', requirePermission('SETUP-ITEM', 'VIEW'), createItemsRouter(adapter))
  router.use('/blocked-schedules', requirePermission('SETUP-SCHEDULE', 'VIEW'), createBlockedSchedulesRouter(adapter))
  router.use('/upload', createUploadRouter(adapter))

  return router
}
