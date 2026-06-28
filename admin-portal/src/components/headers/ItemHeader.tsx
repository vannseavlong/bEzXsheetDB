import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/SearchBar'
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
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  categoryFilter: string
  setCategoryFilter: (v: string) => void
}

export function ItemHeader({ search, setSearch, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search items..."
        value={search}
        onChange={setSearch}
      />
      <div className="flex flex-row gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
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
          <NavLink to="/item/new">
            <Plus className="h-4 w-4 mr-1" />
            New Item
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
