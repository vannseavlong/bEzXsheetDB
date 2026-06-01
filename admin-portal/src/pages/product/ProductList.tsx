import { useState, useMemo, useEffect } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { productColumns } from '@/components/data-table/columns/ProductColumns'
import { ProductHeader } from '@/components/headers/ProductHeader'
import { mockProducts } from '@/data/products'
import type { Product } from '@/types'

export default function ProductList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter } = tableState

  const [data, setData] = useState<Product[]>(() => [...mockProducts] as Product[])

  const columns = useMemo(
    () => productColumns({ onDelete: (id) => setData((prev) => prev.filter((i) => i.id !== id)) }),
    []
  )

  const table = useDataTableConfig(data, columns, tableState)

  useEffect(() => {
    const col = table.getColumn('status')
    if (!col) return
    col.setFilterValue(statusFilter === 'all' ? undefined : statusFilter === 'active')
  }, [statusFilter, table])

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ProductHeader table={table} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
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
