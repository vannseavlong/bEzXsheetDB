import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PopularService } from '@/types'

interface Props {
  table: Table<PopularService>
  statusFilter: string
  setStatusFilter: (v: string) => void
}

export function PopularServiceHeader({ table, statusFilter, setStatusFilter }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b">
      <Input
        placeholder="Search services..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(e) => table.getColumn('nameEn')?.setFilterValue(e.target.value)}
        className="h-9 w-64"
      />
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" asChild>
          <NavLink to="/popular-service/new">
            <Plus className="h-4 w-4 mr-1" />
            New Popular Service
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
