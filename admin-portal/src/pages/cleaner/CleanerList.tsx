import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { CleanerHeader } from '@/components/headers/CleanerHeader'
import { cleanerColumns } from '@/components/data-table/columns/CleanerColumns'
import { useCleaners, useRemoveCleaner } from '@/api/cleaners'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

export default function CleanerList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const { data: result, isLoading } = useCleaners({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })
  const data = useMemo(() => result?.data ?? [], [result])

  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(MODULES.CLEANER, ACTIONS.UPDATE)
  const canDelete = hasPermission(MODULES.CLEANER, ACTIONS.DELETE)

  const removeCleaner = useRemoveCleaner()
  async function handleDelete(id: string) {
    await removeCleaner.mutateAsync(id)
  }

  const columns = useMemo(
    () => cleanerColumns({ onDelete: handleDelete, canUpdate, canDelete }),
    [canUpdate, canDelete]
  )

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-[300px] lg:min-h-0">
        <CleanerHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex min-h-0 overflow-x-auto">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              {isLoading && data.length === 0 ? (
                <TableRowSkeleton columns={columns} />
              ) : (
                <TableRows columns={columns} table={table} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
