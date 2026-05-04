import { formatDate } from '@/lib/date-helper';
import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { MoreVertical, Pen, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const roleColumns: ColumnDef<RolesProps>[] = [
  {
    id: 'select',

    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  // Name first
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="w-[412px]">{row.getValue('role')}</div>
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="w-[180px]">
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
        </div>
      );
    }
  },

  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const rawDate = row.getValue('createdAt') as string;
      return <div className="w-[300px]">{formatDate(rawDate)}</div>;
    }
  },

  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ row }) => <div className="w-[300px]">{row.getValue('createdBy')}</div>
  },

  {
    id: 'actions',
    enableHiding: true,

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
const getStatusVariant = (status: string) => {
  const lowercaseStatus = status.toLowerCase();
  if (lowercaseStatus === 'active') return 'approve';
  if (lowercaseStatus === 'inactive') return 'reject';
  return 'approve';
};
