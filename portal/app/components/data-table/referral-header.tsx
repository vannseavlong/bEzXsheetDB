import type { Table } from '@tanstack/react-table';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { isButtonDisabled } from '@/constants/constants';

type Props = {
  table: Table<ReferralProgramProps>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
} & DateRangePickerProps;

export default function ReferralHeader({ table, ...rest }: Props) {
  const hasNoData = true; // example condition
  const isLoading = false;
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for service..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <DateRangePickerV2 {...rest} />
        <Button disabled={isButtonDisabled(hasNoData || isLoading)}>Export</Button>
      </div>
    </div>
  );
}
