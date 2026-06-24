import { useAuth } from '@/contexts/auth-context'

export function usePermission() {
  const { user } = useAuth()

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    return user.permissions.includes(`${module}:${action}`)
  }

  return { hasPermission }
}
