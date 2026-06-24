import { useState, useMemo, useEffect } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { itemColumns } from '@/components/data-table/columns/ItemColumns'
import { ItemHeader } from '@/components/headers/ItemHeader'
import { itemsApi } from '@/api/items'
import type { Item } from '@/types'

function dbToItem(db: import('@/api/items').DbItem): Item {
  return {
    id: String(db._id),
    nameEn: db.name_en,
    category: db.category,
    status: db.status,
    sortOrder: db.sort_order,
  }
}

export default function ItemList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter } = tableState

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [data, setData] = useState<Item[]>([])

  useEffect(() => {
    itemsApi.list().then(res => setData(res.map(dbToItem)))
  }, [])

  async function handleDelete(id: string) {
    await itemsApi.delete(id)
    setData(prev => prev.filter(i => i.id !== id))
  }

  const columns = useMemo(
    () => itemColumns({ onDelete: handleDelete }),
    []
  )

  const filteredData = useMemo(() => {
    if (categoryFilter === 'all') return data
    return data.filter((i) => i.category === categoryFilter)
  }, [data, categoryFilter])

  const table = useDataTableConfig(filteredData, columns, tableState)

  useEffect(() => {
    const col = table.getColumn('status')
    if (!col) return
    col.setFilterValue(statusFilter === 'all' ? undefined : statusFilter === 'active')
  }, [statusFilter, table])

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ItemHeader
          table={table}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
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
