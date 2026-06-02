import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, RETURN_TO_KEY, type AdminUser } from '@/contexts/auth-context'

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.')
  // JWT uses base64url — replace chars before atob
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64))
}

/**
 * Landing page after the backend's createAuthRouter redirects here with:
 *   ?token=<jwt>              — success: JWT payload contains the AdminUser fields
 *   ?error=<message>          — failure: show on login page
 *
 * If the JWT payload has no 'role' it means the Google account isn't in the
 * users table (createAuthRouter 'open' policy issued a bare Google profile).
 */
export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const { handleAuthCallback } = useAuth()
  const navigate = useNavigate()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const error = params.get('error')
    const token = params.get('token')

    if (error || !token) {
      const msg = error ?? 'Authentication failed. Please try again.'
      navigate(`/login?error=${encodeURIComponent(msg)}`, { replace: true })
      return
    }

    try {
      const payload = decodeJwtPayload(token)

      if (!payload.role) {
        navigate(
          `/login?error=${encodeURIComponent('Account not authorised. Contact your administrator.')}`,
          { replace: true }
        )
        return
      }

      handleAuthCallback(payload as unknown as AdminUser, token)
      const returnTo = sessionStorage.getItem(RETURN_TO_KEY) ?? '/'
      sessionStorage.removeItem(RETURN_TO_KEY)
      navigate(returnTo, { replace: true })
    } catch {
      navigate('/login?error=Invalid+session+data', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
