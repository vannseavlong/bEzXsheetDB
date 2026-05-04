import type { ColumnDef } from '@tanstack/react-table';
import numeral from 'numeral';
import moment from 'moment';
import TableCellDiv from './table-cell-div';

export const dashboardOverviewAdsColumns: ColumnDef<AdsDailyProps>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <TableCellDiv>{moment(row.original.date).format('DD MMM')}</TableCellDiv>
  },
  {
    accessorKey: 'clicks',
    header: 'Clicks',
    cell: ({ row }) => <TableCellDiv>{row.original.clicks}</TableCellDiv>
  },
  {
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => <TableCellDiv>{row.original.platform}</TableCellDiv>
  },
  {
    accessorKey: 'conversionsInstalls',
    header: 'Conversions & Installs',
    cell: ({ row }) => <TableCellDiv>{row.original.conversionsInstalls}</TableCellDiv>
  },
  {
    accessorKey: 'reach',
    header: 'Reach',
    cell: ({ row }) => <TableCellDiv>{numeral(row.original.reach).format('0,0')}</TableCellDiv>
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => <TableCellDiv>${numeral(row.original.spend).format('0,0')}</TableCellDiv>
  },
  {
    accessorKey: 'cpc',
    header: 'CPC',
    cell: ({ row }) => <TableCellDiv>${row.original.cpc}</TableCellDiv>
  },
  {
    accessorKey: 'cac',
    header: 'CAC',
    cell: ({ row }) => <TableCellDiv>${row.original.cac.toFixed(2)}</TableCellDiv>
  },
  {
    accessorKey: 'appInstall',
    header: 'App Install',
    cell: ({ row }) => <TableCellDiv>{row.original.conversionsInstalls}</TableCellDiv>
  }
];
