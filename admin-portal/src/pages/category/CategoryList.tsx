import { useState, useMemo, useEffect } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { SortableRows } from '@/components/data-table/SortableRows'
import { DraggableContext } from '@/components/data-table/DraggableContext'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { categoryColumns } from '@/components/data-table/columns/CategoryColumns'
import { CategoryTableHeader } from '@/components/headers/CategoryTableHeader'
import { mockCategories } from '@/data/categories'
import type { Category } from '@/types'

export default function CategoryList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter } = tableState

  const [data, setData] = useState<Category[]>(() => [...mockCategories] as Category[])

  const columns = useMemo(
    () => categoryColumns({ onDelete: (id) => setData((prev) => prev.filter((i) => i.id !== id)) }),
    []
  )

  const table = useDataTableConfig(data, columns, tableState)

  useEffect(() => {
    const col = table.getColumn('status')
    if (!col) return
    if (statusFilter === 'all') {
      col.setFilterValue(undefined)
    } else {
      col.setFilterValue(statusFilter === 'active')
    }
  }, [statusFilter, table])

  const handleReorder = (id: UniqueIdentifier, newIndex: number) => {
    console.log('Reorder:', id, '→ index', newIndex)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <CategoryTableHeader
          table={table}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex min-h-0 overflow-hidden">
          <DraggableContext data={data} setData={setData} onChange={handleReorder}>
            <Table className="min-w-full">
              <DataTableHeader isDraggable table={table} />
              <TableBody>
                <SortableContext
                  items={data.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <SortableRows table={table} columns={columns} />
                </SortableContext>
              </TableBody>
            </Table>
          </DraggableContext>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
