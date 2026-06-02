import * as React from 'react'
import { Lock, Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ACTIONS } from '@/lib/permission'
import { RBAC_ROLES, MODULE_SECTIONS, PERMISSION_COLUMNS } from './_constants'

function NaCell() {
  return (
    <div
      className="size-4 rounded-sm border border-border/50"
      style={{
        backgroundImage:
          'repeating-linear-gradient(-45deg, transparent 0, transparent 3px, rgba(148,163,184,0.22) 3px, rgba(148,163,184,0.22) 4px)',
      }}
    />
  )
}

export default function RoleList() {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(RBAC_ROLES[0].id)
  const [permissionsState, setPermissionsState] = React.useState<
    Record<string, Record<string, string[]>>
  >(() => Object.fromEntries(RBAC_ROLES.map((role) => [role.id, { ...role.defaultPermissions }])))

  const selectedRole = RBAC_ROLES.find((r) => r.id === selectedRoleId)!
  const currentPermissions = permissionsState[selectedRoleId] ?? {}

  const handlePermissionToggle = (moduleKey: string, actionKey: string, enabled: boolean) => {
    if (selectedRole.isLocked) return
    const mod = MODULE_SECTIONS.flatMap((s) => s.modules).find((m) => m.key === moduleKey)
    setPermissionsState((prev) => {
      const rolePerms = { ...(prev[selectedRoleId] ?? {}) }
      let actions = [...(rolePerms[moduleKey] ?? [])]
      if (enabled) {
        if (!actions.includes(actionKey)) actions.push(actionKey)
        if (actionKey !== ACTIONS.VIEW && mod?.applicableActions.includes(ACTIONS.VIEW)) {
          if (!actions.includes(ACTIONS.VIEW)) actions.push(ACTIONS.VIEW)
        }
      } else {
        actions = actions.filter((a) => a !== actionKey)
        if (actionKey === ACTIONS.VIEW) actions = []
      }
      rolePerms[moduleKey] = actions
      return { ...prev, [selectedRoleId]: rolePerms }
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Role tabs + New Role button */}
        <div className="px-6 pt-4 pb-3 flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {RBAC_ROLES.map((role) => {
              const isSelected = selectedRoleId === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={
                    isSelected
                      ? {
                          borderColor: role.color + '55',
                          backgroundColor: role.color + '14',
                          color: role.color,
                        }
                      : {}
                  }
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
                    isSelected
                      ? 'border-current'
                      : 'border-border text-foreground hover:bg-muted'
                  )}
                >
                  <span
                    className="size-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: role.color }}
                  >
                    {role.initials}
                  </span>
                  {role.name}
                </button>
              )
            })}
          </div>

          <NavLink to="/roles/new">
            <Button size="sm">
              New Role <Plus className="ml-1 h-4 w-4" />
            </Button>
          </NavLink>
        </div>

        {/* Role description strip */}
        <div className="px-6 pb-3 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
          {selectedRole.isLocked ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <div className="size-1.5 rounded-full bg-red-500" />
              Full access — locked
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Lock className="size-3" />
              Editable
            </div>
          )}
        </div>

        {/* Permissions matrix */}
        <div className="px-6 pb-6">
          <div className="border rounded-lg overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Column headers */}
                <div
                  className="grid border-b bg-muted/40"
                  style={{ gridTemplateColumns: 'minmax(160px, 2fr) repeat(7, minmax(72px, 1fr))' }}
                >
                  <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Module
                  </div>
                  {PERMISSION_COLUMNS.map((col) => (
                    <div
                      key={col.key}
                      className="py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center"
                    >
                      {col.label}
                    </div>
                  ))}
                </div>

                {/* Sections */}
                {MODULE_SECTIONS.map((section, sectionIdx) => (
                  <div
                    key={section.sectionLabel}
                    className={cn(sectionIdx > 0 && 'border-t-2 border-border/60')}
                  >
                    {/* Section header */}
                    <div className="px-4 py-2 bg-muted/50 border-b flex items-center gap-2.5">
                      <div className="w-0.5 h-3 rounded-full bg-muted-foreground/40" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
                        {section.sectionLabel}
                      </span>
                    </div>

                    {/* Module rows */}
                    {section.modules.map((mod, idx) => (
                      <div
                        key={mod.key}
                        className={cn(
                          'grid items-center hover:bg-muted/20 transition-colors',
                          idx < section.modules.length - 1 && 'border-b'
                        )}
                        style={{ gridTemplateColumns: 'minmax(160px, 2fr) repeat(7, minmax(72px, 1fr))' }}
                      >
                        <div className="px-4 py-3 text-sm font-medium">{mod.label}</div>
                        {PERMISSION_COLUMNS.map((col) => {
                          const isApplicable = mod.applicableActions.includes(col.key)
                          const isChecked = currentPermissions[mod.key]?.includes(col.key) ?? false
                          return (
                            <div key={col.key} className="flex justify-center py-3">
                              {isApplicable ? (
                                <Checkbox
                                  checked={isChecked}
                                  disabled={selectedRole.isLocked}
                                  onCheckedChange={(checked) =>
                                    handlePermissionToggle(mod.key, col.key, !!checked)
                                  }
                                />
                              ) : (
                                <NaCell />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
