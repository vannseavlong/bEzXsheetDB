import type { ColumnDef } from '@tanstack/react-table';
import { NavLink } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, Pen, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

export const productColumns: ColumnDef<ProductAttributes>[] = [
  {
    accessorKey: 'id',
    header: '',
    meta: { width: 48 },
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.id}</span>
  },
  {
    accessorKey: 'iconUrl',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.original.iconUrl;
      return (
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={row.original.nameEn ?? undefined} />
          <AvatarFallback>{row.original.nameEn?.charAt(0) || '-'}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => <div className="w-50">{row.original.nameEn || '-'}</div>
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <div>{row.original.category?.nameEn || '-'}</div>
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
    cell: ({ row }) => {
      const productId = row.original.id;
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
              <NavLink to={`/product/new?id=${productId}`}>
                <DropdownMenuItem className="text-blue-500">
                  Edit
                  <Pen className="text-blue-500" />
                </DropdownMenuItem>
              </NavLink>
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
