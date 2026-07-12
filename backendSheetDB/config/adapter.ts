import fs from 'fs'
import path from 'path'
import {
  createDatabaseAdapter,
  createSheetAdapter,
  DriveStorageAdapter,
  DatabaseAdapter,
  SheetAdapter,
  SheetAdapterConfig,
  TableSchema,
} from 'longcelot-sheet-db'
import { env } from './env'

/**
 * `registerSchema` is implemented by every adapter kind (SheetAdapter, SQLAdapterBase,
 * PrismaAdapterBase) but isn't part of the shared `DatabaseAdapter` interface — a gap in the
 * package's public types, not a real capability difference. Worth filing as package feedback;
 * cast locally until then.
 */
type RegistrableAdapter = DatabaseAdapter & { registerSchema(schema: TableSchema): void }

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
import productPairingsSchema from '../schemas/admin/product_pairings'
import orderAddonsSchema from '../schemas/admin/order_addons'
import activityLogsSchema from '../schemas/admin/activity_logs'

// User (customer) schemas
import customersSchema from '../schemas/user/customers'
import addressesSchema from '../schemas/user/addresses'

function sheetsAdapterConfig(): SheetAdapterConfig {
  // Render (and other ephemeral-filesystem hosts) can't see the gitignored
  // token file, so allow passing it as a JSON env var in those environments.
  const tokenFile = fs.existsSync(path.join(process.cwd(), '.lsdb-tokens.json'))
    ? '.lsdb-tokens.json'
    : '.sheet-db-tokens.json' // legacy filename, still written by lsdb < 0.1.26
  const tokens = JSON.parse(
    env.SHEET_DB_TOKENS ?? fs.readFileSync(path.join(process.cwd(), tokenFile), 'utf-8')
  )

  return {
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
  }
}

export interface AppAdapter {
  /** All CRUD/withContext/table() calls go through this — Sheets locally/staging, Postgres in production. */
  adapter: DatabaseAdapter
  /**
   * File uploads (routes/admin/upload.ts) always ride on Google Drive via a Sheets-backed
   * client, independent of DB_DRIVER — the SQL adapters have no upload/storage concept of
   * their own. Same underlying OAuth client/instance as `adapter` when driver is 'sheets'
   * (avoids a second live client); a dedicated one otherwise.
   */
  storage: SheetAdapter
}

export function createAdapter(): AppAdapter {
  // Sheets locally/staging, Render Postgres in production — see env.DB_DRIVER for the
  // NODE_ENV-derived default (overridable).
  const driver = env.DB_DRIVER
  const sheets = driver === 'sheets' ? createSheetAdapter(sheetsAdapterConfig()) : undefined

  const adapter: DatabaseAdapter =
    sheets ?? createDatabaseAdapter({ driver })
  // Reuse the same client when it's already a SheetAdapter; otherwise spin up a dedicated one
  // purely for Drive uploads (DriveStorageAdapter can only get a live client via
  // createSheetAdapter() — see driveStorageAdapter.ts's `_setClient`).
  const storage: SheetAdapter = sheets ?? createSheetAdapter(sheetsAdapterConfig())

  // ── Schema registry ────────────────────────────────────────────────────────
  // This is the single migration point: swap adapter above → all routes work.
  const registrable = adapter as RegistrableAdapter
  registrable.registerSchema(usersSchema)
  registrable.registerSchema(rolesSchema)
  registrable.registerSchema(modulesSchema)
  registrable.registerSchema(actionsSchema)
  registrable.registerSchema(rolePermissionsSchema)
  registrable.registerSchema(categoriesSchema)
  registrable.registerSchema(platformsSchema)
  registrable.registerSchema(productsSchema)
  registrable.registerSchema(categoryAddonsSchema)
  registrable.registerSchema(categoryAddonItemsSchema)
  registrable.registerSchema(productOptionsSchema)
  registrable.registerSchema(popularServicesSchema)
  registrable.registerSchema(categoryProductsSchema)
  registrable.registerSchema(categoryProductOptionsSchema)
  registrable.registerSchema(categoryCategoryAddonsSchema)
  registrable.registerSchema(popularServiceItemsSchema)
  registrable.registerSchema(taskInfoSchema)
  registrable.registerSchema(itemsSchema)
  registrable.registerSchema(cleanersSchema)
  registrable.registerSchema(blockedSchedulesSchema)
  registrable.registerSchema(ordersSchema)
  registrable.registerSchema(productPairingsSchema)
  registrable.registerSchema(orderAddonsSchema)
  registrable.registerSchema(activityLogsSchema)

  registrable.registerSchema(customersSchema)
  registrable.registerSchema(addressesSchema)

  return { adapter, storage }
}
