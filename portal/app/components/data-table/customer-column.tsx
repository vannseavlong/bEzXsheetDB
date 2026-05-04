import { formatDate } from '@/lib/date-helper';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Calendar04Icon } from 'hugeicons-react';
import TableCellDiv from './table-cell-div';
import clsx from 'clsx';
import CustomerReviewDrawer from '../common/drawer/customer-review-drawer';
import StarRating from '../common/star-rating';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';
import LastContactDateDrawer from '../common/drawer/last-contact-date-drawer';
import LastContactDate from '../common/customer-service/last-contact-date';
import Remark from '../common/customer-service/remark';
import { getLanguage } from '@/locales/locales';
import PreferredService from '../common/customer-service/preferred-service';

export const customerColumns: ColumnDef<CustomerAttributes>[] = [
  {
    accessorKey: 'customerId',
    header: 'Customer Id',
    cell: ({ row }) => <TableCellDiv>{row.original.id}</TableCellDiv>
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.firstName} {row.original.lastName}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'username',
    header: 'Phone',
    cell: ({ row }) => <TableCellDiv className="w-37.5">{row.original.username}</TableCellDiv>
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <TableCellDiv className="w-37.5">{row.original.gender}</TableCellDiv>
  },
  {
    accessorKey: 'dob',
    header: 'Date Of Birth',
    cell: ({ row }) => <TableCellDiv>{row.original.dob || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <TableCellDiv>{row.original.email || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'balance',
    header: 'bWallet Balance',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.balance ? `$${row.original.balance.toFixed(2)}` : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.language ? getLanguage(row.original.language) : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'resourceReferral',
    header: 'Resource Referral',
    cell: ({ row }) => <TableCellDiv>{row.original.resourceReferral || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <SpenderType type={row.original.spenderCategory} />
  },
  {
    accessorKey: 'numberOfOrders',
    header: 'No. Of Order',
    cell: ({ row }) => <TableCellDiv>{row.original.totalOrders || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'totalOrderRevenue',
    header: 'Total Order Revenue',
    cell: ({ row }) => <TableCellDiv>${row.original.totalOrderAmount}</TableCellDiv>
  },
  {
    accessorKey: 'lastOrderDate',
    header: 'Last Order Date',
    cell: ({ row }) => (
      <TableCellDiv className="flex justify-between gap-6">
        <div>{row.original.lastOrderDate ? formatDate(row.original.lastOrderDate) : '-'}</div>
        <Calendar04Icon className="size-5" />
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'contactDate',
    header: 'Last Contact Date',
    cell: ({ row }) => (
      <LastContactDate
        lastContactDate={row.original.lastContactDate}
        id={row.original.id}
        remark={row.original.remark}
      />
    )
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: ({ row }) => (
      <Remark
        remark={row.original.remark}
        id={row.original.id}
        lastContactDate={row.original.lastContactDate}
      />
    )
  },
  {
    accessorKey: 'preferredService',
    header: 'Favorite Service',
    cell: ({ row }) => (
      <PreferredService customerServices={row.original.customerServices} id={row.original.id} />
    )
  },
  {
    accessorKey: 'overallRatings',
    header: 'Overall Rating',
    cell: ({ row }) => (
      <CustomerStarRating userId={row.original.id} count={row.original.averageRatingRounded} />
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

const Action = ({ row }: { row: Row<CustomerAttributes> }) => {
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
          <CustomerReviewDrawer userId={row.original.id}>
            <DropdownMenuItem
              disabled={!row.original.averageRatingRounded}
              className="text-blue-500"
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              View Overall Rating
            </DropdownMenuItem>
          </CustomerReviewDrawer>

          <LastContactDateDrawer row={row} userId={row.original.id}>
            <DropdownMenuItem
              disabled={!row.original.lastContactDate}
              className="text-blue-500"
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              View Last Contact Date
            </DropdownMenuItem>
          </LastContactDateDrawer>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const CustomerStarRating = ({ count, userId }: { count?: string; userId: string }) => {
  if (!count) return <TableCellDiv>-</TableCellDiv>;

  const roundedCount = Number(count);
  return (
    <CustomerReviewDrawer userId={userId}>
      <div className="flex gap-1 cursor-pointer">
        <StarRating count={roundedCount} />
      </div>
    </CustomerReviewDrawer>
  );
};

const SpenderType = ({ type }: { type: string }) => {
  const spenderType = type.split(' ')[0].toLowerCase();
  return (
    <TableCellDiv
      className={clsx('px-3 py-2 rounded-sm', {
        'bg-success/10': spenderType === 'high',
        'bg-primary/10': spenderType === 'medium',
        'bg-destructive/10': spenderType === 'low'
      })}
    >
      <span
        className={clsx('font-semibold', {
          'text-success': spenderType === 'high',
          'text-primary': spenderType === 'medium',
          'text-destructive': spenderType === 'low'
        })}
      >
        {type}
      </span>
    </TableCellDiv>
  );
};
