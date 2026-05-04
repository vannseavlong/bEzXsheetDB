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

export const PromotionColumns: ColumnDef<PromotionProps>[] = [
  {
    id: 'select',
    meta: {
      isSticky: true,
      stickyLeft: 0
    },
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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="w-[240px]">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'applies_to',
    header: 'Applies To',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('applies_to')}</div>
  },

  {
    accessorKey: 'promotion_type',
    header: 'Promotion Type',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('promotion_type')}</div>
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const value = row.getValue('value') as string;
      return <div className="w-[180px]">{value}</div>;
    }
  },
  {
    accessorKey: 'usage_limit',
    header: 'Usage Limit',
    cell: ({ row }) => <div className="w-[160px]">{row.getValue('usage_limit')}</div>
  },
  {
    accessorKey: 'per_user_unit',
    header: 'Per User Unit',
    cell: ({ row }) => <div className="w-[160px]">{row.getValue('per_user_unit')}</div>
  },

  // New Columns
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
    accessorKey: 'created_by',
    header: 'Created By',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('created_by')}</div>
  },
  {
    accessorKey: 'valid_from',
    header: 'Valid From',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('valid_from')}</div>
  },
  {
    accessorKey: 'valid_to',
    header: 'Valid To',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('valid_to')}</div>
  },
  {
    accessorKey: 'eligible_service',
    header: 'Eligible Service',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('eligible_service')}</div>
  },
  {
    accessorKey: 'eligible_users',
    header: 'Eligible Users',
    cell: ({ row }) => <div className="w-[180px]">{row.getValue('eligible_users')}</div>
  },

  {
    id: 'actions',
    enableHiding: true,
    meta: {
      isSticky: true,
      stickyRight: 0
    },
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
