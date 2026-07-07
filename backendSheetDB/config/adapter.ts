import fs from 'fs'
import path from 'path'
import { createSheetAdapter, DriveStorageAdapter } from 'longcelot-sheet-db'
import { env } from './env'

// Admin schemas
import usersSchema from '../schemas/admin/users'
import rolesSchema from '../schemas/admin/roles'
import modulesSchema from '../schemas/admin/modules'
import actionsSchema from '../schemas/admin/actions'
import rolePermissionsSchema from '../schemas/admin/role_permissions'
import categoriesSchema from '../schemas/admin/categories'
import platformsSchema from '../schemas/admin/platforms'
import productsSchema from '../schemas/admin/products'
import categoryAddonsSchema from '../schemas/admin/category_addons'
import categoryAddonItemsSchema from '../schemas/admin/category_addon_items'
import productOptionsSchema from '../schemas/admin/product_options'
import categoryProductOptionsSchema from '../schemas/admin/category_product_options'
import popularServicesSchema from '../schemas/admin/popular_services'
import categoryProductsSchema from '../schemas/admin/category_products'
import categoryCategoryAddonsSchema from '../schemas/admin/category_category_addons'
import popularServiceItemsSchema from '../schemas/admin/popular_service_items'
import taskInfoSchema from '../schemas/admin/task_info'
import itemsSchema from '../schemas/admin/items'
import cleanersSchema from '../schemas/admin/cleaners'
import blockedSchedulesSchema from '../schemas/admin/blocked_schedules'
import ordersSchema from '../schemas/admin/orders'

export function createAdapter() {
  // Render (and other ephemeral-filesystem hosts) can't see the gitignored
  // token file, so allow passing it as a JSON env var in those environments.
  const tokenFile = fs.existsSync(path.join(process.cwd(), '.lsdb-tokens.json'))
    ? '.lsdb-tokens.json'
    : '.sheet-db-tokens.json' // legacy filename, still written by lsdb < 0.1.26
  const tokens = JSON.parse(
    env.SHEET_DB_TOKENS ?? fs.readFileSync(path.join(process.cwd(), tokenFile), 'utf-8')
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
    driveFolder: {
      root: 'bEasy',
      subfolders: {
        admin: 'Admin',
        user:  'Users',
      },
    },
    storage: new DriveStorageAdapter({ folder: 'uploads' }),
  })

  // ── Schema registry ────────────────────────────────────────────────────────
  // This is the single migration point: swap adapter above → all routes work.
  adapter.registerSchema(usersSchema)
  adapter.registerSchema(rolesSchema)
  adapter.registerSchema(modulesSchema)
  adapter.registerSchema(actionsSchema)
  adapter.registerSchema(rolePermissionsSchema)
  adapter.registerSchema(categoriesSchema)
  adapter.registerSchema(platformsSchema)
  adapter.registerSchema(productsSchema)
  adapter.registerSchema(categoryAddonsSchema)
  adapter.registerSchema(categoryAddonItemsSchema)
  adapter.registerSchema(productOptionsSchema)
  adapter.registerSchema(popularServicesSchema)
  adapter.registerSchema(categoryProductsSchema)
  adapter.registerSchema(categoryProductOptionsSchema)
  adapter.registerSchema(categoryCategoryAddonsSchema)
  adapter.registerSchema(popularServiceItemsSchema)
  adapter.registerSchema(taskInfoSchema)
  adapter.registerSchema(itemsSchema)
  adapter.registerSchema(cleanersSchema)
  adapter.registerSchema(blockedSchedulesSchema)
  adapter.registerSchema(ordersSchema)

  return adapter
}
