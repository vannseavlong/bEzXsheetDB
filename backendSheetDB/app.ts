import express from 'express'
import cors from 'cors'
import type { SheetAdapter } from 'longcelot-sheet-db'
import { env } from './config/env'
import { createRouter } from './routes/index'
import { errorHandler } from './middleware/error'

export function createApp(adapter: SheetAdapter) {
  const app = express()

  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
  app.use(express.json())

  app.use('/api', createRouter(adapter))

  // Must be registered last — catches all unhandled errors
  app.use(errorHandler)

  return app
}
