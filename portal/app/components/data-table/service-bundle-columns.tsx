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
import { formatDate } from '@/lib/date-helper';

export const serviceBundleColumns: ColumnDef<ServiceBundleProps>[] = [
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
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    }
  },
  {
    accessorKey: 'bundleType',
    header: 'Bundle Type',
    cell: ({ row }) => <div>{row.getValue('bundleType')}</div>
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const rawDate = row.getValue('date') as Date;
      return <div>{formatDate(rawDate)}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const handleEdit = () => {
        // Add your edit logic here
        console.log('Edit item:', row.original.id);
      };

      const handleDelete = () => {
        // Add your delete logic here
        console.log('Delete item:', row.original.id);
      };

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
              <DropdownMenuItem className="text-blue-500" onClick={handleEdit}>
                <Pen className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
  if (lowercaseStatus === 'in active') return 'reject';
  return 'default';
};
