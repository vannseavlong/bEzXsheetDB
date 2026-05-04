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
import { formatDate } from '@/lib/date-helper';

export const referralColumns: ColumnDef<ReferralProgramProps>[] = [
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
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'referralCode',
    header: 'Referral Code',
    cell: ({ row }) => <div>{row.getValue('referralCode')}</div>
  },
  {
    accessorKey: 'totalReferralUser',
    header: 'Total Referral Users',
    cell: ({ row }) => <div>{row.getValue('totalReferralUser')}</div>
  },
  {
    accessorKey: 'pointEarnd',
    header: 'Points Earned',
    cell: ({ row }) => <div>{row.getValue('pointEarnd')}</div>
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div>{formatDate(row.getValue('date'))}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => (
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
              <Pen className="text-blue-500 ml-2" size={16} />
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete
              <Trash2 className="ml-2" size={16} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
];
