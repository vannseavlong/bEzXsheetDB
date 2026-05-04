import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Pen } from 'lucide-react';
import { NavLink } from 'react-router';

export const itemColumns: ColumnDef<ServiceItemAttributes>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  //   cell: ({ row }) => <div>{row.original.id}</div>
  // },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.original.name}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div>{row.original.description}</div>
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.status === true;
      return (
        <Badge variant={isActive ? 'approve' : 'reject'}>{isActive ? 'Active' : 'Inactive'}</Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <div>{row.original.createdAt}</div>
  },
  {
    id: 'actions',
    meta: {
      isSticky: true,
      stickyRight: 0
    },
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
              <NavLink to={`/item/${row.original.id}`}>
                <DropdownMenuItem className="text-blue-500">
                  Edit
                  <Pen className="text-blue-500" />
                </DropdownMenuItem>
              </NavLink>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
