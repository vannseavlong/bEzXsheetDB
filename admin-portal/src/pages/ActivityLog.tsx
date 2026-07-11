import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { activityLogColumns } from '@/components/data-table/columns/ActivityLogColumns'
import { ActivityLogHeader } from '@/components/headers/ActivityLogHeader'
import { useActivityLogs } from '@/api/activity-log'

export default function ActivityLogPage() {
  const tableState = useTableState()
  const { search, setSearch, pagination } = tableState

  const { data: result, isLoading } = useActivityLogs({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })
  const data = useMemo(() => result?.data ?? [], [result])

  const table = useDataTableConfig(data, activityLogColumns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ActivityLogHeader search={search} setSearch={setSearch} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              {isLoading && data.length === 0 ? (
                <TableRowSkeleton columns={activityLogColumns} />
              ) : (
                <TableRows table={table} columns={activityLogColumns} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
