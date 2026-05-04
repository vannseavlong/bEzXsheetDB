import type { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import TableCellDiv from './table-cell-div';

export const dashboardNewUserColumns: ColumnDef<DashboardNewUserProps>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <TableCellDiv>{moment(row.original.date).format('DD MMM')}</TableCellDiv>
  },
  {
    accessorKey: 'iosDownload',
    header: 'iOS Download',
    cell: ({ row }) => <TableCellDiv>{row.original.iOS}</TableCellDiv>
  },
  {
    accessorKey: 'androidDownload',
    header: 'Android Download',
    cell: ({ row }) => <TableCellDiv>{row.original.android}</TableCellDiv>
  },
  {
    accessorKey: 'androidInstallOpen',
    header: 'Installs & Opens Android',
    cell: ({ row }) => <TableCellDiv>{row.original.androidInstallOpen}</TableCellDiv>
  },
  {
    accessorKey: 'iosInstallOpen',
    header: 'Installs & Opens iOS',
    cell: ({ row }) => <TableCellDiv>{row.original.iosInstallOpen}</TableCellDiv>
  },
  // {
  //   accessorKey: 'ioIos',
  //   header: 'IO (iOS)',
  //   cell: ({ row }) => <TableCellDiv>{'row.original.id'}</TableCellDiv>
  // },
  // {
  //   accessorKey: 'ioAndroid',
  //   header: 'IO (Android)',
  //   cell: ({ row }) => <TableCellDiv>{'row.original.id'}</TableCellDiv>
  // },
  {
    accessorKey: 'registration',
    header: 'Registration',
    cell: ({ row }) => <TableCellDiv>{row.original.totalRegisteredUsers}</TableCellDiv>
  },
  {
    accessorKey: 'activeUsers',
    header: 'Active Users',
    cell: ({ row }) => <TableCellDiv>{row.original.activeUsers}</TableCellDiv>
  },
  {
    accessorKey: 'inactiveUsers',
    header: 'Inactive Users',
    cell: ({ row }) => <TableCellDiv>{row.original.totalInactiveUsers}</TableCellDiv>
  },
  {
    accessorKey: 'orders',
    header: 'Orders',
    cell: ({ row }) => <TableCellDiv>{row.original.count}</TableCellDiv>
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ row }) => <TableCellDiv>{row.original.revenue}</TableCellDiv>
  }
];
