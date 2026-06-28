import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { categoryAddonColumns } from '@/components/data-table/columns/CategoryAddonColumns'
import { CategoryAddonHeader } from '@/components/headers/CategoryAddonHeader'
import { useCategoryAddonsList, useRemoveCategoryAddon } from '@/api/category-addons'

export default function CategoryAddonList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const { data: result, isLoading } = useCategoryAddonsList({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })

  const data = useMemo(() => result?.data ?? [], [result])

  const removeCategoryAddon = useRemoveCategoryAddon()
  const handleDelete = async (id: string) => {
    try {
      await removeCategoryAddon.mutateAsync(id)
    } catch (err) { console.error('Delete failed:', err) }
  }

  const columns = useMemo(() => categoryAddonColumns({ onDelete: handleDelete }), [])

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  if (isLoading && data.length === 0) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <CategoryAddonHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              <TableRows table={table} columns={columns} />
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
