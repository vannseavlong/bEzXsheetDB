import type { ColumnDef } from '@tanstack/react-table';
import TableCellDiv from './table-cell-div';
import LastContactDate from '../common/customer-service/last-contact-date';
import Remark from '../common/customer-service/remark';
import { getLanguage } from '@/locales/locales';
import PreferredService from '../common/customer-service/preferred-service';

export const directSaleCustomerColumns: ColumnDef<CustomerAttributes>[] = [
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
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.language ? getLanguage(row.original.language) : '-'}
      </TableCellDiv>
    )
  },

  {
    accessorKey: 'contactDate',
    header: 'Last Contact Date',
    cell: ({ row }) => (
      <LastContactDate
        id={row.original.id}
        remark={row.original.remark}
        lastContactDate={row.original.lastContactDate}
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
    accessorKey: 'numberOfOrders',
    header: 'No. Of Order',
    cell: ({ row }) => <TableCellDiv>{row.original.totalOrders || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Service Category',
    cell: ({ row }) => (
      <PreferredService customerServices={row.original.customerServices} id={row.original.id} />
    )
  },
  {
    accessorKey: 'totalOrderRevenue',
    header: 'Total Order Revenue',
    cell: ({ row }) => <TableCellDiv>${row.original.totalOrderAmount}</TableCellDiv>
  }
];
