import * as React from 'react'
import { Check, Lock, Pencil, Plus, Settings2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  useRoles, useCreateRole, useDeleteRole, useRolePermissions, useSetRolePermissions,
  useRbacModules, useRbacActions,
  type DbRole, type RbacModule,
} from '@/api/rbac'
import { ModuleModal } from './_components/ModuleModal'
import { ActionModal } from './_components/ActionModal'
import { MODULE_REGISTRY, MODULES, ACTIONS } from '@/lib/permission-registry'
import { usePermission } from '@/hooks/use-permission'

const ROLE_COLORS = [
  '#EF4444', '#3B82F6', '#10B981', '#F59E0B',
  '#8B5CF6', '#9CA3AF', '#EC4899', '#14B8A6',
]

function roleColor(idx: number) { return ROLE_COLORS[idx % ROLE_COLORS.length] }

function roleInitials(name: string) {
  return name.split(/[\s_-]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function groupBySection(modules: RbacModule[]) {
  const sections = new Map<string, RbacModule[]>()
  for (const mod of modules) {
    const list = sections.get(mod.section) ?? []
    list.push(mod)
    sections.set(mod.section, list)
  }
  return Array.from(sections.entries()).map(([sectionLabel, mods]) => ({ sectionLabel, modules: mods }))
}

function PermissionMatrixSkeleton({ columns, rows = 6 }: { columns: number; rows?: number }) {
  const gridTemplate = `minmax(160px, 2fr) repeat(${Math.max(columns, 1)}, minmax(72px, 1fr)) 48px`
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid items-center border-b" style={{ gridTemplateColumns: gridTemplate }}>
          <div className="px-4 py-3"><Skeleton className="h-4 w-24" /></div>
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex justify-center py-3">
              <Skeleton className="size-4 rounded-sm" />
            </div>
          ))}
          <div />
        </div>
      ))}
    </>
  )
}

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
  const { data: rolesResult, isLoading: loading } = useRoles()
  const roles = rolesResult?.data ?? []

  const { data: modules = [], isLoading: modulesLoading } = useRbacModules()
  const { data: actions = [], isLoading: actionsLoading } = useRbacActions()
  const sections = React.useMemo(() => groupBySection(modules), [modules])
  const unregisteredModuleCount = React.useMemo(() => {
    const existingKeys = new Set(modules.map((m) => m.key))
    return MODULE_REGISTRY.filter((m) => !existingKeys.has(m.key)).length
  }, [modules])

  const { hasPermission } = usePermission()
  const canAddRole = hasPermission(MODULES.RBAC, ACTIONS.ADD)
  const canDeleteRole = hasPermission(MODULES.RBAC, ACTIONS.DELETE)
  const canUpdateRole = hasPermission(MODULES.RBAC, ACTIONS.UPDATE)

  const [selectedCode, setSelectedCode] = React.useState<string | null>(null)
  const [draftPermissions, setDraftPermissions] = React.useState<Record<string, string[]>>({})
  const [editMode, setEditMode] = React.useState(false)

  // Create role dialog
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createForm, setCreateForm] = React.useState({ name: '', code: '', description: '' })

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<DbRole | null>(null)

  // Module / action catalog dialogs
  const [moduleModalOpen, setModuleModalOpen] = React.useState(false)
  const [editingModule, setEditingModule] = React.useState<RbacModule | undefined>(undefined)
  const [actionModalOpen, setActionModalOpen] = React.useState(false)

  // Default-select the first role once the list loads
  React.useEffect(() => {
    if (!selectedCode && roles.length > 0) setSelectedCode(roles[0].code)
  }, [roles, selectedCode])

  const { data: permsList, isLoading: permsLoading } = useRolePermissions(selectedCode ?? undefined)
  const currentPermissions = React.useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const { module, action } of permsList ?? []) {
      map[module] = map[module] ?? []
      map[module].push(action)
    }
    return map
  }, [permsList])

  const setRolePermissions = useSetRolePermissions()
  const createRole = useCreateRole()
  const deleteRole = useDeleteRole()
  const saving = setRolePermissions.isPending
  const creating = createRole.isPending
  const deleting = deleteRole.isPending

  const selectedRole = roles.find(r => r.code === selectedCode)
  const activePermissions = editMode ? draftPermissions : currentPermissions
  const gridTemplate = `minmax(160px, 2fr) repeat(${Math.max(actions.length, 1)}, minmax(72px, 1fr)) 48px`

  const handleEnterEdit = () => {
    setDraftPermissions({ ...currentPermissions })
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setDraftPermissions({})
    setEditMode(false)
  }

  const handleSave = async () => {
    if (!selectedCode) return
    try {
      const permissions = Object.entries(draftPermissions).flatMap(([module, mActions]) =>
        mActions.map(action => ({ module, action }))
      )
      await setRolePermissions.mutateAsync({ code: selectedCode, permissions })
      setEditMode(false)
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleToggle = (moduleKey: string, actionKey: string, enabled: boolean) => {
    if (!editMode) return
    const mod = modules.find(m => m.key === moduleKey)
    setDraftPermissions(prev => {
      const rolePerms = { ...prev }
      let mActions = [...(rolePerms[moduleKey] ?? [])]
      if (enabled) {
        if (!mActions.includes(actionKey)) mActions.push(actionKey)
        if (actionKey !== 'VIEW' && mod?.actions.includes('VIEW')) {
          if (!mActions.includes('VIEW')) mActions.push('VIEW')
        }
      } else {
        mActions = mActions.filter(a => a !== actionKey)
        if (actionKey === 'VIEW') mActions = []
      }
      rolePerms[moduleKey] = mActions
      return rolePerms
    })
  }

  const handleCreateRole = async () => {
    if (!createForm.name.trim() || !createForm.code.trim()) return
    try {
      const role = await createRole.mutateAsync({
        name: createForm.name.trim(),
        code: createForm.code.trim().toUpperCase(),
        description: createForm.description.trim(),
      })
      setSelectedCode(role.code)
      setCreateOpen(false)
      setCreateForm({ name: '', code: '', description: '' })
    } catch (err) {
      console.error('Create failed:', err)
    }
  }

  const handleDeleteRole = async () => {
    if (!deleteTarget) return
    try {
      await deleteRole.mutateAsync(deleteTarget.id)
      if (selectedCode === deleteTarget.code) setSelectedCode(null)
      setDeleteTarget(null)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Role tabs */}
        <div className="px-6 pt-4 pb-3 flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-lg" />
            ))}
            {!loading && roles.map((role, idx) => {
              const isSelected = selectedCode === role.code
              const color = roleColor(idx)
              return (
                <div key={String(role.id)} className="group relative">
                  <button
                    onClick={() => { setSelectedCode(role.code); setEditMode(false) }}
                    style={isSelected ? { borderColor: color + '55', backgroundColor: color + '14', color } : {}}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
                      isSelected ? 'border-current' : 'border-border text-foreground hover:bg-muted'
                    )}
                  >
                    <span
                      className="size-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {roleInitials(role.name)}
                    </span>
                    {role.name}
                    {isSelected && !editMode && canDeleteRole && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(role) }}
                        className="ml-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </button>
                </div>
              )
            })}

            {canAddRole && (
              <button
                onClick={() => setCreateOpen(true)}
                className="size-9 flex items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            )}
          </div>

          {/* Edit / Save controls */}
          <div className="flex items-center gap-2">
            {canUpdateRole && (
              <Button size="sm" variant="outline" onClick={() => setActionModalOpen(true)} className="gap-1.5">
                <Settings2 className="size-3.5" /> Actions
              </Button>
            )}
            {selectedRole && canUpdateRole && (
              editMode ? (
                <>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                    <Check className="size-3.5" />
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={handleEnterEdit} disabled={permsLoading} className="gap-1.5">
                  <Pencil className="size-3.5" /> Edit
                </Button>
              )
            )}
          </div>
        </div>

        {/* Role description strip */}
        {selectedRole && (
          <div className="px-6 pb-3 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
            {editMode && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Lock className="size-3" /> Editing
              </div>
            )}
          </div>
        )}

        {/* Registry sync hint */}
        {!modulesLoading && unregisteredModuleCount > 0 && canUpdateRole && (
          <div className="mx-6 mb-3 px-3 py-2 rounded-md border border-dashed text-xs text-muted-foreground flex items-center justify-between gap-3">
            <span>
              {unregisteredModuleCount} module{unregisteredModuleCount === 1 ? '' : 's'} used by the app{' '}
              {unregisteredModuleCount === 1 ? "isn't" : "aren't"} registered here yet.
            </span>
            <button
              onClick={() => { setEditingModule(undefined); setModuleModalOpen(true) }}
              className="font-medium text-foreground hover:underline cursor-pointer shrink-0"
            >
              Register now
            </button>
          </div>
        )}

        {/* Permissions matrix */}
        <div className="px-6 pb-6">
          <div className="border rounded-lg overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid border-b bg-muted/40" style={{ gridTemplateColumns: gridTemplate }}>
                  <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Module</div>
                  {actions.map(a => (
                    <div key={a.key} className="py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                      {a.label}
                    </div>
                  ))}
                  <div />
                </div>

                {loading || permsLoading || modulesLoading || actionsLoading ? (
                  <PermissionMatrixSkeleton columns={actions.length} />
                ) : sections.length === 0 ? (
                  <div className="px-4 py-8 text-sm text-muted-foreground">
                    No modules yet — add one to start building the permissions matrix.
                  </div>
                ) : (
                  sections.map((section, sectionIdx) => (
                    <div key={section.sectionLabel} className={cn(sectionIdx > 0 && 'border-t-2 border-border/60')}>
                      <div className="px-4 py-2 bg-muted/50 border-b flex items-center gap-2.5">
                        <div className="w-0.5 h-3 rounded-full bg-muted-foreground/40" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
                          {section.sectionLabel}
                        </span>
                      </div>
                      {section.modules.map((mod, idx) => (
                        <div
                          key={mod.key}
                          className={cn(
                            'group grid items-center hover:bg-muted/20 transition-colors',
                            idx < section.modules.length - 1 && 'border-b'
                          )}
                          style={{ gridTemplateColumns: gridTemplate }}
                        >
                          <div className="px-4 py-3 text-sm font-medium">{mod.label}</div>
                          {actions.map(a => {
                            const isApplicable = mod.actions.includes(a.key)
                            const isChecked = activePermissions[mod.key]?.includes(a.key) ?? false
                            return (
                              <div key={a.key} className="flex justify-center py-3">
                                {isApplicable ? (
                                  <Checkbox
                                    checked={isChecked}
                                    disabled={!editMode}
                                    onCheckedChange={checked => handleToggle(mod.key, a.key, !!checked)}
                                  />
                                ) : (
                                  <NaCell />
                                )}
                              </div>
                            )
                          })}
                          <div className="flex justify-center py-3">
                            {canUpdateRole && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer">
                                    <Pencil className="size-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => { setEditingModule(mod); setModuleModalOpen(true) }}>
                                    Edit module
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}

                {canUpdateRole && (
                  <div className="border-t px-4 py-3">
                    <button
                      onClick={() => { setEditingModule(undefined); setModuleModalOpen(true) }}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      Add module
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={v => !v && setCreateOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Ops Manager"
                value={createForm.name}
                onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input
                placeholder="e.g. OPS_MANAGER"
                value={createForm.code}
                onChange={e => setCreateForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                placeholder="Short description"
                value={createForm.description}
                onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateRole}
              disabled={!createForm.name.trim() || !createForm.code.trim() || creating}
            >
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ModuleModal
        open={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        actions={actions}
        existingModules={modules}
        editModule={editingModule}
      />
      <ActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        actions={actions}
      />
    </div>
  )
}
