import { formatDate, formatTime } from '@/lib/date-helper';
import numeral from 'numeral';
import {
  getBadgePaymentStatusVariant,
  getBadgeStatusVariant,
  getPaymentStatusDisplayText,
  getStatusDisplayText
} from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import TableCellDiv from './table-cell-div';

export const directColumns: ColumnDef<OrderListAttributes>[] = [
  // Transaction ID
  {
    accessorKey: 'orderID',
    header: 'Order ID',
    cell: ({ row }) => <TableCellDiv>{row.original.bulkOrderId}</TableCellDiv>
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => (
      <TableCellDiv>{`${row.original.customerFirstName || ''} ${row.original.customerLastName || ''}`}</TableCellDiv>
    )
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => <TableCellDiv>{row.original.customerPhone}</TableCellDiv>
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Service Category',
    cell: ({ row }) => (
      <TableCellDiv>{row.original.category || row.original.categoryNameEn}</TableCellDiv>
    )
  },
  {
    accessorKey: 'spacificService',
    header: 'Service Spacific',
    cell: ({ row }) => (
      <TableCellDiv>{row.original.service || row.original.productNameEn}</TableCellDiv>
    )
  },
  {
    accessorKey: 'bookingDate',
    header: 'Booking Date',
    cell: ({ row }) => (
      <TableCellDiv>{formatDate(row.original.scheduleStartDate, true)}</TableCellDiv>
    )
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => <TableCellDiv>{formatTime(row.original.scheduleStartDate)}</TableCellDiv>
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <TableCellDiv>{row.original.address}</TableCellDiv>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="min-w-[160px]">
          <Badge variant={getBadgeStatusVariant(status)}>{getStatusDisplayText(status)}</Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    // cell: ({ row }) => <div>{row.original.paymentStatus}</div>
    cell: ({ row }) => {
      const status = row.original.paymentStatus || 'PENDING';
      return (
        <Badge variant={getBadgePaymentStatusVariant(status)}>
          {getPaymentStatusDisplayText(status)}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.paymentDate ? formatDate(row.original.paymentDate, true) : '-'}
      </TableCellDiv>
    )
  },
  // Top-up Amount
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      return <TableCellDiv>{row.original.paymentMethodDisplay || '-'}</TableCellDiv>;
    }
  },
  // {
  //   accessorKey: 'originalPrice',
  //   header: 'Original Price',
  //   cell: ({ row }) => (
  //     <TableCellDiv>$ {row.original.amount ? row.original.amount : '0'}</TableCellDiv>
  //   )
  // },
  {
    accessorKey: 'netRevenue',
    header: 'Net Revenue',
    cell: ({ row }) => (
      <TableCellDiv>
        ${' '}
        {numeral(row.original.amount)
          .add(row.original.serviceFee)
          .add(row.original.transportFee)
          .subtract(row.original.vatFee)
          .value()}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'vat',
    header: 'VAT 10%',
    cell: ({ row }) => <TableCellDiv>$ {row.original.vatFee}</TableCellDiv>
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => (
      <TableCellDiv>
        ${' '}
        {numeral(row.original.amount)
          .add(row.original.serviceFee)
          .add(row.original.transportFee)
          .value()}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: ({ row }) => <TableCellDiv>{row.original.note || '-'}</TableCellDiv>
  }
];
