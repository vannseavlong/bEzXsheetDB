const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const USER_KEY = 'beasy_admin_user'
const TOKEN_KEY = 'beasy_admin_token'

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

// A 401 means the token itself is invalid/expired (as opposed to a 403, which means the
// token is fine but this role lacks the permission) — there's no recovering from that
// short of signing in again, so wipe the stale session and send the user to /login instead
// of leaving them stuck re-triggering the same failed request.
export function forceReauth() {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  } catch { /* localStorage unavailable */ }
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
}

// Tokens are short-lived on purpose (see backend utils/jwt.ts) so a role's permissions
// can't drift stale for long. Rather than polling on a timer, a 401 here transparently
// re-fetches a new token via /me and retries once — refresh only happens exactly when
// it's needed. Concurrent 401s (several queries firing right after expiry) share one
// in-flight /me call instead of each triggering their own.
let refreshPromise: Promise<string | null> | null = null

export function refreshToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const currentToken = getToken()
      if (!currentToken) return null
      try {
        const res = await fetch(`${BASE}/admin/auth/me`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        })
        if (!res.ok) return null
        const data = await res.json() as { token: string; user: unknown }
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        return data.token
      } catch {
        return null
      }
    })().finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

async function request<T>(method: string, path: string, body?: unknown, isRetry = false): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return undefined as T
  const json = await res.json()
  if (!res.ok) {
    if (res.status === 401 && !isRetry) {
      const newToken = await refreshToken()
      if (newToken) return request<T>(method, path, body, true)
      forceReauth()
    }
    throw new Error(json.message ?? 'Request failed')
  }
  return json
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  del: (path: string) => request<void>('DELETE', path),
}

/** Serializes a params object into a `?a=1&b=2` query string, dropping undefined/empty values. */
export function buildQuery(params: Record<string, unknown> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
