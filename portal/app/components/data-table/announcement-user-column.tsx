import type { ColumnDef } from '@tanstack/react-table';
import TableCellDiv from './table-cell-div';
import Remark from '../common/customer-service/remark';
import { getLanguage } from '@/locales/locales';
import { formatFullDate } from '@/lib/date-helper';
import { Badge } from '../ui/badge';
import { getBadgePaymentStatusVariant, getPaymentStatusDisplayText } from '@/lib/utils';

export const announcementUserColumns: ColumnDef<CustomerAttributes>[] = [
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
    accessorKey: 'readAt',
    header: 'Read At',
    cell: ({ row }) => {
      const rawDate = row.original.announcementReads?.[0]?.readAt;
      return <div className="min-w-[160px]">{formatFullDate(rawDate || '')}</div>;
    }
  },
  {
    accessorKey: 'coupons',
    header: 'Coupons',
    cell: ({ row }) => <Coupons announcementUsers={row.original.announcementUsers} />
  },
  {
    accessorKey: 'claimedAt',
    header: 'Claimed At',
    cell: ({ row }) => {
      const rawDate = row.original.announcementUsers?.[0]?.claimedAt;
      return <div className="min-w-[160px]">{formatFullDate(rawDate || '')}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.announcementUsers?.[0]?.status;
      if (!status) return '-';
      return (
        <Badge variant={getBadgePaymentStatusVariant(status)}>
          {getPaymentStatusDisplayText(status)}
        </Badge>
      );
    }
    // cell: ({ row }) => (
    //   <TableCellDiv>{row.original.announcementUsers?.[0]?.status || '-'}</TableCellDiv>
    // )
  },
  {
    accessorKey: 'tranId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <TableCellDiv>{row.original.announcementUsers?.[0]?.tranId || '-'}</TableCellDiv>
    )
  },
  {
    accessorKey: 'deletedAt',
    header: 'Deleted At',
    cell: ({ row }) => {
      const rawDate = row.original.announcementReads?.[0]?.deletedAt;
      return <div className="min-w-[160px]">{formatFullDate(rawDate || '')}</div>;
    }
  },
  {
    accessorKey: 'username',
    header: 'Phone',
    cell: ({ row }) => <TableCellDiv className="w-[150px]">{row.original.username}</TableCellDiv>
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <TableCellDiv className="w-[150px]">{row.original.gender}</TableCellDiv>
  },
  {
    accessorKey: 'dob',
    header: 'Date Of Birth',
    cell: ({ row }) => <TableCellDiv>{row.original.dob || '-'}</TableCellDiv>
  },
  // {
  //   accessorKey: 'email',
  //   header: 'Email',
  //   cell: ({ row }) => <TableCellDiv>{row.original.email || '-'}</TableCellDiv>
  // },
  // {
  //   accessorKey: 'balance',
  //   header: 'bWallet Balance',
  //   cell: ({ row }) => (
  //     <TableCellDiv>{row.original.balance ? `$${row.original.balance}` : '-'}</TableCellDiv>
  //   )
  // },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.language ? getLanguage(row.original.language) : '-'}
      </TableCellDiv>
    )
  },
  // {
  //   accessorKey: 'resourceReferral',
  //   header: 'Resource Referral',
  //   cell: ({ row }) => <TableCellDiv>{row.original.resourceReferral || '-'}</TableCellDiv>
  // },
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
  }
];

const Coupons = ({ announcementUsers }: { announcementUsers?: AnnouncementUser[] }) => {
  if (!announcementUsers?.[0]?.coupon) return <TableCellDiv>-</TableCellDiv>;

  return (
    <div className="flex gap-1 cursor-pointer">
      {announcementUsers.map((au, i) => {
        return (
          <div key={i}>
            {au.coupon?.code} x {au.qty} = {au.price}
          </div>
        );
      })}
    </div>
  );
};

export const getPaymentMethodDisplay = (paymentMethod: string) => {
  if (paymentMethod === 'abapay_khqr_deeplink') {
    return 'ABA PayWay';
  }
  if (paymentMethod === 'admin_topup') {
    return 'Admin Topup';
  }
  return paymentMethod;
};
