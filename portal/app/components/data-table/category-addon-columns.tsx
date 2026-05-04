import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Pen, Trash2 } from 'lucide-react';
import TableCellDiv from './table-cell-div';
import { NavLink } from 'react-router';

export interface CategoryAddOnColumnProps {
  onDelete?: (id: number) => void;
}

export const categoryAddOnColumns = ({
  onDelete
}: CategoryAddOnColumnProps = {}): ColumnDef<ProductAddOnGroupListAttributes>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { width: 48 },
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.id}</span>
  },
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => <div className="w-50">{row.original.nameEn || '-'}</div>
  },
  // {
  //   accessorKey: 'nameKm',
  //   header: 'Name (KM)',
  //   cell: ({ row }) => <TableCellDiv>{row.original.nameKm || '-'}</TableCellDiv>
  // },
  // {
  //   accessorKey: 'nameVi',
  //   header: 'Name (VI)',
  //   cell: ({ row }) => <TableCellDiv>{row.original.nameVi || '-'}</TableCellDiv>
  // },
  // {
  //   accessorKey: 'nameCn',
  //   header: 'Name (CN)',
  //   cell: ({ row }) => <TableCellDiv>{row.original.nameCn || '-'}</TableCellDiv>
  // },
  // {
  //   accessorKey: 'nameTw',
  //   header: 'Name (TW)',
  //   cell: ({ row }) => <TableCellDiv>{row.original.nameTw || '-'}</TableCellDiv>
  // },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const categoryName = row.original.category?.nameEn;
      return <TableCellDiv>{categoryName || '-'}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'selectionType',
    header: 'Selection Type',
    cell: ({ row }) => <TableCellDiv>{row.original.selectionType || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'isRequired',
    header: 'Required',
    cell: ({ row }) => (
      <Badge variant={row.original.isRequired ? 'approve' : 'reject'}>
        {row.original.isRequired ? 'Yes' : 'No'}
      </Badge>
    )
  },
  // {
  //   accessorKey: 'sort',
  //   header: 'Sort',
  //   cell: ({ row }) => <TableCellDiv>{row.original.sort ?? '-'}</TableCellDiv>
  // },
  {
    accessorKey: 'addOns',
    header: 'Items',
    cell: ({ row }) => <TableCellDiv>{row.original.addOns?.length ?? 0}</TableCellDiv>
  },
  {
    accessorKey: 'badgeEn',
    header: 'Badge',
    cell: ({ row }) => <TableCellDiv>{row.original.badgeEn || '-'}</TableCellDiv>
  },
  {
    id: 'actions',
    enableHiding: true,
    cell: ({ row }) => {
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
              <NavLink to={`/category-addon/${row.original.id}`}>
                <DropdownMenuItem className="text-blue-500">
                  Edit
                  <Pen className="text-blue-500" />
                </DropdownMenuItem>
              </NavLink>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(row.original.id)}>
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
