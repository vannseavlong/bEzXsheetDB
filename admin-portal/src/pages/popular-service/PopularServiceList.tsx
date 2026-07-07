import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { popularServiceColumns } from '@/components/data-table/columns/PopularServiceColumns'
import { PopularServiceHeader } from '@/components/headers/PopularServiceHeader'
import { usePopularServices, useRemovePopularService } from '@/api/popular-services'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

export default function PopularServiceList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const { data: result, isLoading } = usePopularServices({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })

  const data = useMemo(() => result?.data ?? [], [result])

  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(MODULES.POPULAR_SERVICE, ACTIONS.UPDATE)
  const canDelete = hasPermission(MODULES.POPULAR_SERVICE, ACTIONS.DELETE)

  const removePopularService = useRemovePopularService()
  const handleDelete = async (id: string) => {
    try {
      await removePopularService.mutateAsync(id)
    } catch (err) { console.error('Delete failed:', err) }
  }

  const columns = useMemo(
    () => popularServiceColumns({ onDelete: handleDelete, canUpdate, canDelete }),
    [canUpdate, canDelete]
  )

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <PopularServiceHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
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
