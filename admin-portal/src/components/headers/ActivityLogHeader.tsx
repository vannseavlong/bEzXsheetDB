import type { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import type { ActivityLog } from '@/types'

interface Props {
  table: Table<ActivityLog>
}

export function ActivityLogHeader({ table }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b">
      <Input
        placeholder="Search by user, module or action..."
        value={(table.getState().globalFilter as string) ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="h-9 w-80"
      />
    </div>
  )
}
