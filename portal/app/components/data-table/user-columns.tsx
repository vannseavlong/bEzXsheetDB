// import type { ColumnDef } from '@tanstack/react-table';
// import { Checkbox } from '../ui/checkbox';
// import { Button } from '../ui/button';
// import { MoreVertical, Pen, Trash2 } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '../ui/dropdown-menu';
// import { Badge } from '../ui/badge';
// import { formatDate } from '@/lib/date-helper';

// export const userColumns: ColumnDef<UserManagementProps>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },
//   {
//     accessorKey: 'id',
//     header: 'NO.',
//     cell: ({ row }) => <div>{row.getValue('id')}</div>
//   },
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => <div>{row.getValue('name')}</div>
//   },
//   {
//     accessorKey: 'role',
//     header: 'Role',
//     cell: ({ row }) => <div>{row.getValue('role')}</div>
//   },
//   {
//     accessorKey: 'phoneNumber',
//     header: 'Phone Number',
//     cell: ({ row }) => {
//       const phoneNumber = row.getValue('phoneNumber') as string;
//       return <div>{phoneNumber}</div>;
//     }
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.original.status;
//       return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
//     }
//   },
//   {
//     accessorKey: 'date',
//     header: 'Date',
//     cell: ({ row }) => {
//       const rawDate = row.getValue('date') as string;
//       return <div>{formatDate(rawDate)}</div>;
//     }
//   },
//   {
//     id: 'actions',
//     enableHiding: false,
//     cell: () => {
//       return (
//         <div className="flex justify-end">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreVertical />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem className="text-blue-500" onClick={() => {}}>
//                 Edit
//                 <Pen className="text-blue-500" />
//               </DropdownMenuItem>
//               <DropdownMenuItem variant="destructive">
//                 Delete
//                 <Trash2 />
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       );
//     }
//   }
// ];

// const getStatusVariant = (status: string) => {
//   const lowercaseStatus = status.toLowerCase();
//   if (lowercaseStatus === 'active') return 'approve';
//   if (lowercaseStatus === 'deactivated') return 'reject';
//   return 'approve';
// };

import { useState } from 'react';
import { MoreVertical, Pen, Trash2, X } from 'lucide-react';
import { LockPasswordIcon } from 'hugeicons-react';
import { formatDate } from '@/lib/date-helper';
import type { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '../ui/dialog';
import { PasswordInput } from '../common/password-input';

// ✅ Separate component so hooks are valid
function ActionCell() {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-blue-500">
            Edit
            <Pen className="text-blue-500 ml-auto" />
          </DropdownMenuItem>

          <DropdownMenuItem className="text-blue-500" onClick={() => setOpen(true)}>
            Change Password
            <LockPasswordIcon className="text-blue-500 ml-auto" />
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive">
            Delete
            <Trash2 className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" showCloseButton={false}>
          <div className="flex justify-between items-center border-b pb-2">
            <DialogTitle className="text-lg font-semibold">Change Password</DialogTitle>
            <button onClick={() => setOpen(false)} className="text-red-500 hover:text-red-600">
              <X size={20} className="h-[24px] w-[24px]" />
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  alert('Passwords do not match!');
                  return;
                }
                // TODO: handle save password logic
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const userColumns: ColumnDef<UserManagementProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const Name = row.getValue('name') as string;
      const profileUrl = row.original.date || '/default-profile.png';
      return (
        <div className="flex items-center gap-2 w-[250px]">
          <img src={profileUrl} alt={Name} className="w-10 h-10 rounded-full object-cover" />
          <span>{Name}</span>
        </div>
      );
    }
  },

  {
    accessorKey: 'phoneNumber',
    header: 'Email',
    cell: ({ row }) => <div className="w-[300px]">{row.getValue('phoneNumber')}</div>
  },

  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="w-[300px]">{row.getValue('role')}</div>
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="w-[200px]">
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
        </div>
      );
    }
  },

  {
    accessorKey: 'date',
    header: 'Created At',
    cell: ({ row }) => {
      const rawDate = row.getValue('date') as string;
      return <div className="w-[200px]">{formatDate(rawDate)}</div>;
    }
  },

  {
    accessorKey: 'name',
    header: 'Created By',
    cell: ({ row }) => <div className="w-[200px]">{row.getValue('name')}</div>
  },

  {
    id: 'actions',
    enableHiding: true,
    meta: {
      isSticky: true,
      stickyRight: 0
    },
    cell: () => <ActionCell />
  }
];

const getStatusVariant = (status: string) => {
  const lowercaseStatus = status.toLowerCase();
  if (lowercaseStatus === 'active') return 'approve';
  if (lowercaseStatus === 'inactive') return 'reject';
  return 'approve';
};
