import type { Table } from '@tanstack/react-table';
import { Select } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

type Props = {
  table: Table<RolesProps>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
} & DateRangePickerProps;

export default function RolesHeader({ table, setStatusFilter, statusFilter, ...rest }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for roles..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}></Select>
        <DateRangePickerV2 {...rest} />
        <NavLink to="/roles/new-roles">
          <Button size="sm">
            {t('header.newRoles')} <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
