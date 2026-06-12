import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { requireAuth } from '../../middleware/auth'
import { createUsersRouter } from './users'
import { createCategoriesRouter } from './categories'
import { createProductsRouter } from './products'
import { createCategoryAddonsRouter } from './category-addons'
import { createProductOptionsRouter } from './product-options'
import { createPopularServicesRouter } from './popular-services'
import { createTaskInfoRouter } from './task-info'
import { createCategoryAddonItemsRouter } from './category-addon-items'

/**
 * All /api/admin/* routes.
 * requireAuth is applied at this level — every sub-router inherits it.
 * Role granularity (e.g. super_admin only for /users) is handled per-router.
 */
export function createAdminRouter(adapter: SheetAdapter) {
  const router = Router()

  router.use(requireAuth)

  router.use('/users', createUsersRouter(adapter))
  router.use('/categories', createCategoriesRouter(adapter))
  router.use('/products', createProductsRouter(adapter))
  router.use('/category-addons', createCategoryAddonsRouter(adapter))
  router.use('/product-options', createProductOptionsRouter(adapter))
  router.use('/popular-services', createPopularServicesRouter(adapter))
  router.use('/task-info', createTaskInfoRouter(adapter))
  router.use('/category-addon-items', createCategoryAddonItemsRouter(adapter))

  return router
}
