import { useEffect, useMemo, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { SortableRows } from '@/components/data-table/SortableRows'
import { DraggableContext } from '@/components/data-table/DraggableContext'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { productColumns } from '@/components/data-table/columns/ProductColumns'
import { ProductHeader } from '@/components/headers/ProductHeader'
import { useProducts, useRemoveProduct, useReorderProducts } from '@/api/products'
import type { Product } from '@/types'

export default function ProductList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter, search, setSearch, pagination } = tableState

  const isFiltered = statusFilter !== 'all' || search !== ''

  const { data: result, isLoading } = useProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })

  const [data, setData] = useState<Product[]>([])
  useEffect(() => {
    setData(result?.data ?? [])
  }, [result])

  const removeProduct = useRemoveProduct()
  const handleDelete = async (id: string) => {
    try {
      await removeProduct.mutateAsync(id)
    } catch (err) { console.error('Delete failed:', err) }
  }

  const columns = useMemo(() => productColumns({ onDelete: handleDelete }), [])

  const table = useDataTableConfig(data, columns, tableState, {
    pageCount: result?.meta.totalPages ?? 1,
  })

  const reorder = useReorderProducts()
  const handleReorder = async () => {
    try {
      await reorder.mutateAsync({
        ids: data.map((p) => p.id),
        offset: pagination.pageIndex * pagination.pageSize,
      })
    } catch (err) { console.error('Reorder failed:', err) }
  }

  const isInitialLoading = isLoading && data.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ProductHeader search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
          {isInitialLoading ? (
            <Table className="min-w-full">
              <DataTableHeader table={table} />
              <TableBody>
                <TableRowSkeleton columns={columns} />
              </TableBody>
            </Table>
          ) : isFiltered ? (
            <Table className="min-w-full">
              <DataTableHeader table={table} />
              <TableBody>
                <TableRows table={table} columns={columns} />
              </TableBody>
            </Table>
          ) : (
            <DraggableContext data={data} setData={setData} onChange={handleReorder}>
              <Table className="min-w-full">
                <DataTableHeader isDraggable table={table} />
                <SortableContext
                  items={data.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <SortableRows table={table} columns={columns} />
                </SortableContext>
              </Table>
            </DraggableContext>
          )}
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
