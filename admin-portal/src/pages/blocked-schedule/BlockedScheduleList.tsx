import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { blockedScheduleColumns } from '@/components/data-table/columns/BlockedScheduleColumns'
import { BlockedScheduleHeader } from '@/components/headers/BlockedScheduleHeader'
import { useBlockedSchedules, useRemoveBlockedSchedule } from '@/api/blocked-schedules'

export default function BlockedScheduleList() {
  const tableState = useTableState()
  const { search, setSearch, pagination } = tableState

  const { data: result, isLoading } = useBlockedSchedules({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })
  const data = useMemo(() => result?.data ?? [], [result])

  const removeBlockedSchedule = useRemoveBlockedSchedule()
  async function handleDelete(id: string) {
    await removeBlockedSchedule.mutateAsync(id)
  }

  const columns = useMemo(
    () => blockedScheduleColumns({ onDelete: handleDelete }),
    []
  )

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <BlockedScheduleHeader search={search} setSearch={setSearch} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              {isLoading && data.length === 0 ? (
                <TableRowSkeleton columns={columns} />
              ) : (
                <TableRows table={table} columns={columns} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
