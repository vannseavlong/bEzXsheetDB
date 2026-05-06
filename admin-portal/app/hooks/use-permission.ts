// Stub permission hook — no auth required in admin-portal.
// All permissions return true so UI renders without restriction.
export function usePermission() {
  return {
    hasPermission: (_module: string, _action: string) => true
  };
}
