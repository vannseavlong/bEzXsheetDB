import { formatDate } from '@/lib/date-helper';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { getPaymentMethodDisplay } from './topup-columns';
import { Badge } from '../ui/badge';
import { getBadgePaymentStatusVariant, getPaymentStatusDisplayText } from '@/lib/utils';
import TableCellDiv from './table-cell-div';
import { toast } from 'sonner';
// import { RefreshCcw } from 'lucide-react';
// import { useCheckTopupPaymentStatusMutation } from '@/hooks/use-check-topup-payment-status-mutation';

export const bcomboColumns: ColumnDef<TopupAttributes>[] = [
  // Transaction ID
  {
    accessorKey: 'topupId',
    header: 'bCombo ID',
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
  // Top-up Amount
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      return <TableCellDiv>{getPaymentMethodDisplay(row.original.paymentMethod)}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'tranId',
    header: 'Transaction Id',
    cell: ({ row }) => {
      return (
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
      );
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    // cell: ({ row }) => <div>{row.original.paymentStatus}</div>
    cell: ({ row }) => <PaymentStatus row={row} />
  },
  {
    accessorKey: 'amountPaid',
    header: 'Amount Paid (USD)',
    cell: ({ row }) => {
      return <TableCellDiv>{row.original.paidAmount}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'bonusCredit',
    header: 'Bonus Credit (USD)',
    cell: ({ row }) => {
      const amount = row.original.credit;
      return <TableCellDiv>{amount}</TableCellDiv>;
    }
  },
  // Payment Method
  {
    accessorKey: 'totalCredit',
    header: 'Total Credit (USD)',
    cell: ({ row }) => {
      return <TableCellDiv>{row.original.totalCredit}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'Balance',
    header: 'Balance',
    cell: ({ row }) => <TableCellDiv>{row.original.balanceDisplay}</TableCellDiv>
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current Balance',
    cell: ({ row }) => <TableCellDiv>{row.original.currentBalanceDisplay}</TableCellDiv>
  }
];

const PaymentStatus = ({ row }: { row: Row<TopupAttributes> }) => {
  const { paymentStatus } = row.original;
  // const { mutate, isPending } = useCheckTopupPaymentStatusMutation();
  return (
    <div className="flex">
      <Badge variant={getBadgePaymentStatusVariant(paymentStatus)}>
        {getPaymentStatusDisplayText(paymentStatus)}
      </Badge>
      {/* {paymentStatus === 'IN-REVIEW' && row.original.tranId && (
        <RefreshCcw
          onClick={() => mutate({ tranId: tranId || '', id: topUpID })}
          className={`h-5 w-5 transition-transform cursor-pointer ${
            isPending ? 'animate-spin text-blue-500' : 'text-gray-600'
          }`}
        />
      )} */}
    </div>
  );
};
