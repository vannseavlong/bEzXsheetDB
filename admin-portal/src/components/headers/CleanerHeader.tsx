import type { Table } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/SearchBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'
import type { Cleaner } from '@/types'

type Props = {
  table: Table<Cleaner>
  statusFilter: string
  setStatusFilter: (value: string) => void
}

export function CleanerHeader({ table, statusFilter, setStatusFilter }: Props) {
  const { hasPermission } = usePermission()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search for cleaner..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {hasPermission(MODULES.CLEANER, ACTIONS.ADD) && (
          <NavLink to="/cleaner/new">
            <Button size="sm">
              New Cleaner <Plus className="ml-1 h-4 w-4" />
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  )
}
