import { type ColumnDef } from '@tanstack/react-table';
import numeral from 'numeral';
import { Badge } from '../ui/badge';
import { formatDate, formatFullDate, formatTime } from '@/lib/date-helper';
import { getAvatarFallbackText, getBadgeStatusVariant, getStatusDisplayText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const financeColumns: ColumnDef<OrderListAttributes>[] = [
  // {
  //   id: 'index',
  //   cell: ({ row, table }) => {
  //     const pageIndex = table.getState().pagination.pageIndex;
  //     const pageSize = table.getState().pagination.pageSize;
  //     return <span>{pageIndex * pageSize + row.index + 1}</span>;
  //   },
  //   header: 'No'
  // },
  {
    accessorKey: 'date',
    header: 'Created Date',
    cell: ({ row }) => {
      const rawDate = row.original.latestCreatedAt;
      return <div className="min-w-[160px]">{formatFullDate(rawDate || '')}</div>;
    }
  },
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => <div className="min-w-[130px]">{row.original.bulkOrderId}</div>
  },

  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    cell: ({ row }) => {
      // profileUrl
      const { customerFirstName, customerLastName } = row.original;
      const profileUrl = row.original.profileUrl;

      return (
        <div className="flex items-center gap-2 min-w-[190px]">
          <Avatar className="size-10">
            <AvatarImage
              src={`${import.meta.env.VITE_BASE_URL}/uploads/${profileUrl}`}
              alt={customerFirstName}
            />
            <AvatarFallback>
              {getAvatarFallbackText(`${customerFirstName} ${customerLastName}`)}
            </AvatarFallback>
          </Avatar>
          <span>{`${customerFirstName} ${customerLastName}`}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'customerPhone',
    header: 'Phone Number',
    cell: ({ row }) => {
      return <div className="min-w-[130px]">{row.original.customerPhone}</div>;
    }
  },
  {
    accessorKey: 'category',
    header: 'ServiceCategory',
    cell: ({ row }) => {
      return <div className="min-w-[130px]">{row.original.category}</div>;
    }
  },
  {
    accessorKey: 'service',
    header: 'Specific Service',
    cell: ({ row }) => {
      return <div>{row.original.serviceType}</div>;
    }
  },

  {
    accessorKey: 'date',
    header: 'Schedule Date',
    cell: ({ row }) => {
      const rawDate = row.original.scheduleStartDate;
      return <div className="min-w-[120px]">{formatDate(rawDate)}</div>;
    }
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const rawDate = row.original.scheduleStartDate;
      return <div className="min-w-[120px]">{formatTime(rawDate)}</div>;
    }
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      return <div>{row.original.address}</div>;
    }
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
    accessorKey: 'paymentDate',
    header: 'Payment Init Date',
    cell: ({ row }) => {
      return (
        <div className="min-w-[160px]">
          {row.original?.paymentDate ? formatFullDate(row.original.paymentDate) : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'paymentCompletedDate',
    header: 'Payment Completed Date',
    cell: ({ row }) => {
      return (
        <div className="min-w-[200px]">
          {row.original?.paymentCompletedDate
            ? formatFullDate(row.original.paymentCompletedDate)
            : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      return <div className="min-w-[160px]">{row.original.paymentMethodDisplay}</div>;
    }
  },
  {
    accessorKey: 'promoCode',
    header: 'Promo Code',
    cell: ({ row }) => {
      return <div className="min-w-[160px]">{row.original.couponCode || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'amount',
    header: 'Original Price',
    cell: ({ row }) => {
      const value = parseFloat(row.getValue('amount') as string);
      return <div className="min-w-[160px]">${value.toFixed(2)}</div>;
    }
  },

  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const value = parseFloat(row.original.discount as string);
      return <div className="min-w-[160px]">{value ? `($${value.toFixed(2)})` : 'N/A'}</div>;
    }
  },

  {
    accessorKey: 'serviceFee',
    header: 'Service Fee',
    cell: ({ row }) => {
      const value = parseFloat(row.original.serviceFee || '');
      return <div className="min-w-[160px]">${value.toFixed(2)}</div>;
    }
  },

  {
    accessorKey: 'transportFee',
    header: 'Transport Fee',
    cell: ({ row }) => {
      const value = parseFloat(row.original.transportFee || '');
      return <div className="min-w-[160px]">${value.toFixed(2)}</div>;
    }
  },
  {
    accessorKey: 'netRevenue',
    header: 'Net Revenue',
    cell: ({ row }) => {
      return <div className="min-w-[160px]">${row.original.netRevenue}</div>;
    }
  },

  {
    accessorKey: 'vat',
    header: 'VAT 10%',
    cell: ({ row }) => {
      const value = parseFloat(row.original.vatFee || '');
      return <div className="min-w-[160px]">${value.toFixed(2)}</div>;
    }
  },

  {
    accessorKey: 'totalFee',
    header: 'Total Fee',
    cell: ({ row }) => {
      const { amount, serviceFee, vatFee, discount, transportFee } = row.original;

      const value = numeral(amount)
        .add(serviceFee)
        .add(transportFee)
        .subtract(discount)
        .add(vatFee)
        .value();
      return <div className="font-semibold min-w-[160px] ">${value?.toFixed(2)}</div>;
    }
  },

  {
    accessorKey: 'customerRevaluation',
    header: 'Customer Revaluation',
    cell: ({ row }) => (
      <div className="min-w-[240px]">{row.original.customerRevaluation || '-'}</div>
    )
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: ({ row }) => <div className="min-w-[240px]">{row.original.note}</div>
  }
];
