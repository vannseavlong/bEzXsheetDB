import { useEffect, useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { CleanerHeader } from '@/components/headers/CleanerHeader'
import { cleanerColumns } from '@/components/data-table/columns/CleanerColumns'
import { mockCleaners } from '@/data/cleaners'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'
import type { Cleaner } from '@/types'

export default function CleanerList() {
  const tableState = useTableState()
  const { statusFilter, setStatusFilter } = tableState

  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(MODULES.CLEANER, ACTIONS.UPDATE)
  const columns = useMemo(() => cleanerColumns({ canUpdate }), [canUpdate])

  const table = useDataTableConfig(mockCleaners as Cleaner[], columns, tableState)

  useEffect(() => {
    const col = table.getColumn('status')
    if (!col) return
    col.setFilterValue(statusFilter === 'all' ? undefined : statusFilter === 'active')
  }, [statusFilter, table])

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-[300px] lg:min-h-0">
        <CleanerHeader
          table={table}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex min-h-0 overflow-x-auto">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              <TableRows columns={columns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
