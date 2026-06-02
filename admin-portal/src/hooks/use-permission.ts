import { MODULE_ACTIONS } from '@/lib/permission'

// Stub: in production, pull permissions from auth store.
// Returns all actions for a module as "granted" by default (mock-friendly).
export function usePermission() {
  const hasPermission = (module: string, action: string): boolean => {
    return MODULE_ACTIONS[module]?.includes(action) ?? false
  }

  return { hasPermission }
}
