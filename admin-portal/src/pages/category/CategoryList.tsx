import { useState, useMemo, useEffect } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Table } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { SortableRows } from '@/components/data-table/SortableRows'
import { DraggableContext } from '@/components/data-table/DraggableContext'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { categoryColumns } from '@/components/data-table/columns/CategoryColumns'
import { CategoryTableHeader } from '@/components/headers/CategoryTableHeader'
import { categoriesApi, type DbCategory } from '@/api/categories'
import { platformsApi } from '@/api/platforms'
import type { Category } from '@/types'

function toCategory(r: DbCategory): Category {
  return {
    id: r._id, nameEn: r.name_en, nameKm: r.name_km,
    thumbnailUrl: r.thumbnail_url ?? null, status: r.status, sort: r.sort,
    platform: r.platform ?? [],
    products: [], taskInformation: [], categoryAddOns: [],
  }
}

export default function CategoryList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter } = tableState

  const [data, setData] = useState<Category[]>([])
  const [platformLabels, setPlatformLabels] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([categoriesApi.list(), platformsApi.list()])
      .then(([categories, platforms]) => {
        setData(categories.map(toCategory))
        setPlatformLabels(Object.fromEntries(platforms.map(p => [p._id, p.name_en])))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.remove(id)
      setData(prev => prev.filter(i => i.id !== id))
    } catch (err) { console.error('Delete failed:', err) }
  }

  const columns = useMemo(
    () => categoryColumns({ onDelete: handleDelete, platformLabels }),
    [platformLabels]
  )

  const table = useDataTableConfig(data, columns, tableState)

  useEffect(() => {
    const col = table.getColumn('status')
    if (!col) return
    col.setFilterValue(statusFilter === 'all' ? undefined : statusFilter === 'active')
  }, [statusFilter, table])

  const handleReorder = async () => {
    try {
      const updated = await categoriesApi.reorder(data.map(c => c.id))
      setData(updated.map(toCategory))
    } catch (err) { console.error('Reorder failed:', err) }
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <CategoryTableHeader
          table={table}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
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
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
