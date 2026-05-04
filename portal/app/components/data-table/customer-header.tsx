import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import type { Table } from '@tanstack/react-table';
import CustomSelect from '../common/custom-select';
// import CustomSelectApi from '../common/custom-select-api';
// import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
// import { API_ENDPOINT } from '@/api/endpoint';
// import { Button } from '../ui/button';
// import { useExportExcelMutation } from '@/hooks/use-export-excel-mutation';
// import IconAssets from '@/asset/icons/icon-assets';

type Props = {
  initialDateRange?: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
  table: Table<CustomerAttributes>;
} & DateRangePickerProps;

export default function CustomerHeader({ search, setSearch, table, ...rest }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-3">
      {/* Search bar — left on desktop, full row on mobile */}
      <div className="w-full md:w-auto">
        <SearchBar placeholder="Search phone, Name" value={search} onChange={setSearch} />
      </div>

      {/* Date + Type filter — right on desktop, second row on mobile */}
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="shrink-0">
          <DateRangePickerV2 {...rest} />
        </div>
        <div className="flex gap-3 shrink-0">
          {/* <CustomSelect
            className="w-auto"
            prefix="Status:"
            data={[
              {
                label: 'All',
                value: 'ALL'
              },
              {
                label: 'None',
                value: 'none'
              },
              {
                label: 'Not Interested',
                value: 'NOT-INTEREST'
              },
              {
                label: 'Interested But Not Now',
                value: 'INTEREST-BUT-NOT-NOW'
              },
              {
                label: 'No Answer',
                value: 'NO-ANSWER'
              },
              {
                label: 'Existing Customer',
                value: 'EXISTING-CUSTOMER'
              }
            ]}
            value={(table.getColumn('status')?.getFilterValue() as string) ?? 'ALL'}
            onValueChange={(val) =>
              table.getColumn('status')?.setFilterValue(val === 'ALL' ? undefined : val)
            }
          /> */}
          <CustomSelect
            className="w-auto"
            prefix="Type:"
            data={[
              {
                label: 'All',
                value: 'ALL'
              },
              {
                label: 'High Spender',
                value: 'High Spender'
              },
              {
                label: 'Medium Spender',
                value: 'Medium Spender'
              },
              {
                label: 'Low Spender',
                value: 'Low Spender'
              }
            ]}
            value={(table.getColumn('type')?.getFilterValue() as string) ?? 'ALL'}
            onValueChange={(val) =>
              table.getColumn('type')?.setFilterValue(val === 'ALL' ? undefined : val)
            }
          />
          {/* <CustomSelectApi
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
          /> */}
        </div>
      </div>
    </div>
  );
}
