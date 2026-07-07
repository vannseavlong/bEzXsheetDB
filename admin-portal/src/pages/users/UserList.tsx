import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Table, TableBody } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchBar } from '@/components/shared/SearchBar'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { userColumns } from '@/components/data-table/columns/UserColumns'
import { useUsers, useCreateUser, useUpdateUser, useDeactivateUser, type DbAdminUser } from '@/api/users'
import { useRoles } from '@/api/rbac'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

type EditForm = { name: string; role_id: string; status: string }
type CreateForm = { name: string; email: string; password: string; role_id: string }

export default function UserList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const [roleFilter, setRoleFilter] = useState('all')

  const { data: rolesResult } = useRoles()
  const roles = (rolesResult?.data ?? []).filter((r) => r.status)

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateForm>({ name: '', email: '', password: '', role_id: '' })

  // Edit dialog
  const [editTarget, setEditTarget] = useState<DbAdminUser | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ name: '', role_id: '', status: '' })

  const { data: result, isLoading: loading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
    role_id: roleFilter === 'all' ? undefined : roleFilter,
  })
  const data = result?.data ?? []

  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deactivateUser = useDeactivateUser()
  const creating = createUser.isPending
  const editing = updateUser.isPending

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password || !createForm.role_id) return
    try {
      await createUser.mutateAsync(createForm)
      setCreateOpen(false)
      setCreateForm({ name: '', email: '', password: '', role_id: '' })
    } catch (err) { console.error('Create failed:', err) }
  }

  const handleEdit = async () => {
    if (!editTarget) return
    try {
      await updateUser.mutateAsync({ id: editTarget._id, data: editForm })
      setEditTarget(null)
    } catch (err) { console.error('Update failed:', err) }
  }

  const handleToggleStatus = async (user: DbAdminUser) => {
    try {
      if (user.status === 'active') {
        await deactivateUser.mutateAsync(String(user._id))
      } else {
        await updateUser.mutateAsync({ id: user._id, data: { status: 'active' } })
      }
    } catch (err) { console.error('Toggle failed:', err) }
  }

  const { hasPermission } = usePermission()
  const canAdd = hasPermission(MODULES.ADMIN_USERS, ACTIONS.ADD)
  const canUpdate = hasPermission(MODULES.ADMIN_USERS, ACTIONS.UPDATE)

  const columns = useMemo(() => userColumns({
    onEdit: user => { setEditTarget(user); setEditForm({ name: user.name, role_id: user.role_id, status: user.status }) },
    onToggleStatus: handleToggleStatus,
    canUpdate,
  }), [canUpdate])

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        {/* Header / filters */}
        <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
          <SearchBar
            placeholder="Search by name or email…"
            value={search}
            onChange={setSearch}
          />
          <div className="flex items-center gap-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {canAdd && (
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> New User
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              {loading && data.length === 0 ? (
                <TableRowSkeleton columns={columns} />
              ) : (
                <TableRows table={table} columns={columns} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={v => !v && setCreateOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Full name" value={createForm.name}
                onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="user@example.com" value={createForm.email}
                onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" placeholder="Min 8 chars, uppercase, number, symbol"
                value={createForm.password}
                onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={createForm.role_id} onValueChange={v => setCreateForm(p => ({ ...p, role_id: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!createForm.name || !createForm.email || !createForm.password || !createForm.role_id || creating}
            >
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={v => !v && setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Full name" value={editForm.name}
                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={editForm.role_id} onValueChange={v => setEditForm(p => ({ ...p, role_id: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={v => setEditForm(p => ({ ...p, status: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!editForm.name || editing}>
              {editing ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
