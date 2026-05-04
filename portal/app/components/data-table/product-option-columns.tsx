import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { MoreVertical, Pen, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import TableCellDiv from './table-cell-div';

export const productOptionColumns: ColumnDef<ProductOptionAttributes>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { width: 48 },
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.id}</span>
  },
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => <TableCellDiv>{row.original.nameEn || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row }) => {
      const productName = row.original.product?.nameEn;
      return <TableCellDiv>{productName || '-'}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <TableCellDiv>{row.original.amount ?? '-'}</TableCellDiv>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status ? 'approve' : 'reject'}>{status ? 'Active' : 'Inactive'}</Badge>
      );
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-blue-500" onClick={() => {}}>
                Edit
                <Pen className="text-blue-500" />
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Delete
                <Trash2 />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
