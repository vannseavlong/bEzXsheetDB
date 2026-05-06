import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

type Props = {
  table: Table<ProductAttributes>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
} & DateRangePickerProps;

export default function ProductHeader({ table, setStatusFilter, statusFilter, ...rest }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for service..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('nameEn')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePickerV2 {...rest} />
        <NavLink to="/product/new">
          <Button size="sm">
            {t('productPage.newProduct')} <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
