// import type { Table } from '@tanstack/react-table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import SearchBar from '../common/search-bar';
// import { Button } from '../ui/button';
// import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';

// type Props = {
//   table: Table<UserManagementProps>;
//   statusFilter: string;
//   setStatusFilter: (value: string) => void;
// } & DateRangePickerProps;

// export default function UserHeader({ table, setStatusFilter, statusFilter, ...rest }: Props) {
//   return (
//     <div className="flex items-center p-4 justify-between">
//       <SearchBar
//         placeholder="Search for user..."
//         value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
//         onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
//       />
//       <div className="flex flex-row gap-4">
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="Active">Active</SelectItem>
//             <SelectItem value="Deactivated">Deactivated</SelectItem>
//           </SelectContent>
//         </Select>
//         <DateRangePickerV2 {...rest} />
//         <Button size="sm">New User</Button>
//       </div>
//     </div>
//   );
// }

import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { NavLink } from 'react-router';
import { Plus } from 'lucide-react';
import { t } from 'i18next';

type Props = {
  table: Table<UserManagementProps>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
} & DateRangePickerProps;

export default function UserHeader({ table, setStatusFilter, statusFilter, ...rest }: Props) {
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for user..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePickerV2 {...rest} />
        <NavLink to="/users/new-user">
          <Button size="sm">
            {t('header.newUser')}
            <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
