import type { ColumnDef } from '@tanstack/react-table';

export const overviewCouponUsageColumns: ColumnDef<CouponUsageBreakdownProps>[] = [
  {
    accessorKey: 'label',
    header: 'Coupon'
  },
  {
    accessorKey: 'newUserCount',
    header: 'New Users'
  },
  {
    accessorKey: 'returningCustomerCount',
    header: 'Returning Users'
  },
  {
    accessorKey: 'totalSale',
    header: 'Total Sale',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalSale'));
      return <div className="font-medium">${amount.toFixed(2)}</div>;
    }
  }
];
