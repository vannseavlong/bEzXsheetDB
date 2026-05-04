import { formatDate } from '@/lib/date-helper';
import type { ColumnDef, Row } from '@tanstack/react-table';
import ColumnUserInfo from '../common/column-user-info';
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
import CleanerExpertise from '../common/cleaner-expertise';
import TableCellDiv from './table-cell-div';
import { usePermission } from '@/hooks/use-permission';
import { ACTIONS, MODULES } from '@/lib/permission';
import { CleanerRoleLabels, GenderLabels } from '@/constants/constants';

export const dayMaps = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday'
};

export const cleanerColumns: ColumnDef<CleanerAttributes>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <TableCellDiv>
        <ColumnUserInfo name={row.original.name} image={row.original.image || ''} />
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => (
      <TableCellDiv>{GenderLabels[row.original.gender as keyof typeof GenderLabels]}</TableCellDiv>
    )
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <TableCellDiv>
        {CleanerRoleLabels[row.original.role as keyof typeof CleanerRoleLabels]}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'cleanerWeeklyOffs',
    header: 'Weekly Offs',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.cleanerWeeklyOffs && row.original.cleanerWeeklyOffs.length > 0
          ? row.original.cleanerWeeklyOffs
              ?.map((off) => dayMaps[off as keyof typeof dayMaps])
              .join(', ')
          : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <TableCellDiv>
        <Badge variant={row.original.status ? 'approve' : 'reject'}>
          {row.original.status ? 'Active' : 'Inactive'}
        </Badge>
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'expertises',
    header: 'Expertise',
    cell: ({ row }) => <CleanerExpertise row={row} />
  },
  {
    accessorKey: 'joinedDate',
    header: 'Joined Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.joinedDate ? formatDate(row.original.joinedDate) : '-'}
      </TableCellDiv>
    )
  },
  {
    id: 'actions',
    enableHiding: true,
    meta: {
      isSticky: true,
      width: 40,
      stickyRight: 0
    },
    cell: ({ row }) => {
      return <Action row={row} />;
    }
  }
];

const Action = ({ row }: { row: Row<CleanerAttributes> }) => {
  const { hasPermission } = usePermission();
  if (!hasPermission(MODULES.CLEANER, ACTIONS.UPDATE)) {
    return null;
  }
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
          <NavLink to={`/cleaner/${row.original.id}`}>
            <DropdownMenuItem className="text-blue-500">
              Edit
              <Pen className="text-blue-500" />
            </DropdownMenuItem>
          </NavLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
