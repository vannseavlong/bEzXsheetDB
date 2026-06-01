import { flexRender, type Table } from '@tanstack/react-table'
import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableHeaderProps<TData> {
  table: Table<TData>
  isDraggable?: boolean
}

export function DataTableHeader<TData>({
  table,
  isDraggable = false,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className="sticky top-0 bg-muted z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {isDraggable && <TableHead className="w-12" />}
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}
