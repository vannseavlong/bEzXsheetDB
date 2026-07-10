import type { SheetAdapter } from 'longcelot-sheet-db'
import { env } from '../../config/env'

/** Read/write context for the shared catalog + orders data, which lives in the admin sheet. */
export function adminCtx(adapter: SheetAdapter, userId = 'user-app') {
  return adapter.withContext({ userId, actor: 'admin', actorSheetId: '' })
}

/** Read/write context for the signed-in customer's own data (users, addresses). */
export function userCtx(adapter: SheetAdapter, userId: string) {
  return adapter.withContext({ userId, actor: 'user', actorSheetId: env.DEV_USER_SHEET_ID })
}
