import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Button } from '../ui/button';
import { useExportExcelMutation } from '@/hooks/mutations/use-export-excel-mutation';
import { useTranslation } from 'react-i18next';
import IconAssets from '@/asset/icons/icon-assets';
import CustomSelect from '../common/custom-select';
import type { Table } from '@tanstack/react-table';

type Props = {
  initialDateRange: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
  table: Table<CustomerAttributes>;
} & DateRangePickerProps;

export default function AllUserHeader({ search, setSearch, table, ...rest }: Props) {
  const { t } = useTranslation();
  const { mutate, isPending } = useExportExcelMutation();

  const handleExportClicked = async () => {
    mutate({
      type: 'all-user',
      startDate: rest.dateRange?.from?.toISOString() ?? '',
      endDate: rest.dateRange?.to?.toISOString() ?? '',
      userStatus: table.getColumn('userStatus')?.getFilterValue() as string
    });
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-3">
      {/* Top row: Search + Export */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar placeholder="Search phone, Name" value={search} onChange={setSearch} />
        </div>
        <div className="flex-none">
          <Button isLoading={isPending} size="sm" onClick={handleExportClicked}>
            {t('Export')}
            <IconAssets.Export />
          </Button>
        </div>
      </div>

      {/* Second row: Status + Date */}
      <div className="w-full md:w-auto flex justify-end">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-none">
            <CustomSelect
              className="w-auto"
              prefix="Status:"
              data={[
                { label: 'All', value: 'ALL' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Suspended', value: 'SUSPENDED' },
                { label: 'Deleted', value: 'DELETED' }
              ]}
              value={(table.getColumn('userStatus')?.getFilterValue() as string) ?? 'ALL'}
              onValueChange={(val) => table.getColumn('userStatus')?.setFilterValue(val)}
            />
          </div>

          <div className="flex-none">
            <DateRangePickerV2 {...rest} />
          </div>
        </div>
      </div>
    </div>
  );
}
