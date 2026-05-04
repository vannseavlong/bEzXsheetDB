import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import type { Table } from '@tanstack/react-table';
import CustomSelectApi from '../common/custom-select-api';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { API_ENDPOINT } from '@/api/endpoint';

type Props = {
  initialDateRange?: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
  table: Table<CustomerAttributes>;
} & DateRangePickerProps;

export default function DirectSaleCustomerHeader({ search, setSearch, table, ...rest }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start p-4 sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <SearchBar placeholder="Search phone, Name" value={search} onChange={setSearch} />
        {/* On mobile: date + category in same scrollable row */}
        <div className="flex sm:contents items-center gap-4 overflow-x-auto">
          <div className="shrink-0">
            <DateRangePickerV2 {...rest} />
          </div>
          <div className="shrink-0 sm:hidden">
            <CustomSelectApi
              apiConfig={{
                queryKey: QUERY_KEY_ENUM.CATEGORIES_NAME,
                pathUrl: API_ENDPOINT.CATEGORIES_NAME
              }}
              prefix="Category Name:"
              value={(table.getColumn('serviceCategory')?.getFilterValue() as string) ?? 'ALL'}
              onChange={(val) =>
                table.getColumn('serviceCategory')?.setFilterValue(val === 'ALL' ? undefined : val)
              }
            />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex gap-4">
        <CustomSelectApi
          apiConfig={{
            queryKey: QUERY_KEY_ENUM.CATEGORIES_NAME,
            pathUrl: API_ENDPOINT.CATEGORIES_NAME
          }}
          prefix="Category Name:"
          value={(table.getColumn('serviceCategory')?.getFilterValue() as string) ?? 'ALL'}
          onChange={(val) =>
            table.getColumn('serviceCategory')?.setFilterValue(val === 'ALL' ? undefined : val)
          }
        />
      </div>
    </div>
  );
}
