import type { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Pen } from 'lucide-react';
import { NavLink } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import TableCellDiv from './table-cell-div';

export const blockedScheduleColumns: ColumnDef<BlockedScheduleAttributes>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  //   cell: ({ row }) => <div>{row.original.id}</div>
  // },
  {
    accessorKey: 'iconUrl',
    header: 'Icon',
    cell: ({ row }) => {
      const image = row.original.iconUrl;
      return (
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={image ?? undefined} />
          <AvatarFallback>{image?.charAt(0) || '-'}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    accessorKey: 'labelEn',
    header: 'Label',
    cell: ({ row }) => <TableCellDiv>{row.original.labelEn}</TableCellDiv>
  },
  {
    accessorKey: 'titleEn',
    header: 'Title',
    cell: ({ row }) => <TableCellDiv>{row.original.titleEn}</TableCellDiv>
  },
  {
    accessorKey: 'messageEn',
    header: 'Message',
    cell: ({ row }) => <TableCellDiv>{row.original.messageEn}</TableCellDiv>
  },

  {
    accessorKey: 'Date',
    header: 'Date',
    cell: ({ row }) => <TableCellDiv>{row.original.date}</TableCellDiv>
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
              <NavLink to={`/blocked-schedule/${row.original.id}`}>
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
