import fs from 'fs'
import path from 'path'
import { createSheetAdapter } from 'longcelot-sheet-db'
import { env } from './env'

// Admin schemas
import usersSchema from '../schemas/admin/users'
import categoriesSchema from '../schemas/admin/categories'
import productsSchema from '../schemas/admin/products'
import categoryAddonsSchema from '../schemas/admin/category_addons'
import categoryAddonItemsSchema from '../schemas/admin/category_addon_items'
import productOptionsSchema from '../schemas/admin/product_options'
import popularServicesSchema from '../schemas/admin/popular_services'
import categoryProductsSchema from '../schemas/admin/category_products'
import categoryCategoryAddonsSchema from '../schemas/admin/category_category_addons'
import popularServiceItemsSchema from '../schemas/admin/popular_service_items'
import taskInfoSchema from '../schemas/admin/task_info'

export function createAdapter() {
  const tokens = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '.sheet-db-tokens.json'), 'utf-8')
  )

  const adapter = createSheetAdapter({
    adminSheetId: env.ADMIN_SHEET_ID,
    credentials: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_REDIRECT_URI,
    },
    tokens,
    onSchemaMismatch: env.ON_SCHEMA_MISMATCH,
  })

  // ── Schema registry ────────────────────────────────────────────────────────
  // This is the single migration point: swap adapter above → all routes work.
  adapter.registerSchema(usersSchema)
  adapter.registerSchema(categoriesSchema)
  adapter.registerSchema(productsSchema)
  adapter.registerSchema(categoryAddonsSchema)
  adapter.registerSchema(categoryAddonItemsSchema)
  adapter.registerSchema(productOptionsSchema)
  adapter.registerSchema(popularServicesSchema)
  adapter.registerSchema(categoryProductsSchema)
  adapter.registerSchema(categoryCategoryAddonsSchema)
  adapter.registerSchema(popularServiceItemsSchema)
  adapter.registerSchema(taskInfoSchema)

  return adapter
}
