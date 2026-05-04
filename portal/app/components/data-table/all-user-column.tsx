import { formatDate, formatFullDate } from '@/lib/date-helper';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Calendar04Icon } from 'hugeicons-react';
import { Input } from '../ui/input';
import { useRef, useState } from 'react';
import { useUpdateCustomerServiceMutation } from '@/hooks/mutations/use-update-customer-service-mutation';
import TableCellDiv from './table-cell-div';
import { getLanguage } from '@/locales/locales';
import { getUserStatusDisplayText, getUserStatusVariant } from '@/lib/utils';
import { Badge } from '../ui/badge';

export const allUserColumns: ColumnDef<CustomerAttributes>[] = [
  // {
  //   accessorKey: 'Id',
  //   header: 'ID',
  //   cell: ({ row }) => <TableCellDiv className="!min-w-[20px]">{row.original.id}</TableCellDiv>
  // },
  {
    accessorKey: 'customerId',
    header: 'Customer Id',
    cell: ({ row }) => <TableCellDiv>{row.original.id}</TableCellDiv>
  },
  {
    accessorKey: 'createdAt',
    header: 'Account Created At',
    cell: ({ row }) => (
      <TableCellDiv className="w-[195px]">{formatFullDate(row.original.createdAt)}</TableCellDiv>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <TableCellDiv>{row.original.username}</TableCellDiv>
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => <TableCellDiv>{row.original.firstName}</TableCellDiv>
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => <TableCellDiv>{row.original.lastName}</TableCellDiv>
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <TableCellDiv className="w-[150px]">{row.original.gender}</TableCellDiv>
  },
  {
    accessorKey: 'userStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getUserStatusVariant(status)}>{getUserStatusDisplayText(status)}</Badge>
      );
    }
  },
  {
    accessorKey: 'dob',
    header: 'Date Of Birth',
    cell: ({ row }) => <TableCellDiv>{row.original.dob || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <TableCellDiv>{row.original.email || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => (
      <TableCellDiv>{row.original.balance ? `$${row.original.balance}` : '-'}</TableCellDiv>
    )
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
    header: 'Contact Date',
    cell: ({ row }) => (
      <TableCellDiv className="flex justify-between gap-6">
        <div>
          {row.original.customerServices?.contactDate
            ? formatDate(row.original.customerServices?.contactDate)
            : '-'}
        </div>
        <Calendar04Icon className="size-5" />
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'resourceReferral',
    header: 'Resource Referral',
    cell: ({ row }) => <TableCellDiv>{row.original.resourceReferral || '-'}</TableCellDiv>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Description row={row} />
  }
];

const Description = ({ row }: { row: Row<CustomerAttributes> }) => {
  const [description, setDescription] = useState<string>(row.original.customerServices?.remark);
  const handlerRef = useRef<NodeJS.Timeout>(null);
  const { mutateAsync } = useUpdateCustomerServiceMutation(row.original.id);

  return (
    <div className="w-[200px]">
      <Input
        disabled
        value={description}
        onChange={(val) => {
          setDescription(val.target.value);

          if (handlerRef.current) {
            clearTimeout(handlerRef.current); // cleanup if description changes before 2s
          }
          handlerRef.current = setTimeout(async () => {
            console.log('API call with description:', val.target.value);
            await mutateAsync({ description: val.target.value });
          }, 1000);
        }}
      />
    </div>
  );
};
