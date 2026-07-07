import { useState, useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { itemColumns } from '@/components/data-table/columns/ItemColumns'
import { ItemHeader } from '@/components/headers/ItemHeader'
import { useItems, useRemoveItem } from '@/api/items'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

export default function ItemList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const [categoryFilter, setCategoryFilter] = useState('all')

  const { data: result, isLoading } = useItems({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  })

  const data = useMemo(() => result?.data ?? [], [result])

  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(MODULES.SETUP_ITEM, ACTIONS.UPDATE)
  const canDelete = hasPermission(MODULES.SETUP_ITEM, ACTIONS.DELETE)

  const removeItem = useRemoveItem()
  async function handleDelete(id: string) {
    await removeItem.mutateAsync(id)
  }

  const columns = useMemo(
    () => itemColumns({ onDelete: handleDelete, canUpdate, canDelete }),
    [canUpdate, canDelete]
  )

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ItemHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
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
