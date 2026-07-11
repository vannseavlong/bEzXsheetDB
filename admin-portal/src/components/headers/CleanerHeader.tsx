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

interface Props {
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
}

export function CleanerHeader({ search, setSearch, statusFilter, setStatusFilter }: Props) {
  const { hasPermission } = usePermission()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search for cleaner..."
        value={search}
        onChange={setSearch}
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
