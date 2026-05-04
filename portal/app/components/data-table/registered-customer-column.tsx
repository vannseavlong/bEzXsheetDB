import { formatDate, formatFullDate } from '@/lib/date-helper';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Calendar04Icon } from 'hugeicons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useRef, useState } from 'react';
import { useUpdateCustomerServiceMutation } from '@/hooks/mutations/use-update-customer-service-mutation';
import customQueryClient from '@/hooks/use-custom-query-client';
import TableCellDiv from './table-cell-div';
import { getLanguage } from '@/locales/locales';
import PreferredService from '../common/customer-service/preferred-service';

export const registeredCustomerColumns: ColumnDef<CustomerAttributes>[] = [
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
      <TableCellDiv>
        {row.original.balance ? `$${row.original.balance.toFixed(2)}` : '-'}
      </TableCellDiv>
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <TableCellDiv>
        <CustomerServiceStatus row={row} />
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'preferredService',
    header: 'Preferred Service',
    cell: ({ row }) => (
      <PreferredService customerServices={row.original.customerServices} id={row.original.id} />
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Description row={row} />
  }
];

const CustomerServiceStatus = ({ row }: { row: Row<CustomerAttributes> }) => {
  const { mutateAsync } = useUpdateCustomerServiceMutation(row.original.id);
  return (
    <Select
      defaultValue={row.original.customerServices?.status || 'none'}
      onValueChange={async (value) => {
        // handle update logic here (API call, state update, etc.)
        await mutateAsync({
          status: value
        });
        customQueryClient.invalidateQueries();
      }}
    >
      <SelectTrigger
        className={cn(
          'w-[230px] border-none shadow-none text-muted-foreground',
          row.original.customerServices?.status === 'NOT-INTEREST' &&
            'bg-red-500/20 text-red-500 font-semibold',
          row.original.customerServices?.status === 'INTEREST-BUT-NOT-NOW' &&
            'bg-blue-500/20 text-blue-500 font-semibold',
          row.original.customerServices?.status === 'NO-ANSWER' &&
            'bg-yellow-500/20 text-yellow-500 font-semibold',
          row.original.customerServices?.status === 'EXISTING-CUSTOMER' &&
            'bg-green-500/20 text-green-500 font-semibold'
        )}
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="text-muted-foreground" value="none">
          None
        </SelectItem>
        <SelectItem value="NOT-INTEREST">Not Interested</SelectItem>
        <SelectItem value="INTEREST-BUT-NOT-NOW">Interested But Not Now</SelectItem>
        <SelectItem value="NO-ANSWER">No Answer</SelectItem>
        <SelectItem value="EXISTING-CUSTOMER">Existing Customer</SelectItem>
      </SelectContent>
    </Select>
  );
};

const Description = ({ row }: { row: Row<CustomerAttributes> }) => {
  const [description, setDescription] = useState<string>(row.original.customerServices?.remark);
  const handlerRef = useRef<NodeJS.Timeout>(null);
  const { mutateAsync } = useUpdateCustomerServiceMutation(row.original.id);

  return (
    <div className="w-[200px]">
      <Input
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
