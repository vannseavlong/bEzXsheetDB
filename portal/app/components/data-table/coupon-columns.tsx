import type { ColumnDef, Row } from '@tanstack/react-table';
import TableCellDiv from './table-cell-div';
import { formatDate } from '@/lib/date-helper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Pen } from 'lucide-react';
import { NavLink } from 'react-router';
import { Book01Icon } from 'hugeicons-react';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useSelectedProductDetailQuery } from '@/hooks/query/use-selected-product-detail-query';
import { Badge } from '../ui/badge';

export const couponColumns: ColumnDef<CouponAttributes>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <TableCellDiv>{row.original.name}</TableCellDiv>
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <TableCellDiv>{row.original.code}</TableCellDiv>
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.type === 'PERCENTAGE'
          ? `${parseFloat(`${row.original.value}`) * 100}%`
          : `$${row.original.value}`}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <TableCellDiv>
        <Badge variant={row.original.status ? 'approve' : 'reject'}>
          {row.original.status ? 'Active' : 'Inactive'}
        </Badge>
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'userCount',
    header: 'User Count',
    cell: ({ row }) => <TableCellDiv>{row.original.userCount || '0'}</TableCellDiv>
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Effective Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.effectiveDate ? formatDate(row.original.effectiveDate) : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'expiredDate',
    header: 'Expired Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.expiredDate ? formatDate(row.original.expiredDate) : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'selectedProducts',
    header: 'Selected Products',
    cell: ({ row }) =>
      row.original.selectedProducts ? <SelectedProduct row={row} /> : <TableCellDiv>-</TableCellDiv>
  },
  {
    accessorKey: 'promoText',
    header: 'Promotion Text',
    cell: ({ row }) => <TableCellDiv>{row.original.promoTextEn || '-'}</TableCellDiv>
  },

  {
    accessorKey: 'targetUser',
    header: 'Target Uset',
    cell: ({ row }) => <TableCellDiv>{row.original.targetUser || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: ({ row }) => <TableCellDiv>{row.original.remark || '-'}</TableCellDiv>
  },
  {
    id: 'actions',
    enableHiding: true,
    meta: {
      isSticky: true,
      width: 40,
      stickyRight: 0
    },
    cell: ({ row }) => {
      return <Action row={row} />;
    }
  }
  // {
  //   id: 'actions',
  //   enableHiding: true,
  //   cell: ({ row }) => {
  //     return <Action row={row} />;
  //   }
  // }
];

const Action = ({ row }: { row: Row<CouponAttributes> }) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <NavLink to={`/coupon/${row.original.id}`}>
            <DropdownMenuItem className="text-primary">
              Edit
              <Pen className="text-primary" />
            </DropdownMenuItem>
          </NavLink>
          <NavLink to={`/coupon/${row.original.id}-assign`}>
            <DropdownMenuItem className="text-primary">
              Assign To Customer
              <Book01Icon className="text-primary" />
            </DropdownMenuItem>
          </NavLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const SelectedProduct = ({ row }: { row: Row<CouponAttributes> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending, refetch } = useSelectedProductDetailQuery(row.original.id);

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TableCellDiv
          className="cursor-pointer border p-2 rounded-lg shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          {row.original.selectedProducts?.length || '-'} Product
          {row.original.selectedProducts?.length > 1 ? 's' : ''} Selected
        </TableCellDiv>
      </DialogTrigger>

      <DialogContent className="w-[300px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Selected Products ({row.original.selectedProducts?.length})</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 h-[300px] overflow-auto">
          {isPending ? (
            <TableCellDiv>Loading...</TableCellDiv>
          ) : (
            (data || []).map((item, index) => (
              <div key={index} className="text-sm">
                {index + 1}- {item}
              </div>
            ))
          )}
          {/* {row.original.selectedProducts.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
