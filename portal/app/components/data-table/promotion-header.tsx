import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';

type Props = {
  table: Table<PromotionProps>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
} & DateRangePickerProps;

export default function PromotionHeader({ table, setStatusFilter, statusFilter, ...rest }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for service..."
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
        <NavLink to="/promotions/new">
          <Button size="sm">
            {t('promotionPage.newPromotion')} <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
