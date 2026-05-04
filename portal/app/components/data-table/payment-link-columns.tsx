import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import TableCellDiv from './table-cell-div';
import { Link, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useCheckPaymentStatusMutation } from '@/hooks/mutations/use-check-payment-status-mutation';
import { formatFullDate } from '@/lib/date-helper';
import { getBadgePaymentStatusVariant, getPaymentStatusDisplayText } from '@/lib/utils';
import numeral from 'numeral';

export const paymentLinkColumns: ColumnDef<PaymentLinkAttributes>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.id}</div>
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <TableCellDiv>{row.original.title || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.user?.firstName} {row.original.user?.lastName}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'Phone',
    header: 'Cusstomer Phone',
    cell: ({ row }) => <TableCellDiv>{row.original.user?.username}</TableCellDiv>
  },
  {
    accessorKey: 'netRevenue',
    header: 'Net Revenue',
    cell: ({ row }) => {
      const { amount } = row.original;

      const value = numeral(amount).value();
      return <div className="min-w-[160px]">${value?.toFixed(2)}</div>;
    }
  },

  {
    accessorKey: 'vat',
    header: 'VAT 10%',
    cell: ({ row }) => {
      const { amount, vat } = row.original;

      const value = numeral(amount).multiply(vat).value();
      return <div className="min-w-[160px]">${value?.toFixed(2)}</div>;
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const { amount, vat } = row.original;

      const value = numeral(amount).multiply(vat).add(amount).value();
      return <TableCellDiv>$ {value?.toFixed(2)}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'url',
    header: 'Link For Customer',
    cell: ({ row }) => (
      <TableCellDiv
        onClick={async () => {
          // const dev = `https://staging-landing-kohl.vercel.app/purchase-coupon?id=${row.original.id}`;
          // const dev = `https://beasy-landing-page-318afwghp-seihas-projects-9953a2a5.vercel.app/purchase-coupon?id=${row.original.id}`;
          const dev = `http://localhost:7001/purchase-coupon?id=${row.original.id}`;
          const production = `https://beasy.info/purchase-coupon?id=${row.original.id}`;
          await navigator.clipboard.writeText(
            import.meta.env.VITE_ENV === 'dev' ? dev : production
          );
          toast('User URL Copied');
        }}
      >
        <Link className="text-primary underline font-bold cursor-pointer" />
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'status',
    header: 'Payment Status',
    cell: ({ row }) => (
      <Status status={row.original.status} tranId={row.original.tranId} id={row.original.id} />
    )
  },
  {
    accessorKey: 'transactionID',
    header: 'Transaction ID',
    cell: ({ row }) =>
      row.original.tranId ? (
        <TableCellDiv
          className="cursor-pointer text-primary underline"
          onClick={() => {
            navigator.clipboard.writeText(row.original.tranId).then(() => {
              toast('Transaction ID Copied');
            });
          }}
        >
          {row.original.tranId}
        </TableCellDiv>
      ) : (
        <TableCellDiv>-</TableCellDiv>
      )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <TableCellDiv>{formatFullDate(row.original.createdAt)}</TableCellDiv>
  },
  {
    accessorKey: 'transactionDate',
    header: 'Transaction Date',
    cell: ({ row }) => <TableCellDiv>{formatFullDate(row.original.tranInitDate)}</TableCellDiv>
  }
];

const Status = ({
  status,
  tranId,
  id
}: {
  status: PaymentStatusProps;
  tranId: string;
  id: string;
}) => {
  const { mutate, isPending } = useCheckPaymentStatusMutation();

  return (
    <TableCellDiv className="flex gap-4">
      {/* <Badge>{status}</Badge> */}
      <Badge variant={getBadgePaymentStatusVariant(status)}>
        {getPaymentStatusDisplayText(status)}
      </Badge>
      {tranId && status == 'PENDING' && (
        <RefreshCcw
          onClick={() => mutate({ tranId, id })}
          className={`h-5 w-5 transition-transform cursor-pointer ${
            isPending ? 'animate-spin text-blue-500' : 'text-gray-600'
          }`}
        />
      )}
    </TableCellDiv>
  );
};
