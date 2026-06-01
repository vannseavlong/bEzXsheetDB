import { useState } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { activityLogColumns } from '@/components/data-table/columns/ActivityLogColumns'
import { ActivityLogHeader } from '@/components/headers/ActivityLogHeader'
import { mockActivityLogs } from '@/data/activityLog'
import type { ActivityLog } from '@/types'

export default function ActivityLogPage() {
  const tableState = useTableState()
  const [data] = useState<ActivityLog[]>(() => [...mockActivityLogs] as ActivityLog[])

  const table = useDataTableConfig(data, activityLogColumns, tableState)

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ActivityLogHeader table={table} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              <TableRows table={table} columns={activityLogColumns} />
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
