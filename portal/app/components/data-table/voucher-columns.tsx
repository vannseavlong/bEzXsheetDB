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

export interface VoucherProps {
  id: string;
  name: string;
  code: string;
  discountType: 'Amount' | 'Percentage';
  discountValue: number;
  usageLimit: number;
  perUserLimit: number;
  status: 'Active' | 'Inactive';
  validFrom: Date | string;
  validTo: Date | string;
  eligibleServices: string;
  eligibleUsers: string;
}

export const voucherColumns: ColumnDef<VoucherProps>[] = [
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
    enableHiding: true,
    meta: {
      isSticky: true,
      width: 40,
      stickyLeft: 0
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.name}</div>;
    }
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return <div className="w-[180px]">{row.original.code}</div>;
    }
  },
  {
    accessorKey: 'discountType',
    header: 'Discount Type',
    cell: ({ row }) => {
      return <div className="w-[180px]">{row.original.discountType}</div>;
    }
  },
  {
    accessorKey: 'discountValue',
    header: 'Discount Value',
    cell: ({ row }) => {
      const type = row.getValue<'Amount' | 'Percentage'>('discountType');
      const value = row.getValue<number>('discountValue');
      return <div className="w-[180px]">{type === 'Percentage' ? `${value}%` : `$${value}`}</div>;
    }
  },
  {
    accessorKey: 'usageLimit',
    header: 'Usage Limit',
    cell: ({ row }) => {
      return <div className="w-[160px]">{row.original.usageLimit}</div>;
    }
  },
  {
    accessorKey: 'perUserLimit',
    header: 'Per User Limit',
    cell: ({ row }) => {
      return <div className="w-[160px]">{row.original.perUserLimit}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.status}</div>;
    }
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid From',
    cell: ({ row }) => {
      const date = row.getValue<string>('validFrom');
      return (
        <div className="w-[180px]">
          <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'validTo',
    header: 'Valid To',
    cell: ({ row }) => {
      const date = row.getValue<string>('validTo');
      return (
        <div className="w-[180px]">
          <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'eligibleUsers',
    header: 'Eligible Users',
    cell: ({ row }) => {
      const users = row.getValue<string>('eligibleUsers');
      return (
        <div className="w-[160px]">
          <span>{users || '-'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'eligibleServices',
    header: 'Eligible Services',
    cell: ({ row }) => {
      const services = row.getValue<string>('eligibleServices');
      return (
        <div className="w-[160px">
          <span>{services || '-'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'eligibleUsersCount',
    header: 'Eligible Users Count',
    cell: ({ row }) => {
      const users = row.getValue<string>('eligibleUsers');
      if (!users || users.toLowerCase() === 'all users') return <span>-</span>;
      return <span>{users.split(',').length}</span>;
    }
  },
  {
    id: 'actions',
    enableHiding: true,
    meta: {
      isSticky: true,
      width: 40,
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
            <DropdownMenuContent align="end" className="sticky">
              <DropdownMenuItem className="text-blue-500" onClick={() => {}}>
                Edit
                <Pen className="text-blue-500 ml-2" size={16} />
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Delete
                <Trash2 className="ml-2" size={16} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
