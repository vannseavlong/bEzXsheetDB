import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS } from '@/lib/permission-registry'

type Props = {
  requiredRole?: string
  /** Module key from permission-registry.ts. Omit to only require auth. */
  module?: string
  /** Defaults to VIEW — the action needed to load this route at all. */
  action?: string
  /**
   * Rendered in place of the redirect-to-/login when the visitor is signed
   * out. Used for routes (e.g. "/") that must show real public content —
   * such as an OAuth-branding homepage — instead of bouncing to the login
   * form. Omit to keep the default redirect behaviour.
   */
  publicFallback?: ReactNode
}

export default function ProtectedRoute({ requiredRole, module, action = ACTIONS.VIEW, publicFallback }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { hasPermission } = usePermission()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (publicFallback) return <>{publicFallback}</>
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/not-authorised" replace />
  }

  if (module && !hasPermission(module, action)) {
    return <Navigate to="/not-authorised" replace />
  }

  return <Outlet />
}
