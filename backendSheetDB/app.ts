import express from 'express'
import cors from 'cors'
import type { DatabaseAdapter, SheetAdapter } from 'longcelot-sheet-db'
import { env } from './config/env'
import { createRouter } from './routes/index'
import { createAdminGoogleAuthHandler } from './routes/auth/index'
import { createUserGoogleAuthHandler } from './routes/user/auth'
import { errorHandler } from './middleware/error'

export function createApp(adapter: DatabaseAdapter, storage: SheetAdapter) {
  const app = express()

  app.use(cors({ origin: [env.FRONTEND_URL, env.MINI_APP_FRONTEND_URL], credentials: true }))
  app.use(express.json())

  // Google OAuth handlers must live at root level so req.path is never prefix-stripped
  app.use(createAdminGoogleAuthHandler(adapter))
  app.use(createUserGoogleAuthHandler(adapter))
  app.use('/api', createRouter(adapter, storage))

  // Must be registered last — catches all unhandled errors
  app.use(errorHandler)

  return app
}
