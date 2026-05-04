import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import type { Table } from '@tanstack/react-table';
import CustomSelect from '../common/custom-select';
import CustomSelectApi from '../common/custom-select-api';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { API_ENDPOINT } from '@/api/endpoint';
// import { Button } from '../ui/button';
// import { useExportExcelMutation } from '@/hooks/use-export-excel-mutation';
// import IconAssets from '@/asset/icons/icon-assets';

type Props = {
  initialDateRange?: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
  table: Table<CustomerAttributes>;
} & DateRangePickerProps;

export default function RegisterCustomerHeader({ search, setSearch, table, ...rest }: Props) {
  // const { mutate } = useExportExcelMutation();

  // const handleExportClicked = async () => {
  //   mutate({
  //     type: 'topup',
  //     startDate: rest.dateRange?.from?.toISOString() ?? '',
  //     endDate: rest.dateRange?.to?.toISOString() ?? ''
  //   });
  // };
  return (
    <div className="flex flex-col p-4 gap-3">
      {/* Row 1: Search bar */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-3">
        <div className="w-full md:w-auto">
          <SearchBar placeholder="Search phone, Name" value={search} onChange={setSearch} />
        </div>

        {/* Row 1 right (desktop): Date range + Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="shrink-0">
            <DateRangePickerV2 {...rest} />
          </div>
          <div className="shrink-0">
            <CustomSelect
              className="w-auto"
              prefix="Status:"
              data={[
                { label: 'All', value: 'ALL' },
                { label: 'None', value: 'none' },
                { label: 'Not Interested', value: 'NOT-INTEREST' },
                { label: 'Interested But Not Now', value: 'INTEREST-BUT-NOT-NOW' },
                { label: 'No Answer', value: 'NO-ANSWER' },
                { label: 'Existing Customer', value: 'EXISTING-CUSTOMER' }
              ]}
              value={(table.getColumn('status')?.getFilterValue() as string) ?? 'ALL'}
              onValueChange={(val) =>
                table.getColumn('status')?.setFilterValue(val === 'ALL' ? undefined : val)
              }
            />
          </div>
        </div>
      </div>

      {/* Row 2 (mobile only): Date range + Status */}
      <div className="flex md:hidden items-center gap-3 overflow-x-auto w-full">
        <div className="shrink-0">
          <DateRangePickerV2 {...rest} />
        </div>
        <div className="shrink-0">
          <CustomSelect
            className="w-auto"
            prefix="Status:"
            data={[
              { label: 'All', value: 'ALL' },
              { label: 'None', value: 'none' },
              { label: 'Not Interested', value: 'NOT-INTEREST' },
              { label: 'Interested But Not Now', value: 'INTEREST-BUT-NOT-NOW' },
              { label: 'No Answer', value: 'NO-ANSWER' },
              { label: 'Existing Customer', value: 'EXISTING-CUSTOMER' }
            ]}
            value={(table.getColumn('status')?.getFilterValue() as string) ?? 'ALL'}
            onValueChange={(val) =>
              table.getColumn('status')?.setFilterValue(val === 'ALL' ? undefined : val)
            }
          />
        </div>
      </div>

      {/* Row 2 (desktop) / Row 3 (mobile): Resource Referral + Category Name */}
      <div className="flex items-center gap-3 overflow-x-auto w-full">
        <div className="shrink-0">
          <CustomSelectApi
            apiConfig={{
              queryKey: QUERY_KEY_ENUM.RESOUCE_REFERRAL,
              pathUrl: API_ENDPOINT.RESOUCE_REFERRAL
            }}
            prefix="Resource Referral:"
            value={(table.getColumn('resourceReferral')?.getFilterValue() as string) ?? 'ALL'}
            onChange={(val) =>
              table.getColumn('resourceReferral')?.setFilterValue(val === 'ALL' ? undefined : val)
            }
          />
        </div>
        <div className="shrink-0">
          <CustomSelectApi
            apiConfig={{
              queryKey: QUERY_KEY_ENUM.CATEGORIES_NAME,
              pathUrl: API_ENDPOINT.CATEGORIES_NAME
            }}
            prefix="Category Name:"
            value={(table.getColumn('preferredService')?.getFilterValue() as string) ?? 'ALL'}
            onChange={(val) =>
              table.getColumn('preferredService')?.setFilterValue(val === 'ALL' ? undefined : val)
            }
          />
        </div>
      </div>
    </div>
  );
}
