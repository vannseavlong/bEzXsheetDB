import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useCreateRbacAction, type RbacAction } from '@/api/rbac'
import { ACTION_CATALOG } from '@/lib/permission-registry'

type Props = {
  open: boolean
  onClose: () => void
  actions: RbacAction[]
}

export function ActionModal({ open, onClose, actions }: Props) {
  const createMutation = useCreateRbacAction()

  const registeredKeys = new Set(actions.map((a) => a.key))
  const unregistered = ACTION_CATALOG.filter((a) => !registeredKeys.has(a.key))

  const handleAdd = (data: { key: string; label: string }) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Actions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm font-medium mb-1.5">Registered</p>
            <div className="flex flex-wrap gap-1.5">
              {actions.map((a) => (
                <span key={a.key} className="px-2 py-1 rounded-md border text-xs text-muted-foreground">
                  {a.label} <span className="opacity-60">({a.key})</span>
                </span>
              ))}
              {actions.length === 0 && (
                <p className="text-sm text-muted-foreground">Nothing registered yet.</p>
              )}
            </div>
          </div>

          {unregistered.length > 0 ? (
            <div>
              <p className="text-sm font-medium mb-1.5">Used by the app, not yet in the database</p>
              <div className="flex flex-wrap gap-1.5">
                {unregistered.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => handleAdd(a)}
                    disabled={createMutation.isPending}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    <Plus className="size-3" />
                    {a.label} <span className="opacity-60">({a.key})</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              All actions the app uses are registered.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
