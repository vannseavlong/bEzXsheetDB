import { env } from './config/env'
import { createAdapter } from './config/adapter'
import { createApp } from './app'

const adapter = createAdapter()
const app = createApp(adapter)

app.listen(env.PORT, () => {
  console.log(`bEasy API running on http://localhost:${env.PORT}`)
})
