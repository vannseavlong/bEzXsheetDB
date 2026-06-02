import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/SearchBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CategoryAddon } from '@/types'

interface Props {
  table: Table<CategoryAddon>
  statusFilter: string
  setStatusFilter: (v: string) => void
}

export function CategoryAddonHeader({ table, statusFilter, setStatusFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search add-ons..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('nameEn')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" asChild>
          <NavLink to="/category-addon/new">
            <Plus className="h-4 w-4 mr-1" />
            New Add-On
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
