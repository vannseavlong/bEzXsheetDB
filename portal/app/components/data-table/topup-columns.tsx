import { formatDate } from '@/lib/date-helper';
import { getBadgePaymentStatusVariant, getPaymentStatusDisplayText } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import TableCellDiv from './table-cell-div';
import { toast } from 'sonner';

export const topupColumns: ColumnDef<TopupAttributes>[] = [
  // Transaction ID
  {
    accessorKey: 'topupId',
    header: 'Topup ID',
    cell: ({ row }) => <div>{row.original.topUpID}</div>
  },
  {
    accessorKey: 'id',
    header: 'Customer ID',
    cell: ({ row }) => <div>{row.original.customerId}</div>
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => <TableCellDiv>{row.original.customerName}</TableCellDiv>
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => <TableCellDiv>{row.original.customerPhone}</TableCellDiv>
  },
  {
    accessorKey: 'transactionDate',
    header: 'Transaction Date',
    cell: ({ row }) => <TableCellDiv>{formatDate(row.original.transactionDate)}</TableCellDiv>
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    // cell: ({ row }) => <div>{row.original.paymentStatus}</div>
    cell: ({ row }) => {
      return <TableCellDiv>{getPaymentMethodDisplay(row.original.paymentMethod)}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'tranId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <TableCellDiv
        className="cursor-pointer text-primary underline"
        onClick={() => {
          navigator.clipboard.writeText(row.original.tranId || '').then(() => {
            toast('Transaction ID Copied');
          });
        }}
      >
        {row.original.tranId}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    // cell: ({ row }) => <div>{row.original.paymentStatus}</div>
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return (
        <Badge variant={getBadgePaymentStatusVariant(status)}>
          {getPaymentStatusDisplayText(status)}
        </Badge>
      );
    }
  },
  // Top-up Amount
  {
    accessorKey: 'amountPaid',
    header: 'Amount Paid (USD)',
    cell: ({ row }) => {
      return <div>{row.original.paidAmount}</div>;
    }
  },

  // // Payment Method
  // {
  //   accessorKey: 'totalCredit',
  //   header: 'Total Credit',
  //   cell: ({ row }) => {
  //     const amount = row.original.credit;
  //     return <div>{amount}</div>;
  //   }
  // },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => <div>{row.original.balanceDisplay}</div>
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current Balance',
    cell: ({ row }) => <div>{row.original.currentBalanceDisplay}</div>
  }
];

export const getPaymentMethodDisplay = (paymentMethod: string) => {
  if (paymentMethod === 'abapay_khqr_deeplink') {
    return 'ABA PayWay';
  }
  if (paymentMethod === 'admin_topup') {
    return 'Admin Topup';
  }
  return paymentMethod;
};
