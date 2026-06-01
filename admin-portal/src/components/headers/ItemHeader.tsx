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
import { mockItems } from '@/data/items'
import type { Item } from '@/types'

const uniqueCategories = ['all', ...Array.from(new Set(mockItems.map((i: Item) => i.category)))]

interface Props {
  table: Table<Item>
  statusFilter: string
  setStatusFilter: (v: string) => void
  categoryFilter: string
  setCategoryFilter: (v: string) => void
}

export function ItemHeader({ table, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b">
      <Input
        placeholder="Search items..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(e) => table.getColumn('nameEn')?.setFilterValue(e.target.value)}
        className="h-9 w-64"
      />
      <div className="flex items-center gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <NavLink to="/item/new">
            <Plus className="h-4 w-4 mr-1" />
            New Item
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
