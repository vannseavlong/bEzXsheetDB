import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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

  useEffect(() => {
    setUser(readStorage<AdminUser>(USER_KEY))
    setToken(localStorage.getItem(TOKEN_KEY))
    setIsLoading(false)
  }, [])

  function loginWithGoogle(returnTo = '/') {
    // Persist the destination so AuthCallbackPage can redirect there after login
    sessionStorage.setItem(RETURN_TO_KEY, returnTo)
    // Full-page redirect — backend handles the OAuth dance with Google
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
    window.location.href = `${base}/admin/auth/google`
  }

  function handleAuthCallback(incomingUser: AdminUser, incomingToken: string) {
    setUser(incomingUser)
    setToken(incomingToken)
    localStorage.setItem(USER_KEY, JSON.stringify(incomingUser))
    localStorage.setItem(TOKEN_KEY, incomingToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
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
