import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateRbacAction,
  useCreateRbacModule,
  useUpdateRbacModule,
  type RbacAction,
  type RbacModule,
} from '@/api/rbac'
import { ACTION_LABELS, MODULE_REGISTRY } from '@/lib/permission-registry'

type Props = {
  open: boolean
  onClose: () => void
  actions: RbacAction[]
  existingModules: RbacModule[]
  editModule?: RbacModule
}

export function ModuleModal({ open, onClose, actions, existingModules, editModule }: Props) {
  const isEdit = !!editModule
  const createAction = useCreateRbacAction()
  const createModule = useCreateRbacModule()
  const updateModule = useUpdateRbacModule()
  const [isPending, setIsPending] = React.useState(false)

  const existingKeys = new Set(existingModules.map((m) => m.key))
  const unregistered = MODULE_REGISTRY.filter((m) => !existingKeys.has(m.key))

  const [mode, setMode] = React.useState<'registry' | 'custom'>('registry')
  const [registryKey, setRegistryKey] = React.useState('')

  const [key, setKey] = React.useState('')
  const [label, setLabel] = React.useState('')
  const [section, setSection] = React.useState('')
  const [selectedActions, setSelectedActions] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!open) return
    setMode(isEdit || unregistered.length === 0 ? 'custom' : 'registry')
    setRegistryKey('')
    setKey(editModule?.key ?? '')
    setLabel(editModule?.label ?? '')
    setSection(editModule?.section ?? '')
    setSelectedActions(editModule?.actions ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editModule])

  const handleSelectRegistry = (regKey: string) => {
    setRegistryKey(regKey)
    const def = MODULE_REGISTRY.find((m) => m.key === regKey)
    setKey(def?.key ?? '')
    setLabel(def?.label ?? '')
    setSection(def?.section ?? '')
    setSelectedActions(def?.actions ?? [])
  }

  const toggleAction = (actionKey: string) => {
    setSelectedActions((prev) =>
      prev.includes(actionKey) ? prev.filter((a) => a !== actionKey) : [...prev, actionKey]
    )
  }

  const catalogActionKeys = new Set(actions.map((a) => a.key))
  // The registry action list may include keys the actions catalog doesn't have yet —
  // offer every registry action as a checkbox regardless, and create missing ones on save.
  const availableActionOptions =
    mode === 'registry' && registryKey
      ? (MODULE_REGISTRY.find((m) => m.key === registryKey)?.actions ?? []).map((k) => ({
          key: k,
          label: ACTION_LABELS[k] ?? k,
        }))
      : actions.map((a) => ({ key: a.key, label: a.label }))

  const handleSave = async () => {
    if (!key.trim() || !label.trim()) return
    setIsPending(true)
    try {
      if (isEdit) {
        await updateModule.mutateAsync({
          key: editModule.key,
          data: { label: label.trim(), section: section.trim() || 'Other', actions: selectedActions },
        })
      } else {
        // Auto-create any selected actions that don't exist in the catalog yet, so the
        // module can reference exactly the keys the frontend code expects.
        for (const actionKey of selectedActions) {
          if (!catalogActionKeys.has(actionKey)) {
            await createAction.mutateAsync({ key: actionKey, label: ACTION_LABELS[actionKey] ?? actionKey })
          }
        }
        await createModule.mutateAsync({
          key: key.trim().toUpperCase(),
          label: label.trim(),
          section: section.trim() || 'Other',
          actions: selectedActions,
        })
      }
      onClose()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Module' : 'Add Module'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!isEdit && unregistered.length > 0 && (
            <div className="flex gap-1.5 border rounded-md p-1 w-fit">
              <button
                onClick={() => setMode('registry')}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${mode === 'registry' ? 'bg-muted' : 'text-muted-foreground'}`}
              >
                From app modules
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${mode === 'custom' ? 'bg-muted' : 'text-muted-foreground'}`}
              >
                Custom
              </button>
            </div>
          )}

          {!isEdit && mode === 'registry' ? (
            <div className="space-y-1.5">
              <Label>Module <span className="text-xs text-muted-foreground">(used by the app, not yet in the database)</span></Label>
              <Select value={registryKey} onValueChange={handleSelectRegistry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a module…" />
                </SelectTrigger>
                <SelectContent>
                  {unregistered.map((m) => (
                    <SelectItem key={m.key} value={m.key}>
                      {m.label} <span className="text-muted-foreground">({m.section})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Key <span className="text-xs text-muted-foreground">(unique identifier)</span></Label>
                <Input
                  placeholder="e.g. ORDER"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Section</Label>
                <Input placeholder="e.g. Operations" value={section} onChange={(e) => setSection(e.target.value)} />
              </div>
            </div>
          )}

          {(isEdit || mode === 'custom') && (
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input placeholder="e.g. Order" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-1.5">Applicable actions</p>
            {availableActionOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground border rounded-md px-3 py-2">
                {mode === 'registry' ? 'Select a module above first.' : 'No actions defined yet — add one first.'}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {availableActionOptions.map((a) => (
                  <label key={a.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedActions.includes(a.key)}
                      onCheckedChange={() => toggleAction(a.key)}
                    />
                    {a.label}
                    {mode === 'registry' && !catalogActionKeys.has(a.key) && (
                      <span className="text-[10px] text-muted-foreground">(new)</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!key.trim() || !label.trim() || isPending}>
            {isPending ? 'Saving…' : isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
