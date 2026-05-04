import type { ColumnDef } from '@tanstack/react-table';
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
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

export interface BannerColumnProps {
  onEdit?: (banner: BannerProps) => void;
  onDelete?: (id: number) => void;
}

export const bannerColumns = ({
  onEdit,
  onDelete
}: BannerColumnProps): ColumnDef<BannerProps>[] => [
  {
    accessorKey: 'imgUrlEn',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('imgUrlEn') as string | null;
      return image ? (
        <img src={image} alt="Banner" className="w-40 h-22.5 object-cover" />
      ) : (
        <div className="w-40 h-22.5 bg-muted flex items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      );
    }
  },

  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>
  },

  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div>{row.getValue('type')}</div>
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const displayStatus = status === true ? 'Active' : 'Inactive';
      return <Badge variant={getStatusVariant(displayStatus)}>{displayStatus}</Badge>;
    }
  },

  {
    accessorKey: 'titleEn',
    header: 'Title',
    cell: ({ row }) => <div>{row.getValue('titleEn') ?? '-'}</div>
  },

  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      if (!startDate) return <div>-</div>;

      const formattedDate = formatDate(startDate);
      return <div>{formattedDate.toLowerCase().includes('invalid') ? '-' : formattedDate}</div>;
    }
  },

  {
    accessorKey: 'expiredDate',
    header: 'Expired Date',
    cell: ({ row }) => {
      const expiredDate = row.original.expiredDate;
      if (!expiredDate) return <div>-</div>;

      const formattedDate = formatDate(expiredDate);
      return <div>{formattedDate.toLowerCase().includes('invalid') ? '-' : formattedDate}</div>;
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <div className="flex justify-end">
          <Action banner={banner} onEdit={onEdit} onDelete={onDelete} />
        </div>
      );
    }
  }
];

const Action = ({
  banner,
  onEdit,
  onDelete
}: {
  banner: BannerProps;
  onEdit?: (banner: BannerProps) => void;
  onDelete?: (id: number) => void;
}) => {
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(MODULES.MARKETING_BANNER, ACTIONS.UPDATE);
  const canDelete = hasPermission(MODULES.MARKETING_BANNER, ACTIONS.DELETE);

  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem className="text-blue-500" onClick={() => onEdit?.(banner)}>
            Edit
            <Pen className="text-blue-500" />
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(banner.id)}>
            Delete
            <Trash2 />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getStatusVariant = (status: string) => {
  const lowercaseStatus = status.toLowerCase();
  if (lowercaseStatus === 'active') return 'approve';
  if (lowercaseStatus === 'inactive') return 'reject';
  return 'approve';
};
