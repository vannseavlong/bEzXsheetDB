import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Button } from '../ui/button';
import type { Table } from '@tanstack/react-table';
import { NavLink } from 'react-router';
import { Plus } from 'lucide-react';

type Props = {
  initialDateRange: { from?: Date; to?: Date };
  table: Table<ServiceItemAttributes>;
} & DateRangePickerProps;

export default function ItemHeader({ table, ...rest }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center p-4 gap-4">
      <div className="min-w-0">
        <SearchBar
          placeholder="Search for cleaner..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
        />
      </div>

      <div className="flex items-center gap-4 justify-start md:justify-end">
        <DateRangePickerV2 {...rest} />
        <NavLink to="/item/new">
          <Button size="sm">
            New Item
            <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
