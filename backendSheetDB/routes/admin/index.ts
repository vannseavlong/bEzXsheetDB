import { Router } from 'express'
import type { DatabaseAdapter, SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth, requirePermission, requireAnyPermission } from '../../middleware/auth'
import { logActivity } from '../../middleware/activity-log'
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
import { createOrdersRouter } from './orders'
import { createCleanersRouter } from './cleaners'
import { createActivityLogRouter } from './activity-log'

/**
 * All /api/admin/* routes.
 * requireAuth is applied at this level — every sub-router inherits it.
 * Role granularity (e.g. super_admin only for /users) is handled per-router.
 */
export function createAdminRouter(adapter: DatabaseAdapter, storage: SheetAdapter) {
  const router = Router()

  router.use(requireAuth)
  router.use(logActivity(adapter))

  router.use('/users', requirePermission('ADMIN_USERS', 'VIEW'), createUsersRouter(adapter))
  router.use('/rbac', requirePermission('RBAC', 'VIEW'), createRbacRouter(adapter))
  router.use('/categories', requirePermission('CATEGORY', 'VIEW'), createCategoriesRouter(adapter))
  // Platforms is reference data with no page/checkbox of its own — only ever fetched from
  // Category pages, so it rides on the Category permission.
  router.use('/platforms', requirePermission('CATEGORY', 'VIEW'), createPlatformsRouter(adapter))
  router.use('/products', requirePermission('PRODUCT', 'VIEW'), createProductsRouter(adapter))
  router.use('/category-addons', requirePermission('CATEGORY-ADDON', 'VIEW'), createCategoryAddonsRouter(adapter))
  router.use('/product-options', requirePermission('PRODUCT-OPTION', 'VIEW'), createProductOptionsRouter(adapter))
  router.use('/popular-services', requirePermission('POPULAR-SERVICE', 'VIEW'), createPopularServicesRouter(adapter))
  // Task info is edited from both the Category and Product forms — allow either.
  router.use('/task-info', requireAnyPermission(['CATEGORY', 'PRODUCT'], 'VIEW'), createTaskInfoRouter(adapter))
  router.use('/category-addon-items', requirePermission('CATEGORY-ADDON', 'VIEW'), createCategoryAddonItemsRouter(adapter))
  router.use('/items', requirePermission('SETUP-ITEM', 'VIEW'), createItemsRouter(adapter))
  router.use('/blocked-schedules', requirePermission('SETUP-SCHEDULE', 'VIEW'), createBlockedSchedulesRouter(adapter))
  router.use('/orders', requirePermission('ORDER', 'VIEW'), createOrdersRouter(adapter))
  router.use('/cleaners', requirePermission('CLEANER', 'VIEW'), createCleanersRouter(adapter))
  router.use('/activity-log', requirePermission('ACTIVITY_LOG', 'VIEW'), createActivityLogRouter(adapter))
  router.use('/upload', createUploadRouter(storage))

  return router
}
