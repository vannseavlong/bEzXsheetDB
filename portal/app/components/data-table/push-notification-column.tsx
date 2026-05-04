import { formatDate } from '@/lib/date-helper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { MoreVertical, RefreshCcw, Megaphone } from 'lucide-react';
// import { useResendAnnouncementMutation } from '@/hooks/mutations/use-announcement-resend-mutation';
import { NavLink } from 'react-router';
import TableCellDiv from './table-cell-div';
import { getNotificationStatusDisplayText, getNotificationStatusVariant } from '@/lib/utils';
import { Badge } from '../ui/badge';

export const pushNotificationColumns: ColumnDef<PushNotificationAttributes>[] = [
  // Name first

  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <TableCellDiv>{row.original.name}</TableCellDiv>
  },
  {
    accessorKey: 'titleEn',
    header: 'Title',
    cell: ({ row }) => <TableCellDiv className="w-[200px]">{row.original.titleEn}</TableCellDiv>
  },
  {
    accessorKey: 'contentEn',
    header: 'Description',
    cell: ({ row }) => <TableCellDiv className="w-[250px]">{row.original.contentEn}</TableCellDiv>
  },
  // {
  //   accessorKey: 'announcementTopics',
  //   header: 'Target',
  //   cell: ({ row }) => (
  //     <TableCellDiv>{row.original.announcementTopics.map((item) => item.name).join(', ')}</TableCellDiv>
  //   )
  // },
  {
    accessorKey: 'topics',
    header: 'Topics',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.topics && row.original.topics.length > 0
          ? row.original.topics.map((t) => t.name).join(', ')
          : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <TableCellDiv>{row.original.type}</TableCellDiv>
  },
  {
    accessorKey: 'scheduleType',
    header: 'Schedule Type',
    cell: ({ row }) => <TableCellDiv>{row.original.scheduleType}</TableCellDiv>
  },
  // {
  //   accessorKey: 'startAt',
  //   header: 'Start Date',
  //   cell: ({ row }) => (
  //     <TableCellDiv>
  //       {row.original.startAt ? formatDate(row.original.startAt, true) : '-'}
  //     </TableCellDiv>
  //   )
  // },
  // {
  //   accessorKey: 'endAt',
  //   header: 'End Date',
  //   cell: ({ row }) => (
  //     <TableCellDiv>
  //       {row.original.startAt ? formatDate(row.original.endAt, true) : '-'}
  //     </TableCellDiv>
  //   )
  // },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getNotificationStatusVariant(status)}>
          {getNotificationStatusDisplayText(status)}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'sentAt',
    header: 'Send Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.sentAt ? formatDate(row.original.sentAt, true) : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <TableCellDiv>{formatDate(row.original.createdAt, true)}</TableCellDiv>
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

const Action = ({ row }: { row: Row<PushNotificationAttributes> }) => {
  // const { mutate, isPending } = useResendAnnouncementMutation();

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
          <NavLink to={`/push-notification/${row.original.id}/detail`}>
            <DropdownMenuItem className="text-primary">
              Detail
              <Megaphone className="text-primary" />
            </DropdownMenuItem>
          </NavLink>
          {row.original.status === 'DELIVERED' && (
            <NavLink to={`/push-notification/${row.original.id}-resend`}>
              <DropdownMenuItem className="text-primary">
                Resend
                <RefreshCcw className="text-primary" />
              </DropdownMenuItem>
            </NavLink>
          )}
          {/* <DropdownMenuItem
            disabled={isPending}
            className="text-primary"
            onClick={() => {
              mutate({ id: row.original.id });
            }}
          >
            Resend
            <RefreshCcw className="text-primary" />
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
