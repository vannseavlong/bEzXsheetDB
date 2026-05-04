import type { ColumnDef } from '@tanstack/react-table';
import TableCellDiv from './table-cell-div';
import { formatFullDate } from '@/lib/date-helper';
import { Badge } from '../ui/badge';
import { getBadgePaymentStatusVariant, getPaymentStatusDisplayText } from '@/lib/utils';

export const announcementCouponColumns: ColumnDef<AnnouncementCouponAttributes>[] = [
  {
    accessorKey: 'coupons',
    header: 'Coupons',
    cell: ({ row }) => <Coupons announcementCoupon={row.original} />
  },
  {
    accessorKey: 'claimedAt',
    header: 'Claimed At',
    cell: ({ row }) => {
      const rawDate = row.original?.claimedAt;
      return <div className="min-w-[160px]">{formatFullDate(rawDate || '')}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
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
    cell: ({ row }) => <TableCellDiv>{row.original.tranId || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'customerId',
    header: 'Customer Id',
    cell: ({ row }) => <TableCellDiv>{row.original.userId}</TableCellDiv>
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.user.firstName} {row.original.user.lastName}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'username',
    header: 'Phone',
    cell: ({ row }) => (
      <TableCellDiv className="w-[150px]">{row.original.user.username}</TableCellDiv>
    )
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <TableCellDiv className="w-[150px]">{row.original.user.gender}</TableCellDiv>
  }
];

const Coupons = ({ announcementCoupon }: { announcementCoupon: AnnouncementCouponAttributes }) => {
  if (!announcementCoupon) return <TableCellDiv>-</TableCellDiv>;

  return (
    <div className="flex gap-1 cursor-pointer">
      <div>
        {announcementCoupon.coupon?.code} x {announcementCoupon.qty} = {announcementCoupon.price}
      </div>
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
