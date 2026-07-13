import { env } from './config/env'
import { createAdapter } from './config/adapter'
import { createApp } from './app'

// Entry point: wires the adapter (Sheets or Postgres, per DB_DRIVER) into the Express app.

const { adapter, storage } = createAdapter()
const app = createApp(adapter, storage)

app.listen(env.PORT, () => {
  console.log(`bEasy API running on http://localhost:${env.PORT}`)
})
