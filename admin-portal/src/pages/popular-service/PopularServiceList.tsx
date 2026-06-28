import { useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { popularServiceColumns } from '@/components/data-table/columns/PopularServiceColumns'
import { PopularServiceHeader } from '@/components/headers/PopularServiceHeader'
import { usePopularServices, useRemovePopularService } from '@/api/popular-services'
import type { PopularService } from '@/types'

export default function PopularServiceList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const { data: result, isLoading } = usePopularServices({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })

  const data: PopularService[] = useMemo(
    () => (result?.data ?? []).map((r) => ({
      id: r._id, nameEn: r.name_en, status: r.status,
      displayOrder: r.display_order, imageUrl: r.image_url ?? null, categoryId: '',
    })),
    [result]
  )

  const removePopularService = useRemovePopularService()
  const handleDelete = async (id: string) => {
    try {
      await removePopularService.mutateAsync(id)
    } catch (err) { console.error('Delete failed:', err) }
  }

  const columns = useMemo(() => popularServiceColumns({ onDelete: handleDelete }), [])

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  if (isLoading && data.length === 0) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>

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
              <TableRows table={table} columns={columns} />
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
