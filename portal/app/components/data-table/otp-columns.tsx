import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/date-helper';

export const otpColumns: ColumnDef<OtpAttributes>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  //   cell: ({ row }) => <div>{row.original.id}</div>
  // },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div>{row.original.username}</div>
  },
  {
    accessorKey: 'otp',
    header: 'OTP',
    cell: ({ row }) => <div>{row.original.otp}</div>
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <div>{formatDate(row.original.createdAt, true)}</div>
  },
  {
    accessorKey: 'isVerified',
    header: 'Is Verified?',
    cell: ({ row }) => (
      <div className={row.original.isVerified ? 'text-primary font-bold' : ' text-yellow-500'}>
        {row.original.isVerified ? 'Verified' : 'Not Yet'}
      </div>
    )
  }

  // {
  //   accessorKey: 'expiredDate',
  //   header: 'Expired Date',
  //   cell: ({ row }) => <div>{formatDate(row.original.expDate, true)}</div>
  // }
];
