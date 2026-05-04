import SearchBar from '../common/search-bar';
import { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Button } from '../ui/button';
import type { Table } from '@tanstack/react-table';
import { NavLink } from 'react-router';
import { Plus } from 'lucide-react';

type Props = {
  table: Table<BlockedScheduleAttributes>;
} & DateRangePickerProps;

export default function BlockedScheduleHeader({ table }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for blocked schedule..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />

      <div className="flex flex-wrap items-center gap-4 mt-3 md:mt-0">
        {/* <DateRangePickerV2 {...rest} /> */}
        <NavLink to="/blocked-schedule/new">
          <Button size="sm">
            New Block Schedule
            <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
