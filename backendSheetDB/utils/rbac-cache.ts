import type { SheetAdapter } from 'longcelot-sheet-db'

// role/module/action/role_permissions reads happen on every login, every /me refresh,
// and every RBAC page load — each one is a full-sheet read against the Sheets API
// (findOne is just findMany + limit 1 under the hood, so it's just as expensive as
// reading the whole table). Caching them here means that cost is paid once per TTL
// window (or once per write, via invalidateRbacCache) instead of once per request.
const TTL_MS = 60_000

function ctx(adapter: SheetAdapter) {
  return adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })
}

type Cached<T> = { value: T; expiresAt: number }

let rolesCache: Cached<any[]> | null = null
let modulesCache: Cached<any[]> | null = null
let actionsCache: Cached<any[]> | null = null
let rolePermissionsCache: Cached<any[]> | null = null

async function cached<T>(slot: Cached<T> | null, load: () => Promise<T>, set: (c: Cached<T>) => void): Promise<T> {
  if (slot && slot.expiresAt > Date.now()) return slot.value
  const value = await load()
  set({ value, expiresAt: Date.now() + TTL_MS })
  return value
}

export const getRoles = (adapter: SheetAdapter) =>
  cached(rolesCache, () => ctx(adapter).table('roles').findMany({}) as Promise<any[]>, (c) => { rolesCache = c })

export const getModules = (adapter: SheetAdapter) =>
  cached(modulesCache, () => ctx(adapter).table('modules').findMany({}) as Promise<any[]>, (c) => { modulesCache = c })

export const getActions = (adapter: SheetAdapter) =>
  cached(actionsCache, () => ctx(adapter).table('actions').findMany({}) as Promise<any[]>, (c) => { actionsCache = c })

export const getRolePermissions = (adapter: SheetAdapter) =>
  cached(
    rolePermissionsCache,
    () => ctx(adapter).table('role_permissions').findMany({}) as Promise<any[]>,
    (c) => { rolePermissionsCache = c }
  )

export async function getCatalog(adapter: SheetAdapter) {
  const [modules, actions] = await Promise.all([getModules(adapter), getActions(adapter)])
  return {
    modules,
    actions,
    moduleByKey: new Map(modules.map((m) => [m.key, m])),
    moduleById: new Map(modules.map((m) => [String(m._id), m])),
    actionByKey: new Map(actions.map((a) => [a.key, a])),
    actionById: new Map(actions.map((a) => [String(a._id), a])),
  }
}

/** Call after any write to roles/modules/actions/role_permissions so the next read is fresh. */
export function invalidateRbacCache() {
  rolesCache = null
  modulesCache = null
  actionsCache = null
  rolePermissionsCache = null
}
