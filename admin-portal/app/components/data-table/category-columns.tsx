import { formatDate } from '@/lib/date-helper';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Pen, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router';

export interface CategoryColumnProps {
  onDelete?: (id: string | number) => void;
}

export const categoryColumns = ({
  onDelete
}: CategoryColumnProps = {}): ColumnDef<CategoryAttributes>[] => [
  {
    accessorKey: 'iconUrl',
    header: 'Image',
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
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="w-50">{row.original.nameEn || '-'}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={getStatusVariant(status)}>{status ? 'Active' : 'Inactive'}</Badge>;
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt');
      return <div>{updatedAt ? formatDate(updatedAt as string) : '-'}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: true,
    cell: ({ row }) => {
      const categoryId = row.original.id;
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
              <NavLink to={`/category/new?id=${categoryId}`}>
                <DropdownMenuItem className="text-blue-500">
                  Edit
                  <Pen className="text-blue-500" />
                </DropdownMenuItem>
              </NavLink>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(categoryId)}>
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

const getStatusVariant = (status: boolean) => {
  if (status) return 'approve';
  return 'reject';
};
