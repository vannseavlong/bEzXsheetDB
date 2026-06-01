import { useState, useMemo } from 'react'
import { Table, TableBody } from '@/components/ui/table'
import { useTableState } from '@/hooks/use-table-state'
import { useDataTableConfig } from '@/hooks/use-data-table-config'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { blockedScheduleColumns } from '@/components/data-table/columns/BlockedScheduleColumns'
import { BlockedScheduleHeader } from '@/components/headers/BlockedScheduleHeader'
import { mockBlockedSchedules } from '@/data/blockedSchedule'
import type { BlockedSchedule } from '@/types'

export default function BlockedScheduleList() {
  const tableState = useTableState()

  const [data, setData] = useState<BlockedSchedule[]>(
    () => [...mockBlockedSchedules] as BlockedSchedule[]
  )

  const columns = useMemo(
    () =>
      blockedScheduleColumns({
        onDelete: (id) => setData((prev) => prev.filter((i) => i.id !== id)),
      }),
    []
  )

  const table = useDataTableConfig(data, columns, tableState)

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <BlockedScheduleHeader />
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
