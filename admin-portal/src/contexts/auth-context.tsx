import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

// A role's `code` from the dynamic roles table — 'super_admin' is the one special-cased value.
export type AdminRole = string

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  /** Flat list of "MODULE:ACTION" strings granted to this user */
  permissions: string[]
  profileUrl?: string | null
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  /**
   * Starts the Google OAuth2 flow.
   * Saves the intended destination so the user lands back after login.
   * Then redirects the browser to the backend's /api/admin/auth/google endpoint.
   */
  loginWithGoogle: (returnTo?: string) => void
  /**
   * Called by AuthCallbackPage once the backend hands back a user + token.
   * Persists both to localStorage and updates in-memory state.
   */
  handleAuthCallback: (user: AdminUser, token: string) => void
  logout: () => void
  /** Raw JWT returned by the backend — attach to API request headers */
  token: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_KEY = 'beasy_admin_user'
const TOKEN_KEY = 'beasy_admin_token'
const RETURN_TO_KEY = 'beasy_admin_return_to'

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  function persist(incomingUser: AdminUser, incomingToken: string) {
    setUser(incomingUser)
    setToken(incomingToken)
    localStorage.setItem(USER_KEY, JSON.stringify(incomingUser))
    localStorage.setItem(TOKEN_KEY, incomingToken)
  }

  function wipe() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(RETURN_TO_KEY)
    // Drop every cached list/detail query — otherwise the next person to sign in
    // on this device would briefly see the previous user's cached data.
    queryClient.clear()
  }

  // Re-derives role/permissions from the DB and reissues the token, instead of trusting
  // whatever was baked into the token at login. Called on mount and on tab focus — both
  // are natural "the user is actually here" moments, cheap since the backend caches the
  // RBAC catalog (see backendSheetDB/utils/rbac-cache.ts). No interval: the token is
  // short-lived (see backend utils/jwt.ts) and api/client.ts transparently refreshes +
  // retries on the 401 that produces, so staleness is bounded without polling on a timer.
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (!currentToken) return
    try {
      const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
      const res = await fetch(`${base}/admin/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      if (!res.ok) {
        if (res.status === 401) wipe()
        return
      }
      const data = await res.json() as { token: string; user: AdminUser }
      persist(data.user, data.token)
    } catch {
      // Network hiccup — keep the existing session, try again on the next focus.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setUser(readStorage<AdminUser>(USER_KEY))
    setToken(localStorage.getItem(TOKEN_KEY))
    setIsLoading(false)
    refreshUser()

    function onFocus() { refreshUser() }
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [refreshUser])

  function loginWithGoogle(returnTo = '/') {
    // Persist the destination so AuthCallbackPage can redirect there after login
    sessionStorage.setItem(RETURN_TO_KEY, returnTo)
    // Full-page redirect — backend handles the OAuth dance with Google
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
    window.location.href = `${base}/admin/auth/google`
  }

  function handleAuthCallback(incomingUser: AdminUser, incomingToken: string) {
    // Guards against a leftover cache from a previous account on this device/tab.
    queryClient.clear()
    persist(incomingUser, incomingToken)
  }

  function logout() {
    wipe()
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, isLoading, loginWithGoogle, handleAuthCallback, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export { RETURN_TO_KEY }
