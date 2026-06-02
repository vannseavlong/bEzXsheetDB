import type { Table } from '@tanstack/react-table'
import { SearchBar } from '@/components/shared/SearchBar'
import type { ActivityLog } from '@/types'

interface Props {
  table: Table<ActivityLog>
}

export function ActivityLogHeader({ table }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search by user, module or action..."
        value={(table.getState().globalFilter as string) ?? ''}
        onChange={(val) => table.setGlobalFilter(val)}
      />
    </div>
  )
}
